//most of this code actually wasnt written by me, most of the credits go to hgari.neocities.org
let trackName = document.querySelector(".songtitle");
let playpauseBtn = document.querySelector(".playpause-track");
let nextBtn = document.querySelector(".next-track");
let prevBtn = document.querySelector(".prev-track");
let seekSlider = document.querySelector(".seek_slider");
let currTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");
let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let currTrack = document.getElementById("music");
let trackList = [];

async function loadTrackList() {
  try {
    const response = await fetch("/scripts/json/player.json");
    const data = await response.json();
    trackList = data.tracks || [];
    if (trackList.length > 0) {
      // randomize
      trackIndex = Math.floor(Math.random() * trackList.length);
      loadTrack(trackIndex);
    }
  } catch (err) {
    console.error("Error loading track list:", err);
  }
}

function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();
  currTrack.src = trackList[index].path;
  currTrack.load();
  trackName.textContent = trackList[index].name;
  updateTimer = setInterval(seekUpdate, 1000);
  currTrack.addEventListener("ended", nextTrack);
}

function resetValues() {
  currTime.textContent = "0:00";
  totalDuration.textContent = "0:00";
  seekSlider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  currTrack.play();
  isPlaying = true;
  playpauseBtn.innerHTML = '⏸';
}

function pauseTrack() {
  currTrack.pause();
  isPlaying = false;
  playpauseBtn.innerHTML = '▶';
}

function nextTrack() {
  trackIndex = (trackIndex + 1) % trackList.length;
  loadTrack(trackIndex);
  playTrack();
}

function prevTrack() {
  trackIndex = (trackIndex - 1 + trackList.length) % trackList.length;
  loadTrack(trackIndex);
  playTrack();
}

function seekTo() {
  let seekto = currTrack.duration * (seekSlider.value / 100);
  currTrack.currentTime = seekto;
}

function seekUpdate() {
  if (!isNaN(currTrack.duration)) {
    let seekPosition = currTrack.currentTime * (100 / currTrack.duration);
    seekSlider.value = seekPosition;
    let currentMinutes = Math.floor(currTrack.currentTime / 60);
    let currentSeconds = Math.floor(currTrack.currentTime % 60);
    let durationMinutes = Math.floor(currTrack.duration / 60);
    let durationSeconds = Math.floor(currTrack.duration % 60);
    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;
    currTime.textContent = `${currentMinutes}:${currentSeconds}`;
    totalDuration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

//play by index
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "playTrackByIndex") {
    let index = event.data.index;
    if (index >= 0 && index < trackList.length) {
      trackIndex = index;
      loadTrack(trackIndex);
      playTrack();
    }
  }
});

// play specific song
/*
window.parent.postMessage({
  type: "playTrack",
  name: "song · external",
  path: "https://filegarden.com/song.mp3"
}, "*");
*/
window.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "playTrack") {
    let { name, path } = event.data;
    if (path) playExternalTrack(name || "Unknown", path);
  }
});

function playExternalTrack(name, path) {
  clearInterval(updateTimer);
  resetValues();
  currTrack.src = path;
  currTrack.load();
  trackName.textContent = name;
  updateTimer = setInterval(seekUpdate, 1000);
  currTrack.addEventListener("ended", nextTrack);
  playTrack();
}

playpauseBtn.addEventListener("click", playpauseTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
seekSlider.addEventListener("input", seekTo);
loadTrackList();