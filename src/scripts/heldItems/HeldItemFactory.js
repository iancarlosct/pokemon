/**
 * @file HeldItemFactory.js
 * @description Instancia o decorator correto a partir de um nome de item.
 *
 * Uso:
 *   const pokemon = HeldItemFactory.equipar(meuPokemon, 'Leftovers');
 *   // Retorna um LeftoversDecorator envolvendo meuPokemon.
 *
 *   const pokemon = HeldItemFactory.equipar(meuPokemon, null);
 *   // Retorna o próprio pokemon sem alterações.
 */
const HeldItemFactory = {

  /**
   * Mapa de nome → classe decorator.
   * Adicionar novos items aqui é tudo que é necessário para registrá-los.
   */
  _registro: {
    'Choice Band':  ChoiceBandDecorator,
    'Leftovers':    LeftoversDecorator,
    'Rocky Helmet': RockyHelmetDecorator,
    'Eviolite':     EvioliteDecorator,
    'Lum Berry':    LumBerryDecorator,
  },

  /**
   * Retorna todos os nomes de items disponíveis.
   * @returns {string[]}
   */
  listar() {
    return Object.keys(this._registro);
  },

  /**
   * Envolve um Pokémon com o decorator do item informado.
   * Se itemNome for null/undefined/'', retorna o Pokémon sem decorator.
   *
   * @param {Pokemon} pokemon
   * @param {string|null} itemNome
   * @returns {Pokemon|HeldItemDecorator}
   */
  equipar(pokemon, itemNome) {
    if (!itemNome) return pokemon;

    const DecoratorClass = this._registro[itemNome];
    if (!DecoratorClass) {
      console.warn(`[HeldItemFactory] Item desconhecido: "${itemNome}". Pokémon retornado sem item.`);
      return pokemon;
    }

    return new DecoratorClass(pokemon);
  },

  /**
   * Remove o held item de um Pokémon, retornando o componente interno puro.
   * Suporta decorators aninhados (apenas remove a camada mais externa).
   *
   * @param {Pokemon|HeldItemDecorator} pokemon
   * @returns {Pokemon}
   */
  remover(pokemon) {
    if (pokemon instanceof HeldItemDecorator) {
      return pokemon._pokemon;
    }
    return pokemon;
  },

  /**
   * Retorna o nome do item equipado, ou null se não houver.
   * @param {Pokemon|HeldItemDecorator} pokemon
   * @returns {string|null}
   */
  itemAtual(pokemon) {
    return pokemon instanceof HeldItemDecorator ? pokemon.heldItem : null;
  },
};
