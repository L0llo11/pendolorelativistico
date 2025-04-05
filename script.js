const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const topY = 50;
const length = 200;
const radius = 20;

const oscillationTime = 18;
const frequency = 1 / oscillationTime;
const angularFrequency = 2 * Math.PI * frequency;

let startTime = null;

function drawPendulum(elapsed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxAngle = Math.PI / 4;
  const theta = maxAngle * Math.sin(angularFrequency * elapsed);

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
