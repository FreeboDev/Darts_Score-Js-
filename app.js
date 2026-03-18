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
const start301Btn = document.getElementById("start301Btn");
const start501Btn = document.getElementById("start501Btn");
const boardWrap = document.getElementById("boardWrap");
const checkoutHint = document.getElementById("checkoutHint");
const legResult = document.getElementById("legResult");
const quickOutBtn = document.getElementById("quickOutBtn");
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
const desktopLegsToggle = document.getElementById("desktopLegsToggle");
const titleRow = document.querySelector(".title-row");
const titleLabel = document.getElementById("titleLabel");
const legsTitle = document.getElementById("legsTitle");
const setupTitle = document.getElementById("setupTitle");
const setupBrandLabel = document.getElementById("setupBrandLabel");
const setupSubtitle = document.getElementById("setupSubtitle");
const finishTitle = document.getElementById("finishTitle");
const bullLimitLabel = document.getElementById("bullLimitLabel");
const bullLimitInput = document.getElementById("bullLimitInput");
const bullLimitIncBtn = document.getElementById("bullLimitIncBtn");
const bullLimitDecBtn = document.getElementById("bullLimitDecBtn");
const setsToWinLabel = document.getElementById("setsToWinLabel");
const setsToWinInput = document.getElementById("setsToWinInput");
const setsIncBtn = document.getElementById("setsIncBtn");
const setsDecBtn = document.getElementById("setsDecBtn");

const ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const DEFAULT_START_SCORE = 301;
const DEFAULT_BULL_OFF_DARTS = 39;
const DEFAULT_SETS_TO_WIN = 1;
const LEGS_PER_SET = 3;
const BOARD_BRAND = "winmau";
const BOARD_BOTTOM_MAIN = "BLADE 6";
const BOARD_BOTTOM_SUB = "SIXTH GENERATION BLADE TECHNOLOGY";
const TAU = Math.PI * 2;
const CENTER = 420;
const IPAD_QUERY = "(min-width: 768px) and (max-width: 1180px)";
const iPadMedia = window.matchMedia(IPAD_QUERY);
const DESKTOP_QUERY = "(min-width: 1181px)";
const desktopMedia = window.matchMedia(DESKTOP_QUERY);
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
  matchFinished: false,
  lastClosedDart: null,
  language: localStorage.getItem("darts_lang") || "en",
  startScore: Number(localStorage.getItem("darts_start_score")) === 501 ? 501 : DEFAULT_START_SCORE,
  bullOffDarts: (() => {
    const value = Number(localStorage.getItem("darts_bull_off_darts"));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_BULL_OFF_DARTS;
  })(),
  setsToWin: (() => {
    const value = Number(localStorage.getItem("darts_sets_to_win"));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_SETS_TO_WIN;
  })(),
  quickOutInProgress: false,
  pendingOutClearTimer: null,
};

