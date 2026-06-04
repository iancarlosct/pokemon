const CHARMANDER_BASE = { vida: 39, ataque: 52, defesa: 43, velocidade: 65 };

class Charmander extends Pokemon {
  constructor(atributos) {
    super("Charmander", "Fogo", atributos);
    this.brasa = 0; // acumula até 5; potencializa habilidadeEspecial
  }

  atacar() {
    this.brasa = Math.min(5, this.brasa + 1);
    return Math.floor(this.ataque * 1.0);
  }

  // Consome toda a brasa acumulada para amplificar o dano
  habilidadeEspecial() {
    const dano = Math.floor(this.ataque * (1.5 + this.brasa * 0.3));
    this.brasa = 0;
    return dano;
  }

  _subirNivel() {
    super._subirNivel();
    this.ataque = Math.floor(this.ataque * 1.05);
  }
}
