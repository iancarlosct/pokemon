/**
 * @file HeldItemDecorator.js
 * @description Classe abstrata base para o padrão Decorator aplicado a Pokémon.
 *
 * Todo held item é um decorator que:
 *  1. Recebe uma instância de Pokemon (ou outro decorator) no construtor.
 *  2. Delega TODOS os acessos de propriedade para o componente interno (_pokemon).
 *  3. Sobrescreve apenas o comportamento que o item modifica.
 *
 * Isso garante que Battle e BattleUI continuem funcionando sem nenhuma alteração —
 * eles nunca sabem se estão lidando com um Pokemon puro ou com um decorator.
 */
class HeldItemDecorator {
  /**
   * @param {Pokemon} pokemon - A instância a ser decorada (pode ser outro decorator).
   * @param {string}  itemNome - Nome do item para exibição e serialização.
   */
  constructor(pokemon, itemNome) {
    if (new.target === HeldItemDecorator) {
      throw new Error('HeldItemDecorator é uma classe abstrata.');
    }
    this._pokemon = pokemon;
    this.heldItem = itemNome;
  }

  // ─── Delegação completa de propriedades ──────────────────────────────────
  // Cada getter/setter repassa para o _pokemon interno.
  // Os decorators concretos sobrescrevem apenas o que precisam.

  get nome()       { return this._pokemon.nome; }
  get tipo()       { return this._pokemon.tipo; }
  get nivel()      { return this._pokemon.nivel; }
  get experiencia(){ return this._pokemon.experiencia; }
  get vivo()       { return this._pokemon.vivo; }
  get vida()       { return this._pokemon.vida; }
  get vidaMax()    { return this._pokemon.vidaMax; }
  get ataque()     { return this._pokemon.ataque; }
  get defesa()     { return this._pokemon.defesa; }
  get velocidade() { return this._pokemon.velocidade; }

  set nome(v)        { this._pokemon.nome = v; }
  set tipo(v)        { this._pokemon.tipo = v; }
  set nivel(v)       { this._pokemon.nivel = v; }
  set experiencia(v) { this._pokemon.experiencia = v; }
  set vivo(v)        { this._pokemon.vivo = v; }
  set vida(v)        { this._pokemon.vida = v; }
  set vidaMax(v)     { this._pokemon.vidaMax = v; }
  set ataque(v)      { this._pokemon.ataque = v; }
  set defesa(v)      { this._pokemon.defesa = v; }
  set velocidade(v)  { this._pokemon.velocidade = v; }

  // ─── Delegação de métodos ────────────────────────────────────────────────

  receberDano(dano)         { return this._pokemon.receberDano(dano); }
  curar(quantidade)         { return this._pokemon.curar(quantidade); }
  ganharExperiencia(xp)     { return this._pokemon.ganharExperiencia(xp); }
  atacar()                  { return this._pokemon.atacar(); }
  habilidadeEspecial()      { return this._pokemon.habilidadeEspecial(); }

  status() {
    return {
      ...this._pokemon.status(),
      heldItem: this.heldItem,
    };
  }

  /**
   * Hook chamado no início de cada turno do Pokémon decorado.
   * Decorators que têm efeito de turno (ex: Leftovers) sobrescrevem este método.
   * @returns {{ log: string[] }}
   */
  aoIniciarTurno() {
    return { log: [] };
  }
}
