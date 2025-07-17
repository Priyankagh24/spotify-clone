
let songIndex = 0;
let isLooping = false;
let audioElement = new Audio();
let songs = [
  { songName: "Admirin'You", filePath: "song/admiringYou.mp3", coverPath: "covers/cover1.jpg" },
  { songName: "Chiraiyya", filePath: "song/Chiraiyya.mp3", coverPath: "covers/cover2.jpeg" },
  { songName: "Tu Jahaan", filePath: "song/Tu Jahaan.mp3", coverPath: "covers/cover3.jpeg" },
  { songName: "Kaise Mujhe", filePath: "song/Kaise Mujhe.mp3", coverPath: "covers/cover4.jpeg" },
  { songName: "Manzar Hai Ye Naya", filePath: "song/Manzar Hai Ye Naya.mp3", coverPath: "covers/cover5.jpeg" },
];

// Elements
const masterPlay = document.getElementById('masterPlay');
const progressBar = document.getElementById('MyProgressionBar');
const loopToggle = document.getElementById('loopToggle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const currentSongName = document.getElementById('currentSongName');
const songInfoText = document.getElementById('songInfoText');
const volumeSlider = document.getElementById('volumeSlider');

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function updateUI() {
  currentSongName.innerText = songs[songIndex].songName;
  songInfoText.innerText = `${songs[songIndex].songName}`;
  document.getElementById('songTitleBelowBar').innerText = songs[songIndex].songName;
}

function resetAllPlays() {
  document.querySelectorAll('.songPlay').forEach(el => {
    el.classList.remove('fa-pause-circle');
    el.classList.add('fa-play-circle');
  });
}

function playSong(index) {
  songIndex = index;
  audioElement.src = songs[songIndex].filePath;
  progressBar.value = 0;
currentTimeEl.innerText = '0:00';
durationEl.innerText = '0:00';

  audioElement.currentTime = 0;
  audioElement.play().then(() => {
    updateUI();
    updateMasterIcon(true); // ✅ make sure master play button is updated here
    resetAllPlays();
    const currentIcon = document.getElementById(index);
    currentIcon.classList.remove('fa-play-circle');
    currentIcon.classList.add('fa-pause-circle');
  }).catch((err) => {
    console.error("Audio play failed:", err);
  });
}


function updateMasterIcon(isPlaying) {
  masterPlay.classList.toggle('fa-play-circle', !isPlaying);
  masterPlay.classList.toggle('fa-pause-circle', isPlaying);
}


// Event Listeners
document.querySelectorAll('.songPlay').forEach(el => {
  el.addEventListener('click', e => {
    const index = parseInt(e.target.id);
    if (songIndex === index && !audioElement.paused) {
      audioElement.pause();
      updateMasterIcon(false);
      e.target.classList.remove('fa-pause-circle');
      e.target.classList.add('fa-play-circle');
    } else {
      playSong(index);
    }
  });
});


masterPlay.addEventListener('click', () => {
  if (!audioElement.src) {
    playSong(songIndex);
    return;
  } if (audioElement.paused) {
    audioElement.play();
    updateMasterIcon(true); 
    document.getElementById(songIndex).classList.replace('fa-play-circle', 'fa-pause-circle');
  } else {
    audioElement.pause();
    updateMasterIcon(false);
    document.getElementById(songIndex).classList.replace('fa-pause-circle', 'fa-play-circle');
  }
});


audioElement.addEventListener('timeupdate', () => {
    if (!isNaN(audioElement.duration)) {
  const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
  progressBar.value = progress;
  currentTimeEl.innerText = formatTime(audioElement.currentTime);
  durationEl.innerText = formatTime(audioElement.duration);
}
});

progressBar.addEventListener('input', () => {
  audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

audioElement.addEventListener('ended', () => {
  if (isLooping) {
    audioElement.currentTime = 0;
    audioElement.play();
  } else {
    playSong((songIndex + 1) % songs.length);
  }
});

document.getElementById('next').addEventListener('click', () => {
  playSong((songIndex + 1) % songs.length);
});

document.getElementById('prev').addEventListener('click', () => {
  playSong((songIndex - 1 + songs.length) % songs.length);
});

loopToggle.addEventListener('click', () => {
  isLooping = !isLooping;
  loopToggle.classList.toggle('active', isLooping);
});

volumeSlider.addEventListener('input', e => {
  audioElement.volume = e.target.value;
});

updateUI();
