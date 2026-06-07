# Pokémon Web Game

Jogo Pokémon desenvolvido para o navegador com JavaScript puro (ES6+), HTML5 e CSS3, sem frameworks ou bibliotecas externas. Todo o sistema é construído com Orientação a Objetos, aplicando os padrões de projeto GoF **Factory Method**, **Decorator** e **State**.

---

## Sumário

- [Como jogar](#como-jogar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura e OOP](#arquitetura-e-oop)
- [Padrões de projeto](#padrões-de-projeto)
  - [Factory Method](#factory-method)
  - [Decorator](#decorator)
  - [State](#state)
- [Pokémon disponíveis](#pokémon-disponíveis)
- [Sistema de held items](#sistema-de-held-items)

---

## Como jogar

1. Abra `src/index.html` no navegador
2. Digite seu nome de treinador e escolha seu Pokémon inicial (Charmander, Bulbasaur ou Squirtle)
3. Explore o mapa com **WASD** ou as **setas do teclado**
4. Ao pisar em grama ou água, encontros aleatórios com Pokémon selvagens ocorrem
5. Em batalha, escolha entre **Atacar**, **Trocar**, **Capturar** ou **Correr**
6. Clique em **⬡ Mochila** para equipar held items na sua equipe

---

## Estrutura do projeto

```
src/
├── assets/
│   ├── images/
│   │   ├── icons/       # Sprite do jogador
│   │   ├── maps/        # Imagem do overworld
│   │   └── pokes/       # Sprites dos Pokémon
│   └── songs/           # Músicas do overworld e batalha
│
├── pages/
│   └── overworld13.html
│
├── scripts/
│   ├── battle/
│   │   ├── BattleStates.js   # Padrão State — estados da batalha
│   │   ├── Battle.js         # Contexto do State
│   │   └── BattleUI.js       # Interface visual da batalha
│   ├── heldItems/
│   │   ├── HeldItemDecorator.js  # Padrão Decorator — base abstrata
│   │   ├── HeldItems.js          # Decorators concretos (itens)
│   │   ├── HeldItemFactory.js    # Instancia decorators por nome
│   │   └── HeldItemUI.js         # Interface de gerenciamento de itens
│   ├── maps/
│   │   └── Overworld13.js    # Mapa, encontros e movimentação
│   ├── pokes/
│   │   ├── Pokemon.js        # Classe abstrata base
│   │   ├── Charmander.js
│   │   ├── Bulbasaur.js
│   │   ├── Squirtle.js
│   │   ├── Caterpie.js
│   │   ├── Weedle.js
│   │   ├── Rattata.js
│   │   ├── Horsea.js
│   │   ├── Magikarp.js
│   │   └── Tentacool.js
│   ├── PokemonCreator.js     # Padrão Factory Method — creators
│   ├── PokemonFactory.js     # Ponto de entrada para criação
│   ├── TrainerStorage.js     # Persistência no localStorage
│   ├── songs.js              # Gerenciamento de música
│   └── index.js              # Lógica da tela inicial
│
├── styles/
│   ├── global.css            # Estilos do overworld
│   └── index.css             # Estilos da tela inicial
│
└── index.html
```

---

## Arquitetura e OOP

O projeto aplica os quatro pilares da Orientação a Objetos:

- **Abstração** — `Pokemon` e `BattleState` são classes abstratas que definem contratos sem implementação concreta
- **Herança** — cada espécie de Pokémon herda de `Pokemon`; cada estado herda de `BattleState`; cada item herda de `HeldItemDecorator`
- **Polimorfismo** — `Battle` e `BattleUI` tratam qualquer Pokémon (puro ou decorado) e qualquer estado da mesma forma
- **Encapsulamento** — `TrainerStorage` é o único ponto de acesso ao `localStorage`; os estados gerenciam suas próprias transições

---

## Padrões de projeto

### Factory Method

**Problema:** o `PokemonFactory` original acoplava a criação de todas as espécies em um único mapa de construtores. Adicionar uma nova espécie exigia modificar a factory diretamente.

**Solução:** cada espécie tem seu próprio `PokemonCreator` concreto que implementa o Factory Method `criarPokemon()`. O `PokemonFactory` delega a criação ao creator correto sem saber qual classe concreta está sendo instanciada.

```
PokemonCreator (abstrato)
  ├── criarPokemon(atributos)   ← Factory Method
  └── criar(multiplicadores)    ← Template Method

  ├── CharmanderCreator
  ├── BulbasaurCreator
  └── ... (um por espécie)
```

**Arquivos:** `scripts/PokemonCreator.js`, `scripts/PokemonFactory.js`

**Instanciado em:** `index.js` (Pokémon inicial), `overworld13.js` (Pokémon selvagens), `TrainerStorage.js` (reconstrução da equipe salva)

---

### Decorator

**Problema:** o sistema de held items precisava modificar atributos e comportamentos de Pokémon dinamicamente, sem alterar as classes existentes nem adicionar condicionais em `Battle`.

**Solução:** cada item é um decorator que envolve o Pokémon, expõe a mesma interface e sobrescreve apenas o que o item modifica. `Battle` e `BattleUI` nunca sabem se estão lidando com um Pokémon puro ou decorado.

```
HeldItemDecorator (abstrato)
  ├── ChoiceBandDecorator   → +50% ataque, trava no primeiro move
  ├── LeftoversDecorator    → cura 1/16 HP por turno
  ├── RockyHelmetDecorator  → devolve 1/6 do dano ao atacante
  └── EvioliteDecorator     → +50% defesa
```

**Arquivos:** `scripts/heldItems/`

**Instanciado em:** `HeldItemUI._equiparItem()` (jogador equipa item), `TrainerStorage.desserializarPokemon()` (recarregamento da equipe)

---

### State

**Problema:** a `BattleUI` usava um flag `_bloqueado` para controlar quando o jogador podia agir. Esse flag era verificado e resetado em cada método separadamente, sem expressar o que estava acontecendo na batalha.

**Solução:** a batalha foi modelada como uma máquina de estados. Cada fase é uma classe que define quais ações são válidas. `Battle` delega todas as decisões ao estado atual.

```
BattleState (abstrato)
  ├── PlayerTurnState   → jogador pode atacar, trocar, capturar, correr
  ├── EnemyTurnState    → inimigo executa; jogador bloqueado
  ├── CaptureState      → processa tentativa de captura
  ├── VictoryState      → terminal: vitória, fuga ou captura
  └── DefeatState       → terminal: derrota
```

**Arquivos:** `scripts/battle/`

**Instanciado em:** `Battle` (estado inicial `PlayerTurnState`); demais estados são instanciados pelas transições internas dos próprios estados.

---

## Pokémon disponíveis

| Pokémon    | Tipo         | Diferencial                          |
|------------|--------------|--------------------------------------|
| Charmander | Fogo         | +5% ataque extra ao subir de nível   |
| Bulbasaur  | Grama        | Ataque 0.95×                         |
| Squirtle   | Água         | +5% defesa extra ao subir de nível   |
| Caterpie   | Inseto       | Ataque 0.9×                          |
| Weedle     | Inseto/Veneno| +5% velocidade ao subir de nível     |
| Rattata    | Normal       | 20% de chance de golpe duplo         |
| Horsea     | Água         | +6% defesa extra ao subir de nível   |
| Magikarp   | Água         | Ataque mínimo (0.3×); +8% velocidade |
| Tentacool  | Água/Veneno  | +5% defesa extra ao subir de nível   |

Charmander, Bulbasaur e Squirtle são selecionáveis como Pokémon inicial. Os demais aparecem como selvagens no overworld.

---

## Sistema de held items

Itens equipáveis gerenciados pela **Mochila** no overworld. Cada Pokémon pode carregar um item por vez.

| Item         | Efeito                                      |
|--------------|---------------------------------------------|
| Choice Band  | +50% ataque; trava no primeiro move usado   |
| Leftovers    | Recupera 1/16 do HP máximo por turno        |
| Rocky Helmet | Devolve 1/6 do dano recebido ao atacante    |
| Eviolite     | +50% defesa                                 |

Os itens são persistidos no `localStorage` junto com a equipe e reaplicados automaticamente ao recarregar o jogo.
