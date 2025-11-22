//auto-load on every blog page

// Open all links with class 'button' in the current iframe.
document.addEventListener('DOMContentLoaded', function() {
    const contentLinks = document.querySelectorAll('a.button');
    contentLinks.forEach(function(link) {
        link.target = 'content';
    });
});

//playable_tune
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".playable-song").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.parent.postMessage({
        type: "playTrack",
        name: el.dataset.songtitle,
        path: el.dataset.url
      }, "*");
    });
  });
});