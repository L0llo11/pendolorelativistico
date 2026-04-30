
// Recupero gli elementi dall'HTML
const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const speedSlider = document.getElementById('speedSlider');
const speedValueDisplay = document.getElementById('speedValue');

// Variabili globali della simulazione
let v = 0; // Velocità in frazioni della luce (da 0 a 0.99)
let observerTime = 0; // Tempo misurato dall'osservatore (sulla Terra)
let rocketTime = 0;   // Tempo misurato a bordo del razzo (Tempo Proprio)

// Aggiorna il valore della velocità quando muovi lo slider
speedSlider.addEventListener('input', (e) => {
  v = parseFloat(e.target.value);
  speedValueDisplay.textContent = v.toFixed(3);
});

// Generazione di un cielo stellato per l'effetto di movimento
const stars = [];
for(let i = 0; i < 150; i++) {
   stars.push({
       x: Math.random() * canvas.width,
       y: Math.random() * canvas.height,
       size: Math.random() * 2
   });
}

// Funzione per disegnare il razzo vettoriale
function drawRocket() {
  ctx.save();
  // Spostiamo l'origine del disegno al centro del canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Fuoco del motore (visibile e più lungo se la velocità aumenta)
  if (v > 0) {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-30, 100);
    // La fiamma si allunga in base alla velocità e sfarfalla
    const flameLength = 100 + 100 * v + Math.random() * 30;
    ctx.lineTo(0, flameLength);
    ctx.lineTo(30, 100);
    ctx.closePath();
    ctx.fill();
    
    // Anima interna della fiamma
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-15, 100);
    ctx.lineTo(0, flameLength * 0.7);
    ctx.lineTo(15, 100);
    ctx.closePath();
    ctx.fill();
  }

  // Corpo principale del razzo
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.roundRect(-50, -120, 100, 220, 25);
  ctx.fill();

  // Punta del razzo
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-50, -100);
  ctx.lineTo(0, -180);
  ctx.lineTo(50, -100);
  ctx.closePath();
  ctx.fill();

  // Alettoni sinistro e destro
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-50, 40);
  ctx.lineTo(-80, 120);
  ctx.lineTo(-50, 100);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(50, 40);
  ctx.lineTo(80, 120);
  ctx.lineTo(50, 100);
  ctx.fill();

  // Oblò (la finestra dove vedremo il pendolo)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, -10, 60, 0, Math.PI * 2);
  ctx.fill();
  
  // Bordo dell'oblò
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.restore();
}

// Funzione per disegnare il pendolo
function drawPendulum(angle) {
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 - 35); // Allineato dentro l'oblò

  const length = 60; // Lunghezza del filo
  const bobX = length * Math.sin(angle);
  const bobY = length * Math.cos(angle);

  // Filo del pendolo
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Massa (pallina azzurra)
  ctx.fillStyle = '#00d2ff';
  ctx.beginPath();
  ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Perno centrale
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

let lastTimestamp = 0;

// Ciclo di animazione principale
function animate(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  // 1. CALCOLI RELATIVISTICI
  const deltaSec = deltaTime / 1000;
  observerTime += deltaSec; // Il tempo per noi scorre normalmente

  // Fattore di Lorentz
  const gamma = 1 / Math.sqrt(1 - (v * v));
  
  // Il tempo nel razzo è dilatato (scorre più lentamente)
  const deltaRocketSec = deltaSec / gamma;
  rocketTime += deltaRocketSec;

  // 2. DISEGNO DELLO SFONDO E DELLE STELLE
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Le stelle si muovono verso il basso creando l'illusione del volo
    // La velocità delle stelle è proporzionale a v
    star.y += (v * 15) + 0.5; // +0.5 per dare un minimo di movimento anche da fermo
    if (star.y > canvas.height) {
       star.y = 0;
       star.x = Math.random() * canvas.width;
    }
  });

  // 3. DISEGNO DEL RAZZO
  drawRocket();

  // 4. DISEGNO DEL PENDOLO
  // L'angolo dipende dal tempo del razzo, quindi oscillerà più lentamente a velocità relativistiche
  const maxAngle = Math.PI / 4; // 45 gradi
  const period = 2; // Un'oscillazione completa ogni 2 secondi propri
  const angle = maxAngle * Math.cos((2 * Math.PI / period) * rocketTime); 

  drawPendulum(angle);

  // 5. AGGIORNAMENTO TESTI
  // Dividiamo il timer in due per mostrare la differenza di tempo
  timerDisplay.innerHTML = `
    Tempo Terra (Osservatore): ${observerTime.toFixed(1)}s <br> 
    Tempo Razzo (Proprio): <span style="color:#00d2ff">${rocketTime.toFixed(1)}s</span>
  `;

  // Continua l'animazione
  requestAnimationFrame(animate);
}

// Avvia l'animazione
requestAnimationFrame(animate);
