/**
 * @file TrainerStorage.js
 * @description Centraliza toda leitura e escrita do estado do jogador
 * no localStorage. Nenhum outro arquivo deve acessar o localStorage
 * diretamente para dados da equipe.
 *
 * Estrutura persistida:
 *
 * localStorage['trainer'] = { nome: string, pokemon: string }
 *
 * localStorage['equipe']  = Array de EntradaEquipe:
 * {
 *   especie:     string,
 *   nivel:       number,
 *   experiencia: number,
 *   vidaAtual:   number,
 *   heldItem:    string|null,   ← NOVO: nome do item equipado
 *   atributos: {
 *     vida:       number,
 *     ataque:     number,
 *     defesa:     number,
 *     velocidade: number,
 *   }
 * }
 */

const CHAVE_EQUIPE = 'equipe';

const TrainerStorage = {

  // ─── Leitura ─────────────────────────────────────────────────────────────

  carregarEquipe() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_EQUIPE)) ?? [];
    } catch {
      return [];
    }
  },

  // ─── Escrita ──────────────────────────────────────────────────────────────

  salvarEquipe(entradas) {
    localStorage.setItem(CHAVE_EQUIPE, JSON.stringify(entradas));
  },

  /**
   * Serializa um objeto Pokemon (instância viva, podendo ser um decorator)
   * para EntradaEquipe. Inclui o heldItem se existir.
   *
   * @param {Pokemon|HeldItemDecorator} pokemon
   * @returns {EntradaEquipe}
   */
  serializarPokemon(pokemon) {
    // Se for um decorator, precisamos dos stats do componente interno
    // mas o heldItem vem do decorator.
    const heldItem = HeldItemFactory.itemAtual(pokemon);

    return {
      especie:     pokemon.nome.toLowerCase(),
      nivel:       pokemon.nivel,
      experiencia: pokemon.experiencia,
      vidaAtual:   pokemon.vida,
      heldItem:    heldItem ?? null,
      atributos: {
        // Sempre salva os stats BASE (sem o bônus do decorator)
        // para não acumular multiplicadores a cada carregamento.
        vida:       pokemon instanceof HeldItemDecorator ? pokemon._pokemon.vidaMax    : pokemon.vidaMax,
        ataque:     pokemon instanceof HeldItemDecorator ? pokemon._pokemon.ataque     : pokemon.ataque,
        defesa:     pokemon instanceof HeldItemDecorator ? pokemon._pokemon.defesa     : pokemon.defesa,
        velocidade: pokemon instanceof HeldItemDecorator ? pokemon._pokemon.velocidade : pokemon.velocidade,
      },
    };
  },

  /**
   * Reconstrói uma instância de Pokemon a partir de uma EntradaEquipe salva.
   * Se houver heldItem salvo, envolve o Pokemon no decorator correspondente.
   *
   * @param {EntradaEquipe} entrada
   * @returns {Pokemon|HeldItemDecorator}
   */
  desserializarPokemon(entrada) {
    const pokemon = PokemonFactory.criar(entrada.especie, {
      vida:       entrada.atributos.vida       / this._baseVida(entrada.especie),
      ataque:     entrada.atributos.ataque     / this._baseAtaque(entrada.especie),
      defesa:     entrada.atributos.defesa     / this._baseDefesa(entrada.especie),
      velocidade: entrada.atributos.velocidade / this._baseVelocidade(entrada.especie),
    });

    pokemon.nivel       = entrada.nivel;
    pokemon.experiencia = entrada.experiencia;
    pokemon.vidaMax     = entrada.atributos.vida;
    pokemon.vida        = entrada.vidaAtual;
    pokemon.ataque      = entrada.atributos.ataque;
    pokemon.defesa      = entrada.atributos.defesa;
    pokemon.velocidade  = entrada.atributos.velocidade;
    pokemon.vivo        = entrada.vidaAtual > 0;

    // ── Reaplicar o held item como decorator ─────────────────────────────
    if (entrada.heldItem) {
      return HeldItemFactory.equipar(pokemon, entrada.heldItem);
    }

    return pokemon;
  },

  // ─── Operações de equipe ──────────────────────────────────────────────────

  atualizarPokemon(equipeMemoria, indice) {
    const entradas = this.carregarEquipe();
    entradas[indice] = this.serializarPokemon(equipeMemoria[indice]);
    this.salvarEquipe(entradas);
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

    if (entradas.length > 0) {
      return entradas.map(e => this.desserializarPokemon(e));
    }

    const trainer = JSON.parse(localStorage.getItem('trainer') ?? 'null');
    const especie  = trainer?.pokemon ?? 'rattata';
    const starter  = PokemonFactory.criar(especie);
    this.salvarEquipe([this.serializarPokemon(starter)]);
    return [starter];
  },

  // ─── Helpers internos ────────────────────────────────────────────────────

  _baseVida(especie)       { return (BASE_STATS[especie.toLowerCase()]?.vida       ?? 1); },
  _baseAtaque(especie)     { return (BASE_STATS[especie.toLowerCase()]?.ataque     ?? 1); },
  _baseDefesa(especie)     { return (BASE_STATS[especie.toLowerCase()]?.defesa     ?? 1); },
  _baseVelocidade(especie) { return (BASE_STATS[especie.toLowerCase()]?.velocidade ?? 1); },
};