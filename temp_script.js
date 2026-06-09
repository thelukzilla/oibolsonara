const noButton = document.querySelector("#noButton");
const yesButton = document.querySelector("#yesButton");
const resetButton = document.querySelector("#resetButton");
const buttonArea = document.querySelector("#buttonArea");
const questionPanel = document.querySelector("#questionPanel");
const answerPanel = document.querySelector("#answerPanel");
const canvas = document.querySelector("#confettiCanvas");
const context = canvas.getContext("2d");

let runCount = 0;
let confetti = [];
let animationFrame = 0;

const messages = [
  "Não",
  "tem certeza?",
  "pensa com carinho",
  "quase clicou",
  "opa, escapei",
  "melhor apertar sim",
];

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const maxLeft = Math.max(areaRect.width - buttonRect.width, 0);
  const maxTop = Math.max(areaRect.height - buttonRect.height, 0);
  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;

  runCount += 1;
  noButton.classList.add("is-running");
  noButton.style.left = `${left}px`;
  noButton.style.top = `${top}px`;
  noButton.textContent = messages[runCount % messages.length];
  growYesButton();
}

function growYesButton() {
  const scale = Math.min(1 + runCount * 0.08, 1.56);

  yesButton.style.setProperty("--yes-scale", scale.toFixed(2));
}

function makeConfetti() {
  const colors = ["#e94d6a", "#7ed6bf", "#83c5ff", "#f7c948", "#ffffff"];

  confetti = Array.from({ length: 160 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -30 - Math.random() * window.innerHeight * 0.55,
    size: 7 + Math.random() * 9,
    speed: 2.5 + Math.random() * 4,
    drift: -1.8 + Math.random() * 3.6,
    rotation: Math.random() * 360,
    spin: -8 + Math.random() * 16,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function drawConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate((piece.rotation * Math.PI) / 180);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    context.restore();
  });

  confetti = confetti.filter((piece) => piece.y < window.innerHeight + 40);

  if (confetti.length > 0) {
    animationFrame = requestAnimationFrame(drawConfetti);
  } else {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function celebrate() {
  questionPanel.hidden = true;
  answerPanel.hidden = false;
  cancelAnimationFrame(animationFrame);
  makeConfetti();
  drawConfetti();
}

function resetQuestion() {
  answerPanel.hidden = true;
  questionPanel.hidden = false;
  runCount = 0;
  noButton.textContent = "Não";
  noButton.removeAttribute("style");
  noButton.classList.remove("is-running");
  yesButton.style.removeProperty("--yes-scale");
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") {
    return;
  }

  event.preventDefault();
  moveNoButton();
});
noButton.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    moveNoButton();
  },
  { passive: false },
);

yesButton.addEventListener("click", celebrate);
resetButton.addEventListener("click", resetQuestion);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
