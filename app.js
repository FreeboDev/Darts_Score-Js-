const board = document.getElementById("board");
const appRoot = document.querySelector(".app");
const scorePanel = document.querySelector(".score-panel");
const playersRoot = document.getElementById("players");
const undoBtn = document.getElementById("undoBtn");
const newGameBtn = document.getElementById("newGameBtn");
const languageBtn = document.getElementById("languageBtn");
const legsToggleBtn = document.getElementById("legsToggleBtn");
const setupOverlay = document.getElementById("setupOverlay");
const nameFields = document.getElementById("nameFields");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const startGameBtn = document.getElementById("startGameBtn");
const boardWrap = document.getElementById("boardWrap");
const checkoutHint = document.getElementById("checkoutHint");
const legResult = document.getElementById("legResult");
const legsBox = document.querySelector(".legs-box");
const legsScore = document.getElementById("legsScore");
const finishOverlay = document.getElementById("finishOverlay");
const finishText = document.getElementById("finishText");
const nextLegBtn = document.getElementById("nextLegBtn");
const bullOverlay = document.getElementById("bullOverlay");
const bullTitle = document.getElementById("bullTitle");
const bullTitleText = document.getElementById("bullTitleText");
const bullText = document.getElementById("bullText");
const bullPlayers = document.getElementById("bullPlayers");
const titleRow = document.querySelector(".title-row");
const titleLabel = document.getElementById("titleLabel");
const legsTitle = document.getElementById("legsTitle");
const setupTitle = document.getElementById("setupTitle");
const setupBrandLabel = document.getElementById("setupBrandLabel");
const setupSubtitle = document.getElementById("setupSubtitle");
const finishTitle = document.getElementById("finishTitle");

const ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const START_SCORE = 301;
const BOARD_BRAND = "winmau";
const BOARD_BOTTOM_MAIN = "BLADE 6";
const BOARD_BOTTOM_SUB = "SIXTH GENERATION BLADE TECHNOLOGY";
const TAU = Math.PI * 2;
const CENTER = 420;
const IPAD_QUERY = "(min-width: 768px) and (max-width: 1180px)";
const iPadMedia = window.matchMedia(IPAD_QUERY);
const MOBILE_QUERY = "(max-width: 767px)";
const mobileMedia = window.matchMedia(MOBILE_QUERY);

const RADII = {
  boardOuter: 398,
  doubleOuter: 338,
  doubleInner: 308,
  tripleOuter: 230,
  tripleInner: 200,
  bullOuter: 72,
  bullInner: 34,
};

