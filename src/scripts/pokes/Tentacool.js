// Tentacool — tipo Água/Veneno. Ganha +5% de defesa extra ao subir de nível.
const TENTACOOL_BASE = { vida: 40, ataque: 40, defesa: 35, velocidade: 70 };

class Tentacool extends Pokemon {
  constructor(atributos) {
    super('Tentacool', 'Água/Veneno', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.05);
  }
}