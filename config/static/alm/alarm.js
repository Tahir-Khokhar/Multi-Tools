let alarms = [];
let audioCtx = null;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    checkAlarms(`${hours}:${minutes}`);
}

function checkAlarms(currentTime) {
    alarms.forEach(alarm => {
        if (alarm.time === currentTime && !alarm.ringing) {
            alarm.ringing = true;
            triggerAlarm(alarm.label);
        }
        if (alarm.ringing && alarm.time !== currentTime) {
            alarm.ringing = false;
        }
    });
}

function triggerAlarm(label) {
    document.getElementById('alarm-message').style.display = 'block';
    if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    playBeep();
}

function playBeep() {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
    setTimeout(() => { oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.5); }, 1000);
}

function stopAlarm() {
    document.getElementById('alarm-message').style.display = 'none';
}

async function loadAlarms() {
    const response = await fetch('/alm/api/alarms/');
    const data = await response.json();
    alarms = data.alarms.map(a => ({ ...a, ringing: false }));
    renderAlarms();
}

function renderAlarms() {
    const list = document.getElementById('alarm-list');
    list.innerHTML = alarms.map(a => `
        <div class="alarm-item">
            <div><strong>${a.label}</strong> at ${a.time}</div>
        </div>
    `).join('');
}

async function setAlarm() {
    const timeInput = document.getElementById('alarm-time').value;
    const labelInput = document.getElementById('alarm-label').value;
    if (!timeInput) return alert('Please select a time');
    const response = await fetch('/alm/api/alarms/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: timeInput, label: labelInput })
    });
    if (response.ok) {
        document.getElementById('alarm-time').value = '';
        document.getElementById('alarm-label').value = '';
        loadAlarms();
    }
}

setInterval(updateClock, 1000);
updateClock();
loadAlarms();
