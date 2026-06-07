// Squirtle — tipo Água. Ganha +5% de defesa extra ao subir de nível.
const SQUIRTLE_BASE = { vida: 44, ataque: 48, defesa: 65, velocidade: 43 };

class Squirtle extends Pokemon {
  constructor(atributos) {
    super('Squirtle', 'Água', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.05);
  }
}