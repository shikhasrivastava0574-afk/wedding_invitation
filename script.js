document.addEventListener('DOMContentLoaded', () => {
  // === Audio Player & Custom Music Card Controls ===
  const bgAudio = document.getElementById('bg-audio');
  const mainPlayBtn = document.getElementById('main-play-btn');
  const playSvg = document.getElementById('play-svg');
  const pauseSvg = document.getElementById('pause-svg');
  const progressBar = document.getElementById('progress-bar');
  const volumeSlider = document.getElementById('volume-slider');
  const currentTimeLabel = document.getElementById('current-time');
  const durationTimeLabel = document.getElementById('duration-time');
  const playerContainer = document.getElementById('music-player-container');
  const floatingToggle = document.getElementById('audio-toggle');

  let isPlaying = false;

  // Initialize audio settings
  if (bgAudio) {
    bgAudio.volume = 0.8;
  }

  // Format time (e.g. 125 -> 2:05)
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  // Toggle play/pause state
  function togglePlay() {
    if (!bgAudio) return;

    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      playerContainer.classList.remove('playing');
      floatingToggle.classList.remove('playing');
      playSvg.style.display = 'block';
      pauseSvg.style.display = 'none';
      updateFloatingIcon(false);
    } else {
      bgAudio.play().then(() => {
        isPlaying = true;
        playerContainer.classList.add('playing');
        floatingToggle.classList.add('playing');
        playSvg.style.display = 'none';
        pauseSvg.style.display = 'block';
        updateFloatingIcon(true);
      }).catch(err => {
        console.log("Audio playback failed or prevented by browser.", err);
      });
    }
  }

  // Sync floating button state
  function updateFloatingIcon(playing) {
    if (playing) {
      floatingToggle.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
    } else {
      floatingToggle.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }

  // Event Listeners for controls
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', togglePlay);
  }

  if (floatingToggle) {
    floatingToggle.addEventListener('click', togglePlay);
  }

  // Time and duration updates
  if (bgAudio) {
    bgAudio.addEventListener('loadedmetadata', () => {
      durationTimeLabel.textContent = formatTime(bgAudio.duration);
    });

    bgAudio.addEventListener('timeupdate', () => {
      const progress = (bgAudio.currentTime / bgAudio.duration) * 100;
      progressBar.value = isNaN(progress) ? 0 : progress;
      currentTimeLabel.textContent = formatTime(bgAudio.currentTime);
    });

    bgAudio.addEventListener('ended', () => {
      isPlaying = false;
      playerContainer.classList.remove('playing');
      floatingToggle.classList.remove('playing');
      playSvg.style.display = 'block';
      pauseSvg.style.display = 'none';
      updateFloatingIcon(false);
      progressBar.value = 0;
      currentTimeLabel.textContent = "0:00";
    });
  }

  // Seek bar listener
  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (!bgAudio || !bgAudio.duration) return;
      const seekTime = (progressBar.value / 100) * bgAudio.duration;
      bgAudio.currentTime = seekTime;
    });
  }

  // Volume control slider listener
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (!bgAudio) return;
      bgAudio.volume = volumeSlider.value / 100;
    });
  }

  // Autoplay fallback: start playing on first user interaction with screen
  const autoPlayOnInteraction = () => {
    if (!isPlaying) {
      togglePlay();
    }
    document.removeEventListener('click', autoPlayOnInteraction);
    document.removeEventListener('touchstart', autoPlayOnInteraction);
    document.removeEventListener('scroll', autoPlayOnInteraction);
  };

  document.addEventListener('click', autoPlayOnInteraction);
  document.addEventListener('touchstart', autoPlayOnInteraction);
  document.addEventListener('scroll', autoPlayOnInteraction);


  // === Falling Flower Petals Canvas Animation ===
  const canvas = document.getElementById('petal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = [
      { r: 212, g: 175, b: 55, a: 0.75 },  // Gold
      { r: 128, g: 0, b: 32, a: 0.65 },    // Crimson Rose
      { r: 229, g: 169, b: 59, a: 0.8 },   // Orange Marigold
      { r: 247, g: 104, b: 161, a: 0.65 }  // Pink Petals
    ];

    class Petal {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 - 0.01;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayOffset = Math.random() * 100;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.cos(this.y * this.swaySpeed + this.swayOffset) * 0.5;
        this.angle += this.angleSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.5, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    const totalPetals = 45;
    const petals = [];
    for (let i = 0; i < totalPetals; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }
});
