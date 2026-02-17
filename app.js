const board = document.getElementById("board");
const playersRoot = document.getElementById("players");
const undoBtn = document.getElementById("undoBtn");
const newGameBtn = document.getElementById("newGameBtn");
const languageBtn = document.getElementById("languageBtn");
const setupOverlay = document.getElementById("setupOverlay");
const nameFields = document.getElementById("nameFields");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const startGameBtn = document.getElementById("startGameBtn");
const boardWrap = document.getElementById("boardWrap");
const checkoutHint = document.getElementById("checkoutHint");
const legResult = document.getElementById("legResult");
const legsScore = document.getElementById("legsScore");
const finishOverlay = document.getElementById("finishOverlay");
const finishText = document.getElementById("finishText");
const nextLegBtn = document.getElementById("nextLegBtn");
const titleLabel = document.getElementById("titleLabel");
const legsTitle = document.getElementById("legsTitle");
const setupTitle = document.getElementById("setupTitle");
const setupSubtitle = document.getElementById("setupSubtitle");
const finishTitle = document.getElementById("finishTitle");

const ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const START_SCORE = 301;
const TAU = Math.PI * 2;
const CENTER = 420;

const RADII = {
  boardOuter: 398,
  doubleOuter: 355,
  doubleInner: 325,
  tripleOuter: 230,
  tripleInner: 200,
  bullOuter: 72,
  bullInner: 34,
};

const state = {
  players: [],
  currentPlayer: 0,
  dartInTurn: 0,
  history: [],
  totalDarts: 0,
  gameStarted: false,
  pendingLegStarter: null,
  lastClosedDart: null,
  language: localStorage.getItem("darts_lang") || "uk",
};

const I18N = {
  uk: {
    appTitle: "Darts Score",
    undo: "Скасувати",
    newGame: "Нова гра",
    legsTitle: "Рахунок по партіях",
    setupTitle: "Початок гри",
    setupSubtitle: "Додайте гравців і запустіть матч 301.",
    addPlayer: "+ Додати гравця",
    removePlayer: "Видалити",
    startGame: "Почати гру",
    finishTitle: "Партію закрито",
    nextLeg: "Наступна партія",
    prevTurn: "Попер. хід",
    checkoutPrefix: "Закриття",
    legClosed: "Партію закрито",
    minPlayers: "Потрібно мінімум 2 гравці",
    namePlaceholder: "Впишіть ім'я",
  },
  en: {
    appTitle: "Darts Score",
    undo: "Undo",
    newGame: "New game",
    legsTitle: "Leg score",
    setupTitle: "Start game",
    setupSubtitle: "Add players and start the 301 match.",
    addPlayer: "+ Add player",
    removePlayer: "Remove",
    startGame: "Start game",
    finishTitle: "Leg closed",
    nextLeg: "Next leg",
    prevTurn: "Prev. turn",
    checkoutPrefix: "Checkout",
    legClosed: "Leg closed",
    minPlayers: "At least 2 players are required",
    namePlaceholder: "Enter name",
  },
};

function t(key) {
  return I18N[state.language][key];
}

function applyLanguage() {
  document.documentElement.lang = state.language === "uk" ? "uk" : "en";
  document.title = t("appTitle");
  titleLabel.textContent = t("appTitle");
  undoBtn.textContent = t("undo");
  newGameBtn.textContent = t("newGame");
  legsTitle.textContent = t("legsTitle");
  setupTitle.textContent = t("setupTitle");
  setupSubtitle.textContent = t("setupSubtitle");
  addPlayerBtn.textContent = t("addPlayer");
  startGameBtn.textContent = t("startGame");
  finishTitle.textContent = t("finishTitle");
  nextLegBtn.textContent = t("nextLeg");
  languageBtn.textContent = state.language === "uk" ? "🌐 UA" : "🌐 EN";
  [...nameFields.querySelectorAll(".name-input")].forEach((input) => {
    input.placeholder = t("namePlaceholder");
  });
  [...nameFields.querySelectorAll(".remove-btn")].forEach((btn) => {
    btn.textContent = t("removePlayer");
  });
}

function setLanguage(lang) {
  state.language = lang;
  localStorage.setItem("darts_lang", lang);
  applyLanguage();
  updateLegTexts();
  renderPlayers();
}

