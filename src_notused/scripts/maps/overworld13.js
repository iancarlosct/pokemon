// Script principal do overworld: mapa, encontros, batalhas e movimentação do player.

// 0 = livre | 1 = parede | 2 = grama | 3 = água
const mapa = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,1,1,3,0,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,0],
    [3,3,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,0,0],
    [3,3,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,2,2,2,0,0,0],
    [3,3,3,3,3,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [3,3,3,3,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [3,3,3,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const ENCONTROS = {
  0: [['rattata', 40], ['caterpie', 30], ['weedle',   30]],
  2: [['caterpie',35], ['weedle',   35], ['rattata',  30]],
  3: [['magikarp',40], ['horsea',   35], ['tentacool',25]],
};

const CHANCE_ENCONTRO = { 0: 0.04, 2: 0.12, 3: 0.12 };

function sortearPokemon(tile) {
  const pool = ENCONTROS[tile];
  if (!pool) return null;
  const total = pool.reduce((s, [, w]) => s + w, 0);
  let rand = Math.random() * total;
  for (const [especie, peso] of pool) {
    rand -= peso;
    if (rand <= 0) return PokemonFactory.criar(especie, PokemonFactory.multiplicadorAleatorio(0.9, 1.1));
  }
  return null;
}

function verificarEncontro(tile) {
  const chance = CHANCE_ENCONTRO[tile] ?? 0;
  if (Math.random() > chance) return;
  const selvagem = sortearPokemon(tile);
  if (!selvagem) return;
  const equipe = TrainerStorage.carregarEquipeOuStarter();
  const battle = new Battle(equipe, selvagem);
  new BattleUI(battle, (resultado) => _aoEncerrarBatalha(resultado, battle));
}

function _aoEncerrarBatalha(resultado, battle) {
  // Cura toda a equipe antes de persistir
  battle.equipe.forEach(p => { p.curar(p.vidaMax); p.vivo = true; });

  switch (resultado) {
    case 'vitoria':
    case 'derrota':
    case 'fuga':
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      break;

    case 'captura':
      TrainerStorage.atualizarEquipeCompleta(battle.equipe);
      battle.selvagem.curar(battle.selvagem.vidaMax);
      battle.selvagem.vivo = true;
      TrainerStorage.adicionarCapturado(battle.selvagem);
      break;
  }
}

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

const grid = document.getElementById('gridOverlay');
for (let row = 0; row < 31; row++) {
  for (let col = 0; col < 31; col++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

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