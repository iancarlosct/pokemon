// Bulbasaur — tipo Grama/Veneno.
const BULBASAUR_BASE = { vida: 45, ataque: 49, defesa: 49, velocidade: 45 };

class Bulbasaur extends Pokemon {
  constructor(atributos) {
    super('Bulbasaur', 'Grama', atributos);
  }

  atacar() {
    return Math.floor(this.ataque * 0.95);
  }
}