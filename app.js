/* =============================================
   app.js — Ultra-Realistic Cricket → Fireworks → Cake → Animated Tree + Shake Fruits + Memories + Quote
   ============================================= */
'use strict';

const PHOTOS = [
  "Bis/482539600_17966727389851995_4987439513086331944_n..webp",
  "Bis/508167849_17978371454851995_3263547834983261378_n..webp",
  "Bis/561278958_17991212831851995_8508208162169789973_n..webp",
  "Bis/588631235_17997590873851995_779776481481871223_n..webp",
  "Bis/621523194_18084890329930910_938591607470092846_n..webp",
  "Bis/623426367_18092133931970479_1483087356545179161_n..webp",
  "Bis/624461318_18069418892185693_5909697206925610439_n..webp",
  "Bis/625357330_18095743714941741_3175762240740130313_n..webp",
  "Bis/626214276_18310478737261048_7693185174091910412_n..webp",
  "Bis/626415940_18178437436327583_6611186160969414492_n..webp",
  "Bis/639772602_18574488931031548_8317865605278264357_n..webp",
  "Bis/652001407_18072105140536160_216640931668166540_n..webp",
];

// ─────────────────────────────────────────────
// WEB AUDIO API SOUND EFFECTS ENGINE
// ─────────────────────────────────────────────
let audioCtx = null;
let isMuted = false;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

['pointerdown', 'touchstart', 'keydown'].forEach(evt => {
  window.addEventListener(evt, ensureAudio, { passive: true });
});

document.getElementById('sound-toggle').addEventListener('click', () => {
  isMuted = !isMuted;
  document.getElementById('sound-toggle').textContent = isMuted ? '🔇' : '🔊';
});

const SFX = {
  playTone(freq, type = 'sine', duration = 0.2, vol = 0.2, delay = 0, slideTo = null) {
    if (isMuted) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  },

  playNoise(duration = 0.2, vol = 0.2, filterFreq = 1000, filterType = 'bandpass', delay = 0) {
    if (isMuted) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  },

  bowl() {
    this.playNoise(0.22, 0.08, 1200, 'bandpass', 0);
    this.playTone(300, 'sine', 0.22, 0.06, 0, 140);
  },

  pitchBounce() {
    this.playTone(130, 'sine', 0.06, 0.12, 0, 70);
  },

  batHit(runs) {
    // Realistic willow bat sweet-spot crack
    this.playNoise(0.07, runs >= 4 ? 0.55 : 0.35, 2000, 'bandpass', 0);
    this.playTone(runs === 6 ? 280 : 210, 'triangle', 0.1, 0.38, 0, 85);
    if (runs === 4) {
      this.playNoise(0.6, 0.1, 800, 'bandpass', 0.1);
      this.playTone(523.25, 'triangle', 0.15, 0.16, 0.12);
      this.playTone(659.25, 'triangle', 0.22, 0.16, 0.24);
    }
  },

  miss() {
    this.playNoise(0.18, 0.12, 600, 'lowpass', 0);
  },

  sixCheer() {
    this.playNoise(1.5, 0.24, 950, 'bandpass', 0.05);
    [523.25, 659.25, 783.99, 1046.5].forEach((n, idx) => {
      this.playTone(n, 'triangle', 0.28, 0.2, 0.08 + idx * 0.1);
    });
  },

  fireworkLaunch() {
    this.playNoise(0.45, 0.14, 2400, 'bandpass', 0);
    this.playTone(320, 'sine', 0.42, 0.06, 0, 1250);
  },

  fireworkBoom() {
    this.playTone(85, 'sine', 0.55, 0.45, 0, 24);
    this.playNoise(0.75, 0.36, 950, 'lowpass', 0.01);
    this.playNoise(0.35, 0.25, 2200, 'bandpass', 0.02);
    for (let i = 0; i < 7; i++) {
      const delay = 0.12 + Math.random() * 0.55;
      this.playNoise(0.045, 0.14 + Math.random() * 0.08, 3200 + Math.random() * 2500, 'highpass', delay);
    }
  },

  cakeLayer() {
    this.playTone(170, 'sine', 0.18, 0.25, 0, 65);
  },

  candleAppear() {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      this.playTone(n, 'sine', 0.2, 0.14, i * 0.07);
    });
  },

  blow() {
    this.playNoise(0.32, 0.25, 450, 'lowpass', 0);
  },

  happyBirthday() {
    const melody = [
      [261.63, 0.25], [261.63, 0.25], [293.66, 0.45], [261.63, 0.45], [349.23, 0.45], [329.63, 0.75],
      [261.63, 0.25], [261.63, 0.25], [293.66, 0.45], [261.63, 0.45], [392.00, 0.45], [349.23, 0.75],
      [261.63, 0.25], [261.63, 0.25], [523.25, 0.45], [440.00, 0.45], [349.23, 0.45], [329.63, 0.45], [293.66, 0.65],
      [466.16, 0.25], [466.16, 0.25], [440.00, 0.45], [349.23, 0.45], [392.00, 0.45], [349.23, 0.90]
    ];
    let t = 0.05;
    melody.forEach(([freq, dur]) => {
      this.playTone(freq, 'triangle', dur * 0.92, 0.2, t);
      t += dur;
    });
  },

  treeGrow() {
    [261.63, 329.63, 392.0, 523.25].forEach((f, i) => {
      this.playTone(f, 'sine', 0.9, 0.06, i * 0.22);
    });
  },

  treeRustle() {
    this.playNoise(0.6, 0.22, 1600, 'bandpass', 0);
    this.playNoise(0.45, 0.16, 2800, 'highpass', 0.12);
  },

  fruitDrop(i = 0) {
    this.playTone(380 - i * 12, 'sine', 0.14, 0.09, 0, 140);
  },

  photoPop(index = 0) {
    const melody = [
      523.25, 659.25, 783.99, 987.77,
      880.00, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 1046.50
    ];
    const f = melody[index % melody.length];
    this.playTone(f, 'sine', 0.65, 0.12, 0);
    this.playTone(f * 1.5, 'triangle', 0.45, 0.04, 0.04);
    this.playTone(f * 2, 'sine', 0.35, 0.03, 0.08);
  },

  memoryAmbient() {
    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 392.00]
    ];
    let t = 0.1;
    chords.forEach(chord => {
      chord.forEach((note, idx) => {
        this.playTone(note, 'sine', 1.4, 0.06, t + idx * 0.18);
      });
      t += 1.4;
    });
  },

  quoteChord() {
    [261.63, 329.63, 392.00, 493.88, 587.33, 783.99].forEach((f, i) => {
      this.playTone(f, 'sine', 2.8, 0.08, i * 0.1);
      this.playTone(f, 'triangle', 2.2, 0.03, i * 0.1 + 0.05);
    });
  }
};

