const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const topY = 50;
const length = 200;
const radius = 20;

const properPeriod = 18; // T = 18s (periodo nel sistema proprio)
let relativisticPeriod = properPeriod;

const slider = document.getElementById('speedSlider');
const speedDisplay = document.getElementById('speedValue');

// Funzione per calcolare la dilatazione temporale
function updatePeriod() {
  const v = parseFloat(slider.value); // velocità attuale (in unità di c)
  speedDisplay.textContent = v.toFixed(2);

  // T' = T / sqrt(1 - v^2/c^2)
  const gamma = 1 / Math.sqrt(1 - v * v);
  relativisticPeriod = properPeriod * gamma;
}

slider.addEventListener('input', updatePeriod);
updatePeriod(); // inizializza

let startTime = null;

function drawRocketOutline() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;

  const rocketX = centerX - 200;
  const rocketY = topY - 40;
  const rocketWidth = 400;
  const rocketHeight = 360;

  // Corpo centrale del razzo
  ctx.strokeRect(rocketX, rocketY, rocketWidth, rocketHeight);
}

function drawTitle() {
  ctx.font = '30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText('Pendolo Relativistico', centerX, 40);
}

function drawPendulum(elapsed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRocketOutline();
  drawTitle()

  const frequency = 1 / relativisticPeriod;
  const angularFrequency = 2 * Math.PI * frequency;
  const maxAngle = Math.PI / 4;

  const theta = maxAngle * -Math.cos(angularFrequency * elapsed);

  const ballX = centerX + length * Math.sin(theta);
  const ballY = topY + length * Math.cos(theta);

  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(ballX, ballY);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime) / 1000;

  drawPendulum(elapsed);

  document.getElementById('timer').textContent =
  `Elapsed Time: ${elapsed.toFixed(1)}s`;

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
  