function toggleLanguage() {
  setLanguage(state.language === "uk" ? "en" : "uk");
}

const FIRST_DART_OPTIONS = [];
for (let i = 20; i >= 1; i -= 1) {
  FIRST_DART_OPTIONS.push({ label: `T${i}`, value: i * 3 });
}
for (let i = 20; i >= 1; i -= 1) {
  FIRST_DART_OPTIONS.push({ label: `D${i}`, value: i * 2 });
}
for (let i = 20; i >= 1; i -= 1) {
  FIRST_DART_OPTIONS.push({ label: `${i}`, value: i });
}
FIRST_DART_OPTIONS.push({ label: "SB", value: 25 });
FIRST_DART_OPTIONS.push({ label: "DB", value: 50 });

const DOUBLE_OPTIONS = [];
for (let i = 20; i >= 1; i -= 1) {
  DOUBLE_OPTIONS.push({ label: `D${i}`, value: i * 2 });
}
DOUBLE_OPTIONS.push({ label: "DB", value: 50 });

function createPlayer(name) {
  return {
    name,
    score: START_SCORE,
    turnThrows: ["", "", ""],
    turnTotal: 0,
    turnStartScore: START_SCORE,
    totalDarts: 0,
    legsWon: 0,
    lastTurnTotal: 0,
  };
}

function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function annularSectorPath(cx, cy, rOuter, rInner, start, end) {
  const p1 = polarToCartesian(cx, cy, rOuter, start);
  const p2 = polarToCartesian(cx, cy, rOuter, end);
  const p3 = polarToCartesian(cx, cy, rInner, end);
  const p4 = polarToCartesian(cx, cy, rInner, start);
  const largeArc = end - start > Math.PI ? 1 : 0;

  return `M ${p1.x} ${p1.y}
          A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}
          L ${p3.x} ${p3.y}
          A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}
          Z`;
}

function drawCircle(radius, fill, className, scoreDef) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", CENTER);
  circle.setAttribute("cy", CENTER);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", fill);
  circle.setAttribute("class", className);

  if (scoreDef) {
    circle.dataset.value = String(scoreDef.value);
    circle.dataset.label = scoreDef.label;
    circle.addEventListener("click", onHit);
  }

  return circle;
}

function drawBoard() {
  board.innerHTML = "";

  board.appendChild(drawCircle(RADII.boardOuter, "#2f3036", "board-base"));

  const step = TAU / 20;
  const startOffset = -Math.PI / 2 - step / 2;

  for (let i = 0; i < 20; i += 1) {
    const value = ORDER[i];
    const start = startOffset + i * step;
    const end = start + step;

    const isAlt = i % 2 === 0;
    const singleColor = isAlt ? "#2f3036" : "#d7d1a6";
    const doubleTripleColor = isAlt ? "#ff2c11" : "#08b457";

    const ringSegments = [
      {
        outer: RADII.doubleOuter,
        inner: RADII.doubleInner,
        fill: doubleTripleColor,
        label: `D${value}`,
        score: value * 2,
      },
      {
        outer: RADII.doubleInner,
        inner: RADII.tripleOuter,
        fill: singleColor,
        label: `${value}`,
        score: value,
      },
      {
        outer: RADII.tripleOuter,
        inner: RADII.tripleInner,
        fill: doubleTripleColor,
        label: `T${value}`,
        score: value * 3,
      },
      {
        outer: RADII.tripleInner,
        inner: RADII.bullOuter,
        fill: singleColor,
        label: `${value}`,
        score: value,
      },
    ];

    for (const ring of ringSegments) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute(
        "d",
        annularSectorPath(CENTER, CENTER, ring.outer, ring.inner, start, end)
      );
      path.setAttribute("fill", ring.fill);
      path.setAttribute("stroke", "#2f3742");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("class", "board-segment");
      path.dataset.value = String(ring.score);
      path.dataset.label = ring.label;
      path.addEventListener("click", onHit);
      board.appendChild(path);
    }

    const labelAngle = start + step / 2;
    const labelPoint = polarToCartesian(CENTER, CENTER, 378, labelAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = String(value);
    text.setAttribute("x", labelPoint.x);
    text.setAttribute("y", labelPoint.y);
    text.setAttribute("class", "number-label");
    board.appendChild(text);
  }

  board.appendChild(
    drawCircle(RADII.bullOuter, "#08b457", "board-ring", { value: 25, label: "SB" })
  );
  board.appendChild(
    drawCircle(RADII.bullInner, "#ff2c11", "board-bull", { value: 50, label: "DB" })
  );

  const frame = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  frame.setAttribute("cx", CENTER);
  frame.setAttribute("cy", CENTER);
  frame.setAttribute("r", RADII.boardOuter + 3);
  frame.setAttribute("fill", "none");
  frame.setAttribute("stroke", "#e5e1ba");
  frame.setAttribute("stroke-width", "4");
  board.appendChild(frame);
}

