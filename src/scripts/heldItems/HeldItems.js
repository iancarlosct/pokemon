/**
 * @file HeldItems.js
 * @description Todos os decorators concretos de held items.
 * Cada classe estende HeldItemDecorator e sobrescreve apenas
 * o comportamento relevante ao seu efeito.
 *
 * ─────────────────────────────────────────────────────────────────
 *  Item           │ Efeito
 * ─────────────────────────────────────────────────────────────────
 *  Choice Band    │ +50% ataque; trava no primeiro move usado
 *  Leftovers      │ Recupera 1/16 do HP máximo por turno
 *  Rocky Helmet   │ Devolve 1/6 do dano recebido ao atacante
 *  Eviolite       │ +50% defesa (para Pokémon que ainda evoluem)
 *  Lum Berry      │ (reservado — cura status; sem status no jogo ainda)
 * ─────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════════
//  CHOICE BAND
//  Aumenta o ataque em 50%, mas trava o Pokémon no primeiro move
//  usado na batalha (qualquer tentativa subsequente usa o mesmo move).
// ═══════════════════════════════════════════════════════════════════
class ChoiceBandDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Choice Band');
    this._moveUsado = null; // null = livre para escolher
  }

  get ataque() {
    return Math.floor(this._pokemon.ataque * 1.5);
  }

  set ataque(v) {
    this._pokemon.ataque = v;
  }

  atacar() {
    // Se ainda não escolheu um move, deixa o Pokémon atacar normalmente
    // e memoriza o resultado para travar nos próximos turnos.
    if (this._moveUsado === null) {
      const resultado = this._pokemon.atacar();
      this._moveUsado = resultado;
      return resultado;
    }

    // Já escolheu: repete o mesmo move (simula o "lock" da Choice Band)
    return this._moveUsado;
  }

  /**
   * Reseta o lock ao fim da batalha ou ao trocar.
   * Deve ser chamado por Battle.trocar() ou ao encerrar batalha.
   */
  resetarMove() {
    this._moveUsado = null;
  }

  status() {
    return {
      ...super.status(),
      choiceLocked: this._moveUsado !== null,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  LEFTOVERS
//  Ao início de cada turno do Pokémon, recupera 1/16 do HP máximo.
//  O efeito é aplicado via aoIniciarTurno(), chamado por Battle.atacar().
// ═══════════════════════════════════════════════════════════════════
class LeftoversDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Leftovers');
  }

  aoIniciarTurno() {
    const cura = Math.max(1, Math.floor(this.vidaMax / 16));
    const vidaAntes = this.vida;
    this.curar(cura);
    const curado = this.vida - vidaAntes;

    const log = curado > 0
      ? [`${this.nome} recuperou ${curado} HP com os Leftovers!`]
      : [];

    return { log };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  ROCKY HELMET
//  Quando este Pokémon recebe dano, o atacante sofre 1/6 do dano
//  recebido de volta. Battle._turnoInimigo() verifica o heldItem
//  do Pokémon ativo para aplicar o contra-dano.
// ═══════════════════════════════════════════════════════════════════
class RockyHelmetDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Rocky Helmet');
  }

  receberDano(dano) {
    const danoEfetivo = this._pokemon.receberDano(dano);
    // O contra-dano é calculado aqui, mas aplicado por Battle
    // via o campo 'contaDano' no retorno.
    this._ultimoContraDano = Math.max(1, Math.floor(danoEfetivo / 6));
    return danoEfetivo;
  }

  /**
   * Retorna o contra-dano do último receberDano() e o reseta.
   * @returns {number}
   */
  consumirContraDano() {
    const v = this._ultimoContraDano ?? 0;
    this._ultimoContraDano = 0;
    return v;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  EVIOLITE
//  Aumenta a defesa em 50%. Temáticamente para Pokémon não-finais
//  da linha evolutiva, mas aplicável a qualquer um no sistema.
// ═══════════════════════════════════════════════════════════════════
class EvioliteDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Eviolite');
  }

  get defesa() {
    return Math.floor(this._pokemon.defesa * 1.5);
  }

  set defesa(v) {
    this._pokemon.defesa = v;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  LUM BERRY
//  Reservado para quando o sistema de status (paralisia, sono, etc.)
//  for implementado. Por ora, não tem efeito mecânico.
//  Mantido para completude da API de items.
// ═══════════════════════════════════════════════════════════════════
class LumBerryDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Lum Berry');
    this._usado = false;
  }

  /**
   * Quando status for implementado, chamar este método para curar.
   * Retorna true se a berry foi consumida, false se já foi usada.
   */
  curarStatus() {
    if (this._usado) return false;
    this._usado = true;
    return true;
  }

  status() {
    return {
      ...super.status(),
      berryUsada: this._usado,
    };
  }
}
