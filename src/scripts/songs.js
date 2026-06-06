const music = document.getElementById('bg-music');
music.volume = 0;

let _fadeInterval = null;

function _cancelarFade() {
  if (_fadeInterval) {
    clearInterval(_fadeInterval);
    _fadeInterval = null;
  }
}

function _fadeIn(alvo = 0.5) {
  _cancelarFade();
  music.play().catch(() => {});
  _fadeInterval = setInterval(() => {
    if (music.volume < alvo) {
      music.volume = Math.min(music.volume + 0.01, alvo);
    } else {
      _cancelarFade();
    }
  }, 100);
}

function _fadeOut(cb) {
  _cancelarFade();
  _fadeInterval = setInterval(() => {
    if (music.volume > 0.01) {
      music.volume = Math.max(music.volume - 0.02, 0);
    } else {
      music.volume = 0;
      music.pause();
      _cancelarFade();
      if (cb) cb();
    }
  }, 50);
}

// ─── API pública ──────────────────────────────────────────────────────────

window.musicIniciarBatalha = function () {
  _fadeOut(() => {
    music.src = '../assets/songs/battlesong.mp3';
    music.load();
    _fadeIn(0.5);
  });
};

window.musicEncerrarBatalha = function () {
  _fadeOut(() => {
    music.src = '../assets/songs/defaultOverworldsong.mp3';
    music.load();
    _fadeIn(0.5);
  });
};

// Início normal do overworld
_fadeIn();
document.addEventListener('click', () => _fadeIn(), { once: true });