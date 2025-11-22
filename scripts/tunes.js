const loadTunes = async () => {
  try {
    const response = await fetch('/scripts/json/tunes.json');
    const tunes = await response.json();
    return tunes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  const tunes = await loadTunes();
  const grid = document.getElementById('tunes-grid');
  const playerIframe = window.parent.document.getElementById("player"); 

  const fragment = document.createDocumentFragment();

  for (const tune of tunes) {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.dataset.songtitle = tune.songtitle;
    div.dataset.url = tune.url;

    div.innerHTML = `
      <figure>
        <div class="hover">
          <img src="${tune.img}" alt="${tune.title}" loading="lazy">
        </div>
        <figcaption>${tune.title}</figcaption>
      </figure>
    `;

    fragment.appendChild(div);
  }
  
  //optimization
  grid.appendChild(fragment);

  grid.addEventListener('click', (e) => {
    const div = e.target.closest('.grid-item');
    if (!div) return;

    window.parent.postMessage({
      type: "playTrack",
      name: div.dataset.songtitle,
      path: div.dataset.url
    }, "*");
  });
});