// Classe base abstrata para todos os Pokémon do jogo.
class Pokemon {
  constructor(nome, tipo, atributos) {
    if (new.target === Pokemon) {
      throw new Error('Pokemon é uma classe abstrata.');
    }

    this.nome        = nome;
    this.tipo        = tipo;
    this.vidaMax     = atributos.vida;
    this.vida        = atributos.vida;
    this.ataque      = atributos.ataque;
    this.defesa      = atributos.defesa;
    this.velocidade  = atributos.velocidade;
    this.nivel       = 1;
    this.experiencia = 0;
    this.vivo        = true;
  }

  receberDano(dano) {
    const danoEfetivo = Math.max(0, dano - this.defesa);
    this.vida = Math.max(0, this.vida - danoEfetivo);
    if (this.vida === 0) this.vivo = false;
    return danoEfetivo;
  }

  curar(quantidade) {
    this.vida = Math.min(this.vidaMax, this.vida + quantidade);
    this.vivo = this.vida > 0;
  }

  ganharExperiencia(xp) {
    this.experiencia += xp;
    if (this.experiencia >= this.nivel * 100) {
      this.experiencia -= this.nivel * 100;
      this._subirNivel();
    }
  }

  _subirNivel() {
    this.nivel++;
    this.vidaMax    = Math.floor(this.vidaMax    * 1.1);
    this.ataque     = Math.floor(this.ataque     * 1.1);
    this.defesa     = Math.floor(this.defesa     * 1.1);
    this.velocidade = Math.floor(this.velocidade * 1.05);
    this.curar(this.vidaMax);
  }

  atacar() { throw new Error(`${this.nome} deve implementar atacar().`); }
}