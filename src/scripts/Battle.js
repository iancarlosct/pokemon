class Battle {
  constructor(pokemonEquipe, pokemonSelvagem) {
    this.equipe    = pokemonEquipe;
    this.selvagem  = pokemonSelvagem;
    this.ativo     = this.equipe[0];
    this.encerrada = false;

    this._efetividade = {
      'Fogo':          { 'Grama': 1.5, 'Inseto': 1.5, 'Água': 0.6, 'Fogo': 0.6 },
      'Água':          { 'Fogo': 1.5, 'Água': 0.6, 'Grama': 0.6 },
      'Grama':         { 'Água': 1.5, 'Pedra': 1.5, 'Fogo': 0.6, 'Veneno': 0.6, 'Grama': 0.6 },
      'Normal':        {},
      'Inseto':        { 'Grama': 1.5, 'Veneno': 0.6 },
      'Inseto/Veneno': { 'Grama': 1.5 },
      'Água/Veneno':   { 'Fogo': 1.3, 'Grama': 0.7 },
    };
  }

  _calcularDano(atacante, defensor, danoBase) {
    const tipos = atacante.tipo.split('/');
    let mult = 1.0;
    for (const tipo of tipos) {
      const tabela = this._efetividade[tipo] || {};
      for (const td of defensor.tipo.split('/')) {
        mult *= tabela[td] ?? 1.0;
      }
    }
    // Defesa reduz o dano mas nunca abaixo de 15% do base
    const danoReduzido = danoBase * (50 / (50 + defensor.defesa));
    const danoFinal = Math.max(
      Math.floor(danoBase * 0.15),
      Math.floor(danoReduzido * mult)
    );
    return { dano: danoFinal, multiplicador: mult };
  }

  _aplicarDano(pokemon, dano) {
    pokemon.vida = Math.max(0, pokemon.vida - dano);
    if (pokemon.vida === 0) pokemon.vivo = false;
    return dano;
  }

  atacar() {
    const resAtaque = this.ativo.atacar();
    const danoBase  = typeof resAtaque === 'number' ? resAtaque : (resAtaque.dano ?? 1);
    const { dano, multiplicador } = this._calcularDano(this.ativo, this.selvagem, danoBase);

    const danoEfetivo = this._aplicarDano(this.selvagem, dano);
    const log = [];
    if (multiplicador > 1)        log.push('É super efetivo!');
    if (multiplicador < 1)        log.push('Não é muito efetivo...');
    if (resAtaque.golpesDuplos)   log.push('Golpe duplo!');
    log.push(`${this.ativo.nome} causou ${danoEfetivo} de dano.`);

    if (!this.selvagem.vivo) {
      this.encerrada = true;
      const xp = Math.floor(this.selvagem.vidaMax * 1.5);
      this.ativo.ganharExperiencia(xp);
      return { danoJogador: danoEfetivo, danoInimigo: 0, log, encerrada: true, resultado: 'vitoria', multiplicador };
    }

    return this._turnoInimigo({ danoJogador: danoEfetivo, log, multiplicador });
  }

  trocar(indice) {
    const novo = this.equipe[indice];
    if (!novo || !novo.vivo) return false;
    this.ativo = novo;
    return true;
  }

  tentarCapturar() {
    const chance = 1 - (this.selvagem.vida / this.selvagem.vidaMax) * 0.7;
    return Math.random() < chance;
  }

  tentarCorrer() {
    const bonus = this.ativo.velocidade > this.selvagem.velocidade ? 0.2 : 0;
    return Math.random() < (0.5 + bonus);
  }

  _turnoInimigo(estado) {
    const log = [...estado.log];
    const resInimigo = this.selvagem.atacar();
    const danoBase   = typeof resInimigo === 'number' ? resInimigo : (resInimigo.dano ?? 1);
    const { dano, multiplicador } = this._calcularDano(this.selvagem, this.ativo, danoBase);

    const danoEfetivo = this._aplicarDano(this.ativo, dano);
    log.push(`${this.selvagem.nome} causou ${danoEfetivo} de dano.`);

    if (!this.ativo.vivo) {
      const proximo = this.equipe.find(p => p.vivo && p !== this.ativo);
      if (proximo) {
        this.ativo = proximo;
        log.push(`${this.ativo.nome} entrou em batalha!`);
      } else {
        this.encerrada = true;
        return { ...estado, danoInimigo: danoEfetivo, log, encerrada: true, resultado: 'derrota' };
      }
    }

    return { ...estado, danoInimigo: danoEfetivo, log, encerrada: false };
  }
}