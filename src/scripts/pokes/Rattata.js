const RATTATA_BASE = { vida: 30, ataque: 56, defesa: 35, velocidade: 72 };

class Rattata extends Pokemon {
  constructor(atributos) {
    super("Rattata", "Normal", atributos);
    this.hiperDenteCargas = 2; // usos de habilidadeEspecial por batalha
  }

  // Ataque rápido; por ser o mais veloz, 20% de chance de atacar duas vezes
  // Retorna { dano, golpesDuplos }
  atacar() {
    const golpesDuplos = Math.random() < 0.2;
    return {
      dano: Math.floor(this.ataque * (golpesDuplos ? 1.8 : 1.0)),
      golpesDuplos,
    };
  }

  // Hiper Dente: ignora metade da defesa do oponente; uso limitado
  // Retorna { dano, ignoraDefesa } ou null se sem cargas
  habilidadeEspecial() {
    if (this.hiperDenteCargas <= 0) return null;
    this.hiperDenteCargas--;
    return {
      dano: Math.floor(this.ataque * 2.0),
      ignoraDefesa: true, // o motor de batalha deve ignorar 50% da defesa do alvo
    };
  }

  _subirNivel() {
    super._subirNivel();
    this.ataque     = Math.floor(this.ataque     * 1.05); // Rattata escala mais em ataque
    this.velocidade = Math.floor(this.velocidade * 1.05); // e velocidade
  }
}
