/**
 * @file Battle.js
 * @description Sistema de batalha com suporte a held items via Decorator Pattern.
 *
 * Alterações em relação à versão original:
 *  - atacar(): chama aoIniciarTurno() do Pokémon ativo (Leftovers, etc.)
 *  - _turnoInimigo(): aplica contra-dano do Rocky Helmet ao inimigo
 *  - trocar(): reseta o lock da Choice Band ao trocar de Pokémon
 *
 * Nenhuma outra lógica foi alterada.
 */
class Battle {
  constructor(pokemonEquipe, pokemonSelvagem) {
    this.equipe    = pokemonEquipe;
    this.selvagem  = pokemonSelvagem;
    this.ativo     = this.equipe[0];
    this.encerrada = false;

    this._efetividade = {
      'Fogo':          { 'Grama': 1.5, 'Inseto': 1.5, 'Água': 0.6, 'Fogo': 0.6 },
      'Água':          { 'Fogo': 1.5, 'Água': 0.6, 'Grama': 0.6 },
      'Grama':         { 'Água': 1.5, 'Pedra': 1.5, 'Fogo': 0.6, 'Veneno': 0.6, 'Grama': 0.6 },
      'Normal':        {},
      'Inseto':        { 'Grama': 1.5, 'Veneno': 0.6 },
      'Inseto/Veneno': { 'Grama': 1.5 },
      'Água/Veneno':   { 'Fogo': 1.3, 'Grama': 0.7 },
    };
  }

  _calcularDano(atacante, defensor, danoBase) {
    const tipos = atacante.tipo.split('/');
    let mult = 1.0;
    for (const tipo of tipos) {
      const tabela = this._efetividade[tipo] || {};
      for (const td of defensor.tipo.split('/')) {
        mult *= tabela[td] ?? 1.0;
      }
    }
    const danoReduzido = danoBase * (50 / (50 + defensor.defesa));
    const danoFinal = Math.max(
      Math.floor(danoBase * 0.15),
      Math.floor(danoReduzido * mult)
    );
    return { dano: danoFinal, multiplicador: mult };
  }

  _aplicarDano(pokemon, dano) {
    pokemon.vida = Math.max(0, pokemon.vida - dano);
    if (pokemon.vida === 0) pokemon.vivo = false;
    return dano;
  }

  atacar() {
    const log = [];

    // ── Efeito de turno do held item do Pokémon ativo (ex: Leftovers) ──────
    if (typeof this.ativo.aoIniciarTurno === 'function') {
      const efeito = this.ativo.aoIniciarTurno();
      if (efeito?.log?.length) log.push(...efeito.log);
    }

    const resAtaque = this.ativo.atacar();
    const danoBase  = typeof resAtaque === 'number' ? resAtaque : (resAtaque.dano ?? 1);
    const { dano, multiplicador } = this._calcularDano(this.ativo, this.selvagem, danoBase);

    const danoEfetivo = this._aplicarDano(this.selvagem, dano);

    if (multiplicador > 1)        log.push('É super efetivo!');
    if (multiplicador < 1)        log.push('Não é muito efetivo...');
    if (resAtaque.golpesDuplos)   log.push('Golpe duplo!');
    log.push(`${this.ativo.nome} causou ${danoEfetivo} de dano.`);

    // ── Rocky Helmet: inimigo devolve dano ao jogador ──────────────────────
    if (typeof this.selvagem.consumirContraDano === 'function') {
      const contraDano = this.selvagem.consumirContraDano();
      if (contraDano > 0) {
        this._aplicarDano(this.ativo, contraDano);
        log.push(`${this.ativo.nome} levou ${contraDano} de dano do Rocky Helmet!`);
        if (!this.ativo.vivo) {
          const proximo = this.equipe.find(p => p.vivo && p !== this.ativo);
          if (proximo) {
            this.ativo = proximo;
            log.push(`${this.ativo.nome} entrou em batalha!`);
          } else {
            this.encerrada = true;
            return { danoJogador: danoEfetivo, danoInimigo: 0, log, encerrada: true, resultado: 'derrota', multiplicador };
          }
        }
      }
    }

    if (!this.selvagem.vivo) {
      this.encerrada = true;
      const xp = Math.floor(this.selvagem.vidaMax * 1.5);
      this.ativo.ganharExperiencia(xp);
      return { danoJogador: danoEfetivo, danoInimigo: 0, log, encerrada: true, resultado: 'vitoria', multiplicador };
    }

    return this._turnoInimigo({ danoJogador: danoEfetivo, log, multiplicador });
  }

  trocar(indice) {
    const novo = this.equipe[indice];
    if (!novo || !novo.vivo) return false;

    // ── Choice Band: reseta o lock ao trocar de Pokémon ───────────────────
    if (typeof this.ativo.resetarMove === 'function') {
      this.ativo.resetarMove();
    }

    this.ativo = novo;
    return true;
  }

  tentarCapturar() {
    const chance = 1 - (this.selvagem.vida / this.selvagem.vidaMax) * 0.7;
    return Math.random() < chance;
  }

  tentarCorrer() {
    const bonus = this.ativo.velocidade > this.selvagem.velocidade ? 0.2 : 0;
    return Math.random() < (0.5 + bonus);
  }

  _turnoInimigo(estado) {
    const log = [...estado.log];
    const resInimigo = this.selvagem.atacar();
    const danoBase   = typeof resInimigo === 'number' ? resInimigo : (resInimigo.dano ?? 1);
    const { dano, multiplicador } = this._calcularDano(this.selvagem, this.ativo, danoBase);

    const danoEfetivo = this._aplicarDano(this.ativo, dano);
    log.push(`${this.selvagem.nome} causou ${danoEfetivo} de dano.`);

    // ── Rocky Helmet: jogador devolve dano ao inimigo ──────────────────────
    if (typeof this.ativo.consumirContraDano === 'function') {
      const contraDano = this.ativo.consumirContraDano();
      if (contraDano > 0) {
        this._aplicarDano(this.selvagem, contraDano);
        log.push(`${this.selvagem.nome} levou ${contraDano} de dano do Rocky Helmet!`);
        if (!this.selvagem.vivo) {
          this.encerrada = true;
          const xp = Math.floor(this.selvagem.vidaMax * 1.5);
          this.ativo.ganharExperiencia(xp);
          return { ...estado, danoInimigo: danoEfetivo, log, encerrada: true, resultado: 'vitoria' };
        }
      }
    }

    if (!this.ativo.vivo) {
      const proximo = this.equipe.find(p => p.vivo && p !== this.ativo);
      if (proximo) {
        this.ativo = proximo;
        log.push(`${this.ativo.nome} entrou em batalha!`);
      } else {
        this.encerrada = true;
        return { ...estado, danoInimigo: danoEfetivo, log, encerrada: true, resultado: 'derrota' };
      }
    }

    return { ...estado, danoInimigo: danoEfetivo, log, encerrada: false };
  }
}