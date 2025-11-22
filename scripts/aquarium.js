const aquarium = document.querySelector('.aquarium');
const fishElems = Array.from(document.querySelectorAll('.fish'));
const seaweedElems = Array.from(document.querySelectorAll('.seaweed'));

function getAquariumSize() {
  const rect = aquarium.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

// --- FISH SETUP ---
const FISHES = fishElems.map((fish, idx) => {
  const { width, height } = getAquariumSize();
  const speed = Math.random() * 1.5 + 1.5;
  const angle = Math.random() * Math.PI * 2;

  // scale only if not unscaled
  let scale = 1;
  const img = fish.querySelector('img');
  if (!fish.classList.contains('unscaled')) {
    scale = 0.5 + Math.random() * 0.25;
    img.style.transform = `scale(${scale})`;
  } else {
    img.style.transform = '';
  }

  // Use img width for collision math, default to 96 if not loaded
  const baseWidth = img.naturalWidth || 96;
  const baseHeight = img.naturalHeight || 48;

  return {
    elem: fish,
    img,
    x: Math.random() * (width - baseWidth * scale),
    y: Math.random() * (height - baseHeight * scale),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    flipped: false,
    scale,
    baseWidth,
    baseHeight
  };
});

function setInitialPositions() {
  FISHES.forEach(fish => {
    fish.elem.style.left = fish.x + 'px';
    fish.elem.style.top = fish.y + 'px';
  });
}
setInitialPositions();

function animateFish() {
  const { width, height } = getAquariumSize();
  FISHES.forEach(fish => {
    fish.x += fish.vx;
    fish.y += fish.vy;

    // Bounce left/right
    const scaledW = fish.baseWidth * fish.scale;
    if (fish.x < 0) {
      fish.x = 0;
      fish.vx = Math.abs(fish.vx);
    }
    if (fish.x > width - scaledW) {
      fish.x = width - scaledW;
      fish.vx = -Math.abs(fish.vx);
    }
    // Bounce top/bottom
    const scaledH = fish.baseHeight * fish.scale;
    if (fish.y < 0) {
      fish.y = 0;
      fish.vy = Math.abs(fish.vy);
    }
    if (fish.y > height - scaledH) {
      fish.y = height - scaledH;
      fish.vy = -Math.abs(fish.vy);
    }

    // Flip image if moving left
    if (fish.vx < 0 && !fish.flipped) {
      fish.img.style.transform = fish.scale === 1 ? 'scaleX(-1)' : `scale(${fish.scale}) scaleX(-1)`;
      fish.flipped = true;
    } else if (fish.vx > 0 && fish.flipped) {
      fish.img.style.transform = fish.scale === 1 ? '' : `scale(${fish.scale})`;
      fish.flipped = false;
    }

    fish.elem.style.left = fish.x + 'px';
    fish.elem.style.top = fish.y + 'px';
  });

  requestAnimationFrame(animateFish);
}

// --- SEAWEED SETUP ---
function positionSeaweed() {
  const { width, height } = getAquariumSize();
  seaweedElems.forEach((seaweed, i) => {
    const img = seaweed.querySelector('img');
    const seaweedWidth = img.naturalWidth || 64;
    const left = Math.random() * (width - seaweedWidth);
    seaweed.style.left = left + 'px';
    seaweed.style.bottom = '0px';
  });
}
positionSeaweed();

window.addEventListener('resize', () => {
  const { width, height } = getAquariumSize();
  FISHES.forEach(fish => {
    const scaledW = fish.baseWidth * fish.scale;
    const scaledH = fish.baseHeight * fish.scale;
    fish.x = Math.max(0, Math.min(fish.x, width - scaledW));
    fish.y = Math.max(0, Math.min(fish.y, height - scaledH));
  });
  setInitialPositions();
  positionSeaweed();
});

animateFish();