// ─────────────────────────────────────────────
// SCENE MANAGEMENT
// ─────────────────────────────────────────────
const SCENES = ['scene-cricket', 'scene-fireworks', 'scene-cake', 'scene-tree'];
let currentScene = 0;

function goToScene(idx) {
  if (idx < 0 || idx >= SCENES.length) return;
  document.getElementById(SCENES[currentScene]).classList.remove('active');
  currentScene = idx;
  document.getElementById(SCENES[currentScene]).classList.add('active');
  onSceneEnter(currentScene);
}

function onSceneEnter(idx) {
  if (idx === 0) startCricketScene();
  if (idx === 1) startFireworksScene();
  if (idx === 2) startCakeScene();
  if (idx === 3) startTreeScene();
}

// ─────────────────────────────────────────────
// CONFETTI OVERLAY
// ─────────────────────────────────────────────
const confettiDiv = document.createElement('div');
confettiDiv.id = 'confetti-overlay';
document.body.appendChild(confettiDiv);

function burst(x, y, count = 40) {
  const colors = ['#ff4081', '#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#e040fb', '#00bcd4', '#f44336'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const angle = Math.random() * Math.PI * 2;
    const dist = 55 + Math.random() * 170;
    const dur = 1.0 + Math.random() * 1.3;
    const size = 6 + Math.random() * 8;
    p.style.cssText = `
      left:${x}px; top:${y}px;
      width:${size}px; height:${size * 1.4}px;
      background:${colors[(Math.random() * colors.length) | 0]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      opacity:1;
      transition: transform ${dur}s ease-out, opacity ${dur}s ease-out;
    `;
    confettiDiv.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist * 2.4}px, ${Math.sin(angle) * dist * 2.4 + 160}px) rotate(${Math.random() * 720}deg)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), dur * 1000 + 50);
  }
}

// ═══════════════════════════════════════════════
// SCENE 1 — ULTRA-REALISTIC BROADCAST CRICKET
// ═══════════════════════════════════════════════
let cricketAnimId = null;