function renderLegsScore() {
  legsScore.innerHTML = "";
  state.players.forEach((player) => {
    const row = document.createElement("div");
    row.className = "legs-row";

    const name = document.createElement("span");
    name.textContent = player.name;

    const score = document.createElement("strong");
    score.textContent = String(player.legsWon);

    row.appendChild(name);
    row.appendChild(score);
    legsScore.appendChild(row);
  });
}

function renderPlayers() {
  playersRoot.innerHTML = "";

  state.players.forEach((player, index) => {
    const card = document.createElement("article");
    card.className = `player${index === state.currentPlayer && state.gameStarted ? " active" : ""}`;

    const top = document.createElement("div");
    top.className = "player-top";

    const nameWrap = document.createElement("div");

    const name = document.createElement("div");
    name.className = "player-name";
    name.textContent = player.name;

    const meta = document.createElement("div");
    meta.className = "player-meta";
    meta.innerHTML = `<svg class="meta-dart-icon" viewBox="0 0 120 36" aria-hidden="true">
      <polygon points="108,8 118,18 108,28 96,24 96,12"></polygon>
      <rect x="90" y="15" width="22" height="6" rx="3"></rect>
      <circle cx="88" cy="18" r="4"></circle>
      <rect x="18" y="17" width="66" height="2" rx="1"></rect>
      <rect x="58" y="14" width="4" height="8" rx="1"></rect>
      <rect x="52" y="14" width="3" height="8" rx="1"></rect>
      <rect x="46" y="14" width="3" height="8" rx="1"></rect>
      <rect x="14" y="15" width="6" height="6" rx="2"></rect>
      <polygon points="2,18 14,18 14,20 2,20"></polygon>
    </svg> ${player.totalDarts} | ${t("prevTurn")}: ${player.lastTurnTotal}`;

    nameWrap.appendChild(name);
    nameWrap.appendChild(meta);

    const scoreWrap = document.createElement("div");
    scoreWrap.className = "player-score";

    const score = document.createElement("span");
    score.textContent = String(player.score);

    const badge = document.createElement("span");
    badge.className = "turn-badge";
    badge.textContent =
      index === state.currentPlayer && state.gameStarted ? String(3 - state.dartInTurn) : "";

    scoreWrap.appendChild(score);
    scoreWrap.appendChild(badge);

    top.appendChild(nameWrap);
    top.appendChild(scoreWrap);

    const throws = document.createElement("div");
    throws.className = "player-throws";

    player.turnThrows.forEach((item) => {
      const box = document.createElement("div");
      box.className = "throw-box";
      box.textContent = item;
      throws.appendChild(box);
    });

    const total = document.createElement("div");
    total.className = "turn-total";
    if (index === state.currentPlayer && state.gameStarted) {
      total.textContent = player.turnTotal > 0 ? String(player.turnTotal) : "";
    } else {
      total.textContent = player.lastTurnTotal > 0 ? String(player.lastTurnTotal) : "";
    }
    throws.appendChild(total);

    card.appendChild(top);
    card.appendChild(throws);
    playersRoot.appendChild(card);
  });

  checkoutHint.textContent = getCheckoutHint();
  renderLegsScore();
}

function nextPlayer() {
  const previousPlayer = state.players[state.currentPlayer];
  previousPlayer.lastTurnTotal = previousPlayer.turnTotal;
  previousPlayer.turnThrows = ["", "", ""];
  previousPlayer.turnTotal = 0;
  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  state.dartInTurn = 0;
}

