// Contexto do padrão State. Mantém os dados da batalha e delega o fluxo ao estado atual.
class Battle {
  constructor(pokemonEquipe, pokemonSelvagem) {
    this.equipe   = pokemonEquipe;
    this.selvagem = pokemonSelvagem;
    this.ativo    = this.equipe[0];

    this._efetividade = {
      'Fogo':          { 'Grama': 1.5, 'Inseto': 1.5, 'Água': 0.6, 'Fogo': 0.6 },
      'Água':          { 'Fogo': 1.5, 'Água': 0.6, 'Grama': 0.6 },
      'Grama':         { 'Água': 1.5, 'Pedra': 1.5, 'Fogo': 0.6, 'Veneno': 0.6, 'Grama': 0.6 },
      'Normal':        {},
      'Inseto':        { 'Grama': 1.5, 'Veneno': 0.6 },
      'Inseto/Veneno': { 'Grama': 1.5 },
      'Água/Veneno':   { 'Fogo': 1.3, 'Grama': 0.7 },
    };

    this.estado = new PlayerTurnState(this);
  }

  atacar()       { return this.estado.atacar(); }
  trocar(indice) { return this.estado.trocar(indice); }
  capturar()     { return this.estado.capturar(); }
  correr()       { return this.estado.correr(); }

  jogadorPodeAgir()  { return this.estado.jogadorPodeAgir(); }
  get encerrada()    { return this.estado.encerrada(); }
  get resultado()    { return this.estado.resultado ?? null; }

  _transicionarPara(novoEstado) { this.estado = novoEstado; }

  _calcularDano(atacante, defensor, danoBase) {
    const tipos = atacante.tipo.split('/');
    let mult = 1.0;
    for (const tipo of tipos) {
      const tabela = this._efetividade[tipo] || {};
      for (const td of defensor.tipo.split('/')) {
        mult *= tabela[td] ?? 1.0;
      }
    }
    const danoReduzido = danoBase * (50 / (50 + defensor.defesa));
    const danoFinal    = Math.max(
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
}