// Caterpie — tipo Inseto.
const CATERPIE_BASE = { vida: 45, ataque: 30, defesa: 35, velocidade: 45 };

class Caterpie extends Pokemon {
  constructor(atributos) {
    super('Caterpie', 'Inseto', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 0.9);
  }
}