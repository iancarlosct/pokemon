// Instancia e gerencia decorators de held items pelo nome do item.
const HeldItemFactory = {
  _registro: {
    'Choice Band':  ChoiceBandDecorator,
    'Leftovers':    LeftoversDecorator,
    'Rocky Helmet': RockyHelmetDecorator,
    'Eviolite':     EvioliteDecorator,
  },

  listar() {
    return Object.keys(this._registro);
  },

  equipar(pokemon, itemNome) {
    if (!itemNome) return pokemon;
    const DecoratorClass = this._registro[itemNome];
    if (!DecoratorClass) {
      console.warn(`[HeldItemFactory] Item desconhecido: "${itemNome}".`);
      return pokemon;
    }
    return new DecoratorClass(pokemon);
  },

  remover(pokemon) {
    return pokemon instanceof HeldItemDecorator ? pokemon._pokemon : pokemon;
  },

  itemAtual(pokemon) {
    return pokemon instanceof HeldItemDecorator ? pokemon.heldItem : null;
  },
};