const state = {
  players: [],
  currentPlayer: 0,
  legStarter: 0,
  dartInTurn: 0,
  history: [],
  totalDarts: 0,
  gameStarted: false,
  bullOffActive: false,
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
    bullTitle: "BULL",
    bullText: "Усі кинули 39 дротиків. Хто ближче до центру?",
    prevTurn: "Попер. хід",
    checkoutPrefix: "Закриття",
    legClosed: "Партію закрито",
    minPlayers: "Потрібен мінімум 1 гравець",
    namePlaceholder: "Впишіть ім'я",
    scoreBtn: "Рахунок",
    avg: "Середнє",
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
    bullTitle: "BULL",
    bullText: "Everyone reached 39 darts. Who is closer to the bull?",
    prevTurn: "Prev. turn",
    checkoutPrefix: "Checkout",
    legClosed: "Leg closed",
    minPlayers: "At least 1 player is required",
    namePlaceholder: "Enter name",
    scoreBtn: "Score",
    avg: "Average",
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
  if (legsToggleBtn) {
    legsToggleBtn.textContent = t("scoreBtn");
  }
  legsTitle.textContent = t("legsTitle");
  if (setupTitle) {
    setupTitle.setAttribute("aria-label", t("appTitle"));
  }
  if (setupBrandLabel) {
    setupBrandLabel.textContent = t("appTitle");
  }
  setupSubtitle.textContent = t("setupSubtitle");
  addPlayerBtn.textContent = t("addPlayer");
  startGameBtn.textContent = t("startGame");
  finishTitle.textContent = t("finishTitle");
  nextLegBtn.textContent = t("nextLeg");
  if (bullTitle) {
    bullTitle.setAttribute("aria-label", t("bullTitle"));
  }
  if (bullTitleText) {
    bullTitleText.textContent = t("bullTitle");
  }
  bullText.textContent = t("bullText");
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

function syncIpadLegsPanel() {
  if (!legsToggleBtn) {
    return;
  }
  if (!iPadMedia.matches) {
    document.body.classList.remove("ipad-legs-open");
  }
  const isOpen = iPadMedia.matches && document.body.classList.contains("ipad-legs-open");
  legsToggleBtn.setAttribute("aria-expanded", String(isOpen));
}

function toggleIpadLegsPanel() {
  if (!iPadMedia.matches) {
    return;
  }
  document.body.classList.toggle("ipad-legs-open");
  syncIpadLegsPanel();
}

function applyMobileLayout() {
  if (!appRoot || !scorePanel || !boardWrap || !playersRoot) {
    return;
  }
  if (mobileMedia.matches) {
    scorePanel.insertBefore(boardWrap, playersRoot);
  } else if (boardWrap.parentElement !== appRoot) {
    appRoot.appendChild(boardWrap);
  }
}

function renderBullPlayers() {
  if (!bullPlayers) {
    return;
  }
  bullPlayers.innerHTML = "";
  state.players.forEach((player, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = player.name;
    btn.addEventListener("click", () => resolveBullOff(index));
    bullPlayers.appendChild(btn);
  });
}

function shouldStartBullOff() {
  if (!state.gameStarted || state.players.length < 1 || state.bullOffActive) {
    return false;
  }
  return state.players.every((player) => player.totalDarts >= 39);
}

function openBullOff() {
  if (!bullOverlay) {
    return;
  }
  state.bullOffActive = true;
  state.gameStarted = false;
  bullOverlay.classList.remove("hidden");
  renderBullPlayers();
}

function resolveBullOff(winnerIndex) {
  if (!state.bullOffActive) {
    return;
  }

  const winner = state.players[winnerIndex];
  winner.legsWon += 1;

  // Bull-off winner starts a new leg flow immediately with fresh dart counters.
  state.players.forEach((player) => {
    player.totalDarts = 0;
  });
  state.totalDarts = 0;
  state.lastClosedDart = null;
  updateLegTexts();

  const nextLegStarter = (state.legStarter + 1) % state.players.length;
  state.pendingLegStarter = null;
  state.bullOffActive = false;

  if (bullOverlay) {
    bullOverlay.classList.add("hidden");
  }
  finishOverlay.classList.add("hidden");

  startNewLeg(nextLegStarter);
  renderPlayers();
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
    pointsScored: 0,
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

  const brandRadius = 346;
  const brandStart = polarToCartesian(CENTER, CENTER, brandRadius, (-128 * Math.PI) / 180);
  const brandEnd = polarToCartesian(CENTER, CENTER, brandRadius, (-52 * Math.PI) / 180);
  const brandArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
  brandArc.setAttribute("id", "boardBrandArc");
  brandArc.setAttribute(
    "d",
    `M ${brandStart.x} ${brandStart.y} A ${brandRadius} ${brandRadius} 0 0 1 ${brandEnd.x} ${brandEnd.y}`
  );
  brandArc.setAttribute("fill", "none");
  board.appendChild(brandArc);

  const brandText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  brandText.setAttribute("class", "board-brand");
  const brandTextPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
  brandTextPath.setAttribute("href", "#boardBrandArc");
  brandTextPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#boardBrandArc");
  brandTextPath.setAttribute("startOffset", "50%");
  brandTextPath.setAttribute("text-anchor", "middle");
  const brandMain = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  brandMain.textContent = BOARD_BRAND;
  const brandReg = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  brandReg.setAttribute("class", "board-brand-reg");
  brandReg.setAttribute("dx", "1");
  brandReg.setAttribute("dy", "-18");
  brandReg.textContent = "®";
  brandTextPath.appendChild(brandMain);
  brandTextPath.appendChild(brandReg);
  brandText.appendChild(brandTextPath);
  board.appendChild(brandText);

  const bottomMainRadius = 366;
  const bottomMainStart = polarToCartesian(CENTER, CENTER, bottomMainRadius, (170 * Math.PI) / 180);
  const bottomMainEnd = polarToCartesian(CENTER, CENTER, bottomMainRadius, (10 * Math.PI) / 180);
  const bottomMainArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bottomMainArc.setAttribute("id", "boardBottomMainArc");
  bottomMainArc.setAttribute(
    "d",
    `M ${bottomMainStart.x} ${bottomMainStart.y} A ${bottomMainRadius} ${bottomMainRadius} 0 0 0 ${bottomMainEnd.x} ${bottomMainEnd.y}`
  );
  bottomMainArc.setAttribute("fill", "none");
  board.appendChild(bottomMainArc);

  const bottomMainText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  bottomMainText.setAttribute("class", "board-bottom-main");
  const bottomMainPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
  bottomMainPath.setAttribute("href", "#boardBottomMainArc");
  bottomMainPath.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#boardBottomMainArc"
  );
  bottomMainPath.setAttribute("startOffset", "50%");
  bottomMainPath.setAttribute("text-anchor", "middle");
  const bladeText = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeText.textContent = "BLADE";
  const bladeBarRed = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeBarRed.setAttribute("class", "board-bottom-main-bar board-bottom-main-bar-red");
  bladeBarRed.setAttribute("dx", "0.35");
  bladeBarRed.textContent = "/";
  const bladeBarCream = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeBarCream.setAttribute("class", "board-bottom-main-bar board-bottom-main-bar-cream");
  bladeBarCream.setAttribute("dx", "-0.45");
  bladeBarCream.textContent = "/";
  const bladeBarGray = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeBarGray.setAttribute("class", "board-bottom-main-bar board-bottom-main-bar-gray");
  bladeBarGray.setAttribute("dx", "-0.45");
  bladeBarGray.textContent = "/";
  const bladeSix = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeSix.setAttribute("class", "board-bottom-main-six");
  bladeSix.setAttribute("dx", "0.45");
  bladeSix.textContent = "6";
  const bladeTm = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  bladeTm.setAttribute("class", "board-bottom-main-tm");
  bladeTm.setAttribute("dx", "0.65");
  bladeTm.setAttribute("dy", "-13");
  bladeTm.textContent = "™";
  bottomMainPath.appendChild(bladeText);
  bottomMainPath.appendChild(bladeBarRed);
  bottomMainPath.appendChild(bladeBarCream);
  bottomMainPath.appendChild(bladeBarGray);
  bottomMainPath.appendChild(bladeSix);
  bottomMainPath.appendChild(bladeTm);
  bottomMainText.appendChild(bottomMainPath);
  board.appendChild(bottomMainText);

  const bottomSubRadius = 384;
  const bottomSubStart = polarToCartesian(CENTER, CENTER, bottomSubRadius, (172 * Math.PI) / 180);
  const bottomSubEnd = polarToCartesian(CENTER, CENTER, bottomSubRadius, (8 * Math.PI) / 180);
  const bottomSubArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bottomSubArc.setAttribute("id", "boardBottomSubArc");
  bottomSubArc.setAttribute(
    "d",
    `M ${bottomSubStart.x} ${bottomSubStart.y} A ${bottomSubRadius} ${bottomSubRadius} 0 0 0 ${bottomSubEnd.x} ${bottomSubEnd.y}`
  );
  bottomSubArc.setAttribute("fill", "none");
  board.appendChild(bottomSubArc);

  const bottomSubText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  bottomSubText.setAttribute("class", "board-bottom-sub");
  const bottomSubPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
  bottomSubPath.setAttribute("href", "#boardBottomSubArc");
  bottomSubPath.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#boardBottomSubArc"
  );
  bottomSubPath.setAttribute("startOffset", "50%");
  bottomSubPath.setAttribute("text-anchor", "middle");
  bottomSubPath.textContent = BOARD_BOTTOM_SUB;
  bottomSubText.appendChild(bottomSubPath);
  board.appendChild(bottomSubText);

  // Side technology badge near 16 segment (TRIPLE CORE / CARBON style).
  const sideBadge = document.createElementNS("http://www.w3.org/2000/svg", "g");
  sideBadge.setAttribute("class", "board-side-badge");
  sideBadge.setAttribute("transform", "translate(108 570) rotate(59) scale(0.72)");

  const tripleBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  tripleBox.setAttribute("x", "0");
  tripleBox.setAttribute("y", "0");
  tripleBox.setAttribute("width", "52");
  tripleBox.setAttribute("height", "16");
  tripleBox.setAttribute("rx", "4");
  tripleBox.setAttribute("class", "board-side-badge-triple-box");

  const tripleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  tripleText.setAttribute("x", "26");
  tripleText.setAttribute("y", "11");
  tripleText.setAttribute("text-anchor", "middle");
  tripleText.setAttribute("class", "board-side-badge-triple-text");
  tripleText.textContent = "TRIPLE";

  const coreBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  coreBox.setAttribute("x", "56");
  coreBox.setAttribute("y", "0");
  coreBox.setAttribute("width", "44");
  coreBox.setAttribute("height", "16");
  coreBox.setAttribute("rx", "4");
  coreBox.setAttribute("class", "board-side-badge-core-box");

  const coreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  coreText.setAttribute("x", "78");
  coreText.setAttribute("y", "11");
  coreText.setAttribute("text-anchor", "middle");
  coreText.setAttribute("class", "board-side-badge-core-text");
  coreText.textContent = "CORE";

  const carbonText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  carbonText.setAttribute("x", "49");
  carbonText.setAttribute("y", "25");
  carbonText.setAttribute("text-anchor", "middle");
  carbonText.setAttribute("class", "board-side-badge-carbon");
  carbonText.textContent = "C A R B O N";

  sideBadge.appendChild(tripleBox);
  sideBadge.appendChild(tripleText);
  sideBadge.appendChild(coreBox);
  sideBadge.appendChild(coreText);
  sideBadge.appendChild(carbonText);
  board.appendChild(sideBadge);

  // Keep labels to render them after frame (top layer).
  const labelNodes = [];
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
    const labelPoint = polarToCartesian(CENTER, CENTER, 384, labelAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = String(value);
    text.setAttribute("x", labelPoint.x);
    text.setAttribute("y", labelPoint.y);
    text.setAttribute("class", "number-label");
    labelNodes.push(text);
  }

  // Move badge above segments so it stays visible in the green 16 zone.
  board.appendChild(sideBadge);

  // Sector wires with a slight overshoot outside the double ring.
  for (let i = 0; i < 20; i += 1) {
    const angle = startOffset + i * step;
    const innerPoint = polarToCartesian(CENTER, CENTER, RADII.tripleInner - 2, angle);
    const outerPoint = polarToCartesian(CENTER, CENTER, RADII.doubleOuter + 18, angle);
    const wire = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wire.setAttribute("x1", innerPoint.x);
    wire.setAttribute("y1", innerPoint.y);
    wire.setAttribute("x2", outerPoint.x);
    wire.setAttribute("y2", outerPoint.y);
    wire.setAttribute("class", "board-wire");
    board.appendChild(wire);
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
  frame.setAttribute("stroke", "#a7adb6");
  frame.setAttribute("stroke-opacity", "0.78");
  frame.setAttribute("stroke-width", "4");
  board.appendChild(frame);

  labelNodes.forEach((node) => board.appendChild(node));

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
    const scoredThisLeg = START_SCORE - player.score;
    const avgValue =
      player.totalDarts > 0 ? ((scoredThisLeg * 3) / player.totalDarts).toFixed(1) : "0.0";
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
    </svg> ${player.totalDarts} | <svg class="meta-prev-icon" viewBox="0 0 24 24" aria-label="${t(
      "prevTurn"
    )}">
      <path d="M20 12H8"></path>
      <path d="M12 8L8 12L12 16"></path>
    </svg> ${player.lastTurnTotal} | <svg class="meta-avg-icon" viewBox="0 0 24 24" aria-label="${t(
      "avg"
    )}">
      <circle cx="12" cy="12" r="8"></circle>
      <circle cx="12" cy="12" r="4.2"></circle>
      <circle cx="12" cy="12" r="1.7"></circle>
      <path d="M12 2v3"></path>
      <path d="M12 19v3"></path>
      <path d="M2 12h3"></path>
      <path d="M19 12h3"></path>
    </svg> ${avgValue}`;

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
  previousPlayer.pointsScored += previousPlayer.turnTotal;
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
    player.pointsScored = 0;
    player.lastTurnTotal = 0;
  });

  state.legStarter = startingPlayer;
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
  state.bullOffActive = false;
  state.pendingLegStarter = (state.legStarter + 1) % state.players.length;
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
    legStarter: state.legStarter,
    dartInTurn: state.dartInTurn,
    totalDarts: state.totalDarts,
    gameStarted: state.gameStarted,
    bullOffActive: state.bullOffActive,
    pendingLegStarter: state.pendingLegStarter,
    playerScore: player.score,
    playerTurnThrows: [...player.turnThrows],
    playerTurnTotal: player.turnTotal,
    playerTurnStartScore: player.turnStartScore,
    playerTotalDarts: player.totalDarts,
    playerPointsScored: player.pointsScored,
    playerLegsWon: player.legsWon,
    playerLastTurnTotal: player.lastTurnTotal,
    lastClosedDart: state.lastClosedDart,
    finishModalOpen: !finishOverlay.classList.contains("hidden"),
    bullModalOpen: bullOverlay ? !bullOverlay.classList.contains("hidden") : false,
  };

  state.history.push(prev);
  state.totalDarts += 1;
  player.totalDarts += 1;

  const nextScore = player.score - value;
  const isValidFinish = nextScore !== 0 || isDoubleLabel(label);
  const isDeadScore = nextScore === 1;

  if (nextScore < 0 || isDeadScore || !isValidFinish) {
    // Bust ends the turn immediately, but this app counts a full 3-dart turn.
    // Add remaining darts from the turn to player/match totals.
    const remainingDartsInTurn = Math.max(0, 2 - state.dartInTurn);
    state.totalDarts += remainingDartsInTurn;
    player.totalDarts += remainingDartsInTurn;
    player.score = player.turnStartScore;
    player.turnTotal = 0;
    nextPlayer();
    if (shouldStartBullOff()) {
      openBullOff();
    }
    renderPlayers();
    return;
  }

  player.score = nextScore;
  player.turnThrows[state.dartInTurn] = label;
  player.turnTotal += value;

  state.dartInTurn += 1;

  if (player.score === 0) {
    player.pointsScored += player.turnTotal;
    finishLeg(state.currentPlayer, state.dartInTurn);
  } else if (state.dartInTurn >= 3) {
    nextPlayer();
  }

  if (shouldStartBullOff()) {
    openBullOff();
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
  state.legStarter = snapshot.legStarter;
  state.dartInTurn = snapshot.dartInTurn;
  state.totalDarts = snapshot.totalDarts;
  state.gameStarted = snapshot.gameStarted;
  state.bullOffActive = snapshot.bullOffActive;
  state.pendingLegStarter = snapshot.pendingLegStarter;
  state.lastClosedDart = snapshot.lastClosedDart;

  const player = state.players[state.currentPlayer];
  player.score = snapshot.playerScore;
  player.turnThrows = snapshot.playerTurnThrows;
  player.turnTotal = snapshot.playerTurnTotal;
  player.turnStartScore = snapshot.playerTurnStartScore;
  player.totalDarts = snapshot.playerTotalDarts;
  player.pointsScored = snapshot.playerPointsScored;
  player.legsWon = snapshot.playerLegsWon;
  player.lastTurnTotal = snapshot.playerLastTurnTotal;

  updateLegTexts();
  if (snapshot.finishModalOpen) {
    finishOverlay.classList.remove("hidden");
  } else {
    finishOverlay.classList.add("hidden");
  }
  if (snapshot.bullModalOpen) {
    bullOverlay.classList.remove("hidden");
    renderBullPlayers();
  } else {
    bullOverlay.classList.add("hidden");
  }

  renderPlayers();
}

function resetMatch() {
  state.players.forEach((player) => {
    player.totalDarts = 0;
    player.pointsScored = 0;
    player.legsWon = 0;
    player.lastTurnTotal = 0;
  });
  state.totalDarts = 0;
  state.pendingLegStarter = null;
  state.bullOffActive = false;
  state.lastClosedDart = null;
  updateLegTexts();
  finishOverlay.classList.add("hidden");
  bullOverlay.classList.add("hidden");
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

function openSetupFromTitle() {
  finishOverlay.classList.add("hidden");
  bullOverlay.classList.add("hidden");
  setupOverlay.classList.remove("hidden");
  state.gameStarted = false;
  state.bullOffActive = false;
  document.body.classList.remove("ipad-legs-open");

  const existingNames = state.players.map((player) => player.name).filter(Boolean);
  nameFields.innerHTML = "";
  if (existingNames.length > 0) {
    existingNames.forEach((name) => addPlayerField(name));
  } else {
    addPlayerField("");
    addPlayerField("");
  }

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
    if (nameFields.children.length <= 1) {
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

  if (names.length < 1) {
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
  state.bullOffActive = false;
  state.lastClosedDart = null;
  updateLegTexts();
  finishOverlay.classList.add("hidden");
  bullOverlay.classList.add("hidden");
  renderPlayers();
}

undoBtn.addEventListener("click", undo);
newGameBtn.addEventListener("click", newGame);
languageBtn.addEventListener("click", toggleLanguage);
if (titleRow) {
  titleRow.addEventListener("click", openSetupFromTitle);
}
if (legsToggleBtn) {
  legsToggleBtn.addEventListener("click", toggleIpadLegsPanel);
}
addPlayerBtn.addEventListener("click", () => addPlayerField(""));
startGameBtn.addEventListener("click", startGameFromSetup);
nextLegBtn.addEventListener("click", startPendingLeg);
boardWrap.addEventListener("click", (event) => {
  const isBoardSegment = event.target.closest(".board-segment, .board-bull, .board-ring");
  if (!isBoardSegment) {
    applyThrow("0", 0);
  }
});

document.addEventListener("click", (event) => {
  if (!iPadMedia.matches || !document.body.classList.contains("ipad-legs-open")) {
    return;
  }
  if (!legsBox || !legsToggleBtn) {
    return;
  }
  const insidePanel = legsBox.contains(event.target);
  const insideToggle = legsToggleBtn.contains(event.target);
  if (!insidePanel && !insideToggle) {
    document.body.classList.remove("ipad-legs-open");
    syncIpadLegsPanel();
  }
});

if (typeof iPadMedia.addEventListener === "function") {
  iPadMedia.addEventListener("change", syncIpadLegsPanel);
} else if (typeof iPadMedia.addListener === "function") {
  iPadMedia.addListener(syncIpadLegsPanel);
}
if (typeof mobileMedia.addEventListener === "function") {
  mobileMedia.addEventListener("change", () => {
    applyMobileLayout();
  });
} else if (typeof mobileMedia.addListener === "function") {
  mobileMedia.addListener(() => {
    applyMobileLayout();
  });
}

drawBoard();
applyLanguage();
addPlayerField("");
addPlayerField("");
updateLegTexts();
renderPlayers();
syncIpadLegsPanel();
applyMobileLayout();
