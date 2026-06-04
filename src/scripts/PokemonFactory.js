const CONSTRUTORES = { charmander: Charmander, bulbasaur: Bulbasaur, squirtle: Squirtle };
const BASE_STATS   = { charmander: CHARMANDER_BASE, bulbasaur: BULBASAUR_BASE, squirtle: SQUIRTLE_BASE };

class PokemonFactory {
  // multiplicadores: { vida, ataque, defesa, velocidade } — valores opcionais, padrão 1.0
  static criar(especie, multiplicadores = {}) {
    const chave = especie.toLowerCase().trim();
    const Classe = CONSTRUTORES[chave];

    if (!Classe) throw new Error(`Espécie "${especie}" não reconhecida.`);

    const atributos = {};
    for (const [attr, base] of Object.entries(BASE_STATS[chave])) {
      const fator = Math.max(0.5, Math.min(2.0, multiplicadores[attr] ?? 1.0));
      atributos[attr] = Math.round(base * fator);
    }

    return new Classe(atributos);
  }

  // Gera multiplicadores aleatórios entre min e max para todos os atributos
  static multiplicadorAleatorio(min = 0.85, max = 1.15) {
    return Object.fromEntries(
      ["vida", "ataque", "defesa", "velocidade"].map(attr => [
        attr,
        parseFloat((Math.random() * (max - min) + min).toFixed(2)),
      ])
    );
  }
}
