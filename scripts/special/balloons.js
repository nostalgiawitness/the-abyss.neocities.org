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
  const balloon = document.createElement("div");
  const lifeTimeout = setTimeout(() => balloon.remove(), 13000);
  balloon.className = "balloon";
  balloon.style.backgroundImage = `url(/assets/balloon1.gif)`;
  const startX = random(window.innerWidth - 100);
  const hue = random(360);
  balloon.style.left = `${startX}px`;
  balloon.style.top = `${window.innerHeight + 50}px`;
  balloon.style.filter = `hue-rotate(${hue}deg)`;
  specialContainer.append(balloon);
  
  balloon.addEventListener("click", function onPop(e) {
    e.preventDefault();
    if (balloon.dataset.popped) return;
    balloon.dataset.popped = "1";
    //minifix
    clearTimeout(lifeTimeout);
    
    const rect = balloon.getBoundingClientRect();
    balloon.style.left = `${rect.left}px`;
    balloon.style.top = `${rect.top}px`;
    balloon.style.animation = "none";

    //dont mind me hotlinking like a douche :3
    const popSound = new Audio('https://opengameart.org/sites/default/files/audio_preview/pop_0.ogg.mp3');
    popSound.volume = 0.3;
    popSound.play().catch(err => console.log(err));

    //holyfix for timestamp
    balloon.style.backgroundImage = `url(/assets/balloon1pop.gif?t=${Date.now()})`;
    balloon.style.pointerEvents = "none";
    balloon.classList.add("popped");
    setTimeout(() => balloon.remove(), 600);
  });
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