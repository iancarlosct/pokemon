// Padrão Decorator: envolve um Pokémon e delega tudo ao componente interno,
// sobrescrevendo apenas o que o item modifica.
class HeldItemDecorator {
  constructor(pokemon, itemNome) {
    if (new.target === HeldItemDecorator) {
      throw new Error('HeldItemDecorator é uma classe abstrata.');
    }
    this._pokemon = pokemon;
    this.heldItem = itemNome;
  }

  get nome()        { return this._pokemon.nome; }
  get tipo()        { return this._pokemon.tipo; }
  get nivel()       { return this._pokemon.nivel; }
  get experiencia() { return this._pokemon.experiencia; }
  get vivo()        { return this._pokemon.vivo; }
  get vida()        { return this._pokemon.vida; }
  get vidaMax()     { return this._pokemon.vidaMax; }
  get ataque()      { return this._pokemon.ataque; }
  get defesa()      { return this._pokemon.defesa; }
  get velocidade()  { return this._pokemon.velocidade; }

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

  receberDano(dano)      { return this._pokemon.receberDano(dano); }
  curar(quantidade)      { return this._pokemon.curar(quantidade); }
  ganharExperiencia(xp)  { return this._pokemon.ganharExperiencia(xp); }
  atacar()               { return this._pokemon.atacar(); }

  // Hook de turno — sobrescrito por decorators com efeito por turno (ex: Leftovers)
  aoIniciarTurno() { return { log: [] }; }
}