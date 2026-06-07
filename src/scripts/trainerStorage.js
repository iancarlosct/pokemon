// Centraliza leitura e escrita do estado do jogador no localStorage.
// Estrutura salva em 'equipe': [{ especie, nivel, experiencia, vidaAtual, heldItem, atributos }]
const CHAVE_EQUIPE = 'equipe';

const TrainerStorage = {
  carregarEquipe() {
    try { return JSON.parse(localStorage.getItem(CHAVE_EQUIPE)) ?? []; }
    catch { return []; }
  },

  salvarEquipe(entradas) {
    localStorage.setItem(CHAVE_EQUIPE, JSON.stringify(entradas));
  },

  serializarPokemon(pokemon) {
    const heldItem = HeldItemFactory.itemAtual(pokemon);
    // Salva sempre os stats base (sem bônus do decorator) para evitar acúmulo
    const base = pokemon instanceof HeldItemDecorator ? pokemon._pokemon : pokemon;
    return {
      especie:     pokemon.nome.toLowerCase(),
      nivel:       pokemon.nivel,
      experiencia: pokemon.experiencia,
      vidaAtual:   pokemon.vida,
      heldItem:    heldItem ?? null,
      atributos: {
        vida:       base.vidaMax,
        ataque:     base.ataque,
        defesa:     base.defesa,
        velocidade: base.velocidade,
      },
    };
  },

  desserializarPokemon(entrada) {
    const pokemon = PokemonFactory.criar(entrada.especie, {
      vida:       entrada.atributos.vida       / this._base(entrada.especie, 'vida'),
      ataque:     entrada.atributos.ataque     / this._base(entrada.especie, 'ataque'),
      defesa:     entrada.atributos.defesa     / this._base(entrada.especie, 'defesa'),
      velocidade: entrada.atributos.velocidade / this._base(entrada.especie, 'velocidade'),
    });

    pokemon.nivel       = entrada.nivel;
    pokemon.experiencia = entrada.experiencia;
    pokemon.vidaMax     = entrada.atributos.vida;
    pokemon.vida        = entrada.vidaAtual;
    pokemon.ataque      = entrada.atributos.ataque;
    pokemon.defesa      = entrada.atributos.defesa;
    pokemon.velocidade  = entrada.atributos.velocidade;
    pokemon.vivo        = entrada.vidaAtual > 0;

    if (entrada.heldItem) return HeldItemFactory.equipar(pokemon, entrada.heldItem);
    return pokemon;
  },

  atualizarEquipeCompleta(equipeMemoria) {
    this.salvarEquipe(equipeMemoria.map(p => this.serializarPokemon(p)));
  },

  adicionarCapturado(pokemon) {
    const entradas = this.carregarEquipe();
    entradas.push(this.serializarPokemon(pokemon));
    this.salvarEquipe(entradas);
  },

  carregarEquipeOuStarter() {
    const entradas = this.carregarEquipe();
    if (entradas.length > 0) return entradas.map(e => this.desserializarPokemon(e));

    const trainer = JSON.parse(localStorage.getItem('trainer') ?? 'null');
    const especie  = trainer?.pokemon ?? 'rattata';
    const starter  = PokemonFactory.criar(especie);
    this.salvarEquipe([this.serializarPokemon(starter)]);
    return [starter];
  },

  // Unificado em um único helper com o atributo como parâmetro
  _base(especie, attr) { return BASE_STATS[especie.toLowerCase()]?.[attr] ?? 1; },
};