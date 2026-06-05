const WEEDLE_BASE = { vida: 40, ataque: 35, defesa: 30, velocidade: 50 };

class Weedle extends Pokemon {
  constructor(atributos) {
    super("Weedle", "Inseto/Veneno", atributos);
    this.venenoAtivo = false; // rastrea se o oponente foi envenenado pelo aguijão
  }

  // Picada básica; 25% de chance de envenenar o alvo
  // Retorna { dano, envenenou }
  atacar() {
    const envenenou = !this.venenoAtivo && Math.random() < 0.25;
    if (envenenou) this.venenoAtivo = true;
    return {
      dano: Math.floor(this.ataque * 1.0),
      envenenou,
    };
  }

  // Aguijão venenoso: dano garantido + veneno mais potente
  // Retorna { dano, envenenou, danoVenenoExtra }
  habilidadeEspecial() {
    this.venenoAtivo = true;
    return {
      dano: Math.floor(this.ataque * 1.6),
      envenenou: true,
      danoVenenoExtra: Math.floor(this.ataque * 0.2), // dano por turno de veneno
    };
  }

  _subirNivel() {
    super._subirNivel();
    this.velocidade = Math.floor(this.velocidade * 1.05); // Weedle escala mais em velocidade
  }
}
