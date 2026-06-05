/**
 * @file trainerStorage.js
 * @description Centraliza toda leitura e escrita do estado do jogador
 * no localStorage. Nenhum outro arquivo deve acessar o localStorage
 * diretamente para dados da equipe.
 *
 * Estrutura persistida:
 *
 * localStorage['trainer'] = { nome: string, pokemon: string }   ← já existente
 *
 * localStorage['equipe']  = Array de EntradaEquipe:
 * {
 *   especie:     string,   // chave para PokemonFactory.criar() — ex: 'charmander'
 *   nivel:       number,
 *   experiencia: number,
 *   vidaAtual:   number,   // HP atual (pode estar abaixo do máximo entre batalhas)
 *   atributos: {
 *     vida:       number,  // vidaMax calculada (com multiplicadores já aplicados)
 *     ataque:     number,
 *     defesa:     number,
 *     velocidade: number,
 *   }
 * }
 */

const CHAVE_EQUIPE = 'equipe';

const TrainerStorage = {

  // ─── Leitura ─────────────────────────────────────────────────────────────

  /**
   * Retorna o array salvo de entradas de equipe, ou [] se vazio.
   * @returns {EntradaEquipe[]}
   */
  carregarEquipe() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_EQUIPE)) ?? [];
    } catch {
      return [];
    }
  },

  // ─── Escrita ──────────────────────────────────────────────────────────────

  /**
   * Substitui toda a equipe salva.
   * @param {EntradaEquipe[]} entradas
   */
  salvarEquipe(entradas) {
    localStorage.setItem(CHAVE_EQUIPE, JSON.stringify(entradas));
  },

  /**
   * Serializa um objeto Pokemon (instância viva) para EntradaEquipe.
   * @param {Pokemon} pokemon
   * @returns {EntradaEquipe}
   */
  serializarPokemon(pokemon) {
    return {
      especie:     pokemon.nome.toLowerCase(),
      nivel:       pokemon.nivel,
      experiencia: pokemon.experiencia,
      vidaAtual:   pokemon.vida,
      atributos: {
        vida:       pokemon.vidaMax,
        ataque:     pokemon.ataque,
        defesa:     pokemon.defesa,
        velocidade: pokemon.velocidade,
      },
    };
  },

  /**
   * Reconstrói uma instância de Pokemon a partir de uma EntradaEquipe salva.
   * Usa PokemonFactory para instanciar a classe correta, depois restaura
   * o estado exato (nível, XP, HP atual).
   *
   * @param {EntradaEquipe} entrada
   * @returns {Pokemon}
   */
  desserializarPokemon(entrada) {
    // Cria a instância com os atributos exatos salvos (sem novo sorteio aleatório)
    const pokemon = PokemonFactory.criar(entrada.especie, {
      vida:       entrada.atributos.vida       / this._baseVida(entrada.especie),
      ataque:     entrada.atributos.ataque     / this._baseAtaque(entrada.especie),
      defesa:     entrada.atributos.defesa     / this._baseDefesa(entrada.especie),
      velocidade: entrada.atributos.velocidade / this._baseVelocidade(entrada.especie),
    });

    // Restaura o estado que a Factory não conhece
    pokemon.nivel       = entrada.nivel;
    pokemon.experiencia = entrada.experiencia;
    pokemon.vidaMax     = entrada.atributos.vida;
    pokemon.vida        = entrada.vidaAtual;
    pokemon.ataque      = entrada.atributos.ataque;
    pokemon.defesa      = entrada.atributos.defesa;
    pokemon.velocidade  = entrada.atributos.velocidade;
    pokemon.vivo        = entrada.vidaAtual > 0;

    return pokemon;
  },

  // ─── Operações de equipe ──────────────────────────────────────────────────

  /**
   * Atualiza a entrada de um Pokemon já existente na equipe salva.
   * Identifica o Pokemon pelo índice na equipe em memória.
   *
   * @param {Pokemon[]} equipeMemoria  - Array de instâncias atual
   * @param {number}    indice         - Índice do Pokemon a atualizar
   */
  atualizarPokemon(equipeMemoria, indice) {
    const entradas = this.carregarEquipe();
    entradas[indice] = this.serializarPokemon(equipeMemoria[indice]);
    this.salvarEquipe(entradas);
  },

  /**
   * Persiste toda a equipe em memória de uma vez.
   * Usar após batalhas (XP ganho, dano recebido).
   *
   * @param {Pokemon[]} equipeMemoria
   */
  atualizarEquipeCompleta(equipeMemoria) {
    this.salvarEquipe(equipeMemoria.map(p => this.serializarPokemon(p)));
  },

  /**
   * Adiciona um Pokemon capturado ao final da equipe salva.
   * @param {Pokemon} pokemon
   */
  adicionarCapturado(pokemon) {
    const entradas = this.carregarEquipe();
    entradas.push(this.serializarPokemon(pokemon));
    this.salvarEquipe(entradas);
  },

  /**
   * Carrega a equipe do localStorage como instâncias prontas para batalha.
   * Se a equipe estiver vazia, cria um time inicial com o starter salvo em 'trainer'.
   *
   * @returns {Pokemon[]}
   */
  carregarEquipeOuStarter() {
    const entradas = this.carregarEquipe();

    if (entradas.length > 0) {
      return entradas.map(e => this.desserializarPokemon(e));
    }

    // Fallback: equipe ainda não foi criada — usa o starter do 'trainer'
    const trainer = JSON.parse(localStorage.getItem('trainer') ?? 'null');
    const especie  = trainer?.pokemon ?? 'rattata';
    const starter  = PokemonFactory.criar(especie);
    this.salvarEquipe([this.serializarPokemon(starter)]);
    return [starter];
  },

  // ─── Helpers internos ────────────────────────────────────────────────────
  // Acessam os BASE_STATS globais para calcular os multiplicadores corretos
  // na desserialização. Os BASE_STATS são declarados nos arquivos de cada espécie.

  _baseVida(especie)       { return (BASE_STATS[especie.toLowerCase()]?.vida       ?? 1); },
  _baseAtaque(especie)     { return (BASE_STATS[especie.toLowerCase()]?.ataque     ?? 1); },
  _baseDefesa(especie)     { return (BASE_STATS[especie.toLowerCase()]?.defesa     ?? 1); },
  _baseVelocidade(especie) { return (BASE_STATS[especie.toLowerCase()]?.velocidade ?? 1); },
};
