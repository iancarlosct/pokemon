const BULBASAUR_BASE = { vida: 45, ataque: 49, defesa: 49, velocidade: 45 };

class Bulbasaur extends Pokemon {
  constructor(atributos) {
    super("Bulbasaur", "Planta/Veneno", atributos);
    this.cargas = 3; // usos de habilidadeEspecial por batalha
  }

  // Retorna { dano, envenenou } — 20% de chance de envenenar
  atacar() {
    return {
      dano: Math.floor(this.ataque * 0.95),
      envenenou: Math.random() < 0.2,
    };
  }

  // Causa dano e cura Bulbasaur. Limitado a this.cargas usos
  habilidadeEspecial() {
    if (this.cargas <= 0) return null;
    this.cargas--;
    const cura = Math.floor(this.vidaMax * 0.15);
    this.curar(cura);
    return { dano: Math.floor(this.ataque * 1.8), cura };
  }

  _subirNivel() {
    super._subirNivel();
    if (this.nivel % 3 === 0) this.cargas++;
  }
}