const I18N = {
  uk: {
    appTitle: "Darts Score",
    undo: "Скасувати",
    newGame: "Нова гра",
    legsTitle: "Рахунок по партіях",
    setsToWinLabel: "Сет",
    setupTitle: "Початок гри",
    setupSubtitle: "Додайте гравців і запустіть матч 301.",
    addPlayer: "+ Додати гравця",
    removePlayer: "Видалити",
    startGame: "Почати гру",
    finishTitle: "Партію закрито",
    nextLeg: "Наступна партія",
    bullTitle: "BULL",
    bullText: "Усі кинули {limit} дротиків. Хто ближче до центру?",
    bullLimitLabel: "Ліміт",
    prevTurn: "Попер. хід",
    checkoutPrefix: "Закриття",
    legClosed: "Партію закрито",
    minPlayers: "Потрібен мінімум 1 гравець",
    namePlaceholder: "Впишіть ім'я",
    scoreBtn: "Рахунок",
    avg: "Середнє",
    quickOut: "3x Аут",
    setsShort: "Сети",
    legsShort: "Леги",
    nextMatch: "Новий матч",
    setWon: "{name} виграв сет ({setsWon}/{setsTarget})",
    matchWon: "{name} виграв матч ({setsWon}/{setsTarget})",
  },
  en: {
    appTitle: "Darts Score",
    undo: "Undo",
    newGame: "New game",
    legsTitle: "Leg score",
    setsToWinLabel: "Set",
    setupTitle: "Start game",
    setupSubtitle: "Add players and start the 301 match.",
    addPlayer: "+ Add player",
    removePlayer: "Remove",
    startGame: "Start game",
    finishTitle: "Leg closed",
    nextLeg: "Next leg",
    bullTitle: "BULL",
    bullText: "Everyone reached {limit} darts. Who is closer to the bull?",
    bullLimitLabel: "Limit",
    prevTurn: "Prev. turn",
    checkoutPrefix: "Checkout",
    legClosed: "Leg closed",
    minPlayers: "At least 1 player is required",
    namePlaceholder: "Enter name",
    scoreBtn: "Score",
    avg: "Average",
    quickOut: "3x Out",
    setsShort: "Sets",
    legsShort: "Legs",
    nextMatch: "New match",
    setWon: "{name} won the set ({setsWon}/{setsTarget})",
    matchWon: "{name} won the match ({setsWon}/{setsTarget})",
  },
};

function t(key) {
  return I18N[state.language][key];
}

