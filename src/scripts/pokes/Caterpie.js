const CATERPIE_BASE = { vida: 45, ataque: 30, defesa: 35, velocidade: 45 };

class Caterpie extends Pokemon {
  constructor(atributos) {
    super("Caterpie", "Normal", atributos);
    this.pilhasSeda = 0; // acumula até 3; reduz a defesa do oponente quando aplicado
  }

  // Ataque básico; acumula seda a cada golpe
  atacar() {
    this.pilhasSeda = Math.min(3, this.pilhasSeda + 1);
    return Math.floor(this.ataque * 0.9);
  }

  // Dispara toda a seda acumulada: quanto mais pilhas, maior a penalidade de defesa do alvo
  // Retorna { dano, reducaoDefesa } — o motor de batalha deve aplicar reducaoDefesa no alvo
  habilidadeEspecial() {
    const multiplicador = 1.0 + this.pilhasSeda * 0.4; // 1.4 / 1.8 / 2.2
    const reducaoDefesa = this.pilhasSeda * 5;          // 5 / 10 / 15 pontos de defesa
    const dano = Math.floor(this.ataque * multiplicador);
    this.pilhasSeda = 0;
    return { dano, reducaoDefesa };
  }

  _subirNivel() {
    super._subirNivel();
    this.vida = Math.floor(this.vidaMax * 1.05); // Caterpie escala mais em HP
  }
}
