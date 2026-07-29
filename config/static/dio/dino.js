const canvas = document.getElementById('dinoCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let game, dino, obstacles, particles, mountains, clouds, stars;
let score, distance, gameSpeed, frameCount;
let isJumping, jumpsLeft, isDucking;
let nightMode, dayNightProgress, lastMilestone;
let groundOffset = 0;
let audioCtx = null;
let shakeAmount = 0;

function initStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * (H - 60),
            size: Math.random() * 1.8 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.01
        });
    }
}

function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * W,
            y: Math.random() * 50 + 25,
            w: Math.random() * 50 + 60,
            speed: Math.random() * 0.4 + 0.2,
            opacity: Math.random() * 0.4 + 0.2
        });
    }
}

function initMountains() {
    mountains = [];
    for (let i = 0; i < 6; i++) {
        mountains.push({
            x: i * 180,
            w: Math.random() * 120 + 100,
            h: Math.random() * 50 + 60,
            color: null
        });
    }
}

function initDinoGame() {
    dino = {
        x: 60,
        y: 155,
        width: 44,
        height: 48,
        legFrame: 0,
        legTimer: 0,
        ducking: false
    };
    obstacles = [];
    particles = [];
    score = 0;
    distance = 0;
    gameSpeed = 5;
    frameCount = 0;
    isJumping = false;
    jumpsLeft = 2;
    isDucking = false;
    nightMode = false;
    dayNightProgress = 0;
    lastMilestone = 0;
    groundOffset = 0;
    shakeAmount = 0;
    initStars();
    initClouds();
    initMountains();
    updateUI();
}

