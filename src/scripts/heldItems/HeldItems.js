// Decorators concretos de held items. Cada um sobrescreve apenas o que seu efeito modifica.

// +50% ataque; trava o Pokémon no move usado no primeiro turno.
class ChoiceBandDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Choice Band');
    this._moveUsado = null;
  }

  get ataque() { return Math.floor(this._pokemon.ataque * 1.5); }
  set ataque(v){ this._pokemon.ataque = v; }

  atacar() {
    if (this._moveUsado === null) {
      this._moveUsado = this._pokemon.atacar();
      return this._moveUsado;
    }
    return this._moveUsado;
  }

  // Chamado por Battle.trocar() ao trocar de Pokémon
  resetarMove() { this._moveUsado = null; }
}

// Recupera 1/16 do HP máximo no início de cada turno.
class LeftoversDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Leftovers');
  }

  aoIniciarTurno() {
    const cura     = Math.max(1, Math.floor(this.vidaMax / 16));
    const anterior = this.vida;
    this.curar(cura);
    const curado = this.vida - anterior;
    return { log: curado > 0 ? [`${this.nome} recuperou ${curado} HP com os Leftovers!`] : [] };
  }
}

// Devolve 1/6 do dano recebido ao atacante.
class RockyHelmetDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Rocky Helmet');
  }

  receberDano(dano) {
    const danoEfetivo      = this._pokemon.receberDano(dano);
    this._ultimoContraDano = Math.max(1, Math.floor(danoEfetivo / 6));
    return danoEfetivo;
  }

  consumirContraDano() {
    const v = this._ultimoContraDano ?? 0;
    this._ultimoContraDano = 0;
    return v;
  }
}

// +50% defesa.
class EvioliteDecorator extends HeldItemDecorator {
  constructor(pokemon) {
    super(pokemon, 'Eviolite');
  }

  get defesa() { return Math.floor(this._pokemon.defesa * 1.5); }
  set defesa(v){ this._pokemon.defesa = v; }
}