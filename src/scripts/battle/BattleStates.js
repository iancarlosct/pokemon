// Padrão State: define os estados da batalha e suas transições.
// BattleState é a classe abstrata base; os concretos controlam o fluxo.

class BattleState {
  constructor(battle) {
    if (new.target === BattleState) {
      throw new Error('BattleState é uma classe abstrata.');
    }
    this.battle = battle;
  }

  // Ações — estados que não suportam simplesmente retornam null
  atacar()       { return null; }
  trocar(indice) { return null; }
  capturar()     { return null; }
  correr()       { return null; }

  jogadorPodeAgir() { return false; }
  encerrada()       { return false; }
}

class PlayerTurnState extends BattleState {
  jogadorPodeAgir() { return true; }

  atacar() {
    const b   = this.battle;
    const log = [];

    if (typeof b.ativo.aoIniciarTurno === 'function') {
      const efeito = b.ativo.aoIniciarTurno();
      if (efeito?.log?.length) log.push(...efeito.log);
    }

    const resAtaque   = b.ativo.atacar();
    const danoBase    = typeof resAtaque === 'number' ? resAtaque : (resAtaque.dano ?? 1);
    const { dano, multiplicador } = b._calcularDano(b.ativo, b.selvagem, danoBase);
    const danoEfetivo = b._aplicarDano(b.selvagem, dano);

    if (multiplicador > 1)      log.push('É super efetivo!');
    if (multiplicador < 1)      log.push('Não é muito efetivo...');
    if (resAtaque.golpesDuplos) log.push('Golpe duplo!');
    log.push(`${b.ativo.nome} causou ${danoEfetivo} de dano.`);

    if (typeof b.selvagem.consumirContraDano === 'function') {
      const contraDano = b.selvagem.consumirContraDano();
      if (contraDano > 0) {
        b._aplicarDano(b.ativo, contraDano);
        log.push(`${b.ativo.nome} levou ${contraDano} de dano do Rocky Helmet!`);
      }
    }

    if (!b.selvagem.vivo) {
      b.ativo.ganharExperiencia(Math.floor(b.selvagem.vidaMax * 1.5));
      b._transicionarPara(new VictoryState(b, 'vitoria'));
      return { log, encerrada: true, resultado: 'vitoria', multiplicador };
    }

    if (!b.ativo.vivo) {
      const proximo = b.equipe.find(p => p.vivo && p !== b.ativo);
      if (proximo) {
        b.ativo = proximo;
        log.push(`${b.ativo.nome} entrou em batalha!`);
      } else {
        b._transicionarPara(new DefeatState(b));
        return { log, encerrada: true, resultado: 'derrota', multiplicador };
      }
    }

    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return { ...resInimigo, log: [...log, ...resInimigo.log], multiplicador };
  }

  trocar(indice) {
    const b    = this.battle;
    const novo = b.equipe[indice];
    if (!novo || !novo.vivo || novo === b.ativo) return null;
    if (typeof b.ativo.resetarMove === 'function') b.ativo.resetarMove();
    b.ativo = novo;
    return { trocado: true, nome: novo.nome };
  }

  capturar() {
    const b = this.battle;
    b._transicionarPara(new CaptureState(b));
    return b.estado._resolver();
  }

  correr() {
    const b     = this.battle;
    const bonus = b.ativo.velocidade > b.selvagem.velocidade ? 0.2 : 0;
    const fugiu = Math.random() < (0.5 + bonus);

    if (fugiu) {
      b._transicionarPara(new VictoryState(b, 'fuga'));
      return { fugiu: true, log: ['Você escapou!'], encerrada: true, resultado: 'fuga' };
    }

    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return { fugiu: false, log: ['Não conseguiu escapar!', ...resInimigo.log], ...resInimigo };
  }
}

class EnemyTurnState extends BattleState {
  // Resolve o turno do inimigo e transiciona. Chamado internamente, nunca pela BattleUI.
  _resolver() {
    const b         = this.battle;
    const log       = [];
    const resInimigo = b.selvagem.atacar();
    const danoBase   = typeof resInimigo === 'number' ? resInimigo : (resInimigo.dano ?? 1);
    const { dano, multiplicador } = b._calcularDano(b.selvagem, b.ativo, danoBase);
    const danoEfetivo = b._aplicarDano(b.ativo, dano);

    log.push(`${b.selvagem.nome} causou ${danoEfetivo} de dano.`);

    if (typeof b.ativo.consumirContraDano === 'function') {
      const contraDano = b.ativo.consumirContraDano();
      if (contraDano > 0) {
        b._aplicarDano(b.selvagem, contraDano);
        log.push(`${b.selvagem.nome} levou ${contraDano} de dano do Rocky Helmet!`);
        if (!b.selvagem.vivo) {
          b.ativo.ganharExperiencia(Math.floor(b.selvagem.vidaMax * 1.5));
          b._transicionarPara(new VictoryState(b, 'vitoria'));
          return { log, encerrada: true, resultado: 'vitoria', multiplicador };
        }
      }
    }

    if (!b.ativo.vivo) {
      const proximo = b.equipe.find(p => p.vivo && p !== b.ativo);
      if (proximo) {
        b.ativo = proximo;
        log.push(`${b.ativo.nome} entrou em batalha!`);
        b._transicionarPara(new PlayerTurnState(b));
      } else {
        b._transicionarPara(new DefeatState(b));
        return { log, encerrada: true, resultado: 'derrota', multiplicador };
      }
    } else {
      b._transicionarPara(new PlayerTurnState(b));
    }

    return { log, encerrada: false, multiplicador };
  }
}

class CaptureState extends BattleState {
  _resolver() {
    const b        = this.battle;
    const chance   = 1 - (b.selvagem.vida / b.selvagem.vidaMax) * 0.7;
    const capturou = Math.random() < chance;

    if (capturou) {
      b._transicionarPara(new VictoryState(b, 'captura'));
      return { capturou: true, log: [`${b.selvagem.nome} foi capturado!`], encerrada: true, resultado: 'captura' };
    }

    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return { capturou: false, log: [`${b.selvagem.nome} escapou da Pokébola!`, ...resInimigo.log], ...resInimigo };
  }
}

class VictoryState extends BattleState {
  constructor(battle, resultado) {
    super(battle);
    this._resultado = resultado;
  }
  encerrada()     { return true; }
  get resultado() { return this._resultado; }
}

class DefeatState extends BattleState {
  encerrada()     { return true; }
  get resultado() { return 'derrota'; }
}