function drawBackground() {
    const day = { sky: 135, sky2: 205, ground: 232, ground2: 217, mountain: 180, mountain2: 195 };
    const night = { sky: 15, sky2: 35, ground: 35, ground2: 50, mountain: 45, mountain2: 55 };
    const t = dayNightProgress;
    const blend = (d, n) => Math.round(d * (1 - t) + n * t);

    const skyTop = blend(day.sky, night.sky);
    const skyBot = blend(day.sky2, night.sky2);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgb(${skyTop}, ${skyTop}, ${skyTop + 10})`);
    grad.addColorStop(1, `rgb(${skyBot}, ${skyBot}, ${skyBot + 15})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const sunY = 40 + Math.sin(dayNightProgress * Math.PI) * 30;
    const sunAlpha = 1 - dayNightProgress * 0.6;
    const moonY = 40 - Math.sin(dayNightProgress * Math.PI) * 30;

    if (dayNightProgress < 0.5) {
        ctx.fillStyle = `rgba(251, 191, 36, ${sunAlpha})`;
        ctx.shadowColor = `rgba(251, 191, 36, ${sunAlpha})`;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(W - 80, sunY, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = `rgba(226, 232, 240, ${(dayNightProgress - 0.5) * 1.6})`;
        ctx.shadowColor = `rgba(226, 232, 240, 0.3)`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(W - 80, moonY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    if (dayNightProgress > 0.35) {
        const starAlpha = Math.min(1, (dayNightProgress - 0.35) * 2.5);
        stars.forEach(s => {
            s.twinkle += s.speed;
            const alpha = starAlpha * (0.4 + 0.6 * Math.abs(Math.sin(s.twinkle)));
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });
    }

    const gTop = blend(day.ground, night.ground);
    const gBot = blend(day.ground2, night.ground2);
    const gGrad = ctx.createLinearGradient(0, H - 50, 0, H);
    gGrad.addColorStop(0, `rgb(${gTop}, ${gTop - 5}, ${gTop - 20})`);
    gGrad.addColorStop(1, `rgb(${gBot}, ${gBot - 5}, ${gBot - 25})`);
    ctx.fillStyle = gGrad;
    ctx.fillRect(0, H - 50, W, 50);

    ctx.strokeStyle = `rgba(120, 90, 50, ${0.3 + dayNightProgress * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H - 50);
    ctx.lineTo(W, H - 50);
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + (1 - dayNightProgress) * 0.15})`;
    for (let x = -groundOffset % 30; x < W; x += 30) {
        ctx.fillRect(x, H - 50, 2, 3);
    }

    const mTop = blend(day.mountain, night.mountain);
    const mBot = blend(day.mountain2, night.mountain2);
    mountains.forEach(m => {
        const mx = ((m.x - groundOffset * 0.15) % (W + 200)) - 100;
        ctx.fillStyle = `rgb(${mTop}, ${mTop - 15}, ${mTop - 35})`;
        ctx.beginPath();
        ctx.moveTo(mx, H - 50);
        ctx.lineTo(mx + m.w / 2, H - 50 - m.h);
        ctx.lineTo(mx + m.w, H - 50);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.03 * (1 - dayNightProgress)})`;
        ctx.beginPath();
        ctx.moveTo(mx + m.w / 2, H - 50 - m.h);
        ctx.lineTo(mx + m.w / 2 + 8, H - 50 - m.h + 15);
        ctx.lineTo(mx + m.w / 2 - 5, H - 50 - m.h + 20);
        ctx.fill();
    });

    const cBase = nightMode ? 80 : 230;
    const cAlpha = nightMode ? 0.5 : 0.7;
    clouds.forEach(c => {
        ctx.fillStyle = `rgba(${cBase}, ${cBase}, ${cBase}, ${c.opacity * cAlpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.w * 0.18, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.2, c.y - 6, c.w * 0.22, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.4, c.y - 3, c.w * 0.18, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.55, c.y + 2, c.w * 0.15, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawDinoSprite() {
    const x = dino.x;
    const baseY = dino.y;
    const h = dino.ducking ? 28 : 48;
    const y = dino.ducking ? baseY + 20 : baseY;

    const bodyColor = nightMode ? '#60a5fa' : '#1e293b';
    const bellyColor = nightMode ? '#93c5fd' : '#fbbf24';
    const eyeColor = '#fff';

    ctx.fillStyle = bodyColor;

    if (!dino.ducking) {
        const legSwing = Math.sin(frameCount * 0.3) * 6;

        ctx.fillRect(x + 8, y + 14, 12, 18);
        ctx.fillRect(x + 24, y + 14, 12, 18);
        ctx.fillStyle = bellyColor;
        ctx.fillRect(x + 9, y + 15 + legSwing, 10, 16);

        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + 4, y, 10, 20);
        ctx.fillRect(x + 34, y, 10, 20);
        ctx.fillRect(x + 10, y - 14, 24, 20);
        ctx.fillRect(x + 30, y - 8, 8, 14);

        ctx.fillRect(x + 16, y - 8, 10, 8);
        ctx.fillRect(x + 28, y - 8, 10, 8);

        ctx.fillStyle = bodyColor;
        ctx.fillRect(x - 6, y + 4, 8, 6);
        ctx.fillRect(x - 8, y + 6, 6, 3);
        ctx.fillRect(x - 10, y + 8, 4, 3);

        ctx.fillRect(x + 40, y + 4, 2, 3);
        ctx.fillRect(x + 42, y + 5, 2, 3);

        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + 30, y - 4, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 31, y - 3, 2, 2);

        ctx.fillStyle = '#000';
        ctx.fillRect(x + 36, y - 2, 2, 1);
        ctx.fillRect(x + 38, y - 1, 2, 1);
    } else {
        ctx.fillRect(x + 4, y + 6, 10, 14);
        ctx.fillRect(x + 34, y + 6, 10, 14);
        ctx.fillStyle = bellyColor;
        ctx.fillRect(x + 5, y + 7, 8, 12);

        ctx.fillStyle = bodyColor;
        ctx.fillRect(x - 4, y - 2, 8, 14);
        ctx.fillRect(x + 42, y - 2, 8, 14);
        ctx.fillRect(x + 8, y - 8, 30, 16);
        ctx.fillRect(x + 30, y - 4, 8, 10);

        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + 34, y - 2, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 35, y - 1, 2, 2);
    }
}

function drawCactus(type, x, baseY) {
    const cactusColor = nightMode ? '#34d399' : '#15803d';
    const cactusLight = nightMode ? '#6ee7b7' : '#22c55e';
    const shadowColor = nightMode ? 'rgba(52, 211, 153, 0.4)' : 'rgba(21, 128, 61, 0.5)';

    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 8;

    if (type === 'small') {
        ctx.fillStyle = cactusColor;
        ctx.fillRect(x + 7, baseY - 28, 10, 28);
        ctx.fillRect(x, baseY - 18, 6, 10);
        ctx.fillRect(x + 18, baseY - 22, 6, 10);
        ctx.fillRect(x + 1, baseY - 18, 4, 7);
        ctx.fillRect(x + 19, baseY - 22, 4, 7);
        ctx.fillStyle = cactusLight;
        ctx.fillRect(x + 9, baseY - 26, 2, 26);
        ctx.fillRect(x + 2, baseY - 17, 2, 6);
        ctx.fillRect(x + 20, baseY - 21, 2, 6);
    } else if (type === 'large') {
        ctx.fillStyle = cactusColor;
        ctx.fillRect(x + 10, baseY - 46, 12, 46);
        ctx.fillRect(x, baseY - 28, 8, 16);
        ctx.fillRect(x + 24, baseY - 34, 8, 16);
        ctx.fillRect(x + 1, baseY - 28, 5, 11);
        ctx.fillRect(x + 25, baseY - 34, 5, 11);
        ctx.fillStyle = cactusLight;
        ctx.fillRect(x + 12, baseY - 44, 3, 44);
        ctx.fillRect(x + 2, baseY - 27, 2, 12);
        ctx.fillRect(x + 26, baseY - 33, 2, 12);
    } else if (type === 'double') {
        ctx.fillStyle = cactusColor;
        ctx.fillRect(x + 5, baseY - 30, 10, 30);
        ctx.fillRect(x + 22, baseY - 42, 10, 42);
        ctx.fillRect(x, baseY - 20, 6, 10);
        ctx.fillRect(x + 19, baseY - 26, 6, 12);
        ctx.fillRect(x + 30, baseY - 34, 6, 14);
        ctx.fillRect(x + 1, baseY - 20, 4, 7);
        ctx.fillRect(x + 20, baseY - 26, 4, 9);
        ctx.fillRect(x + 31, baseY - 34, 4, 10);
        ctx.fillStyle = cactusLight;
        ctx.fillRect(x + 7, baseY - 28, 2, 28);
        ctx.fillRect(x + 24, baseY - 40, 2, 40);
    } else if (type === 'cluster') {
        ctx.fillStyle = cactusColor;
        ctx.fillRect(x + 6, baseY - 24, 8, 24);
        ctx.fillRect(x + 18, baseY - 30, 8, 30);
        ctx.fillRect(x + 6, baseY - 16, 4, 8);
        ctx.fillRect(x + 22, baseY - 20, 4, 10);
        ctx.fillRect(x + 7, baseY - 22, 2, 22);
        ctx.fillRect(x + 19, baseY - 28, 2, 28);
    }

    ctx.shadowBlur = 0;
}

function drawBird(x, baseY, frame) {
    const birdColor = nightMode ? '#94a3b8' : '#1e293b';
    const wingUp = Math.sin(frame * 0.5) * 8;
    const wingAngle = Math.sin(frame * 0.5) * 0.4;

    ctx.save();
    ctx.translate(x, baseY);
    ctx.fillStyle = birdColor;

    ctx.beginPath();
    ctx.ellipse(10, 0, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(14, -2, 8, 4);
    ctx.fillRect(22, -1, 4, 2);

    ctx.save();
    ctx.translate(8, -2);
    ctx.rotate(-0.2 + wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-18, -6 - wingUp);
    ctx.lineTo(-14, 0);
    ctx.lineTo(-18, 4 + wingUp);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(8, 2);
    ctx.rotate(0.2 - wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-16, 4 + wingUp);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-16, -4 - wingUp);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = nightMode ? '#fca5a5' : '#ef4444';
    ctx.fillRect(22, -1.5, 3, 3);
    ctx.fillStyle = '#000';
    ctx.fillRect(23, -1.5, 1, 1);

    ctx.restore();
}

function drawDustParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        p.size *= 0.97;
        return p.life > 0;
    });
}

