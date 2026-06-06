/**
 * @file Battle.js
 * @description Contexto do padrão State. A Battle não toma mais decisões
 * de fluxo diretamente — ela delega para o estado atual (this.estado).
 *
 * A Battle mantém:
 *  - Os dados da batalha (equipe, selvagem, ativo)
 *  - A tabela de efetividade e os helpers de dano
 *  - O estado atual, acessível via this.estado
 *  - O método _transicionarPara() usado pelos estados
 */
class Battle {
  constructor(pokemonEquipe, pokemonSelvagem) {
    this.equipe   = pokemonEquipe;
    this.selvagem = pokemonSelvagem;
    this.ativo    = this.equipe[0];

    this._efetividade = {
      'Fogo':          { 'Grama': 1.5, 'Inseto': 1.5, 'Água': 0.6, 'Fogo': 0.6 },
      'Água':          { 'Fogo': 1.5, 'Água': 0.6, 'Grama': 0.6 },
      'Grama':         { 'Água': 1.5, 'Pedra': 1.5, 'Fogo': 0.6, 'Veneno': 0.6, 'Grama': 0.6 },
      'Normal':        {},
      'Inseto':        { 'Grama': 1.5, 'Veneno': 0.6 },
      'Inseto/Veneno': { 'Grama': 1.5 },
      'Água/Veneno':   { 'Fogo': 1.3, 'Grama': 0.7 },
    };

    // ── Estado inicial: turno do jogador ─────────────────────────
    this.estado = new PlayerTurnState(this);
  }

  // ─── API pública — delegada ao estado atual ───────────────────────────────

  atacar()       { return this.estado.atacar(); }
  trocar(indice) { return this.estado.trocar(indice); }
  capturar()     { return this.estado.capturar(); }
  correr()       { return this.estado.correr(); }

  /** Indica se o jogador pode interagir agora (usado pela BattleUI). */
  jogadorPodeAgir() { return this.estado.jogadorPodeAgir(); }

  /** Indica se a batalha terminou (usado pela BattleUI). */
  get encerrada() { return this.estado.encerrada(); }

  /** Resultado final ('vitoria' | 'derrota' | 'fuga' | 'captura') ou null. */
  get resultado() { return this.estado.resultado ?? null; }

  // ─── Transição de estado ──────────────────────────────────────────────────

  /**
   * Muda o estado atual. Chamado exclusivamente pelos estados concretos.
   * @param {BattleState} novoEstado
   */
  _transicionarPara(novoEstado) {
    this.estado = novoEstado;
  }

  // ─── Helpers de dano (usados pelos estados) ───────────────────────────────

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

  tentarCapturar() {
    const chance = 1 - (this.selvagem.vida / this.selvagem.vidaMax) * 0.7;
    return Math.random() < chance;
  }

  tentarCorrer() {
    const bonus = this.ativo.velocidade > this.selvagem.velocidade ? 0.2 : 0;
    return Math.random() < (0.5 + bonus);
  }

  _turnoInimigo(estado) { return estado; }
}