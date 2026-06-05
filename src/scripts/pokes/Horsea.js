const HORSEA_BASE = { vida: 30, ataque: 40, defesa: 70, velocidade: 60 };

class Horsea extends Pokemon {
  constructor(atributos) {
    super("Horsea", "Água", atributos);
    this.cargasTinta = 4; // usos de habilidadeEspecial por batalha
    this.reducaoVelocidadeAtiva = false; // rastrea se o oponente está com velocidade reduzida
  }

  // Disparo de água; 30% de chance de reduzir velocidade do oponente
  // Retorna { dano, reduziuVelocidade }
  atacar() {
    const reduziuVelocidade = !this.reducaoVelocidadeAtiva && Math.random() < 0.3;
    if (reduziuVelocidade) this.reducaoVelocidadeAtiva = true;
    return {
      dano: Math.floor(this.ataque * 1.0),
      reduziuVelocidade,
      reducaoVelocidade: reduziuVelocidade ? 10 : 0, // pontos de velocidade removidos do alvo
    };
  }

  // Tinta: cega o oponente, garantindo redução de velocidade e precisão baixa por 1 turno
  // Retorna { dano, cegou } ou null se sem cargas
  habilidadeEspecial() {
    if (this.cargasTinta <= 0) return null;
    this.cargasTinta--;
    this.reducaoVelocidadeAtiva = true;
    return {
      dano: Math.floor(this.ataque * 1.3),
      cegou: true, // o motor de batalha deve aplicar penalidade de precisão ao alvo
      reducaoVelocidade: 20,
    };
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.06); // Horsea escala forte em defesa
    if (this.nivel % 4 === 0) this.cargasTinta++; // ganha uma carga extra a cada 4 níveis
  }
}
