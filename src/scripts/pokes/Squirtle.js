const SQUIRTLE_BASE = { vida: 44, ataque: 48, defesa: 65, velocidade: 43 };

class Squirtle extends Pokemon {
  constructor(atributos) {
    super("Squirtle", "Água", atributos);
    this.escudoAtivo = false;
  }

  atacar() {
    return Math.floor(this.ataque * 1.0);
  }

  // Alterna entre ativar escudo (dobra defesa) e soltar Hidrobomba (alto dano)
  habilidadeEspecial() {
    if (!this.escudoAtivo) {
      this.escudoAtivo = true;
      this.defesa = Math.floor(this.defesa * 2);
      return { dano: Math.floor(this.ataque * 0.5), escudo: true };
    }
    this.defesa = Math.floor(this.defesa / 2);
    this.escudoAtivo = false;
    return { dano: Math.floor(this.ataque * 2.5), escudo: false };
  }

  receberDano(dano) {
    return super.receberDano(this.escudoAtivo ? Math.floor(dano * 0.9) : dano);
  }

  _subirNivel() {
    super._subirNivel();
    this.defesa = Math.floor(this.defesa * 1.05);
  }
}
