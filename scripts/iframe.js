// auto-load on every iframe
document.addEventListener("mousemove", (e) => {
  const rect = window.frameElement.getBoundingClientRect();
  window.parent.postMessage({
    type: "mousemove",
    x: e.clientX + rect.left,
    y: e.clientY + rect.top
  }, "*");
});
