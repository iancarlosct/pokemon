// Charmander — tipo Fogo. Ganha +5% de ataque extra ao subir de nível.
const CHARMANDER_BASE = { vida: 39, ataque: 52, defesa: 43, velocidade: 65 };

class Charmander extends Pokemon {
  constructor(atributos) {
    super('Charmander', 'Fogo', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  _subirNivel() {
    super._subirNivel();
    this.ataque = Math.floor(this.ataque * 1.05);
  }
}