// Rattata — tipo Normal. 20% de chance de golpe duplo ao atacar.
const RATTATA_BASE = { vida: 30, ataque: 56, defesa: 35, velocidade: 72 };

class Rattata extends Pokemon {
  constructor(atributos) {
    super('Rattata', 'Normal', atributos);
  }

  atacar() {
    const golpesDuplos = Math.random() < 0.2;
    return {
      dano: Math.floor(this.ataque * (golpesDuplos ? 1.8 : 1.0)),
      golpesDuplos,
    };
  }

  _subirNivel() {
    super._subirNivel();
    this.ataque     = Math.floor(this.ataque     * 1.05);
    this.velocidade = Math.floor(this.velocidade * 1.05);
  }
}