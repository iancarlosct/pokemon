/**
 * @file BattleState.js
 * @description Classe abstrata base do padrão State aplicado à batalha.
 *
 * Cada estado concreto representa uma fase distinta da batalha e define
 * quais ações são válidas naquele momento. A Battle delega todas as
 * decisões de comportamento para o estado atual.
 *
 * Estados concretos (em BattleStates.js):
 *  - PlayerTurnState  → jogador pode atacar, trocar, capturar ou correr
 *  - EnemyTurnState   → inimigo executa seu ataque automaticamente
 *  - CaptureState     → animação e lógica de captura em andamento
 *  - VictoryState     → batalha encerrada por vitória ou captura
 *  - DefeatState      → batalha encerrada por derrota
 */
class BattleState {
  /**
   * @param {Battle} battle - Referência ao contexto (Battle).
   */
  constructor(battle) {
    if (new.target === BattleState) {
      throw new Error('BattleState é uma classe abstrata.');
    }
    this.battle = battle;
  }

  // ─── Ações do jogador ────────────────────────────────────────────────────
  // Estados que não suportam a ação simplesmente ignoram — sem flags, sem
  // condicionais externas. A BattleUI chama normalmente e o estado decide.

  atacar()          { return null; }
  trocar(indice)    { return null; }
  capturar()        { return null; }
  correr()          { return null; }

  // ─── Queries de estado ───────────────────────────────────────────────────

  /** Retorna true se o jogador pode interagir agora. */
  jogadorPodeAgir() { return false; }

  /** Retorna true se a batalha chegou ao fim. */
  encerrada()       { return false; }

  /** Nome do estado atual para debugging e logging. */
  nome()            { return this.constructor.name; }
}