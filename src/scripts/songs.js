  const music = document.getElementById('bg-music');
  music.volume = 0;

  const fadeIn = () => {
    music.play().then(() => {
      const interval = setInterval(() => {
        if (music.volume < 0.5) {
          music.volume = Math.min(music.volume + 0.01, 0.5);
        } else {
          clearInterval(interval);
        }
      }, 100); // aumenta 0.01 a cada 100ms → ~5 segundos até 0.5
    }).catch(() => {});
  };

  fadeIn();
  document.addEventListener('click', fadeIn, { once: true });