/**
 * @file PokemonCreator.js
 * @description Implementação do padrão Factory Method para criação de Pokémon.
 *
 * PokemonCreator é a classe abstrata que define o Factory Method: criarPokemon().
 * Cada subclasse concreta sobrescreve criarPokemon() para instanciar sua própria
 * espécie, sem que o código cliente precise saber qual classe concreta está sendo
 * criada.
 *
 * O método criar() é o "template method" — ele orquestra a lógica comum
 * (aplicar multiplicadores, clamp de valores) e chama criarPokemon() para
 * obter a instância concreta.
 *
 * PokemonFactory continua existindo como ponto de entrada, mas agora delega
 * a criação para o creator correto em vez de instanciar diretamente.
 *
 * Hierarquia:
 *
 *  PokemonCreator (abstrato)
 *    ├── CharmanderCreator
 *    ├── BulbasaurCreator
 *    ├── SquirtleCreator
 *    ├── CaterpieCreator
 *    ├── WeedleCreator
 *    ├── RattataCreator
 *    ├── TentacoolCreator
 *    ├── MagikarpCreator
 *    └── HorseaCreator
 */

// ═══════════════════════════════════════════════════════════════════
//  CREATOR ABSTRATO
// ═══════════════════════════════════════════════════════════════════
class PokemonCreator {
  constructor() {
    if (new.target === PokemonCreator) {
      throw new Error('PokemonCreator é uma classe abstrata.');
    }
  }

  /**
   * Factory Method — cada subclasse implementa a instanciação da sua espécie.
   * Recebe os atributos já calculados (com multiplicadores aplicados).
   *
   * @param {object} atributos - { vida, ataque, defesa, velocidade }
   * @returns {Pokemon}
   */
  criarPokemon(atributos) {
    throw new Error(`${this.constructor.name} deve implementar criarPokemon().`);
  }

  /**
   * Retorna os base stats da espécie. Cada creator conhece os seus.
   * @returns {{ vida: number, ataque: number, defesa: number, velocidade: number }}
   */
  baseStats() {
    throw new Error(`${this.constructor.name} deve implementar baseStats().`);
  }

  /**
   * Template Method — orquestra a criação:
   *  1. Obtém os base stats via baseStats()
   *  2. Aplica os multiplicadores (com clamp entre 0.5 e 2.0)
   *  3. Delega a instanciação para criarPokemon() (Factory Method)
   *
   * @param {object} multiplicadores - { vida?, ataque?, defesa?, velocidade? }
   * @returns {Pokemon}
   */
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

// ═══════════════════════════════════════════════════════════════════
//  CREATORS CONCRETOS — Pokémon do jogador
// ═══════════════════════════════════════════════════════════════════

class CharmanderCreator extends PokemonCreator {
  baseStats() { return CHARMANDER_BASE; }
  criarPokemon(atributos) { return new Charmander(atributos); }
}

class BulbasaurCreator extends PokemonCreator {
  baseStats() { return BULBASAUR_BASE; }
  criarPokemon(atributos) { return new Bulbasaur(atributos); }
}

class SquirtleCreator extends PokemonCreator {
  baseStats() { return SQUIRTLE_BASE; }
  criarPokemon(atributos) { return new Squirtle(atributos); }
}

// ═══════════════════════════════════════════════════════════════════
//  CREATORS CONCRETOS — Pokémon selvagens
// ═══════════════════════════════════════════════════════════════════

class CaterpieCreator extends PokemonCreator {
  baseStats() { return CATERPIE_BASE; }
  criarPokemon(atributos) { return new Caterpie(atributos); }
}

class WeedleCreator extends PokemonCreator {
  baseStats() { return WEEDLE_BASE; }
  criarPokemon(atributos) { return new Weedle(atributos); }
}

class RattataCreator extends PokemonCreator {
  baseStats() { return RATTATA_BASE; }
  criarPokemon(atributos) { return new Rattata(atributos); }
}

class TentacoolCreator extends PokemonCreator {
  baseStats() { return TENTACOOL_BASE; }
  criarPokemon(atributos) { return new Tentacool(atributos); }
}

class MagikarpCreator extends PokemonCreator {
  baseStats() { return MAGIKARP_BASE; }
  criarPokemon(atributos) { return new Magikarp(atributos); }
}

class HorseaCreator extends PokemonCreator {
  baseStats() { return HORSEA_BASE; }
  criarPokemon(atributos) { return new Horsea(atributos); }
}