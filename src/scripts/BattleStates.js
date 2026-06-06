/**
 * @file BattleStates.js
 * @description Estados concretos do padrão State da batalha.
 *
 * Fluxo de transições:
 *
 *  [PlayerTurnState]
 *      │  atacar()   → executa dano no inimigo
 *      │              ├─ inimigo morreu → [VictoryState]
 *      │              └─ inimigo vivo   → [EnemyTurnState]
 *      │  trocar()   → troca o ativo, permanece em [PlayerTurnState]
 *      │  capturar() → [CaptureState]
 *      └─ correr()   → sucesso → [VictoryState] (resultado='fuga')
 *                      falha   → [EnemyTurnState]
 *
 *  [EnemyTurnState]  (resolvido automaticamente ao entrar)
 *      ├─ jogador morreu, sem reservas → [DefeatState]
 *      └─ jogador sobreviveu           → [PlayerTurnState]
 *
 *  [CaptureState]    (resolvido automaticamente ao entrar)
 *      ├─ captura bem-sucedida → [VictoryState] (resultado='captura')
 *      └─ falhou               → [EnemyTurnState]
 *
 *  [VictoryState] / [DefeatState] → terminais, encerrada() = true
 */

// ═══════════════════════════════════════════════════════════════════
//  PLAYER TURN STATE
//  O jogador está no controle. Todos os botões são válidos.
// ═══════════════════════════════════════════════════════════════════
class PlayerTurnState extends BattleState {
  constructor(battle) {
    super(battle);
  }

  jogadorPodeAgir() { return true; }

  atacar() {
    const b   = this.battle;
    const log = [];

    // ── Efeito de turno do held item (ex: Leftovers) ──────────────
    if (typeof b.ativo.aoIniciarTurno === 'function') {
      const efeito = b.ativo.aoIniciarTurno();
      if (efeito?.log?.length) log.push(...efeito.log);
    }

    const resAtaque = b.ativo.atacar();
    const danoBase  = typeof resAtaque === 'number' ? resAtaque : (resAtaque.dano ?? 1);
    const { dano, multiplicador } = b._calcularDano(b.ativo, b.selvagem, danoBase);
    const danoEfetivo = b._aplicarDano(b.selvagem, dano);

    if (multiplicador > 1)      log.push('É super efetivo!');
    if (multiplicador < 1)      log.push('Não é muito efetivo...');
    if (resAtaque.golpesDuplos) log.push('Golpe duplo!');
    log.push(`${b.ativo.nome} causou ${danoEfetivo} de dano.`);

    // ── Rocky Helmet: devolve dano ao jogador ─────────────────────
    if (typeof b.selvagem.consumirContraDano === 'function') {
      const contraDano = b.selvagem.consumirContraDano();
      if (contraDano > 0) {
        b._aplicarDano(b.ativo, contraDano);
        log.push(`${b.ativo.nome} levou ${contraDano} de dano do Rocky Helmet!`);
      }
    }

    // ── Verifica resultado ────────────────────────────────────────
    if (!b.selvagem.vivo) {
      const xp = Math.floor(b.selvagem.vidaMax * 1.5);
      b.ativo.ganharExperiencia(xp);
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

    // ── Turno do inimigo ──────────────────────────────────────────
    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return { ...resInimigo, log: [...log, ...resInimigo.log], multiplicador };
  }

  trocar(indice) {
    const b   = this.battle;
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

    // Falhou: inimigo ataca
    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return { fugiu: false, log: ['Não conseguiu escapar!', ...resInimigo.log], ...resInimigo };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  ENEMY TURN STATE
//  O inimigo executa seu ataque. Resolve automaticamente e transiciona.
//  O jogador não pode interagir enquanto este estado está ativo.
// ═══════════════════════════════════════════════════════════════════
class EnemyTurnState extends BattleState {
  constructor(battle) {
    super(battle);
  }

  jogadorPodeAgir() { return false; }

  /**
   * Resolve o turno do inimigo e já transiciona para o próximo estado.
   * Chamado internamente por PlayerTurnState — nunca pela BattleUI diretamente.
   * @returns {{ log: string[], encerrada: boolean, resultado?: string }}
   */
  _resolver() {
    const b          = this.battle;
    const log        = [];
    const resInimigo = b.selvagem.atacar();
    const danoBase   = typeof resInimigo === 'number' ? resInimigo : (resInimigo.dano ?? 1);
    const { dano, multiplicador } = b._calcularDano(b.selvagem, b.ativo, danoBase);
    const danoEfetivo = b._aplicarDano(b.ativo, dano);

    log.push(`${b.selvagem.nome} causou ${danoEfetivo} de dano.`);

    // ── Rocky Helmet do jogador: devolve dano ao inimigo ──────────
    if (typeof b.ativo.consumirContraDano === 'function') {
      const contraDano = b.ativo.consumirContraDano();
      if (contraDano > 0) {
        b._aplicarDano(b.selvagem, contraDano);
        log.push(`${b.selvagem.nome} levou ${contraDano} de dano do Rocky Helmet!`);
        if (!b.selvagem.vivo) {
          const xp = Math.floor(b.selvagem.vidaMax * 1.5);
          b.ativo.ganharExperiencia(xp);
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

// ═══════════════════════════════════════════════════════════════════
//  CAPTURE STATE
//  Processa a tentativa de captura e transiciona para o resultado.
// ═══════════════════════════════════════════════════════════════════
class CaptureState extends BattleState {
  constructor(battle) {
    super(battle);
  }

  jogadorPodeAgir() { return false; }

  _resolver() {
    const b      = this.battle;
    const chance = 1 - (b.selvagem.vida / b.selvagem.vidaMax) * 0.7;
    const capturou = Math.random() < chance;

    if (capturou) {
      b._transicionarPara(new VictoryState(b, 'captura'));
      return {
        capturou: true,
        log: [`${b.selvagem.nome} foi capturado!`],
        encerrada: true,
        resultado: 'captura',
      };
    }

    // Falhou: inimigo ataca
    b._transicionarPara(new EnemyTurnState(b));
    const resInimigo = b.estado._resolver();
    return {
      capturou: false,
      log: [`${b.selvagem.nome} escapou da Pokébola!`, ...resInimigo.log],
      ...resInimigo,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  VICTORY STATE
//  Estado terminal de fim de batalha positivo (vitória, fuga, captura).
//  Nenhuma ação do jogador é processada.
// ═══════════════════════════════════════════════════════════════════
class VictoryState extends BattleState {
  constructor(battle, resultado) {
    super(battle);
    this._resultado = resultado; // 'vitoria' | 'fuga' | 'captura'
  }

  jogadorPodeAgir() { return false; }
  encerrada()       { return true; }
  nome()            { return `VictoryState(${this._resultado})`; }

  get resultado()   { return this._resultado; }
}

// ═══════════════════════════════════════════════════════════════════
//  DEFEAT STATE
//  Estado terminal de derrota. Nenhuma ação é processada.
// ═══════════════════════════════════════════════════════════════════
class DefeatState extends BattleState {
  constructor(battle) {
    super(battle);
  }

  jogadorPodeAgir() { return false; }
  encerrada()       { return true; }

  get resultado()   { return 'derrota'; }
}