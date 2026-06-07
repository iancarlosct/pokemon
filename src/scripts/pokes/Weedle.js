// Weedle — tipo Inseto/Veneno.
const WEEDLE_BASE = { vida: 40, ataque: 35, defesa: 30, velocidade: 50 };

class Weedle extends Pokemon {
  constructor(atributos) {
    super('Weedle', 'Inseto/Veneno', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  _subirNivel() {
    super._subirNivel();
    this.velocidade = Math.floor(this.velocidade * 1.05);
  }
}