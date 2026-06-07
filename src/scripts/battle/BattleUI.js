// Interface visual da batalha. Delega toda lógica de estado ao Battle.
class BattleUI {
  constructor(battle, onEncerrar) {
    this.battle     = battle;
    this.onEncerrar = onEncerrar;
    this._injectStyles();
    this._build();
    if (typeof window.musicIniciarBatalha === 'function') window.musicIniciarBatalha();
    this._atualizar();
    requestAnimationFrame(() => this.overlay.classList.add('visible'));
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'bt-overlay';

    const s = this.battle.selvagem;
    const a = this.battle.ativo;

    this.overlay.innerHTML = `
      <div id="bt-arena">
        <div id="bt-enemy-side">
          <div id="bt-enemy-info">
            <div class="bt-name-row">
              <span class="bt-name">${s.nome}</span>
              <span class="bt-level">Nv.${s.nivel}</span>
            </div>
            <div class="bt-hp-track">
              <div class="bt-hp-label">HP</div>
              <div class="bt-hp-rail"><div class="bt-hp-bar" id="bt-ehp"></div></div>
            </div>
          </div>
          <div id="bt-enemy-sprite-wrap">
            <div class="bt-ground enemy-ground"></div>
            <img id="bt-enemy-sprite" src="../assets/images/pokes/${s.nome.toLowerCase()}.png" alt="${s.nome}" class="bt-sprite enemy-sprite" />
          </div>
        </div>

        <div id="bt-player-side">
          <div id="bt-player-sprite-wrap">
            <div class="bt-ground player-ground"></div>
            <img id="bt-player-sprite" src="../assets/images/pokes/${a.nome.toLowerCase()}.png" alt="${a.nome}" class="bt-sprite player-sprite" />
          </div>
          <div id="bt-player-info">
            <div class="bt-name-row">
              <span class="bt-name" id="bt-pname">${a.nome}</span>
              <span class="bt-level" id="bt-plevel">Nv.${a.nivel}</span>
            </div>
            <div class="bt-hp-track">
              <div class="bt-hp-label">HP</div>
              <div class="bt-hp-rail"><div class="bt-hp-bar" id="bt-php"></div></div>
            </div>
            <div class="bt-hp-numbers" id="bt-php-nums"></div>
          </div>
        </div>
      </div>

      <div id="bt-panel">
        <div id="bt-log-box">
          <p id="bt-log">Um ${s.nome} selvagem apareceu!</p>
        </div>
        <div id="bt-actions">
          <button class="bt-btn primary" id="bt-atk">⚔ Atacar</button>
          <button class="bt-btn" id="bt-swap">⇄ Trocar</button>
          <button class="bt-btn" id="bt-cap">● Capturar</button>
          <button class="bt-btn danger" id="bt-run">↩ Correr</button>
        </div>
        <div id="bt-swap-list" style="display:none"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this._bindEventos();
  }

  _bindEventos() {
    this.overlay.querySelector('#bt-atk').onclick  = () => this._acao(() => this.battle.atacar());
    this.overlay.querySelector('#bt-cap').onclick  = () => this._capturar();
    this.overlay.querySelector('#bt-run').onclick  = () => this._correr();
    this.overlay.querySelector('#bt-swap').onclick = () => this._abrirTrocar();
  }

  _acao(fn) {
    if (!this.battle.jogadorPodeAgir()) return;
    this._animAtaque('player', () => {
      const ativoAntes = this.battle.ativo;
      const res = fn();
      if (!res) return;
      this._animAtaque('enemy', () => {
        if (this.battle.ativo !== ativoAntes) this._atualizarSprite();
        this._atualizar();
        this._log(res.log.join(' '));
        if (res.multiplicador > 1) this._flashEfetividade('super');
        if (res.multiplicador < 1) this._flashEfetividade('fraco');
        if (this.battle.encerrada) setTimeout(() => this._encerrar(this.battle.resultado), 2000);
      });
    });
  }

  _capturar() {
    if (!this.battle.jogadorPodeAgir()) return;
    this._animPokeball(() => {
      const ativoAntes = this.battle.ativo;
      const res = this.battle.capturar();
      if (!res) return;
      if (this.battle.ativo !== ativoAntes) this._atualizarSprite();
      this._atualizar();
      this._log(res.log.join(' '));
      if (this.battle.encerrada) setTimeout(() => this._encerrar(this.battle.resultado), 1800);
    });
  }

  _correr() {
    if (!this.battle.jogadorPodeAgir()) return;
    const res = this.battle.correr();
    if (!res) return;
    this._atualizar();
    this._log(res.log.join(' '));
    if (this.battle.encerrada) setTimeout(() => this._encerrar(this.battle.resultado), 1200);
  }

  _abrirTrocar() {
    if (!this.battle.jogadorPodeAgir()) return;
    const actions  = this.overlay.querySelector('#bt-actions');
    const swapList = this.overlay.querySelector('#bt-swap-list');
    swapList.innerHTML    = '';
    actions.style.display  = 'none';
    swapList.style.display = 'flex';

    this.battle.equipe.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'bt-btn swap-entry' + (!p.vivo || p === this.battle.ativo ? ' disabled' : '');
      btn.disabled  = !p.vivo || p === this.battle.ativo;
      btn.innerHTML = `<img src="../assets/images/pokes/${p.nome.toLowerCase()}.png" class="swap-thumb">
                       <span>${p.nome}</span>
                       <span class="swap-hp">${p.vida}/${p.vidaMax}</span>`;
      btn.onclick = () => {
        const res = this.battle.trocar(i);
        if (res) {
          this._atualizarSprite();
          this._atualizar();
          this._log(`Vai, ${p.nome}!`);
        }
        swapList.style.display = 'none';
        actions.style.display  = 'grid';
      };
      swapList.appendChild(btn);
    });

    const voltar = document.createElement('button');
    voltar.className   = 'bt-btn';
    voltar.textContent = '← Voltar';
    voltar.onclick = () => { swapList.style.display = 'none'; actions.style.display = 'grid'; };
    swapList.appendChild(voltar);
  }

  _animAtaque(lado, cb) {
    const sprite = this.overlay.querySelector(lado === 'player' ? '#bt-player-sprite' : '#bt-enemy-sprite');
    const dir    = lado === 'player' ? '18px' : '-18px';
    sprite.style.transition = 'transform 0.1s';
    sprite.style.transform  = `translateX(${dir})`;
    setTimeout(() => {
      sprite.style.transform = 'translateX(0)';
      const alvo = this.overlay.querySelector(lado === 'player' ? '#bt-enemy-sprite' : '#bt-player-sprite');
      alvo.classList.add('hit-flash');
      setTimeout(() => { alvo.classList.remove('hit-flash'); cb(); }, 250);
    }, 130);
  }

  _animPokeball(cb) {
    const ball = document.createElement('div');
    ball.id = 'bt-pokeball-anim';
    ball.innerHTML = `<div class="pb-top"></div><div class="pb-mid"></div><div class="pb-bot"></div><div class="pb-btn"></div>`;
    this.overlay.querySelector('#bt-arena').appendChild(ball);
    setTimeout(() => { ball.remove(); cb(); }, 900);
  }

  _flashEfetividade(tipo) {
    const el = document.createElement('div');
    el.className   = `bt-efectividade ${tipo}`;
    el.textContent = tipo === 'super' ? 'Super efetivo!' : 'Não é muito efetivo...';
    this.overlay.querySelector('#bt-arena').appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  _atualizar() {
    const s    = this.battle.selvagem;
    const a    = this.battle.ativo;
    const pctE = Math.max(0, (s.vida / s.vidaMax) * 100);
    const pctP = Math.max(0, (a.vida / a.vidaMax) * 100);
    const ehp  = this.overlay.querySelector('#bt-ehp');
    const php  = this.overlay.querySelector('#bt-php');

    ehp.style.width      = `${pctE}%`;
    ehp.style.background = this._corHP(pctE);
    php.style.width      = `${pctP}%`;
    php.style.background = this._corHP(pctP);

    this.overlay.querySelector('#bt-php-nums').textContent = `${a.vida} / ${a.vidaMax}`;
    this.overlay.querySelector('#bt-pname').textContent    = a.nome;
    this.overlay.querySelector('#bt-plevel').textContent   = `Nv.${a.nivel}`;
  }

  _atualizarSprite() {
    const a      = this.battle.ativo;
    const sprite = this.overlay.querySelector('#bt-player-sprite');
    sprite.src   = `../assets/images/pokes/${a.nome.toLowerCase()}.png`;
    sprite.alt   = a.nome;
  }

  _corHP(pct) {
    if (pct > 50) return '#4ade80';
    if (pct > 20) return '#facc15';
    return '#ef4444';
  }

  _log(texto) {
    const el = this.overlay.querySelector('#bt-log');
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = texto; el.style.opacity = '1'; }, 120);
  }

  _encerrar(resultado) {
    if (typeof window.musicEncerrarBatalha === 'function') window.musicEncerrarBatalha();
    this.overlay.classList.remove('visible');
    setTimeout(() => { this.overlay.remove(); this.onEncerrar(resultado); }, 400);
  }

  _injectStyles() {
    if (document.getElementById('bt-styles')) return;
    const style = document.createElement('style');
    style.id = 'bt-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      #bt-overlay {
        position: fixed; inset: 0; z-index: 200;
        background: #0a0a1a;
        display: flex; flex-direction: column;
        opacity: 0; transition: opacity 0.35s ease;
        font-family: 'Press Start 2P', monospace;
      }
      #bt-overlay.visible { opacity: 1; }

      #bt-arena {
        flex: 1; position: relative;
        background:
          radial-gradient(ellipse 80% 60% at 50% 100%, #1a2a1a 0%, transparent 70%),
          linear-gradient(180deg, #0d1a2e 0%, #0a1a0a 60%, #1a2a1a 100%);
        overflow: hidden;
        display: flex; align-items: flex-end;
        padding: 0 4% 0;
      }

      #bt-arena::before {
        content: '';
        position: absolute; inset: 0; z-index: 1;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 3px,
          rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
        );
        pointer-events: none;
      }

      #bt-enemy-side {
        position: absolute; top: 10%; left: 4%;
        display: flex; flex-direction: column; gap: 10px;
        z-index: 2;
      }
      #bt-player-side {
        position: absolute; bottom: 8%; right: 4%;
        display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        z-index: 2;
      }

      #bt-enemy-info, #bt-player-info {
        background: rgba(10,10,30,0.85);
        border: 2px solid #2a2a6e;
        border-radius: 8px; padding: 10px 14px;
        min-width: 200px; backdrop-filter: blur(4px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
      }
      #bt-player-info { min-width: 220px; }

      .bt-name-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
      .bt-name  { font-size: 0.55rem; color: #e8e8ff; letter-spacing: 1px; }
      .bt-level { font-size: 0.4rem; color: #6a6aaa; }

      .bt-hp-track { display: flex; align-items: center; gap: 8px; }
      .bt-hp-label { font-size: 0.38rem; color: #f5c542; }
      .bt-hp-rail  { flex: 1; height: 8px; background: #1a1a3e; border-radius: 99px; border: 1px solid #2a2a5a; overflow: hidden; }
      .bt-hp-bar   { height: 100%; border-radius: 99px; transition: width 0.5s ease, background 0.5s ease; box-shadow: 0 0 6px currentColor; }
      .bt-hp-numbers { font-size: 0.38rem; color: #6a6aaa; text-align: right; margin-top: 5px; }

      #bt-enemy-sprite-wrap, #bt-player-sprite-wrap { position: relative; display: flex; flex-direction: column; align-items: center; }
      .bt-ground { width: 120px; height: 18px; border-radius: 50%; position: absolute; bottom: -4px; }
      .enemy-ground  { background: radial-gradient(ellipse, rgba(100,200,100,0.18) 0%, transparent 70%); }
      .player-ground { background: radial-gradient(ellipse, rgba(100,200,100,0.18) 0%, transparent 70%); }

      .bt-sprite { image-rendering: pixelated; position: relative; z-index: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.7)); transition: transform 0.1s; }
      .enemy-sprite  { width: 140px; height: 140px; }
      .player-sprite { width: 160px; height: 160px; transform: scaleX(-1); }

      .hit-flash { animation: hitFlash 0.25s ease; }
      @keyframes hitFlash {
        0%,100% { filter: drop-shadow(0 8px 16px rgba(0,0,0,0.7)); opacity: 1; }
        40%     { filter: drop-shadow(0 0 20px #fff) brightness(3); opacity: 0.5; }
      }

      #bt-pokeball-anim {
        position: absolute; top: 50%; left: 55%;
        transform: translate(-50%, -50%);
        width: 56px; height: 56px;
        border-radius: 50%; border: 4px solid #111;
        overflow: hidden; z-index: 5;
        animation: pbThrow 0.9s ease forwards;
      }
      .pb-top { position:absolute; top:0; left:0; right:0; height:50%; background:#e63946; }
      .pb-bot { position:absolute; bottom:0; left:0; right:0; height:50%; background:#f1f1f1; }
      .pb-mid { position:absolute; top:50%; left:0; right:0; height:5px; background:#111; transform:translateY(-50%); z-index:1; }
      .pb-btn { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:14px; height:14px; background:#fff; border-radius:50%; border:3px solid #111; z-index:2; }
      @keyframes pbThrow {
        0%   { transform:translate(-50%,-50%) scale(0.3) rotate(0deg); opacity:0; }
        30%  { transform:translate(-50%,-50%) scale(1.1) rotate(-180deg); opacity:1; }
        60%  { transform:translate(-50%,-50%) scale(0.95) rotate(-360deg); }
        80%  { transform:translate(-50%,-50%) scale(1.05) rotate(-360deg); }
        100% { transform:translate(-50%,-50%) scale(1) rotate(-360deg); opacity:0.2; }
      }

      .bt-efectividade {
        position: absolute; top: 38%; left: 50%;
        transform: translateX(-50%);
        font-size: 0.45rem; padding: 6px 14px;
        border-radius: 4px; z-index: 10;
        animation: fadeUp 1.2s ease forwards;
        pointer-events: none;
      }
      .bt-efectividade.super { background: #4ade80; color: #000; }
      .bt-efectividade.fraco { background: #6a6aaa; color: #fff; }
      @keyframes fadeUp {
        0%   { opacity:0; transform:translateX(-50%) translateY(8px); }
        20%  { opacity:1; transform:translateX(-50%) translateY(0); }
        80%  { opacity:1; }
        100% { opacity:0; transform:translateX(-50%) translateY(-12px); }
      }

      #bt-panel { height: 180px; background: #0d0d2b; border-top: 3px solid #2a2a6e; display: flex; }

      #bt-log-box { flex: 1.2; padding: 20px 24px; display: flex; align-items: center; border-right: 2px solid #1a1a3e; }
      #bt-log     { font-size: 0.48rem; color: #e8e8ff; line-height: 2; transition: opacity 0.12s; }

      #bt-actions   { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 16px; align-content: center; }
      #bt-swap-list { flex: 1; flex-direction: column; gap: 6px; padding: 12px; overflow-y: auto; }

      .bt-btn {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.4rem; padding: 10px 8px;
        background: #11112e; color: #e8e8ff;
        border: 2px solid #2a2a6e; border-radius: 6px;
        cursor: pointer; transition: all 0.12s; letter-spacing: 0.5px;
      }
      .bt-btn:hover:not(:disabled) { background: #1a1a4e; border-color: #f5c542; color: #f5c542; transform: translateY(-1px); box-shadow: 0 3px 0 #8a6e00; }
      .bt-btn:active:not(:disabled){ transform: translateY(1px); box-shadow: none; }
      .bt-btn.primary { border-color: #4ade80; color: #4ade80; }
      .bt-btn.primary:hover:not(:disabled) { background: #0a2a0a; border-color: #4ade80; color: #4ade80; box-shadow: 0 3px 0 #166534; }
      .bt-btn.danger  { border-color: #ef4444; color: #ef4444; }
      .bt-btn.danger:hover:not(:disabled)  { background: #2a0a0a; box-shadow: 0 3px 0 #7f1d1d; }
      .bt-btn:disabled, .bt-btn.disabled   { opacity: 0.3; cursor: not-allowed; }

      .swap-entry { display: flex; align-items: center; gap: 10px; text-align: left; padding: 8px 12px; }
      .swap-thumb { width: 32px; height: 32px; image-rendering: pixelated; }
      .swap-hp    { margin-left: auto; font-size: 0.35rem; color: #6a6aaa; }

      @media (max-width: 600px) {
        .enemy-sprite  { width: 100px; height: 100px; }
        .player-sprite { width: 110px; height: 110px; }
        #bt-enemy-info, #bt-player-info { min-width: 150px; }
        #bt-panel   { height: 200px; flex-direction: column; }
        #bt-log-box { border-right: none; border-bottom: 2px solid #1a1a3e; flex: none; padding: 12px 16px; }
        #bt-actions { grid-template-columns: 1fr 1fr; }
      }
    `;
    document.head.appendChild(style);
  }
}