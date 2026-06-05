const TENTACOOL_BASE = { vida: 40, ataque: 40, defesa: 35, velocidade: 70 };

class Tentacool extends Pokemon {
  constructor(atributos) {
    super("Tentacool", "Água/Veneno", atributos);
    this.tentaculosCarregados = false; // ativado após 2 ataques básicos seguidos
    this.ataquesSeguidos = 0;
  }

  // Ataque com tentáculos; a cada 2 ataques seguidos carrega os tentáculos
  // Retorna { dano, tentaculosCarregados }
  atacar() {
    this.ataquesSeguidos++;
    if (this.ataquesSeguidos >= 2) {
      this.tentaculosCarregados = true;
      this.ataquesSeguidos = 0;
    }
    return {
      dano: Math.floor(this.ataque * 1.0),
      tentaculosCarregados: this.tentaculosCarregados,
    };
  }

  // Ácido venenoso: sempre venena; dano amplificado se tentáculos carregados
  // Retorna { dano, envenenou, danoVenenoExtra }
  habilidadeEspecial() {
    const bonus = this.tentaculosCarregados ? 0.6 : 0;
    const dano = Math.floor(this.ataque * (1.5 + bonus));
    this.tentaculosCarregados = false;
    this.ataquesSeguidos = 0;
    return {
      dano,
      envenenou: true,
      danoVenenoExtra: Math.floor(this.ataque * 0.15),
    };
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.05); // Tentacool ganha mais defesa especial
  }
}