function createDust() {
    if (isJumping) return;
    for (let i = 0; i < 2; i++) {
        particles.push({
            x: dino.x + (dino.ducking ? 10 : 20),
            y: dino.y + (dino.ducking ? 20 : 48),
            vx: -gameSpeed * 0.2 + (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.2 - 0.3,
            life: 1,
            color: `rgba(${nightMode ? '120' : '180'}, ${nightMode ? '120' : '150'}, ${nightMode ? '130' : '100'}, 0.5)`,
            size: Math.random() * 3 + 1.5
        });
    }
}

function spawnObstacle() {
    const last = obstacles[obstacles.length - 1];
    const minGap = Math.max(45, 100 - (score / 200) * 15);
    if (last && last.x > W - minGap) return;

    const rand = Math.random();
    let type;
    if (rand < 0.35) type = 'small';
    else if (rand < 0.6) type = 'large';
    else if (rand < 0.85) type = 'double';
    else type = 'bird';

    const baseY = 200;
    obstacles.push({
        x: W + 20,
        y: baseY,
        type: type,
        wingFrame: 0
    });
}

function checkCollision() {
    const dx = dino.ducking ? 4 : 6;
    const dTop = dino.ducking ? 4 : 8;
    const dBottom = dino.ducking ? 20 : 42;
    const dBox = {
        x: dino.x + dx,
        y: dino.y + dTop,
        w: 36 - dx,
        h: dBottom - dTop
    };

    return obstacles.some(obs => {
        let oBox;
        if (obs.type === 'bird') {
            const wingY = Math.sin(obs.wingFrame * 0.5) * 6;
            oBox = {
                x: obs.x + 4,
                y: obs.y - 28 + wingY,
                w: 28,
                h: 18
            };
        } else {
            const baseY = obs.y;
            if (obs.type === 'small') {
                oBox = { x: obs.x + 1, y: baseY - 28, w: 18, h: 28 };
            } else if (obs.type === 'large') {
                oBox = { x: obs.x + 1, y: baseY - 46, w: 22, h: 46 };
            } else if (obs.type === 'double') {
                oBox = { x: obs.x + 1, y: baseY - 42, w: 28, h: 42 };
            } else if (obs.type === 'cluster') {
                oBox = { x: obs.x + 1, y: baseY - 30, w: 24, h: 30 };
            }
        }
        return (
            dBox.x < oBox.x + oBox.w &&
            dBox.x + dBox.w > oBox.x &&
            dBox.y < oBox.y + oBox.h &&
            dBox.y + dBox.h > oBox.y
        );
    });
}

function playSound(freq, duration, type = 'sine', vol = 0.06) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function updateUI() {
    document.getElementById('dino-score').textContent = Math.floor(score / 10);
    document.getElementById('dino-level').textContent = Math.floor(score / 600) + 1;
    const timeEl = document.getElementById('dino-time');
    timeEl.textContent = nightMode ? 'NIGHT' : 'DAY';
    timeEl.className = 'dino-stat-value' + (nightMode ? ' night-indicator' : '');
}

function gameLoop() {
    dino.legTimer++;
    if (dino.legTimer > 6) {
        dino.legTimer = 0;
        dino.legFrame = (dino.legFrame + 1) % 2;
    }

    if (isJumping) {
        dino.y += dino.dy;
        dino.dy += 0.55;
        if (dino.y >= 155) {
            dino.y = 155;
            dino.dy = 0;
            isJumping = false;
            jumpsLeft = 2;
        }
    }

    obstacles.forEach(obs => {
        obs.x -= gameSpeed;
        obs.wingFrame = (obs.wingFrame || 0) + 1;
    });
    obstacles = obstacles.filter(obs => obs.x > -80);

    if (frameCount % Math.floor(120 / gameSpeed) === 0 && Math.random() < 0.45) {
        spawnObstacle();
    }

    if (checkCollision()) {
        shakeAmount = 18;
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: dino.x + dino.width / 2,
                y: dino.y + dino.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 55%)`,
                size: Math.random() * 5 + 2
            });
        }
        playSound(150, 0.4, 'sawtooth', 0.08);
        playSound(100, 0.3, 'square', 0.06);
        draw();
        updateParticles();
        drawDustParticles();
        gameOver();
        return;
    }

    score++;
    distance += gameSpeed;
    frameCount++;
    groundOffset += gameSpeed;

    if (frameCount % 4 === 0) createDust();
    updateParticles();

    if (score > 0 && Math.floor(score / 10) % 80 === 0 && Math.floor(score / 10) > lastMilestone) {
        lastMilestone = Math.floor(score / 10);
        playSound(800, 0.1);
        setTimeout(() => playSound(1100, 0.15), 80);
    }

    const cycleLength = 800;
    const cyclePos = (score / 10) % cycleLength;
    dayNightProgress = cyclePos / cycleLength;

    gameSpeed = Math.min(14, 4.5 + (score / 10) * 0.008);
    updateUI();
    draw();
}

function draw() {
    if (shakeAmount > 0) {
        const dx = (Math.random() - 0.5) * shakeAmount;
        const dy = (Math.random() - 0.5) * shakeAmount;
        ctx.save();
        ctx.translate(dx, dy);
        shakeAmount *= 0.88;
        if (shakeAmount < 0.5) shakeAmount = 0;
    }

    drawBackground();

    ctx.save();
    ctx.translate(0, 0);

    const baseY = 200;
    obstacles.forEach(obs => {
        if (obs.type === 'bird') {
            const birdY = baseY - 20 - Math.sin(obs.wingFrame * 0.03) * 6;
            drawBird(obs.x, birdY, obs.wingFrame);
        } else {
            drawCactus(obs.type, obs.x, baseY);
        }
    });

    drawDinoSprite();
    ctx.restore();

    if (shakeAmount > 0) ctx.restore();
}

function jump() {
    if (jumpsLeft > 0) {
        isJumping = true;
        dino.dy = jumpsLeft === 2 ? -11.5 : -9.5;
        jumpsLeft--;
        playSound(380, 0.1);
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: dino.x + 15,
                y: dino.y + 48,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 2,
                life: 1,
                color: `rgba(180, 160, 130, 0.6)`,
                size: Math.random() * 2.5 + 1
            });
        }
    }
}

function duck(active) {
    if (!isJumping && !active) {
        isDucking = false;
        dino.ducking = false;
        dino.height = 48;
        dino.y = 155;
    } else if (!isJumping) {
        isDucking = true;
        dino.ducking = true;
        dino.height = 28;
        dino.y = 175;
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === ' ' || key === 'arrowup' || key === 'w') {
        e.preventDefault();
        jump();
    }
    if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        duck(true);
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowdown' || key === 's') {
        duck(false);
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const rect = canvas.getBoundingClientRect();
    const relY = touchY - rect.top;
    if (relY > rect.height * 0.55) {
        duck(true);
    } else {
        jump();
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    duck(false);
}, { passive: false });

function gameOver() {
    clearInterval(game);
    setTimeout(() => {
        alert(`GAME OVER\nScore: ${Math.floor(score / 10)}\nLevel: ${Math.floor(score / 600) + 1}`);
        saveHighScore();
        resetDino();
    }, 700);
}

async function saveHighScore() {
    try {
        const s = Math.floor(score / 10);
        await fetch('/dio/api/score/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({score: s})
        });
        fetch('/dio/api/score/', {method: 'GET'})
            .then(r => r.json())
            .then(d => { document.getElementById('dino-highscore').textContent = d.high_score; });
    } catch (e) {}
}

function resetDino() {
    clearInterval(game);
    initDinoGame();
    game = setInterval(gameLoop, 1000 / 60);
}

fetch('/dio/api/score/', {method: 'GET'})
    .then(r => r.json())
    .then(d => { document.getElementById('dino-highscore').textContent = d.high_score; });

resetDino();
