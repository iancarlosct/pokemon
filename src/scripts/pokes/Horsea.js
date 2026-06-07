// Horsea — tipo Água. Ganha +6% de defesa extra ao subir de nível.
const HORSEA_BASE = { vida: 30, ataque: 40, defesa: 70, velocidade: 60 };

class Horsea extends Pokemon {
  constructor(atributos) {
    super('Horsea', 'Água', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.06);
  }
}