function startCricketScene() {
  const canvas = document.getElementById('cricketCanvas');
  const ctx = canvas.getContext('2d');
  const runsEl = document.getElementById('cricket-runs');
  const bannerEl = document.getElementById('cricket-shot-banner');
  const hintEl = document.getElementById('swipe-hint');

  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let totalRuns = 0;
  let ballsFaced = 0;
  const TARGET_RUNS = 24;
  runsEl.textContent = '0';
  bannerEl.classList.add('hidden');
  hintEl.textContent = '🏏 Read the pitch marker & swipe to play Cover Drive, Pull, or Loft! Target: 24';

  const crowdFlashes = Array.from({ length: 36 }, () => ({
    x: Math.random(), y: 0.13 + Math.random() * 0.11, phase: Math.random() * 12
  }));

  // Fielders positioned around the ground (normalized coords)
  const baseFielders = [
    { nx: 0.16, ny: 0.44 }, // Deep Point
    { nx: 0.84, ny: 0.44 }, // Deep Square Leg
    { nx: 0.25, ny: 0.62 }, // Cover
    { nx: 0.75, ny: 0.62 }, // Mid-wicket
    { nx: 0.34, ny: 0.35 }, // Long-off
    { nx: 0.66, ny: 0.35 }  // Long-on
  ];
  let fielders = baseFielders.map(f => ({ ...f, x: 0, y: 0 }));

  const dustPuffs = [];
  const impactSparks = [];

  const DELIVERIES = [
    { name: 'Fast Ball', speedKmh: 144, vyFactor: 0.0088, swing: 0, spinTurn: 0, bounceZ: 1.0 },
    { name: 'Outswinger', speedKmh: 136, vyFactor: 0.0082, swing: 0.045, spinTurn: 0.2, bounceZ: 0.95 },
    { name: 'Off-Spin', speedKmh: 89, vyFactor: 0.0064, swing: 0, spinTurn: -0.9, bounceZ: 1.25 },
    { name: 'Yorker', speedKmh: 148, vyFactor: 0.0094, swing: -0.02, spinTurn: 0, bounceZ: 0.72 }
  ];

  let currentDelivery = DELIVERIES[0];
  let state = 'runup'; // 'runup' | 'bowling' | 'hit' | 'missed' | 'won'
  let stateTimer = 0;
  let bowlerRunY = 0;
  let ball = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0, bounced: false, targetX: 0, targetY: 0 };
  let swipeTrail = [];
  let isSwiping = false;
  let swipeStart = null;
  let batSwing = 0;
  let batDir = 1;
  let umpireSignal = 'none'; // 'none' | 'six' | 'four'
  let cameraShake = 0;
  let lastTime = performance.now();

  function startRunup() {
    state = 'runup';
    stateTimer = 0;
    bowlerRunY = 0;
    umpireSignal = 'none';
    currentDelivery = DELIVERIES[Math.floor(Math.random() * DELIVERIES.length)];
    fielders = baseFielders.map(f => ({ x: f.nx * W, y: f.ny * H }));
  }

  function releaseBall() {
    state = 'bowling';
    stateTimer = 0;
    ballsFaced++;
    const horizonY = H * 0.30;
    const targetY = currentDelivery.name === 'Yorker' ? H * 0.73 : H * (0.56 + Math.random() * 0.12);
    const targetX = W / 2 + (Math.random() - 0.5) * (W * 0.055);
    const startX = W / 2 + (Math.random() - 0.5) * (W * 0.03);
    const framesToBounce = Math.max(12, (targetY - horizonY) / (H * currentDelivery.vyFactor));

    ball = {
      x: startX,
      y: horizonY + 6,
      z: 30,
      vx: (targetX - startX) / framesToBounce,
      vy: H * currentDelivery.vyFactor,
      vz: -0.95,
      spin: 0,
      bounced: false,
      targetX,
      targetY
    };
    SFX.bowl();
  }

  function showShotBanner(text, color = '#ffeb3b') {
    bannerEl.textContent = text;
    bannerEl.style.color = color;
    bannerEl.classList.remove('hidden');
    bannerEl.style.animation = 'none';
    void bannerEl.offsetWidth;
    bannerEl.style.animation = '';
  }

  function spawnSparks(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 5;
      impactSparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, a: 1 });
    }
  }

  function processSwipe(dx, dy, speed) {
    if (state !== 'bowling') return;
    batSwing = 1;
    batDir = dx >= 0 ? 1 : -1;

    const hitZoneTop = H * 0.50;
    const hitZoneBottom = H * 0.90;

    if (ball.y >= hitZoneTop && ball.y <= hitZoneBottom) {
      const sweetSpot = H * 0.74;
      const distFromSweet = Math.abs(ball.y - sweetSpot) / (H * 0.21);
      const timingScore = Math.max(0, 1 - distFromSweet);
      const powerScore = Math.min(1, speed / 19);
      const combined = timingScore * 0.56 + powerScore * 0.44;

      let runs = 1;
      if (combined > 0.65) runs = 6;
      else if (combined > 0.49) runs = 4;
      else if (combined > 0.35) runs = 3;
      else if (combined > 0.20) runs = 2;
      else runs = 1;

      totalRuns += runs;
      runsEl.textContent = totalRuns;
      SFX.batHit(runs);
      spawnSparks(ball.x, ball.y - ball.z, runs >= 4 ? 18 : 8);
      if (runs >= 4) cameraShake = runs === 6 ? 10 : 6;

      const angleSpread = (dx === 0 ? (Math.random() - 0.5) : Math.sign(dx)) * (4.5 + runs * 2.1);
      ball.vx = angleSpread;
      ball.vy = -(7.2 + runs * 3.0);
      ball.vz = runs === 6 ? 15 : runs === 4 ? 4.5 : 7;
      state = 'hit';
      stateTimer = 0;

      const shotName = Math.abs(dx) > Math.abs(dy) * 1.3
        ? (dx > 0 ? 'COVER DRIVE' : 'PULL SHOT')
        : 'STRAIGHT LOFT';

      if (totalRuns >= TARGET_RUNS) {
        state = 'won';
        umpireSignal = 'six';
        showShotBanner(`🏆 ${totalRuns} RUNS! TARGET ACHIEVED!`, '#ffeb3b');
        hintEl.textContent = '🎉 24+ RUNS SCORED! Firecrackers coming up!';
        SFX.sixCheer();
        burst(ball.x, ball.y, 75);
        setTimeout(() => {
          if (currentScene === 0) {
            cancelAnimationFrame(cricketAnimId);
            goToScene(1);
          }
        }, 1800);
      } else if (runs === 6) {
        umpireSignal = 'six';
        showShotBanner(`🏏 ${shotName} SIX! 6️⃣`, '#ffeb3b');
        SFX.sixCheer();
        burst(ball.x, ball.y, 45);
      } else if (runs === 4) {
        umpireSignal = 'four';
        showShotBanner(`🔥 ${shotName} FOUR! 4️⃣`, '#4caf50');
        burst(ball.x, ball.y, 30);
      } else if (runs === 2) {
        showShotBanner('⚡ DOUBLE! 2️⃣', '#00bcd4');
      } else if (runs === 1) {
        showShotBanner('👍 SINGLE! 1️⃣', '#80deea');
      } else {
        showShotBanner('🏃 THREE! 3️⃣', '#4dd0e1');
      }
    } else {
      SFX.miss();
      showShotBanner(ball.y < hitZoneTop ? 'Too Early! ⏳' : 'Too Late!', '#ff7043');
    }
  }

  function onStart(x, y) {
    if (currentScene !== 0) return;
    isSwiping = true;
    swipeStart = { x, y, t: performance.now() };
    swipeTrail = [{ x, y, alpha: 1 }];
  }
  function onMove(x, y) {
    if (!isSwiping || currentScene !== 0) return;
    swipeTrail.push({ x, y, alpha: 1 });
    if (swipeTrail.length > 16) swipeTrail.shift();
  }
  function onEnd(x, y) {
    if (!isSwiping || !swipeStart || currentScene !== 0) return;
    isSwiping = false;
    const dx = x - swipeStart.x;
    const dy = y - swipeStart.y;
    const dt = Math.max(14, performance.now() - swipeStart.t);
    const dist = Math.hypot(dx, dy);
    const speed = (dist / dt) * 16;
    if (dist > 20) processSwipe(dx, dy, speed);
    swipeStart = null;
  }

  canvas.onmousedown = e => onStart(e.clientX, e.clientY);
  canvas.onmousemove = e => onMove(e.clientX, e.clientY);
  canvas.onmouseup = e => onEnd(e.clientX, e.clientY);

  canvas.ontouchstart = e => { e.preventDefault(); onStart(e.touches[0].clientX, e.touches[0].clientY); };
  canvas.ontouchmove = e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); };
  canvas.ontouchend = e => { e.preventDefault(); onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY); };

  function drawStadium(now) {
    ctx.save();
    if (cameraShake > 0.2) {
      ctx.translate((Math.random() - 0.5) * cameraShake, (Math.random() - 0.5) * cameraShake);
      cameraShake *= 0.85;
    } else {
      cameraShake = 0;
    }

    ctx.clearRect(-20, -20, W + 40, H + 40);

    // 1. Night Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.30);
    sky.addColorStop(0, '#02050d');
    sky.addColorStop(1, '#0d1b2a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.30);

    // 2. Stadium Bowl, Sightscreen & Crowd
    ctx.fillStyle = '#09121e';
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.28, W * 0.68, H * 0.14, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // White Sightscreen behind bowler
    ctx.fillStyle = 'rgba(235, 240, 245, 0.85)';
    ctx.fillRect(W / 2 - Math.min(54, W * 0.09), H * 0.17, Math.min(108, W * 0.18), H * 0.08);

    // Crowd camera flashes
    crowdFlashes.forEach(cf => {
      const f = Math.sin(now * 0.005 + cf.phase);
      if (f > 0.72) {
        ctx.fillStyle = `rgba(255,255,240,${(f - 0.72) * 3.2})`;
        ctx.beginPath();
        ctx.arc(cf.x * W, cf.y * H, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // LED Perimeter Advertising Boards
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(0, H * 0.245, W, 10);
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ BIRTHDAY PREMIER LEAGUE  •  TARGET 24 RUNS  •  NIGHT FINALS ★', W / 2, H * 0.245 + 8);

    // 3. 4 Stadium Floodlight Towers + Volumetric Light Beams
    [0.10, 0.26, 0.74, 0.90].forEach(rx => {
      const lx = W * rx;
      const ly = H * 0.06;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(lx, H * 0.22); ctx.lineTo(lx, ly); ctx.stroke();

      const beam = ctx.createLinearGradient(lx, ly, W / 2, H * 0.6);
      beam.addColorStop(0, 'rgba(255,255,235,0.16)');
      beam.addColorStop(1, 'rgba(255,255,235,0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(lx - 14, ly); ctx.lineTo(lx + 14, ly);
      ctx.lineTo(W / 2 + W * 0.22, H * 0.65); ctx.lineTo(W / 2 - W * 0.22, H * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fffde7';
      ctx.shadowColor = '#fff9c4';
      ctx.shadowBlur = 18;
      ctx.fillRect(lx - 14, ly - 5, 28, 8);
      ctx.shadowBlur = 0;
    });

    // 4. Outfield Grass with Concentric Mowed Rings
    const fieldTop = H * 0.255;
    const grass = ctx.createRadialGradient(W / 2, H * 0.65, 30, W / 2, H * 0.65, Math.max(W, H) * 0.78);
    grass.addColorStop(0, '#2e7d32');
    grass.addColorStop(0.65, '#1b5e20');
    grass.addColorStop(1, '#0b2e10');
    ctx.fillStyle = grass;
    ctx.fillRect(0, fieldTop, W, H - fieldTop);

    [0.22, 0.34, 0.45].forEach(rad => {
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.62, W * rad, H * (rad * 0.78), 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 30-yard circle & Boundary Rope
    ctx.strokeStyle = 'rgba(255,255,255,0.24)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.62, W * 0.34, H * 0.26, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.62, W * 0.48, H * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 5. 3D Perspective Pitch + Crease Markings + Wear Patches
    const topW = Math.max(28, W * 0.045);
    const botW = Math.min(185, W * 0.175);
    const pitchGrad = ctx.createLinearGradient(0, H * 0.28, 0, H * 0.95);
    pitchGrad.addColorStop(0, '#b59469');
    pitchGrad.addColorStop(0.5, '#d4b483');
    pitchGrad.addColorStop(1, '#c4a272');
    ctx.fillStyle = pitchGrad;
    ctx.beginPath();
    ctx.moveTo(W / 2 - topW, H * 0.28);
    ctx.lineTo(W / 2 + topW, H * 0.28);
    ctx.lineTo(W / 2 + botW, H * 0.95);
    ctx.lineTo(W / 2 - botW, H * 0.95);
    ctx.closePath();
    ctx.fill();

    // Pitch rough/wear marks
    ctx.fillStyle = 'rgba(110, 75, 40, 0.22)';
    ctx.beginPath(); ctx.ellipse(W / 2 - 14, H * 0.66, 16, 6, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W / 2 + 12, H * 0.36, 9, 4, -0.1, 0, Math.PI * 2); ctx.fill();

    // Popping & Return Creases
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - botW * 0.94, H * 0.77);
    ctx.lineTo(W / 2 + botW * 0.94, H * 0.77);
    ctx.moveTo(W / 2 - botW * 0.72, H * 0.77);
    ctx.lineTo(W / 2 - botW * 0.78, H * 0.90);
    ctx.moveTo(W / 2 + botW * 0.72, H * 0.77);
    ctx.lineTo(W / 2 + botW * 0.78, H * 0.90);
    ctx.moveTo(W / 2 - topW * 1.1, H * 0.31);
    ctx.lineTo(W / 2 + topW * 1.1, H * 0.31);
    ctx.stroke();

    // Pitch Bounce Target Marker (while bowling before bounce)
    if (state === 'bowling' && !ball.bounced) {
      const pulse = 0.5 + 0.4 * Math.sin(now * 0.015);
      ctx.strokeStyle = `rgba(255, 235, 59, ${pulse})`;
      ctx.fillStyle = `rgba(255, 193, 7, ${pulse * 0.25})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ball.targetX, ball.targetY, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Sweet-spot ring
    if (state === 'bowling') {
      const pulse = 0.22 + 0.16 * Math.sin(now * 0.008);
      ctx.strokeStyle = `rgba(255, 235, 59, ${pulse})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.74, Math.min(68, botW * 0.6), 20, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Fielders on the Outfield
    fielders.forEach(f => {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(f.x, f.y + 12, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#00acc1';
      ctx.fillRect(f.x - 5, f.y - 2, 10, 12);
      ctx.fillStyle = '#ffccbc';
      ctx.beginPath(); ctx.arc(f.x, f.y - 6, 4.5, 0, Math.PI * 2); ctx.fill();
    });

    // 7. Umpire behind bowler's stumps
    const uX = W / 2 - Math.min(26, topW * 0.9);
    const uY = H * 0.265;
    ctx.fillStyle = '#263238';
    ctx.fillRect(uX - 5, uY, 10, 16);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(uX, uY - 5, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    if (umpireSignal === 'six') {
      ctx.strokeStyle = '#263238'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(uX - 4, uY + 2); ctx.lineTo(uX - 11, uY - 11); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(uX + 4, uY + 2); ctx.lineTo(uX + 11, uY - 11); ctx.stroke();
    } else if (umpireSignal === 'four') {
      ctx.strokeStyle = '#263238'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(uX + 4, uY + 3); ctx.lineTo(uX + 15, uY + 1); ctx.stroke();
    }

    // 8. 3D Wooden Stumps + LED Zing Bails
    const stumpY = H * 0.86;
    ctx.strokeStyle = '#ffecb3';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    [-13, 0, 13].forEach(ox => {
      ctx.beginPath();
      ctx.moveTo(W / 2 + ox, stumpY);
      ctx.lineTo(W / 2 + ox, stumpY - 40);
      ctx.stroke();
    });
    ctx.strokeStyle = '#ff5252';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 14, stumpY - 40);
    ctx.lineTo(W / 2 + 14, stumpY - 40);
    ctx.stroke();

    // 9. Animated Bowler
    const bY = H * 0.225 + bowlerRunY * (H * 0.06);
    const bScale = 0.75 + bowlerRunY * 0.25;
    ctx.save();
    ctx.translate(W / 2, bY);
    ctx.scale(bScale, bScale);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(0, 26, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
    const legSwing = state === 'runup' ? Math.sin(bowlerRunY * 22) * 6 : 0;
    ctx.strokeStyle = '#eceff1'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-3, 12); ctx.lineTo(-4 + legSwing, 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(4 - legSwing, 25); ctx.stroke();
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(-7, -4, 14, 17);
    const armAngle = state === 'runup' ? -Math.PI + bowlerRunY * Math.PI * 2.2 : 0.4;
    ctx.strokeStyle = '#ffccbc'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(6 + Math.cos(armAngle) * 14, -2 + Math.sin(armAngle) * 14); ctx.stroke();
    ctx.fillStyle = '#ffccbc';
    ctx.beginPath(); ctx.arc(0, -10, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // 10. Batsman + Bat at Crease
    const batX = W / 2 + Math.min(48, botW * 0.42);
    const batY = H * 0.77;
    ctx.save();
    ctx.translate(batX, batY);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -2, 8, 26);
    ctx.fillRect(2, -2, 8, 26);
    ctx.fillStyle = '#0277bd';
    ctx.fillRect(-11, -30, 22, 28);
    ctx.fillStyle = '#01579b';
    ctx.beginPath(); ctx.arc(0, -39, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(-6, -38, 10, 5);
    const swingAngle = batSwing > 0 ? Math.sin((1 - batSwing) * Math.PI) * 2.1 * batDir : -0.45;
    ctx.save();
    ctx.translate(-8, -14);
    ctx.rotate(swingAngle);
    ctx.fillStyle = '#212121';
    ctx.fillRect(-2.5, -24, 5, 20);
    ctx.fillStyle = '#e6c280';
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-7, -4, 14, 46);
    ctx.strokeRect(-7, -4, 14, 46);
    ctx.restore();
    ctx.restore();

    // 11. Broadcast Speed-Gun & Delivery Pill (Bottom-Left)
    ctx.fillStyle = 'rgba(8, 14, 24, 0.72)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    const pillW = 165, pillH = 38;
    const pillX = 14, pillY = H - 72;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ ${currentDelivery.speedKmh} km/h`, pillX + 10, pillY + 16);
    ctx.fillStyle = '#cfd8dc';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${currentDelivery.name} • Ball ${ballsFaced}`, pillX + 10, pillY + 31);

    ctx.restore();
  }

  function drawBallAndEffects() {
    for (let i = dustPuffs.length - 1; i >= 0; i--) {
      const d = dustPuffs[i];
      ctx.fillStyle = `rgba(215, 190, 150, ${d.a})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      d.r += 0.5; d.a -= 0.03;
      if (d.a <= 0) dustPuffs.splice(i, 1);
    }

    for (let i = impactSparks.length - 1; i >= 0; i--) {
      const s = impactSparks[i];
      ctx.fillStyle = `rgba(255, 235, 59, ${s.a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2); ctx.fill();
      s.x += s.vx; s.y += s.vy; s.a -= 0.06;
      if (s.a <= 0) impactSparks.splice(i, 1);
    }

    if (state === 'runup') return;
    const progress = Math.max(0, Math.min(1.4, (ball.y - H * 0.28) / (H * 0.58)));
    const r = Math.max(4.5, 5 + progress * 10);

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(ball.x, ball.y + 3, r * 0.95, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    const drawY = ball.y - ball.z;
    const grad = ctx.createRadialGradient(ball.x - r * 0.3, drawY - r * 0.3, r * 0.1, ball.x, drawY, r);
    grad.addColorStop(0, '#ff6659');
    grad.addColorStop(0.5, '#c62828');
    grad.addColorStop(1, '#4e0000');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, drawY, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.88)';
    ctx.lineWidth = Math.max(1, r * 0.14);
    ctx.beginPath();
    ctx.ellipse(ball.x, drawY, r * 0.8, r * 0.35, ball.spin, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawSwipeTrail() {
    for (let i = 1; i < swipeTrail.length; i++) {
      const p0 = swipeTrail[i - 1];
      const p1 = swipeTrail[i];
      ctx.strokeStyle = `rgba(255, 235, 59, ${p1.alpha})`;
      ctx.lineWidth = 6 * p1.alpha;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      p1.alpha *= 0.87;
    }
    swipeTrail = swipeTrail.filter(p => p.alpha > 0.05);
  }

  startRunup();

  function loop(now) {
    if (currentScene !== 0) return;
    const dt = Math.min(2.2, (now - lastTime) / 16.667);
    lastTime = now;

    if (batSwing > 0) batSwing = Math.max(0, batSwing - 0.08 * dt);

    if (state === 'runup') {
      bowlerRunY += 0.024 * dt;
      if (bowlerRunY >= 1) releaseBall();
    } else if (state === 'bowling') {
      ball.vx += currentDelivery.swing * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.z += ball.vz * dt;
      ball.vz -= 0.11 * dt;
      ball.spin += 0.26 * dt;

      if (ball.z <= 0) {
        ball.z = 0;
        ball.vz = Math.abs(ball.vz) * 0.68 * currentDelivery.bounceZ;
        if (!ball.bounced) {
          ball.bounced = true;
          ball.vx += currentDelivery.spinTurn;
          SFX.pitchBounce();
          dustPuffs.push({ x: ball.x, y: ball.y, r: 4, a: 0.75 });
        }
      }

      if (ball.y > H * 0.93) {
        state = 'missed';
        stateTimer = 0;
        SFX.miss();
        showShotBanner('Missed! Next ball...', '#90caf9');
      }
    } else if (state === 'hit' || state === 'won') {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.z = Math.max(0, ball.z + ball.vz * dt);
      ball.vz -= 0.35 * dt;
      ball.spin += 0.35 * dt;

      // Fielders chase toward the ball
      fielders.forEach(f => {
        const dx = ball.x - f.x;
        const dy = ball.y - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          f.x += (dx / dist) * 2.2 * dt;
          f.y += (dy / dist) * 2.2 * dt;
        }
      });

      stateTimer += dt;
      if (state === 'hit' && (stateTimer > 65 || ball.y < -60 || ball.x < -60 || ball.x > W + 60)) {
        bannerEl.classList.add('hidden');
        startRunup();
      }
    } else if (state === 'missed') {
      stateTimer += dt;
      if (stateTimer > 50) {
        bannerEl.classList.add('hidden');
        startRunup();
      }
    }

    drawStadium(now);
    drawBallAndEffects();
    drawSwipeTrail();

    cricketAnimId = requestAnimationFrame(loop);
  }

  if (cricketAnimId) cancelAnimationFrame(cricketAnimId);
  cricketAnimId = requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════
// SCENE 2 — REALISTIC FIRECRACKERS / FIREWORKS
// ═══════════════════════════════════════════════
let fwAnimId = null;
const particles = [];
const rockets = [];
let skyFlash = 0;
let skyFlashColor = '#ffffff';

class FWRocket {
  constructor(W, H) {
    this.x = W * (0.2 + Math.random() * 0.6);
    this.y = H;
    this.targetY = H * (0.14 + Math.random() * 0.36);
    this.vx = (Math.random() - 0.5) * 2.4;
    this.vy = -(11 + Math.random() * 4.5);
    const palette = ['#ff4081', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#e040fb', '#00bcd4', '#ff5252'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.color2 = palette[Math.floor(Math.random() * palette.length)];
    this.trail = [];
    this.exploded = false;
    SFX.fireworkLaunch();
  }
  update(dt) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 0.14 * dt;
    if (this.y <= this.targetY || this.vy >= -1.5) {
      this.exploded = true;
      explodeFirework(this.x, this.y, this.color, this.color2);
    }
  }
  draw(ctx) {
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.globalAlpha = (i / this.trail.length) * 0.7;
      ctx.fillStyle = '#ffe082';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 1.5 + (i / this.trail.length) * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class FWParticle {
  constructor(x, y, color, speed, angle, isWillow = false) {
    this.x = x; this.y = y;
    this.color = color;
    this.isWillow = isWillow;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = isWillow ? (0.008 + Math.random() * 0.008) : (0.013 + Math.random() * 0.015);
    this.radius = isWillow ? (1.8 + Math.random() * 1.8) : (2 + Math.random() * 2.5);
    this.trail = [];
    this.twinkle = Math.random() > 0.45;
  }
  update(dt) {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha });
    if (this.trail.length > (this.isWillow ? 12 : 8)) this.trail.shift();
    this.vy += (this.isWillow ? 0.15 : 0.09) * dt;
    this.vx *= Math.pow(0.975, dt);
    this.vy *= Math.pow(0.985, dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.alpha -= this.decay * dt;
  }
  draw(ctx) {
    for (let i = 1; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.globalAlpha = Math.max(0, t.a * (i / this.trail.length) * 0.45);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.radius * 0.8;
      ctx.beginPath();
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }
    const flicker = this.twinkle && Math.random() > 0.65 ? 0.35 : 1;
    ctx.globalAlpha = Math.max(0, this.alpha * flicker);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

function explodeFirework(x, y, color, color2) {
  SFX.fireworkBoom();
  skyFlash = 0.18;
  skyFlashColor = color;
  burst(x, y, 16);

  const style = Math.floor(Math.random() * 3);
  if (style === 0) {
    for (let i = 0; i < 85; i++) {
      const angle = (Math.PI * 2 * i) / 85 + (Math.random() - 0.5) * 0.1;
      const speed = 3.5 + Math.random() * 6.5;
      particles.push(new FWParticle(x, y, i % 3 === 0 ? '#ffffff' : color, speed, angle, false));
    }
  } else if (style === 1) {
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push(new FWParticle(x, y, i % 2 === 0 ? '#ffd54f' : '#ffab40', speed, angle, true));
    }
  } else {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      particles.push(new FWParticle(x, y, color, 6.5 + Math.random() * 1.2, angle, false));
    }
    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36;
      particles.push(new FWParticle(x, y, color2, 3.2 + Math.random() * 0.8, angle, false));
    }
  }
}

function startFireworksScene() {
  const canvas = document.getElementById('fwCanvas');
  const ctx = canvas.getContext('2d');
  const label = document.getElementById('fw-label');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles.length = 0;
  rockets.length = 0;
  skyFlash = 0;
  let launches = 0;
  const totalLaunches = 10;
  let lastLaunch = 0;
  let lastTime = performance.now();

  if (fwAnimId) cancelAnimationFrame(fwAnimId);
  label.textContent = '🧨 24 RUNS! Firecrackers! 🎆';

  function fwLoop(ts) {
    if (currentScene !== 1) return;
    const dt = Math.min(2.2, (ts - lastTime) / 16.667);
    lastTime = ts;

    ctx.fillStyle = 'rgba(0,0,14,0.24)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (skyFlash > 0.01) {
      ctx.save();
      ctx.globalAlpha = skyFlash;
      ctx.fillStyle = skyFlashColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      skyFlash *= Math.pow(0.85, dt);
    }

    if (launches < totalLaunches && ts - lastLaunch > 420 + Math.random() * 320) {
      rockets.push(new FWRocket(canvas.width, canvas.height));
      launches++;
      lastLaunch = ts;
      if (launches === totalLaunches) {
        setTimeout(() => {
          if (currentScene === 1) label.textContent = '🎂 Here comes the Cake! 🎂';
        }, 900);
        setTimeout(() => {
          if (currentScene === 1) goToScene(2);
        }, 2800);
      }
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].update(dt);
      rockets[i].draw(ctx);
      if (rockets[i].exploded) rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(dt);
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    fwAnimId = requestAnimationFrame(fwLoop);
  }
  fwAnimId = requestAnimationFrame(fwLoop);
}

// ═══════════════════════════════════════════════
// SCENE 3 — 3-LAYER CAKE (SEQUENTIAL BUILD) + CANDLE BLOW
// ═══════════════════════════════════════════════
let blowCount = 0;
let cakeReadyForBlow = false;
let cakeConfettiInterval = null;
let micActive = false;

function spawnCakeParticles() {
  const scene = document.getElementById('scene-cake');
  const emojis = ['🎊', '✨', '🎉', '⭐', '💫', '🌟', '🎈', '🎀'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      top:${100 + Math.random() * 10}%;
      font-size:${1.2 + Math.random() * 1.4}rem;
      pointer-events:none;
      animation: floatUp ${3 + Math.random() * 3}s ease-in forwards;
      opacity:0.9;
      z-index:10;
    `;
    scene.appendChild(el);
    setTimeout(() => el.remove(), 6500);
  }
}

(function () {
  const st = document.createElement('style');
  st.textContent = `@keyframes floatUp {
    0%   { transform:translateY(0) scale(1) rotate(0deg); opacity:.9; }
    100% { transform:translateY(-110vh) scale(1.3) rotate(120deg); opacity:0; }
  }`;
  document.head.appendChild(st);
})();

function startCakeScene() {
  blowCount = 0;
  cakeReadyForBlow = false;
  document.getElementById('blow-num').textContent = '0';
  document.getElementById('flame').className = 'flickering';
  document.getElementById('hb-message').classList.add('hidden');
  document.getElementById('hb-message').classList.remove('show');
  document.getElementById('blow-instructions').classList.add('hidden');
  document.getElementById('blow-counter').classList.add('hidden');

  const plate = document.getElementById('cake-plate');
  const layer3 = document.querySelector('.layer3');
  const layer2 = document.querySelector('.layer2');
  const layer1 = document.querySelector('.layer1');
  const candle = document.getElementById('candle-area');

  [plate, layer3, layer2, layer1, candle].forEach(el => el.classList.remove('dropped'));

  const sequence = [
    { el: plate, delay: 300, sfx: () => SFX.cakeLayer() },
    { el: layer3, delay: 850, sfx: () => SFX.cakeLayer() },
    { el: layer2, delay: 1450, sfx: () => SFX.cakeLayer() },
    { el: layer1, delay: 2050, sfx: () => SFX.cakeLayer() },
    { el: candle, delay: 2650, sfx: () => SFX.candleAppear() },
  ];

  sequence.forEach(step => {
    setTimeout(() => {
      if (currentScene !== 2) return;
      step.el.classList.add('dropped');
      step.sfx();
    }, step.delay);
  });

  setTimeout(() => {
    if (currentScene !== 2) return;
    cakeReadyForBlow = true;
    document.getElementById('blow-instructions').classList.remove('hidden');
    document.getElementById('blow-counter').classList.remove('hidden');
    setupBlowDetection();
  }, 3250);

  if (cakeConfettiInterval) clearInterval(cakeConfettiInterval);
  cakeConfettiInterval = setInterval(() => {
    if (currentScene === 2) spawnCakeParticles();
    else clearInterval(cakeConfettiInterval);
  }, 1800);
}

function setupBlowDetection() {
  const instr = document.getElementById('blow-instructions');
  instr.onclick = registerBlow;

  if (!micActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      micActive = true;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let lastBlow = 0;
      let blowLatch = false;

      function checkBlow() {
        if (currentScene !== 2 || blowCount >= 3) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const now = Date.now();
        if (avg > 28 && !blowLatch && now - lastBlow > 750) {
          blowLatch = true;
          lastBlow = now;
          registerBlow();
        } else if (avg < 15) {
          blowLatch = false;
        }
        requestAnimationFrame(checkBlow);
      }
      checkBlow();
    }).catch(() => {
      instr.textContent = '👆 Tap here (or press Space) 3 times to blow out the candle!';
    });
  }
}

function registerBlow() {
  if (!cakeReadyForBlow || blowCount >= 3 || currentScene !== 2) return;
  blowCount++;
  document.getElementById('blow-num').textContent = blowCount;
  SFX.blow();

  const flame = document.getElementById('flame');
  flame.style.transform = 'scaleX(2.4) skewX(20deg)';
  setTimeout(() => { flame.style.transform = ''; }, 280);

  burst(window.innerWidth / 2, window.innerHeight / 3, 18);

  if (blowCount >= 3) {
    setTimeout(() => {
      flame.classList.remove('flickering');
      flame.classList.add('blown');
      document.getElementById('blow-instructions').classList.add('hidden');

      setTimeout(() => {
        const hb = document.getElementById('hb-message');
        hb.classList.remove('hidden');
        setTimeout(() => hb.classList.add('show'), 40);
        SFX.happyBirthday();

        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            burst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6, 55);
          }, i * 240);
        }

        setTimeout(() => {
          if (currentScene === 2) goToScene(3);
        }, 5200);
      }, 450);
    }, 350);
  }
}

// ═══════════════════════════════════════════════
// SCENE 4 — ANIMATED GROWING TREE + SHAKE FRUITS + MEMORIES + QUOTE
// ═══════════════════════════════════════════════
let treeAnimId = null;

function startTreeScene() {
  const canvas = document.getElementById('treeCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  document.getElementById('tree-photos').innerHTML = '';
  document.getElementById('shake-prompt').classList.add('hidden');
  document.getElementById('photo-spotlight').classList.add('hidden');
  document.getElementById('quote-overlay').classList.add('hidden');

  if (treeAnimId) cancelAnimationFrame(treeAnimId);

  // Pre-generate deterministic stars
  const stars = Array.from({ length: 110 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.65,
    r: 0.5 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2
  }));

  // Pre-generate tree branches, leaves & fruits for smooth animated growth
  const branches = [];
  const leaves = [];
  const fruits = [];
  const fruitEmojis = ['🍎', '🥭', '🍊', '🍒', '🍑'];
  const greens = ['#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#145208'];

  function buildTreeData(x, y, angle, length, width, depth, delayOffset) {
    if (depth === 0 || length < 7) return;
    const ex = x + Math.cos(angle) * length;
    const ey = y + Math.sin(angle) * length;
    branches.push({ x, y, ex, ey, width, depth, start: delayOffset, end: delayOffset + 0.14 });

    if (depth <= 3) {
      for (let i = 0; i < 4; i++) {
        leaves.push({
          x: ex + (Math.random() - 0.5) * 36,
          y: ey + (Math.random() - 0.5) * 36,
          r: 7 + Math.random() * 12,
          rot: Math.random() * Math.PI,
          color: greens[Math.floor(Math.random() * greens.length)],
          appearAt: delayOffset + 0.15 + Math.random() * 0.12
        });
      }
    }

    if (depth === 2 && Math.random() > 0.35 && fruits.length < 16) {
      fruits.push({
        x: ex + (Math.random() - 0.5) * 18,
        y: ey + 6 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 0,
        emoji: fruitEmojis[fruits.length % fruitEmojis.length],
        size: Math.min(26, Math.max(18, W * 0.032)),
        appearAt: 0.72 + Math.random() * 0.18,
        falling: false,
        landed: false,
        rot: 0,
        vrot: (Math.random() - 0.5) * 0.12
      });
    }

    const spread = (Math.PI / 4.2) + Math.random() * 0.12;
    const wobble = (Math.random() - 0.5) * 0.22;
    const ratio = 0.64 + Math.random() * 0.11;
    const nextDelay = delayOffset + 0.10;

    buildTreeData(ex, ey, angle - spread + wobble, length * ratio, width * 0.66, depth - 1, nextDelay);
    buildTreeData(ex, ey, angle + spread + wobble, length * ratio, width * 0.66, depth - 1, nextDelay);
    if (depth > 4) {
      buildTreeData(ex, ey, angle + wobble * 0.5, length * 0.58, width * 0.52, depth - 2, nextDelay);
    }
  }

  buildTreeData(W / 2, H * 0.84, -Math.PI / 2, Math.min(H * 0.27, W * 0.32), 14, 7, 0);

  let growthProgress = 0; // 0 -> 1 over ~2.2s
  let treePhase = 'growing'; // 'growing' | 'waitShake' | 'fallingFruits' | 'memories'
  let shakeAngle = 0;
  let shakeVel = 0;
  let memoriesStarted = false;
  let lastTime = performance.now();

  SFX.treeGrow();

  function triggerShake() {
    if (treePhase !== 'waitShake') return;
    treePhase = 'fallingFruits';
    document.getElementById('shake-prompt').classList.add('hidden');
    SFX.treeRustle();
    shakeVel = 0.14;

    fruits.forEach((f, idx) => {
      setTimeout(() => {
        f.falling = true;
        SFX.fruitDrop(idx);
      }, idx * 55);
    });

    // After fruits fall, start memories!
    setTimeout(() => {
      if (currentScene === 3 && !memoriesStarted) {
        memoriesStarted = true;
        treePhase = 'memories';
        placePhotos(W, H);
        animateTreePhotosAndShowcase();
      }
    }, 1500);
  }

  // Shake Button, Canvas Tap/Swipe, and Mobile DeviceMotion
  const shakeBtn = document.getElementById('shake-btn');
  shakeBtn.onclick = triggerShake;

  let dragStartX = null;
  canvas.onmousedown = e => { dragStartX = e.clientX; };
  canvas.onmouseup = e => {
    if (treePhase === 'waitShake') triggerShake();
    dragStartX = null;
  };
  canvas.ontouchstart = e => {
    dragStartX = e.touches[0].clientX;
  };
  canvas.ontouchend = e => {
    if (treePhase === 'waitShake') triggerShake();
    dragStartX = null;
  };

  function onDeviceMotion(e) {
    if (currentScene !== 3 || treePhase !== 'waitShake') return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (mag > 26) {
      triggerShake();
      window.removeEventListener('devicemotion', onDeviceMotion);
    }
  }
  window.addEventListener('devicemotion', onDeviceMotion);

  function renderTreeFrame(now) {
    if (currentScene !== 3) {
      window.removeEventListener('devicemotion', onDeviceMotion);
      return;
    }
    const dt = Math.min(2.2, (now - lastTime) / 16.667);
    lastTime = now;

    if (treePhase === 'growing') {
      growthProgress = Math.min(1, growthProgress + 0.0085 * dt);
      if (growthProgress >= 1) {
        treePhase = 'waitShake';
        document.getElementById('shake-prompt').classList.remove('hidden');
      }
    }

    // Spring physics for tree shake
    const springForce = -0.18 * shakeAngle;
    shakeVel = (shakeVel + springForce * dt) * Math.pow(0.88, dt);
    shakeAngle += shakeVel * dt;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#020c14');
    sky.addColorStop(1, '#071a0a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Twinkling stars
    stars.forEach(s => {
      ctx.globalAlpha = 0.4 + 0.5 * Math.sin(now * 0.003 + s.phase);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Moon
    ctx.fillStyle = '#f5ffea';
    ctx.shadowColor = '#aaffaa';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(W * 0.84, H * 0.11, Math.min(34, W * 0.07), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ground
    const ground = ctx.createLinearGradient(0, H * 0.82, 0, H);
    ground.addColorStop(0, '#0d2e06');
    ground.addColorStop(1, '#040f02');
    ctx.fillStyle = ground;
    ctx.fillRect(0, H * 0.82, W, H * 0.18);

    // Draw tree pivoted at trunk base for smooth shake
    ctx.save();
    ctx.translate(W / 2, H * 0.84);
    ctx.rotate(shakeAngle);
    ctx.translate(-W / 2, -H * 0.84);

    // Branches
    branches.forEach(b => {
      if (growthProgress < b.start) return;
      const t = Math.min(1, (growthProgress - b.start) / (b.end - b.start));
      const cx = b.x + (b.ex - b.x) * t;
      const cy = b.y + (b.ey - b.y) * t;
      const grad = ctx.createLinearGradient(b.x, b.y, cx, cy);
      grad.addColorStop(0, b.depth > 5 ? '#3d1f00' : '#2a1200');
      grad.addColorStop(1, b.depth > 3 ? '#5c3300' : '#8b5e2a');
      ctx.strokeStyle = grad;
      ctx.lineWidth = b.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    });

    // Leaves
    leaves.forEach(l => {
      if (growthProgress < l.appearAt) return;
      const scale = Math.min(1, (growthProgress - l.appearAt) / 0.15);
      ctx.fillStyle = l.color;
      ctx.globalAlpha = 0.85 * scale;
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, l.r * scale, l.r * 0.65 * scale, l.rot, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Hanging fruits (not yet falling)
    fruits.forEach(f => {
      if (f.falling || growthProgress < f.appearAt) return;
      const scale = Math.min(1, (growthProgress - f.appearAt) / 0.12);
      ctx.font = `${Math.round(f.size * scale)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, f.x, f.y);
    });

    ctx.restore();

    // Falling fruits (independent of tree shake)
    const groundY = H * 0.86;
    fruits.forEach(f => {
      if (!f.falling) return;
      if (!f.landed) {
        f.vy += 0.42 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.vrot * dt;
        if (f.y >= groundY) {
          f.y = groundY;
          f.vy = -f.vy * 0.35;
          f.vx *= 0.6;
          if (Math.abs(f.vy) < 1.2) {
            f.landed = true;
            f.vy = 0;
          }
        }
      }
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.font = `${Math.round(f.size)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, 0, 0);
      ctx.restore();
    });

    treeAnimId = requestAnimationFrame(renderTreeFrame);
  }

  treeAnimId = requestAnimationFrame(renderTreeFrame);
}

function getLeafPositions(W, H, count) {
  const cx = W / 2;
  const treeTop = H * 0.22;
  const treeSpan = Math.min(W * 0.40, 380);
  const positions = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const rowY = treeTop + row * (H * 0.13);
    const rowWidth = treeSpan * (0.65 + row * 0.25);
    const stepX = (rowWidth * 2) / 3;
    const px = (cx - rowWidth) + col * stepX + (Math.random() - 0.5) * 28;
    const py = rowY + (Math.random() - 0.5) * 28;
    positions.push({ x: px, y: py });
  }
  return positions;
}

function placePhotos(W, H) {
  const container = document.getElementById('tree-photos');
  container.innerHTML = '';
  const positions = getLeafPositions(W, H, PHOTOS.length);
  const photoSize = Math.min(78, Math.max(48, W * 0.11));

  PHOTOS.forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'tree-photo';
    img.src = src;
    img.alt = `Memory ${i + 1}`;
    const rot = (Math.random() - 0.5) * 18;
    img.style.setProperty('--rot', rot + 'deg');
    img.style.left = (positions[i].x - photoSize / 2) + 'px';
    img.style.top = (positions[i].y - photoSize / 2) + 'px';
    img.style.width = photoSize + 'px';
    img.style.height = photoSize + 'px';
    container.appendChild(img);
  });
}

function animateTreePhotosAndShowcase() {
  const photos = Array.from(document.querySelectorAll('.tree-photo'));
  SFX.memoryAmbient();
  setTimeout(() => {
    if (currentScene === 3) SFX.memoryAmbient();
  }, 5800);

  // 1) Pop all photos into tree leaves
  photos.forEach((img, i) => {
    setTimeout(() => {
      if (currentScene !== 3) return;
      img.classList.add('visible');
      SFX.photoPop(i);
      const rect = img.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    }, 150 + i * 100);
  });

  // 2) Automatically open each photo in spotlight one by one
  const startShowcaseDelay = 150 + photos.length * 100 + 350;
  const perPhotoDuration = 800;

  photos.forEach((img, i) => {
    setTimeout(() => {
      if (currentScene !== 3) return;
      photos.forEach(p => p.classList.remove('active-leaf'));
      img.classList.add('active-leaf');

      const spotlight = document.getElementById('photo-spotlight');
      const spotImg = document.getElementById('spotlight-img');
      const spotNum = document.getElementById('spotlight-num');

      spotImg.src = PHOTOS[i];
      spotNum.textContent = i + 1;
      spotlight.classList.remove('hidden');
      SFX.photoPop(i);
    }, startShowcaseDelay + i * perPhotoDuration);
  });

  // 3) After all pics opened, show motivational quote for life!
  const quoteDelay = startShowcaseDelay + photos.length * perPhotoDuration + 250;
  setTimeout(() => {
    if (currentScene !== 3) return;
    photos.forEach(p => p.classList.remove('active-leaf'));
    document.getElementById('photo-spotlight').classList.add('hidden');
    document.getElementById('quote-overlay').classList.remove('hidden');
    SFX.quoteChord();
    burst(window.innerWidth / 2, window.innerHeight / 2, 65);
  }, quoteDelay);
}

// Replay button
document.getElementById('replay-btn').addEventListener('click', () => {
  goToScene(0);
});

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  goToScene(0);

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && currentScene === 2) {
      e.preventDefault();
      registerBlow();
    }
  });
});
