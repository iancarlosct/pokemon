// Padrão Factory Method: PokemonCreator define o contrato de criação,
// cada subclasse concreta instancia sua própria espécie.
class PokemonCreator {
  constructor() {
    if (new.target === PokemonCreator) {
      throw new Error('PokemonCreator é uma classe abstrata.');
    }
  }

  // Factory Method — sobrescrito por cada subclasse
  criarPokemon(atributos) {
    throw new Error(`${this.constructor.name} deve implementar criarPokemon().`);
  }

  baseStats() {
    throw new Error(`${this.constructor.name} deve implementar baseStats().`);
  }

  // Aplica multiplicadores aos base stats e delega a instanciação
  criar(multiplicadores = {}) {
    const base      = this.baseStats();
    const atributos = {};
    for (const [attr, valorBase] of Object.entries(base)) {
      const fator = Math.max(0.5, Math.min(2.0, multiplicadores[attr] ?? 1.0));
      atributos[attr] = Math.round(valorBase * fator);
    }
    return this.criarPokemon(atributos);
  }
}

class CharmanderCreator extends PokemonCreator {
  baseStats()             { return CHARMANDER_BASE; }
  criarPokemon(atributos) { return new Charmander(atributos); }
}

class BulbasaurCreator extends PokemonCreator {
  baseStats()             { return BULBASAUR_BASE; }
  criarPokemon(atributos) { return new Bulbasaur(atributos); }
}

class SquirtleCreator extends PokemonCreator {
  baseStats()             { return SQUIRTLE_BASE; }
  criarPokemon(atributos) { return new Squirtle(atributos); }
}

class CaterpieCreator extends PokemonCreator {
  baseStats()             { return CATERPIE_BASE; }
  criarPokemon(atributos) { return new Caterpie(atributos); }
}

class WeedleCreator extends PokemonCreator {
  baseStats()             { return WEEDLE_BASE; }
  criarPokemon(atributos) { return new Weedle(atributos); }
}

class RattataCreator extends PokemonCreator {
  baseStats()             { return RATTATA_BASE; }
  criarPokemon(atributos) { return new Rattata(atributos); }
}

class TentacoolCreator extends PokemonCreator {
  baseStats()             { return TENTACOOL_BASE; }
  criarPokemon(atributos) { return new Tentacool(atributos); }
}

class MagikarpCreator extends PokemonCreator {
  baseStats()             { return MAGIKARP_BASE; }
  criarPokemon(atributos) { return new Magikarp(atributos); }
}

class HorseaCreator extends PokemonCreator {
  baseStats()             { return HORSEA_BASE; }
  criarPokemon(atributos) { return new Horsea(atributos); }
}