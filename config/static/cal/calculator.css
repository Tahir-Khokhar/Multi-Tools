let snake, food, direction, nextDirection, score, cellSize, gameInterval, baseSpeed;
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let shakeAmount = 0;
let popTexts = [];
let paused = false;
let audioCtx = null;

function initSnake() {
    cellSize = 20;
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    score = 0;
    particles = [];
    popTexts = [];
    shakeAmount = 0;
    updateScoreDisplay();
    placeFood();
}

function updateScoreDisplay() {
    document.getElementById('snake-score').textContent = score;
    const speedEl = document.getElementById('snake-speed');
    if (speedEl) {
        const level = Math.floor(score / 10) + 1;
        speedEl.textContent = level + 'x';
    }
}

function getSpeed() {
    return Math.max(60, 140 - score * 3);
}

function placeFood() {
    const maxX = Math.floor(canvas.width / cellSize);
    const maxY = Math.floor(canvas.height / cellSize);
    let pos;
    let attempts = 0;
    do {
        pos = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
        attempts++;
    } while (snake.some(s => s.x === pos.x && s.y === pos.y) && attempts < 500);
    food = pos;
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x * cellSize + cellSize / 2,
            y: y * cellSize + cellSize / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

function createPopText(x, y, text) {
    popTexts.push({
        x: x * cellSize + cellSize / 2,
        y: y * cellSize,
        text: text,
        life: 1,
        dy: -1.5
    });
}

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        p.size *= 0.95;
        return p.life > 0;
    });
    popTexts = popTexts.filter(p => {
        p.y += p.dy;
        p.life -= 0.02;
        return p.life > 0;
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    popTexts.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
    });
    ctx.globalAlpha = 1;
}

function draw() {
    if (shakeAmount > 0) {
        const dx = (Math.random() - 0.5) * shakeAmount;
        const dy = (Math.random() - 0.5) * shakeAmount;
        ctx.save();
        ctx.translate(dx, dy);
        shakeAmount *= 0.9;
        if (shakeAmount < 0.5) shakeAmount = 0;
    }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 20;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    const hue = (Date.now() / 20) % 360;
    snake.forEach((seg, i) => {
        const alpha = 1 - (i / snake.length) * 0.6;
        const segHue = (hue + i * 8) % 360;
        ctx.fillStyle = `hsla(${segHue}, 70%, 55%, ${alpha})`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        const r = 4;
        const x = seg.x * cellSize;
        const y = seg.y * cellSize;
        const w = cellSize - 2;
        const h = cellSize - 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    });
    ctx.shadowBlur = 0;

    if (food) {
        const pulse = 1 + Math.sin(Date.now() / 150) * 0.15;
        const fx = food.x * cellSize + cellSize / 2;
        const fy = food.y * cellSize + cellSize / 2;
        const fSize = (cellSize / 2 - 2) * pulse;

        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(fx - 2, fy - 2, fSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawParticles();

    if (shakeAmount > 0) {
        ctx.restore();
    }
}

function moveSnake() {
    direction = {...nextDirection};
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const maxX = Math.floor(canvas.width / cellSize);
    const maxY = Math.floor(canvas.height / cellSize);

    const willCollide = head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY ||
        snake.some((s, i) => i < snake.length - 1 && s.x === head.x && s.y === head.y);

    if (willCollide) {
        shakeAmount = 15;
        createParticles(snake[0].x, snake[0].y, '#ef4444', 20);
        createPopText(snake[0].x, snake[0].y, 'GAME OVER');
        playBeep(150, 0.3, 'sawtooth');
        draw();
        updateParticles();
        drawParticles();
        gameOver();
        return;
    }

    snake.unshift(head);
    const ate = head.x === food.x && head.y === food.y;
    if (ate) {
        score++;
        updateScoreDisplay();
        createParticles(food.x, food.y, '#fbbf24', 12);
        createPopText(food.x, food.y, `+${1}`);
        playBeep(600, 0.1);
        placeFood();
    } else {
        snake.pop();
    }
}

function playBeep(freq, duration, type = 'sine') {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    fetchHighScore();
    setTimeout(() => {
        alert(`Game Over! Score: ${score}`);
        resetSnake();
    }, 600);
}

function fetchHighScore() {
    fetch('/sng/api/score/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({score: score})
    })
    .then(r => r.json())
    .then(d => { document.getElementById('snake-highscore').textContent = d.high_score; });
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === ' ') {
        e.preventDefault();
        if (gameInterval) {
            paused = !paused;
            if (paused) {
                clearInterval(gameInterval);
                gameInterval = null;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
            } else {
                resetSnake();
            }
        }
        return;
    }

    const nd = nextDirection;
    switch(key) {
        case 'arrowup': case 'w':
            if (nd.y !== 1) nextDirection = {x: 0, y: -1};
            e.preventDefault();
            break;
        case 'arrowdown': case 's':
            if (nd.y !== -1) nextDirection = {x: 0, y: 1};
            e.preventDefault();
            break;
        case 'arrowleft': case 'a':
            if (nd.x !== 1) nextDirection = {x: -1, y: 0};
            e.preventDefault();
            break;
        case 'arrowright': case 'd':
            if (nd.x !== -1) nextDirection = {x: 1, y: 0};
            e.preventDefault();
            break;
    }
});

function gameLoop() {
    moveSnake();
    updateParticles();
    draw();
}

function resetSnake() {
    if (gameInterval) clearInterval(gameInterval);
    paused = false;
    initSnake();
    gameInterval = setInterval(gameLoop, getSpeed());
}

fetch('/sng/api/score/', {method: 'GET'})
    .then(r => r.json())
    .then(d => { document.getElementById('snake-highscore').textContent = d.high_score; });

resetSnake();