function isDoubleLabel(label) {
  return label === "DB" || label.startsWith("D");
}

function searchCheckout(remaining, dartsLeft, sequence) {
  if (dartsLeft === 1) {
    for (const option of DOUBLE_OPTIONS) {
      if (option.value === remaining) {
        sequence.push(option.label);
        return true;
      }
    }
    return false;
  }

  for (const option of FIRST_DART_OPTIONS) {
    const nextRemaining = remaining - option.value;
    if (nextRemaining < 2) {
      continue;
    }
    sequence.push(option.label);
    if (searchCheckout(nextRemaining, dartsLeft - 1, sequence)) {
      return true;
    }
    sequence.pop();
  }

  return false;
}

function findCheckout(score, dartsLeft) {
  if (score < 2 || score > 170 || dartsLeft < 1) {
    return null;
  }

  for (let length = 1; length <= dartsLeft; length += 1) {
    const sequence = [];
    if (searchCheckout(score, length, sequence)) {
      return sequence.join(" ");
    }
  }

  return null;
}

function getCheckoutHint() {
  if (!state.gameStarted || state.players.length === 0) {
    return "";
  }

  const player = state.players[state.currentPlayer];
  const dartsLeft = 3 - state.dartInTurn;
  const checkout = findCheckout(player.score, dartsLeft);
  if (!checkout) {
    return "";
  }

  return `${t("checkoutPrefix")} ${player.score}: ${checkout}`;
}

function updateLegTexts() {
  if (state.lastClosedDart === null) {
    legResult.textContent = "";
    finishText.textContent = "";
    return;
  }
  const text = `${t("legClosed")}: ${state.lastClosedDart}`;
  legResult.textContent = text;
  finishText.textContent = text;
}

function startNewLeg(startingPlayer) {
  state.players.forEach((player) => {
    player.score = START_SCORE;
    player.turnThrows = ["", "", ""];
    player.turnTotal = 0;
    player.turnStartScore = START_SCORE;
    player.lastTurnTotal = 0;
  });

  state.currentPlayer = startingPlayer;
  state.dartInTurn = 0;
  state.history = [];
  state.gameStarted = true;
}

function finishLeg(winnerIndex, dartNumber) {
  const winner = state.players[winnerIndex];
  winner.legsWon += 1;
  state.lastClosedDart = dartNumber;
  updateLegTexts();
  state.gameStarted = false;
  state.pendingLegStarter = winnerIndex;
  finishOverlay.classList.remove("hidden");
}

function applyThrow(label, value) {
  if (!state.gameStarted || state.players.length === 0) {
    return;
  }

  const player = state.players[state.currentPlayer];
  if (state.dartInTurn === 0) {
    player.turnThrows = ["", "", ""];
    player.turnTotal = 0;
    player.turnStartScore = player.score;
  }

  const prev = {
    currentPlayer: state.currentPlayer,
    dartInTurn: state.dartInTurn,
    totalDarts: state.totalDarts,
    gameStarted: state.gameStarted,
    pendingLegStarter: state.pendingLegStarter,
    playerScore: player.score,
    playerTurnThrows: [...player.turnThrows],
    playerTurnTotal: player.turnTotal,
    playerTurnStartScore: player.turnStartScore,
    playerTotalDarts: player.totalDarts,
    playerLegsWon: player.legsWon,
    playerLastTurnTotal: player.lastTurnTotal,
    lastClosedDart: state.lastClosedDart,
    finishModalOpen: !finishOverlay.classList.contains("hidden"),
  };

  state.history.push(prev);
  state.totalDarts += 1;
  player.totalDarts += 1;

  const nextScore = player.score - value;
  const isValidFinish = nextScore !== 0 || isDoubleLabel(label);
  const isDeadScore = nextScore === 1;

  if (nextScore < 0 || isDeadScore || !isValidFinish) {
    player.score = player.turnStartScore;
    player.turnTotal = 0;
    nextPlayer();
    renderPlayers();
    return;
  }

  player.score = nextScore;
  player.turnThrows[state.dartInTurn] = label;
  player.turnTotal += value;

  state.dartInTurn += 1;

  if (player.score === 0) {
    finishLeg(state.currentPlayer, state.dartInTurn);
  } else if (state.dartInTurn >= 3) {
    nextPlayer();
  }

  renderPlayers();
}

