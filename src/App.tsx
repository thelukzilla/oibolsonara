import React, { useEffect, useRef, useState } from "react";

const messages = [
  "Não",
  "tem certeza?",
  "pensa com carinho",
  "quase clicou",
  "opa, escapei",
  "melhor apertar sim",
];

export default function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonAreaRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  
  // Confetti vars
  const confettiRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>(0);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const moveNoButton = () => {
    if (!buttonAreaRef.current || !noButtonRef.current) return;

    const areaRect = buttonAreaRef.current.getBoundingClientRect();
    const buttonRect = noButtonRef.current.getBoundingClientRect();
    const maxLeft = Math.max(areaRect.width - buttonRect.width, 0);
    const maxTop = Math.max(areaRect.height - buttonRect.height, 0);
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;

    setRunCount((prev) => prev + 1);

    noButtonRef.current.classList.add("is-running");
    noButtonRef.current.style.left = `${left}px`;
    noButtonRef.current.style.top = `${top}px`;
  };

  const handlePointerEnter = () => moveNoButton();
  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    event.preventDefault();
    moveNoButton();
  };
  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    moveNoButton();
  };

  const drawConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiRef.current.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate((piece.rotation * Math.PI) / 180);
      context.fillStyle = piece.color;
      context.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 0.62
      );
      context.restore();
    });

    confettiRef.current = confettiRef.current.filter(
      (piece) => piece.y < window.innerHeight + 40
    );

    if (confettiRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(drawConfetti);
    } else {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  const makeConfetti = () => {
    const colors = ["#e94d6a", "#7ed6bf", "#83c5ff", "#f7c948", "#ffffff"];

    confettiRef.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * window.innerHeight * 0.55,
      size: 7 + Math.random() * 9,
      speed: 2.5 + Math.random() * 4,
      drift: -1.8 + Math.random() * 3.6,
      rotation: Math.random() * 360,
      spin: -8 + Math.random() * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  };

  const celebrate = () => {
    setIsAccepted(true);
    cancelAnimationFrame(animationFrameRef.current);
    makeConfetti();
    drawConfetti();
  };

  const resetQuestion = () => {
    setIsAccepted(false);
    setRunCount(0);
    if (noButtonRef.current) {
      noButtonRef.current.removeAttribute("style");
      noButtonRef.current.classList.remove("is-running");
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  const yesScale = Math.min(1 + runCount * 0.08, 1.56).toFixed(2);
  const currentNoMessage = messages[runCount % messages.length];

  return (
    <>
      <main className="date-card" aria-live="polite">
        {!isAccepted ? (
          <section className="question-panel" id="questionPanel">
            <div className="tiny-note">pergunta importante</div>
            <h1>Você aceita pré-namorar comigo?</h1>
            <p>
              Prometo que vamos ficar ricos com T.I. e viver em uma casa no campo com 3 filhos e vários animais.
            </p>
            <p
              style={{
                color: "var(--rose-dark)",
                fontWeight: 800,
                fontSize: "0.95rem",
                marginTop: "1.5rem",
                letterSpacing: "0.05em"
              }}
            >
              (para sair do pré você sabe o que tem que liberar para oficializar)
            </p>

            <div className="button-area" id="buttonArea" ref={buttonAreaRef}>
              <button
                className="yes-button"
                id="yesButton"
                type="button"
                onClick={celebrate}
                style={{ "--yes-scale": yesScale } as React.CSSProperties}
              >
                Sim
              </button>
              <button
                ref={noButtonRef}
                className="no-button"
                id="noButton"
                type="button"
                onPointerEnter={handlePointerEnter}
                onPointerDown={handlePointerDown}
                onTouchStart={handleTouchStart}
              >
                {currentNoMessage}
              </button>
            </div>
          </section>
        ) : (
          <section className="answer-panel" id="answerPanel">
            <div className="ticket" aria-hidden="true">
              <span className="ticket-line"></span>
              <span className="ticket-heart">♥</span>
              <span className="ticket-line"></span>
            </div>
            <h2>Contrato de pré-namoro assinado com sucesso!</h2>
            <p>
              Agora é só aguardar a liberação para o deploy oficial do nosso romance. Já vou começar a pesquisar os filhotes de animais pra nossa casa no campo! Manda o print confirmando ❤️
            </p>
            <button
              className="reset-button"
              id="resetButton"
              type="button"
              onClick={resetQuestion}
            >
              Ver de novo
            </button>
          </section>
        )}
      </main>
      <canvas
        ref={canvasRef}
        className="confetti-canvas"
        id="confettiCanvas"
        aria-hidden="true"
      ></canvas>
    </>
  );
}
