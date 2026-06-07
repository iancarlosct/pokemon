const BASE_STATS = {
  charmander: CHARMANDER_BASE,
  bulbasaur:  BULBASAUR_BASE,
  squirtle:   SQUIRTLE_BASE,
  caterpie:   CATERPIE_BASE,
  weedle:     WEEDLE_BASE,
  rattata:    RATTATA_BASE,
  tentacool:  TENTACOOL_BASE,
  magikarp:   MAGIKARP_BASE,
  horsea:     HORSEA_BASE,
};

class PokemonFactory {
  static _creators = null;

  static _getCreators() {
    if (!PokemonFactory._creators) {
      PokemonFactory._creators = {
        charmander: new CharmanderCreator(),
        bulbasaur:  new BulbasaurCreator(),
        squirtle:   new SquirtleCreator(),
        caterpie:   new CaterpieCreator(),
        weedle:     new WeedleCreator(),
        rattata:    new RattataCreator(),
        tentacool:  new TentacoolCreator(),
        magikarp:   new MagikarpCreator(),
        horsea:     new HorseaCreator(),
      };
    }
    return PokemonFactory._creators;
  }

  static criar(especie, multiplicadores = {}) {
    const chave   = especie.toLowerCase().trim();
    const creator = PokemonFactory._getCreators()[chave];
    if (!creator) throw new Error(`Espécie "${especie}" não reconhecida.`);
    return creator.criar(multiplicadores);
  }

  static multiplicadorAleatorio(min = 0.85, max = 1.15) {
    return Object.fromEntries(
      ['vida', 'ataque', 'defesa', 'velocidade'].map(attr => [
        attr,
        parseFloat((Math.random() * (max - min) + min).toFixed(2)),
      ])
    );
  }

  static especiesDisponiveis() {
    return Object.keys(PokemonFactory._getCreators());
  }
}