function onHit(event) {
  const label = event.currentTarget.dataset.label;
  const value = Number(event.currentTarget.dataset.value);
  applyThrow(label, value);
}

function undo() {
  const snapshot = state.history.pop();
  if (!snapshot) {
    return;
  }

  state.currentPlayer = snapshot.currentPlayer;
  state.dartInTurn = snapshot.dartInTurn;
  state.totalDarts = snapshot.totalDarts;
  state.gameStarted = snapshot.gameStarted;
  state.pendingLegStarter = snapshot.pendingLegStarter;
  state.lastClosedDart = snapshot.lastClosedDart;

  const player = state.players[state.currentPlayer];
  player.score = snapshot.playerScore;
  player.turnThrows = snapshot.playerTurnThrows;
  player.turnTotal = snapshot.playerTurnTotal;
  player.turnStartScore = snapshot.playerTurnStartScore;
  player.totalDarts = snapshot.playerTotalDarts;
  player.legsWon = snapshot.playerLegsWon;
  player.lastTurnTotal = snapshot.playerLastTurnTotal;

  updateLegTexts();
  if (snapshot.finishModalOpen) {
    finishOverlay.classList.remove("hidden");
  } else {
    finishOverlay.classList.add("hidden");
  }

  renderPlayers();
}

function resetMatch() {
  state.players.forEach((player) => {
    player.totalDarts = 0;
    player.legsWon = 0;
    player.lastTurnTotal = 0;
  });
  state.totalDarts = 0;
  state.pendingLegStarter = null;
  state.lastClosedDart = null;
  updateLegTexts();
  finishOverlay.classList.add("hidden");
  startNewLeg(0);
}

function newGame() {
  if (state.players.length === 0) {
    setupOverlay.classList.remove("hidden");
    return;
  }

  setupOverlay.classList.add("hidden");
  finishOverlay.classList.add("hidden");
  resetMatch();
  renderPlayers();
}

function addPlayerField(value = "") {
  const row = document.createElement("div");
  row.className = "name-row";

  const input = document.createElement("input");
  input.className = "name-input";
  input.type = "text";
  input.placeholder = t("namePlaceholder");
  input.value = value;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = t("removePlayer");
  removeBtn.addEventListener("click", () => {
    if (nameFields.children.length <= 2) {
      return;
    }
    row.remove();
  });

  row.appendChild(input);
  row.appendChild(removeBtn);
  nameFields.appendChild(row);
}

function startGameFromSetup() {
  const inputs = [...nameFields.querySelectorAll(".name-input")];
  const names = inputs.map((input) => input.value.trim()).filter(Boolean);

  if (names.length < 2) {
    alert(t("minPlayers"));
    return;
  }

  state.players = names.map((name) => createPlayer(name));
  setupOverlay.classList.add("hidden");
  finishOverlay.classList.add("hidden");
  resetMatch();
  renderPlayers();
}

function startPendingLeg() {
  if (state.pendingLegStarter === null) {
    finishOverlay.classList.add("hidden");
    return;
  }

  startNewLeg(state.pendingLegStarter);
  state.pendingLegStarter = null;
  state.lastClosedDart = null;
  updateLegTexts();
  finishOverlay.classList.add("hidden");
  renderPlayers();
}

undoBtn.addEventListener("click", undo);
newGameBtn.addEventListener("click", newGame);
languageBtn.addEventListener("click", toggleLanguage);
addPlayerBtn.addEventListener("click", () => addPlayerField(""));
startGameBtn.addEventListener("click", startGameFromSetup);
nextLegBtn.addEventListener("click", startPendingLeg);
boardWrap.addEventListener("click", (event) => {
  const isBoardSegment = event.target.closest(".board-segment, .board-bull, .board-ring");
  if (!isBoardSegment) {
    applyThrow("0", 0);
  }
});

drawBoard();
applyLanguage();
addPlayerField("");
addPlayerField("");
updateLegTexts();
renderPlayers();
