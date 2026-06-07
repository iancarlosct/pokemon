// Magikarp — tipo Água. Ataque fraco mas escala forte em velocidade.
const MAGIKARP_BASE = { vida: 20, ataque: 10, defesa: 55, velocidade: 80 };

class Magikarp extends Pokemon {
  constructor(atributos) {
    super('Magikarp', 'Água', atributos);
  }

  atacar() {
    return Math.max(1, Math.floor(this.ataque * 0.3));
  }

  _subirNivel() {
    super._subirNivel();
    this.velocidade = Math.floor(this.velocidade * 1.08);
  }
}