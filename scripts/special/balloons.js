const isMobile = detectMob();
const specialContainer = document.getElementById("special-container");

const date = new Date();
// BEWARE! starts on 0-index, so november -> 10 and NOT 11
const currentMonth = date.getMonth();
// this is normal for some reason
const currentDay = date.getDate();

if (currentMonth === 10 && currentDay === 25) {
  window.addEventListener("load", startParty);
}

function random(n) {
  return Math.floor(Math.random() * n);
}

function spawnBalloon() {
  const img = document.createElement("img");
  img.className = "balloon";
  img.src = `/assets/balloon1.gif`;
  const startX = random(window.innerWidth - 100);
  const hue = random(360);
  img.style.left = `${startX}px`;
  img.style.top = `${window.innerHeight + 50}px`;
  img.style.filter = `hue-rotate(${hue}deg)`;
  specialContainer.append(img);
  setTimeout(() => img.remove(), 13000);
}

function startParty() {
  const interval = isMobile ? 100 : 300;
    // spawn a balloon every 300–450ms, 100-250ms for portable devices
  setInterval(() => {
    spawnBalloon();
  }, random(150) + interval);
}

function detectMob() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (window.innerWidth <= 800 && window.innerHeight <= 600);
}