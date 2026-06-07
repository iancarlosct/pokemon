// Tela inicial: coleta nome e Pokémon inicial do jogador e salva no localStorage.
class TrainerSession {
  constructor() {
    this.trainerName   = '';
    this.chosenPokemon = null;
  }

  save() {
    const pokemon = PokemonFactory.criar(this.chosenPokemon, PokemonFactory.multiplicadorAleatorio());
    localStorage.setItem('trainer', JSON.stringify({
      nome:    this.trainerName,
      pokemon: this.chosenPokemon,
      atributos: {
        vida:       pokemon.vidaMax,
        ataque:     pokemon.ataque,
        defesa:     pokemon.defesa,
        velocidade: pokemon.velocidade,
      },
    }));
  }
}

const session = new TrainerSession();

const screenName    = document.getElementById('screen-name');
const screenPokemon = document.getElementById('screen-pokemon');
const screenConfirm = document.getElementById('screen-confirm');
const trainerInput  = document.getElementById('trainer-name');
const btnName       = document.getElementById('btn-name');
const dialogPkmnText= document.getElementById('dialog-pokemon-text');
const confirmText   = document.getElementById('confirm-text');
const btnStart      = document.getElementById('btn-start');
const pokemonCards  = document.querySelectorAll('.pokemon-card');

(function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay: ${(Math.random() * 4).toFixed(1)}s;
    `;
    container.appendChild(star);
  }
})();

function typeWrite(el, text, speed = 38) {
  el.textContent = '';
  let i = 0;
  return new Promise(resolve => {
    const timer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(timer); resolve(); }
    }, speed);
  });
}

function transitionTo(from, to, afterFn) {
  from.classList.add('exit');
  from.classList.remove('active');
  setTimeout(() => {
    from.classList.remove('exit');
    to.classList.add('active');
    if (afterFn) afterFn();
  }, 500);
}

function shakeInput() {
  trainerInput.style.borderColor = '#e63946';
  setTimeout(() => { trainerInput.style.borderColor = ''; }, 800);
}

btnName.addEventListener('click', confirmName);
trainerInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmName(); });

function confirmName() {
  const raw = trainerInput.value.trim();
  if (!raw) { shakeInput(); return; }
  session.trainerName = raw;
  transitionTo(screenName, screenPokemon, () => {
    typeWrite(dialogPkmnText, `Olá, ${session.trainerName}! Escolha seu parceiro de jornada.`, 36);
  });
}

pokemonCards.forEach(card => {
  card.addEventListener('click', () => selectPokemon(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPokemon(card); }
  });
});

function selectPokemon(card) {
  pokemonCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  session.chosenPokemon = card.dataset.name;
  setTimeout(() => transitionTo(screenPokemon, screenConfirm, buildConfirmScreen), 500);
}

const TYPE_COLORS = { charmander: '#ff6b35', bulbasaur: '#4ade80', squirtle: '#38bdf8' };

function buildConfirmScreen() {
  const color       = TYPE_COLORS[session.chosenPokemon] || '#fff';
  const displayName = session.chosenPokemon.charAt(0).toUpperCase() + session.chosenPokemon.slice(1);
  confirmText.innerHTML = `
    <span style="color:${color}">${displayName}</span> foi escolhido!<br><br>
    Boa sorte na sua jornada,<br>
    <span style="color:#f5c542">${session.trainerName}</span>!
  `;
}

btnStart.addEventListener('click', () => {
  session.save();
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed; inset:0; background:#000; opacity:0; transition:opacity 0.6s ease; z-index:999;`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    setTimeout(() => { window.location.href = 'pages/overworld13.html'; }, 650);
  });
});