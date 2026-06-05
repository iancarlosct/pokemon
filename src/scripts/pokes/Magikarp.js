const MAGIKARP_BASE = { vida: 20, ataque: 10, defesa: 55, velocidade: 80 };

class Magikarp extends Pokemon {
  constructor(atributos) {
    super("Magikarp", "Água", atributos);
    this.furia = 0;      // acumula a cada dano recebido; potencializa Salto
    this.saltoCargas = 3; // usos de habilidadeEspecial por batalha
  }

  // Splash: ataque praticamente inútil, mas acumula fúria
  // Retorna { dano, mensagem }
  atacar() {
    this.furia = Math.min(10, this.furia + 1);
    return {
      dano: Math.max(1, Math.floor(this.ataque * 0.3)),
      mensagem: "Magikarp usou Splash! Não teve efeito algum...",
    };
  }

  // Salto: dano proporcional à fúria acumulada; surpreendentemente forte com fúria alta
  // Retorna { dano } ou null se sem cargas
  habilidadeEspecial() {
    if (this.saltoCargas <= 0) return null;
    this.saltoCargas--;
    const multiplicador = 1.0 + this.furia * 0.5; // até 6x com fúria máxima
    const dano = Math.floor(this.ataque * multiplicador);
    this.furia = 0;
    return { dano };
  }

  // Sobrescreve para acumular fúria a cada dano recebido
  receberDano(dano) {
    const danoFinal = super.receberDano(dano);
    if (danoFinal > 0) this.furia = Math.min(10, this.furia + 1);
    return danoFinal;
  }

  _subirNivel() {
    super._subirNivel();
    // Magikarp escala lentamente; a recompensa é a evolução
    this.velocidade = Math.floor(this.velocidade * 1.08);
  }
}
