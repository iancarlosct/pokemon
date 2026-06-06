// 0 = livre | 1 = parede | 2 = grama | 3 = água
const mapa = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,2,2,2,2,2], //0
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2], //1
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,2,2,2,2,2,2], //2
    [3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2,2], //3
    [3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2,2], //4
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,2,2,2,2,2,2], //5
    [3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0,2,2,2,2,2,2], //6
    [3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2], //7
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2], //8
    [3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2], //9
    [3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2], //10
    [3,3,3,3,3,3,3,3,3,3,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2], //11
    [3,3,3,3,3,3,3,1,1,3,0,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2], //12
    [3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2], //13
    [3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,0], //14
    [3,3,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,0,0], //15
    [3,3,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,2,2,2,0,0,0], //16
    [3,3,3,3,3,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], //17
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], //18
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], //19
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], //20
    [3,3,3,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0], //21
    [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0], //22
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //23
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //24
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //25
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //26
    [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //27
    [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //28
    [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //29
    [0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0], //30
];

// ─── Pools de encontro por tipo de tile ───────────────────────────────────
const ENCONTROS = {
  0: [
    ['rattata',  40],
    ['caterpie', 30],
    ['weedle',   30],
  ],
  2: [
    ['caterpie', 35],
    ['weedle',   35],
    ['rattata',  30],
  ],
  3: [
    ['magikarp',  40],
    ['horsea',    35],
    ['tentacool', 25],
  ],
};

const CHANCE_ENCONTRO = { 0: 0.04, 2: 0.12, 3: 0.12 };

// ─── Sorteio de Pokémon selvagem ──────────────────────────────────────────
function sortearPokemon(tile) {
  const pool = ENCONTROS[tile];
  if (!pool) return null;

  const total = pool.reduce((s, [, w]) => s + w, 0);
  let rand = Math.random() * total;
  for (const [especie, peso] of pool) {
    rand -= peso;
    if (rand <= 0) {
      return PokemonFactory.criar(especie, PokemonFactory.multiplicadorAleatorio(0.9, 1.1));
    }
  }
  return null;
}

// ─── Lógica de encontro e batalha ─────────────────────────────────────────
function verificarEncontro(tile) {
  const chance = CHANCE_ENCONTRO[tile] ?? 0;
  if (Math.random() > chance) return;

  const selvagem = sortearPokemon(tile);
  if (!selvagem) return;

  const equipe = TrainerStorage.carregarEquipeOuStarter();
  const battle = new Battle(equipe, selvagem);

  new BattleUI(battle, (resultado) => {
    _aoEncerrarBatalha(resultado, battle);
  });
}

/**
 * Callback chamado pela BattleUI quando a batalha termina.
 * Toda a persistência acontece aqui.
 *
 * @param {'vitoria'|'derrota'|'fuga'|'captura'} resultado
 * @param {Battle} battle
 */
function _aoEncerrarBatalha(resultado, battle) {
  // Cura toda a equipe para o HP maximo antes de qualquer persistencia.
  // Garante que nenhum Pokemon entre na proxima batalha com vida zerada.
  battle.equipe.forEach(p => {
    p.curar(p.vidaMax);
    p.vivo = true;
  });

  switch (resultado) {

    case 'vitoria':
      // XP ja foi aplicado em Battle.atacar() via ganharExperiencia()
      // Re-salva a equipe com nivel/xp/stats atualizados e HP cheio
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      console.log(`[Storage] Vitoria - equipe curada e salva. ${battle.ativo.nome} Nv.${battle.ativo.nivel}`);
      break;

    case 'captura':
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      // Selvagem capturado tambem entra na equipe com HP cheio
      battle.selvagem.curar(battle.selvagem.vidaMax);
      battle.selvagem.vivo = true;
      TrainerStorage.adicionarCapturado(battle.selvagem);
      console.log(`[Storage] ${battle.selvagem.nome} capturado! Equipe: ${
        TrainerStorage.carregarEquipe().map(e => e.especie).join(', ')
      }`);
      break;

    case 'derrota':
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      console.log('[Storage] Derrota - equipe curada e salva.');
      break;

    case 'fuga':
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      console.log('[Storage] Fuga - equipe curada e salva.');
      break;
  }
}

// ─── Player ───────────────────────────────────────────────────────────────
class Player {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.el  = document.createElement('div');
    this.el.classList.add('player');
    document.querySelector('.map-container').appendChild(this.el);
    this._render();
  }

  move(dRow, dCol) {
    const newRow = this.row + dRow;
    const newCol = this.col + dCol;

    if (newRow < 0 || newRow >= 31 || newCol < 0 || newCol >= 31) return;
    if (mapa[newRow][newCol] === 1) return;

    this.row = newRow;
    this.col = newCol;
    this._render();
    verificarEncontro(mapa[newRow][newCol]);
  }

  _render() {
    this.el.style.top  = `${(this.row / 31) * 100}%`;
    this.el.style.left = `${(this.col / 31) * 100}%`;
  }
}

// ─── Grid ─────────────────────────────────────────────────────────────────
const grid = document.getElementById('gridOverlay');
for (let row = 0; row < 31; row++) {
  for (let col = 0; col < 31; col++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────
const player = new Player(22, 11);

const KEYS = {
  ArrowUp:    [-1,  0], w: [-1,  0],
  ArrowDown:  [ 1,  0], s: [ 1,  0],
  ArrowLeft:  [ 0, -1], a: [ 0, -1],
  ArrowRight: [ 0,  1], d: [ 0,  1],
};

let moving = false;

document.addEventListener('keydown', e => {
  const dir = KEYS[e.key];
  if (!dir || moving) return;
  e.preventDefault();
  moving = true;
  player.move(...dir);
  setTimeout(() => { moving = false; }, 200);
});