function withVars(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

function updateSetupSubtitle() {
  setupSubtitle.textContent =
    state.language === "uk"
      ? `Додайте гравців і запустіть матч ${state.startScore}.`
      : `Add players and start the ${state.startScore} match.`;
}

function renderStartScoreToggle() {
  if (!start301Btn || !start501Btn) {
    return;
  }
  const is301 = state.startScore === 301;
  start301Btn.classList.toggle("active", is301);
  start501Btn.classList.toggle("active", !is301);
  start301Btn.setAttribute("aria-pressed", String(is301));
  start501Btn.setAttribute("aria-pressed", String(!is301));
}

function setStartScore(score) {
  state.startScore = score === 501 ? 501 : 301;
  localStorage.setItem("darts_start_score", String(state.startScore));
  updateSetupSubtitle();
  renderStartScoreToggle();
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
  updateSetupSubtitle();
  addPlayerBtn.textContent = t("addPlayer");
  startGameBtn.textContent = t("startGame");
  finishTitle.textContent = t("finishTitle");
  nextLegBtn.textContent = state.matchFinished ? t("nextMatch") : t("nextLeg");
  if (bullTitle) {
    bullTitle.setAttribute("aria-label", t("bullTitle"));
  }
  if (bullTitleText) {
    bullTitleText.textContent = t("bullTitle");
  }
  bullText.textContent = withVars(t("bullText"), { limit: state.bullOffDarts });
  if (bullLimitLabel) {
    bullLimitLabel.innerHTML = `${t("bullLimitLabel")} <svg class="bull-limit-label-flag" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 20V4"></path>
      <path d="M6 5h11l-2 3 2 3H6"></path>
    </svg>`;
  }
  if (setsToWinLabel) {
    setsToWinLabel.innerHTML = `${t("setsToWinLabel")} <svg class="sets-limit-label-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5h8v3a4 4 0 0 1-8 0z"></path>
      <path d="M8 6H6a2 2 0 0 0 2 3"></path>
      <path d="M16 6h2a2 2 0 0 1-2 3"></path>
      <path d="M10 13h4"></path>
      <path d="M12 13v4"></path>
      <path d="M9 19h6"></path>
    </svg>`;
  }
  if (quickOutBtn) {
    quickOutBtn.textContent = t("quickOut");
  }
  languageBtn.textContent = state.language === "uk" ? "🌐 UA" : "🌐 EN";
  [...nameFields.querySelectorAll(".name-input")].forEach((input) => {
    input.placeholder = t("namePlaceholder");
  });
  [...nameFields.querySelectorAll(".remove-btn")].forEach((btn) => {
    btn.textContent = t("removePlayer");
  });
  renderStartScoreToggle();
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

function syncDesktopLegsPanel() {
  if (!desktopMedia.matches) {
    document.body.classList.remove("desktop-legs-open");
  }
}

function toggleDesktopLegsPanel() {
  if (!desktopMedia.matches) {
    return;
  }
  document.body.classList.toggle("desktop-legs-open");
}

function syncMobileLegsPanel() {
  if (!mobileMedia.matches) {
    document.body.classList.remove("mobile-legs-open");
  }
}

function toggleMobileLegsPanel() {
  if (!mobileMedia.matches) {
    return;
  }
  document.body.classList.toggle("mobile-legs-open");
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
  return state.players.every((player) => player.totalDarts >= state.bullOffDarts);
}

function setBullOffDartsLimit(value) {
  const numeric = Number(value);
  const normalized = Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : DEFAULT_BULL_OFF_DARTS;
  state.bullOffDarts = normalized;
  localStorage.setItem("darts_bull_off_darts", String(normalized));
  if (bullLimitInput && Number(bullLimitInput.value) !== normalized) {
    bullLimitInput.value = String(normalized);
  }
  bullText.textContent = withVars(t("bullText"), { limit: state.bullOffDarts });
}

function setSetsToWin(value) {
  const numeric = Number(value);
  const normalized = Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : DEFAULT_SETS_TO_WIN;
  state.setsToWin = normalized;
  localStorage.setItem("darts_sets_to_win", String(normalized));
  if (setsToWinInput && Number(setsToWinInput.value) !== normalized) {
    setsToWinInput.value = String(normalized);
  }
  renderLegsScore();
}

function changeBullOffDartsLimit(delta) {
  const base = Number.isFinite(Number(bullLimitInput?.value)) ? Number(bullLimitInput.value) : state.bullOffDarts;
  const next = Math.max(1, Math.floor(base + delta));
  setBullOffDartsLimit(next);
}

function changeSetsToWin(delta) {
  const base = Number.isFinite(Number(setsToWinInput?.value)) ? Number(setsToWinInput.value) : state.setsToWin;
  const next = Math.max(1, Math.floor(base + delta));
  setSetsToWin(next);
}

function registerLegWinner(winnerIndex) {
  const winner = state.players[winnerIndex];
  winner.legsInSet += 1;

  let setWon = false;
  let matchWon = false;

  if (winner.legsInSet >= LEGS_PER_SET) {
    setWon = true;
    winner.setWins += 1;
    state.players.forEach((player) => {
      player.legsInSet = 0;
    });
    if (winner.setWins >= state.setsToWin) {
      matchWon = true;
    }
  }

  return { winner, setWon, matchWon };
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

  const { winner, setWon, matchWon } = registerLegWinner(winnerIndex);

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
  state.matchFinished = matchWon;

  if (bullOverlay) {
    bullOverlay.classList.add("hidden");
  }
  if (matchWon) {
    finishText.textContent = withVars(t("matchWon"), {
      name: winner.name,
      setsWon: winner.setWins,
      setsTarget: state.setsToWin,
    });
    nextLegBtn.textContent = t("nextMatch");
    finishOverlay.classList.remove("hidden");
    renderPlayers();
    return;
  }

  if (setWon) {
    finishText.textContent = withVars(t("setWon"), {
      name: winner.name,
      setsWon: winner.setWins,
      setsTarget: state.setsToWin,
    });
    nextLegBtn.textContent = t("nextLeg");
    finishOverlay.classList.remove("hidden");
    state.pendingLegStarter = nextLegStarter;
    renderPlayers();
    return;
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
    score: state.startScore,
    turnThrows: ["", "", ""],
    turnTotal: 0,
    turnStartScore: state.startScore,
    totalDarts: 0,
    pointsScored: 0,
    legsInSet: 0,
    setWins: 0,
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
    score.textContent = `${t("setsShort")} ${player.setWins}/${state.setsToWin} | ${t("legsShort")} ${player.legsInSet}/${LEGS_PER_SET}`;

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
    const scoredThisLeg = state.startScore - player.score;
    const avgValue =
      player.totalDarts > 0 ? ((scoredThisLeg * 3) / player.totalDarts).toFixed(1) : "0.0";
    const bullLimitValue = String(state.bullOffDarts);
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
    </svg> ${avgValue} | <svg class="meta-limit-icon" viewBox="0 0 24 24" aria-label="Bull-off limit">
      <path d="M6 20V4"></path>
      <path d="M6 5h11l-2 3 2 3H6"></path>
    </svg> <span class="meta-limit-value">${bullLimitValue}</span>`;

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

    player.turnThrows.forEach((item, throwIndex) => {
      const box = document.createElement("div");
      box.className = "throw-box";
      box.textContent = item;
      const shouldAnimateOut =
        item === "0" &&
        state.gameStarted &&
        index === state.currentPlayer &&
        state.dartInTurn > 0 &&
        throwIndex === state.dartInTurn - 1;
      if (shouldAnimateOut) {
        box.classList.add("throw-box-out");
      }
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
  const canUseQuickOut = (() => {
    if (!quickOutBtn || !state.gameStarted || state.players.length === 0) {
      return false;
    }
    const player = state.players[state.currentPlayer];
    return canCloseInOneDart(player.score);
  })();
  if (quickOutBtn) {
    quickOutBtn.classList.toggle("hidden", !canUseQuickOut);
    quickOutBtn.disabled = !canUseQuickOut || state.quickOutInProgress;
  }
  renderLegsScore();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function animateBustAsOuts(player) {
  state.quickOutInProgress = true;
  renderPlayers();

  const startIndex = state.dartInTurn;
  for (let index = startIndex; index < 3; index += 1) {
    player.turnThrows[index] = "0";
    renderPlayers();
    if (index < 2) {
      await delay(320);
    }
  }

  state.quickOutInProgress = false;
  player.turnTotal = 0;
  player.score = player.turnStartScore;
  state.dartInTurn = 3;
  nextPlayer();
}

async function applyQuickOut() {
  if (!state.gameStarted || state.players.length === 0 || state.quickOutInProgress) {
    return;
  }

  state.quickOutInProgress = true;
  renderPlayers();
  const remaining = 3 - state.dartInTurn;
  try {
    for (let i = 0; i < remaining; i += 1) {
      applyThrow("0", 0);
      if (i < remaining - 1 && state.gameStarted) {
        // Small delay so each OUT is clearly visible in the throw boxes.
        await delay(320);
      }
    }
  } finally {
    state.quickOutInProgress = false;
    renderPlayers();
  }
}

function nextPlayer() {
  const previousPlayer = state.players[state.currentPlayer];
  previousPlayer.pointsScored += previousPlayer.turnTotal;
  previousPlayer.lastTurnTotal = previousPlayer.turnTotal;
  previousPlayer.turnTotal = 0;
  const endedOnThirdDart = state.dartInTurn >= 3;
  const lastThrowLabel = endedOnThirdDart ? previousPlayer.turnThrows[state.dartInTurn - 1] : "";
  const endedOnManualOut = lastThrowLabel === "0";
  if (state.pendingOutClearTimer) {
    clearTimeout(state.pendingOutClearTimer);
    state.pendingOutClearTimer = null;
  }
  if (state.quickOutInProgress || endedOnManualOut || endedOnThirdDart) {
    const clearDelay = state.quickOutInProgress || endedOnManualOut ? 520 : 280;
    state.pendingOutClearTimer = window.setTimeout(() => {
      previousPlayer.turnThrows = ["", "", ""];
      state.pendingOutClearTimer = null;
      renderPlayers();
    }, clearDelay);
  } else {
    previousPlayer.turnThrows = ["", "", ""];
  }
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

function canCloseInOneDart(score) {
  return score > 0 && score <= 50;
}

function getCheckoutHint() {
  if (!state.gameStarted || state.players.length === 0 || state.quickOutInProgress) {
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
  if (state.pendingOutClearTimer) {
    clearTimeout(state.pendingOutClearTimer);
    state.pendingOutClearTimer = null;
  }
  state.players.forEach((player) => {
    player.score = state.startScore;
    player.turnThrows = ["", "", ""];
    player.turnTotal = 0;
    player.turnStartScore = state.startScore;
    player.totalDarts = 0;
    player.pointsScored = 0;
    player.lastTurnTotal = 0;
  });

  state.totalDarts = 0;
  state.legStarter = startingPlayer;
  state.currentPlayer = startingPlayer;
  state.dartInTurn = 0;
  state.history = [];
  state.gameStarted = true;
  state.matchFinished = false;
}

function finishLeg(winnerIndex, dartNumber) {
  const { winner, setWon, matchWon } = registerLegWinner(winnerIndex);
  state.lastClosedDart = dartNumber;
  updateLegTexts();
  state.gameStarted = false;
  state.bullOffActive = false;
  state.matchFinished = matchWon;
  state.pendingLegStarter = matchWon ? null : (state.legStarter + 1) % state.players.length;
  if (matchWon) {
    finishText.textContent = withVars(t("matchWon"), {
      name: winner.name,
      setsWon: winner.setWins,
      setsTarget: state.setsToWin,
    });
    nextLegBtn.textContent = t("nextMatch");
  } else if (setWon) {
    finishText.textContent = withVars(t("setWon"), {
      name: winner.name,
      setsWon: winner.setWins,
      setsTarget: state.setsToWin,
    });
    nextLegBtn.textContent = t("nextLeg");
  } else {
    finishText.textContent = `${t("legClosed")}: ${dartNumber}`;
    nextLegBtn.textContent = t("nextLeg");
  }
  finishOverlay.classList.remove("hidden");
}

function applyThrow(label, value) {
  if (!state.gameStarted || state.players.length === 0 || state.quickOutInProgress) {
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
    matchFinished: state.matchFinished,
    bullOffActive: state.bullOffActive,
    pendingLegStarter: state.pendingLegStarter,
    allPlayersSetState: state.players.map((item) => ({
      setWins: item.setWins,
      legsInSet: item.legsInSet,
    })),
    playerScore: player.score,
    playerTurnThrows: [...player.turnThrows],
    playerTurnTotal: player.turnTotal,
    playerTurnStartScore: player.turnStartScore,
    playerTotalDarts: player.totalDarts,
    playerPointsScored: player.pointsScored,
    playerSetWins: player.setWins,
    playerLegsInSet: player.legsInSet,
    playerLastTurnTotal: player.lastTurnTotal,
    lastClosedDart: state.lastClosedDart,
    finishTextContent: finishText.textContent,
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
    animateBustAsOuts(player).then(() => {
      if (shouldStartBullOff()) {
        openBullOff();
      }
      renderPlayers();
    });
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
  if (state.pendingOutClearTimer) {
    clearTimeout(state.pendingOutClearTimer);
    state.pendingOutClearTimer = null;
  }
  const snapshot = state.history.pop();
  if (!snapshot) {
    return;
  }

  state.currentPlayer = snapshot.currentPlayer;
  state.legStarter = snapshot.legStarter;
  state.dartInTurn = snapshot.dartInTurn;
  state.totalDarts = snapshot.totalDarts;
  state.gameStarted = snapshot.gameStarted;
  state.matchFinished = snapshot.matchFinished;
  state.bullOffActive = snapshot.bullOffActive;
  state.pendingLegStarter = snapshot.pendingLegStarter;
  state.lastClosedDart = snapshot.lastClosedDart;
  if (snapshot.allPlayersSetState) {
    state.players.forEach((item, idx) => {
      const snap = snapshot.allPlayersSetState[idx];
      if (!snap) {
        return;
      }
      item.setWins = snap.setWins;
      item.legsInSet = snap.legsInSet;
    });
  }

  const player = state.players[state.currentPlayer];
  player.score = snapshot.playerScore;
  player.turnThrows = snapshot.playerTurnThrows;
  player.turnTotal = snapshot.playerTurnTotal;
  player.turnStartScore = snapshot.playerTurnStartScore;
  player.totalDarts = snapshot.playerTotalDarts;
  player.pointsScored = snapshot.playerPointsScored;
  player.setWins = snapshot.playerSetWins;
  player.legsInSet = snapshot.playerLegsInSet;
  player.lastTurnTotal = snapshot.playerLastTurnTotal;

  updateLegTexts();
  if (snapshot.finishModalOpen) {
    finishOverlay.classList.remove("hidden");
  } else {
    finishOverlay.classList.add("hidden");
  }
  if (typeof snapshot.finishTextContent === "string") {
    finishText.textContent = snapshot.finishTextContent;
  }
  nextLegBtn.textContent = state.matchFinished ? t("nextMatch") : t("nextLeg");
  if (snapshot.bullModalOpen) {
    bullOverlay.classList.remove("hidden");
    renderBullPlayers();
  } else {
    bullOverlay.classList.add("hidden");
  }

  renderPlayers();
}

function resetMatch() {
  if (state.pendingOutClearTimer) {
    clearTimeout(state.pendingOutClearTimer);
    state.pendingOutClearTimer = null;
  }
  state.players.forEach((player) => {
    player.totalDarts = 0;
    player.pointsScored = 0;
    player.setWins = 0;
    player.legsInSet = 0;
    player.lastTurnTotal = 0;
  });
  state.totalDarts = 0;
  state.pendingLegStarter = null;
  state.matchFinished = false;
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
  state.matchFinished = false;
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

function updateOrderButtons() {
  const rows = [...nameFields.querySelectorAll(".name-row")];
  rows.forEach((row, index) => {
    const swapBtn = row.querySelector(".order-btn");
    if (swapBtn) {
      swapBtn.disabled = rows.length < 2 || index !== 0;
      swapBtn.style.visibility = index === 0 ? "visible" : "hidden";
    }
  });
}

function addPlayerField(value = "") {
  const row = document.createElement("div");
  row.className = "name-row";

  const input = document.createElement("input");
  input.className = "name-input";
  input.type = "text";
  input.placeholder = t("namePlaceholder");
  input.value = value;

  const orderControls = document.createElement("div");
  orderControls.className = "order-controls";

  const swapBtn = document.createElement("button");
  swapBtn.type = "button";
  swapBtn.className = "order-btn order-swap-btn";
  swapBtn.setAttribute("aria-label", "Swap player order");
  swapBtn.textContent = "";
  orderControls.appendChild(swapBtn);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = t("removePlayer");
  removeBtn.addEventListener("click", () => {
    if (nameFields.children.length <= 1) {
      return;
    }
    row.remove();
    updateOrderButtons();
  });

  swapBtn.addEventListener("click", () => {
    const rows = [...nameFields.querySelectorAll(".name-row")];
    if (rows.length < 2) {
      return;
    }
    if (rows.length === 2) {
      const first = rows[0];
      const second = rows[1];
      nameFields.insertBefore(second, first);
      updateOrderButtons();
      return;
    }
    const second = rows[1];
    if (second) {
      nameFields.insertBefore(second, rows[0]);
      updateOrderButtons();
    }
  });

  row.appendChild(input);
  row.appendChild(orderControls);
  row.appendChild(removeBtn);
  nameFields.appendChild(row);
  updateOrderButtons();
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
  if (state.matchFinished) {
    finishOverlay.classList.add("hidden");
    bullOverlay.classList.add("hidden");
    resetMatch();
    renderPlayers();
    return;
  }
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
if (desktopLegsToggle) {
  desktopLegsToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (desktopMedia.matches) {
      toggleDesktopLegsPanel();
      return;
    }
    if (mobileMedia.matches) {
      toggleMobileLegsPanel();
    }
  });
}
if (start301Btn) {
  start301Btn.addEventListener("click", () => setStartScore(301));
}
if (start501Btn) {
  start501Btn.addEventListener("click", () => setStartScore(501));
}
if (bullLimitInput) {
  bullLimitInput.addEventListener("change", () => setBullOffDartsLimit(bullLimitInput.value));
  bullLimitInput.addEventListener("blur", () => setBullOffDartsLimit(bullLimitInput.value));
}
if (setsToWinInput) {
  setsToWinInput.addEventListener("change", () => setSetsToWin(setsToWinInput.value));
  setsToWinInput.addEventListener("blur", () => setSetsToWin(setsToWinInput.value));
}
if (bullLimitIncBtn) {
  bullLimitIncBtn.addEventListener("click", () => changeBullOffDartsLimit(1));
}
if (bullLimitDecBtn) {
  bullLimitDecBtn.addEventListener("click", () => changeBullOffDartsLimit(-1));
}
if (setsIncBtn) {
  setsIncBtn.addEventListener("click", () => changeSetsToWin(1));
}
if (setsDecBtn) {
  setsDecBtn.addEventListener("click", () => changeSetsToWin(-1));
}
if (quickOutBtn) {
  quickOutBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    applyQuickOut();
  });
}
if (legsToggleBtn) {
  legsToggleBtn.addEventListener("click", toggleIpadLegsPanel);
}
addPlayerBtn.addEventListener("click", () => addPlayerField(""));
startGameBtn.addEventListener("click", startGameFromSetup);
nextLegBtn.addEventListener("click", startPendingLeg);
boardWrap.addEventListener("click", (event) => {
  if (event.target.closest("#quickOutBtn")) {
    return;
  }
  const isBoardSegment = event.target.closest(".board-segment, .board-bull, .board-ring");
  if (!isBoardSegment) {
    applyThrow("0", 0);
  }
});

document.addEventListener("click", (event) => {
  if (desktopMedia.matches && document.body.classList.contains("desktop-legs-open")) {
    const inLegs = legsBox && legsBox.contains(event.target);
    const inDesktopToggle = desktopLegsToggle && desktopLegsToggle.contains(event.target);
    if (!inLegs && !inDesktopToggle) {
      document.body.classList.remove("desktop-legs-open");
    }
  }

  if (mobileMedia.matches && document.body.classList.contains("mobile-legs-open")) {
    const inLegs = legsBox && legsBox.contains(event.target);
    const inMobileToggle = desktopLegsToggle && desktopLegsToggle.contains(event.target);
    if (!inLegs && !inMobileToggle) {
      document.body.classList.remove("mobile-legs-open");
    }
  }

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
if (typeof desktopMedia.addEventListener === "function") {
  desktopMedia.addEventListener("change", syncDesktopLegsPanel);
} else if (typeof desktopMedia.addListener === "function") {
  desktopMedia.addListener(syncDesktopLegsPanel);
}
if (typeof mobileMedia.addEventListener === "function") {
  mobileMedia.addEventListener("change", () => {
    applyMobileLayout();
    syncMobileLegsPanel();
  });
} else if (typeof mobileMedia.addListener === "function") {
  mobileMedia.addListener(() => {
    applyMobileLayout();
    syncMobileLegsPanel();
  });
}

drawBoard();
applyLanguage();
setBullOffDartsLimit(state.bullOffDarts);
setSetsToWin(state.setsToWin);
addPlayerField("");
addPlayerField("");
updateLegTexts();
renderPlayers();
syncIpadLegsPanel();
syncDesktopLegsPanel();
syncMobileLegsPanel();
applyMobileLayout();
