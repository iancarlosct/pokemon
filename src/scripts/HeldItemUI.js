/**
 * @file HeldItemUI.js
 * @description Interface para gerenciar held items da equipe.
 *
 * Abre um painel modal sobre o overworld onde o jogador pode:
 *  - Ver a equipe atual com os items equipados
 *  - Equipar um item em qualquer Pokémon
 *  - Remover o item de um Pokémon
 *
 * Uso:
 *   new HeldItemUI();   // abre o painel
 *
 * Deve ser chamada a partir de um botão no overworld.
 * Ex: <button onclick="new HeldItemUI()">Mochila</button>
 */
class HeldItemUI {
  constructor() {
    this._equipe = TrainerStorage.carregarEquipeOuStarter();
    this._pokemonSelecionado = null;
    this._injectStyles();
    this._build();
    requestAnimationFrame(() => this.overlay.classList.add('visible'));
  }

  // ─── Build ────────────────────────────────────────────────────────────────

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'hi-overlay';
    this.overlay.innerHTML = `
      <div id="hi-modal">
        <div id="hi-header">
          <span id="hi-title">⬡ Itens da Equipe</span>
          <button id="hi-close">✕</button>
        </div>
        <div id="hi-body">
          <div id="hi-team-list"></div>
          <div id="hi-item-panel">
            <p id="hi-hint">Selecione um Pokémon para gerenciar seu item.</p>
            <div id="hi-item-grid" style="display:none"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.overlay);
    this.overlay.querySelector('#hi-close').onclick = () => this._fechar();
    this._renderEquipe();
  }

  // ─── Renderização da equipe ───────────────────────────────────────────────

  _renderEquipe() {
    const lista = this.overlay.querySelector('#hi-team-list');
    lista.innerHTML = '';

    this._equipe.forEach((pokemon, i) => {
      const itemAtual = HeldItemFactory.itemAtual(pokemon);
      const card = document.createElement('div');
      card.className = 'hi-pokemon-card' + (this._pokemonSelecionado === i ? ' selected' : '');
      card.innerHTML = `
        <img class="hi-sprite" src="../assets/images/pokes/${pokemon.nome.toLowerCase()}.png" alt="${pokemon.nome}">
        <div class="hi-poke-info">
          <span class="hi-poke-name">${pokemon.nome}</span>
          <span class="hi-poke-level">Nv. ${pokemon.nivel}</span>
          <span class="hi-poke-item ${itemAtual ? 'has-item' : 'no-item'}">
            ${itemAtual ? `⬡ ${itemAtual}` : '— sem item —'}
          </span>
        </div>
      `;
      card.onclick = () => this._selecionarPokemon(i);
      lista.appendChild(card);
    });
  }

  // ─── Seleção e painel de items ────────────────────────────────────────────

  _selecionarPokemon(indice) {
    this._pokemonSelecionado = indice;
    this._renderEquipe();
    this._renderItemPanel();
  }

  _renderItemPanel() {
    const hint = this.overlay.querySelector('#hi-hint');
    const grid = this.overlay.querySelector('#hi-item-grid');
    const pokemon = this._equipe[this._pokemonSelecionado];
    const itemAtual = HeldItemFactory.itemAtual(pokemon);

    hint.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = '';

    // Botão "Remover item"
    if (itemAtual) {
      const btnRemover = document.createElement('button');
      btnRemover.className = 'hi-item-btn remove-btn';
      btnRemover.innerHTML = `<span class="hi-item-icon">✕</span><span class="hi-item-label">Remover Item</span>`;
      btnRemover.onclick = () => this._removerItem(this._pokemonSelecionado);
      grid.appendChild(btnRemover);
    }

    // Botões de cada item disponível
    const DESCRICOES = {
      'Choice Band':  '+50% Ataque. Trava no primeiro move.',
      'Leftovers':    'Recupera 1/16 HP por turno.',
      'Rocky Helmet': 'Devolve 1/6 do dano recebido.',
      'Eviolite':     '+50% Defesa.',
      'Lum Berry':    'Cura status (em breve).',
    };

    const ICONES = {
      'Choice Band':  '⚔',
      'Leftovers':    '🍃',
      'Rocky Helmet': '🪨',
      'Eviolite':     '🛡',
      'Lum Berry':    '🍒',
    };

    HeldItemFactory.listar().forEach(nomeItem => {
      const btn = document.createElement('button');
      const isAtual = itemAtual === nomeItem;
      btn.className = 'hi-item-btn' + (isAtual ? ' current-item' : '');
      btn.innerHTML = `
        <span class="hi-item-icon">${ICONES[nomeItem] ?? '⬡'}</span>
        <span class="hi-item-label">${nomeItem}</span>
        <span class="hi-item-desc">${DESCRICOES[nomeItem] ?? ''}</span>
        ${isAtual ? '<span class="hi-item-badge">Equipado</span>' : ''}
      `;
      btn.onclick = () => this._equiparItem(this._pokemonSelecionado, nomeItem);
      grid.appendChild(btn);
    });
  }

  // ─── Ações ────────────────────────────────────────────────────────────────

  _equiparItem(indice, nomeItem) {
    let pokemon = this._equipe[indice];

    // Remove decorator existente antes de aplicar o novo
    pokemon = HeldItemFactory.remover(pokemon);
    pokemon = HeldItemFactory.equipar(pokemon, nomeItem);
    this._equipe[indice] = pokemon;

    this._persistir();
    this._renderEquipe();
    this._renderItemPanel();
  }

  _removerItem(indice) {
    let pokemon = this._equipe[indice];
    pokemon = HeldItemFactory.remover(pokemon);
    this._equipe[indice] = pokemon;

    this._persistir();
    this._renderEquipe();

    const hint = this.overlay.querySelector('#hi-hint');
    const grid = this.overlay.querySelector('#hi-item-grid');
    hint.style.display = 'block';
    hint.textContent = 'Item removido!';
    grid.style.display = 'none';
    this._pokemonSelecionado = null;
    this._renderEquipe();
  }

  _persistir() {
    TrainerStorage.atualizarEquipeCompleta(this._equipe);
  }

  _fechar() {
    this.overlay.classList.remove('visible');
    setTimeout(() => this.overlay.remove(), 300);
  }

  // ─── Estilos ──────────────────────────────────────────────────────────────

  _injectStyles() {
    if (document.getElementById('hi-styles')) return;
    const style = document.createElement('style');
    style.id = 'hi-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      #hi-overlay {
        position: fixed; inset: 0; z-index: 300;
        background: rgba(0,0,0,0.75);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.25s ease;
        font-family: 'Press Start 2P', monospace;
      }
      #hi-overlay.visible { opacity: 1; }

      #hi-modal {
        background: #0d0d2b;
        border: 3px solid #2a2a6e;
        border-radius: 10px;
        width: min(92vw, 680px);
        max-height: 90vh;
        display: flex; flex-direction: column;
        box-shadow: 0 0 40px rgba(90,90,200,0.3);
        overflow: hidden;
      }

      /* ── Header ── */
      #hi-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 20px;
        border-bottom: 2px solid #1a1a4e;
        background: #0a0a20;
      }
      #hi-title { font-size: 0.5rem; color: #f5c542; letter-spacing: 1px; }
      #hi-close {
        background: none; border: none; color: #6a6aaa;
        font-size: 0.55rem; cursor: pointer;
        font-family: 'Press Start 2P', monospace;
        transition: color 0.1s;
      }
      #hi-close:hover { color: #ef4444; }

      /* ── Body ── */
      #hi-body {
        display: flex; flex: 1;
        overflow: hidden; min-height: 0;
      }

      /* ── Lista de Pokémon ── */
      #hi-team-list {
        width: 200px; min-width: 200px;
        border-right: 2px solid #1a1a4e;
        overflow-y: auto;
        padding: 8px;
        display: flex; flex-direction: column; gap: 6px;
      }

      .hi-pokemon-card {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 10px;
        background: #11112e;
        border: 2px solid #1a1a4e;
        border-radius: 6px; cursor: pointer;
        transition: all 0.12s;
      }
      .hi-pokemon-card:hover { border-color: #4a4aae; background: #18183e; }
      .hi-pokemon-card.selected { border-color: #f5c542; background: #1a1a0a; }

      .hi-sprite {
        width: 40px; height: 40px;
        image-rendering: pixelated;
        flex-shrink: 0;
      }

      .hi-poke-info {
        display: flex; flex-direction: column; gap: 4px;
        overflow: hidden;
      }
      .hi-poke-name  { font-size: 0.38rem; color: #e8e8ff; }
      .hi-poke-level { font-size: 0.3rem;  color: #6a6aaa; }
      .hi-poke-item  { font-size: 0.28rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hi-poke-item.has-item { color: #f5c542; }
      .hi-poke-item.no-item  { color: #3a3a6a; }

      /* ── Painel de items ── */
      #hi-item-panel {
        flex: 1; padding: 16px; overflow-y: auto;
        display: flex; flex-direction: column;
      }
      #hi-hint {
        font-size: 0.38rem; color: #6a6aaa;
        text-align: center; margin: auto;
        line-height: 2;
      }

      #hi-item-grid {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .hi-item-btn {
        font-family: 'Press Start 2P', monospace;
        background: #11112e;
        border: 2px solid #2a2a6e;
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        color: #e8e8ff;
        display: flex; flex-direction: column; gap: 6px;
        text-align: left;
        transition: all 0.12s;
        position: relative;
      }
      .hi-item-btn:hover {
        border-color: #f5c542;
        background: #1a1a0a;
        transform: translateY(-1px);
      }
      .hi-item-btn.current-item {
        border-color: #4ade80;
        background: #0a1a0a;
      }
      .hi-item-btn.remove-btn {
        border-color: #ef4444;
        color: #ef4444;
        grid-column: 1 / -1;
        flex-direction: row; align-items: center;
        gap: 10px;
      }
      .hi-item-btn.remove-btn:hover { background: #1a0a0a; }

      .hi-item-icon  { font-size: 1.2rem; }
      .hi-item-label { font-size: 0.38rem; color: #e8e8ff; }
      .hi-item-desc  { font-size: 0.28rem; color: #6a6aaa; line-height: 1.8; }

      .hi-item-badge {
        position: absolute; top: 6px; right: 8px;
        font-size: 0.25rem; color: #4ade80;
        background: #0a2a0a; border: 1px solid #4ade80;
        padding: 2px 6px; border-radius: 3px;
      }

      @media (max-width: 520px) {
        #hi-body { flex-direction: column; }
        #hi-team-list { width: 100%; min-width: unset; border-right: none; border-bottom: 2px solid #1a1a4e; flex-direction: row; overflow-x: auto; overflow-y: hidden; }
        #hi-item-grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }
}
