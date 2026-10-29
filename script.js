/**
 * ============================================================================
 * HARSH & MONIKA — SACRED BUDDHIST WEDDING INVITATION WEBSITE
 * Pure HTML5, CSS3 & Vanilla JavaScript
 * Zero External Frameworks & Zero Build Steps Required
 * Deployable directly on GitHub Pages
 * ============================================================================
 */

'use strict';

/* ==========================================================================
   1. MASTER CONFIGURATION
   All confirmed wedding details centrally located here.
   Do not invent missing information.
   ========================================================================== */
const CONFIG = {
  // Couple Information
  couple: {
    groom: "Harsh",
    groomHindi: "हर्ष",
    bride: "Monika",
    brideHindi: "मोनिका",
    invitingFamily: "Both Families",
    invitingFamilyHindi: "समस्त परिवार",
    weddingDateFormatted: "Wednesday, 25 November 2026",
    weddingDateHindi: "बुधवार, 25 नवंबर 2026",
    weddingTimeFormatted: "7:00 PM IST",
    weddingTimeHindi: "सायं 7:00 बजे",
    // Venue Information
    venueName: "THE ROYAL AVENUE",
    venueLandmark: "Beside Vijay Farms, Bhadesi Mafi",
    venueCity: "Aligarh, Uttar Pradesh 202002",
    venueFullAddress: "Beside Vijay Farms, Bhadesi Mafi, Aligarh, Uttar Pradesh 202002",
    googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=THE+ROYAL+AVENUE+Beside+Vijay+Farms+Bhadesi+Mafi+Aligarh+Uttar+Pradesh+202002"
  },

  // Wedding Date & Time for Countdown Timer (ISO 8601 string in IST UTC+5:30)
  weddingDateIso: "2026-11-25T19:00:00+05:30",

  // WhatsApp Contact Configuration
  // Provide verified phone number with country code (e.g. 919876543210 for India +91)
  // Do not include '+', spaces, brackets, or dashes
  whatsAppContactNumber: "916398334625",
  whatsAppContactMessage: "Namaste! We received the wedding invitation for Harsh & Monika. Sending our warmest blessings to the couple and family!",

  // Resolve WhatsApp Contact URL
  getWhatsAppContactUrl() {
    const cleanNumber = (this.whatsAppContactNumber || "").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(this.whatsAppContactMessage || "");
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  },

  // Creator Details Configuration
  // Enter creator name and optional social links. Empty links are automatically hidden.
  creator: {
    name: "A.K. Bardhan", // Replace with your name or brand
    role: "Designed & Developed with ❤️",
    github: "https://github.com/dilipk2026",
    portfolio: "",
    instagram: ""
  },

  // Canonical URL for sharing:
  // If hosted on GitHub Pages (e.g. "https://username.github.io/wedding/"), set here
  // If left empty (""), it automatically detects the current browser URL
  canonicalUrl: "",

  // Resolve public sharing URL
  getShareUrl() {
    if (this.canonicalUrl && this.canonicalUrl.trim() !== "") {
      return this.canonicalUrl.trim();
    }
    const loc = window.location;
    return `${loc.origin}${loc.pathname}`;
  }
};

/* ==========================================================================
   2. DOM READY & INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  OpeningScreenController.init();
  SoundController.init();
  HeroThreeSceneController.init();
  RingsThreeSceneController.init();
  GSAPAnimationController.init();
  AmbientCanvasController.init();
  CountdownController.init();
  EnvelopeCardController.init();
  WhatsAppContactController.init();
  DownloadInvitationController.init();
  AutoScrollController.init();
  ShareController.init();
  NavigationController.init();
  CalendarController.init();
  CreatorController.init();
});

/* ==========================================================================
   3. ANIMATED WELCOME SCREEN CONTROLLER
   ========================================================================== */
const OpeningScreenController = {
  init() {
    const btn = document.getElementById('btnOpenInvitation');
    const screen = document.getElementById('openingScreen');
    if (!btn || !screen) return;

    btn.addEventListener('click', () => this.open());
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.open();
      }
    });
  },

  open() {
    const screen = document.getElementById('openingScreen');
    if (!screen) return;

    // Start soothing flute meditation audio on explicit user interaction
    SoundController.startAudio();

    screen.classList.add('dismissed');
    screen.setAttribute('aria-hidden', 'true');
    screen.style.pointerEvents = 'none';
    document.body.style.overflow = '';

    // Scroll smoothly to hero
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus on first navigation link for keyboard accessibility
    setTimeout(() => {
      const brand = document.querySelector('.nav-brand');
      if (brand) brand.focus();
    }, 800);

    // Automatically begin gentle auto-scroll after welcoming the guest (unless reduced motion is preferred)
    setTimeout(() => {
      if (typeof AutoScrollController !== 'undefined' && !AutoScrollController.reducedMotion) {
        if (!AutoScrollController.isPlaying) {
          AutoScrollController.start();
        }
      }
    }, 1800);
  }
};

/* ==========================================================================
   4. JOYFUL INDIAN WEDDING BGM SYNTHESIZER
   Web Audio API celebratory procedural background music engine.
   Plays a festive, uplifting Indian wedding melody (Raag Bilawal / Pahadi)
   featuring joyful Bansuri flute, sparkling Santoor arpeggios, auspicious
   temple bells, and a warm Tanpura harmonic drone — 100% offline & zero external deps.
   ========================================================================== */
const SoundController = {
  audioCtx: null,
  masterGain: null,
  droneGain: null,
  isPlaying: false,
  schedulerTimer: null,
  currentStep: 0,
  nextNoteTime: 0,
  droneOscs: [],
  html5Audio: null,

  // Musical Timing: 96 BPM (Joyful, celebratory wedding rhythm)
  tempo: 96,
  lookahead: 25.0, // Milliseconds
  scheduleAheadTime: 0.15, // Seconds

  // Note Frequencies in Hz
  notes: {
    D3: 146.83,
    A3: 220.00,
    D4: 293.66,
    E4: 329.63,
    Fs4: 369.99,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    Cs5: 554.37,
    D5: 587.33,
    E5: 659.25,
    Fs5: 739.99,
    G5: 783.99,
    A5: 880.00,
    B5: 987.77,
    Cs6: 1108.73,
    D6: 1174.66,
    E6: 1318.51
  },

  init() {
    const toggleBtn = document.getElementById('soundToggle');
    if (!toggleBtn) return;

    this.html5Audio = document.getElementById('bgAudio');
    if (this.html5Audio) {
      if (!this.html5Audio.getAttribute('src')) {
        this.html5Audio.src = 'assets/chanakya.mp3';
      }
      this.html5Audio.volume = 0.18;
      this.html5Audio.loop = true;
    }

    toggleBtn.addEventListener('click', () => this.toggle());
  },

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime); // 18% volume
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  startAudio() {
    if (this.isPlaying) return;

    if (this.html5Audio) {
      if (!this.html5Audio.getAttribute('src')) {
        this.html5Audio.src = 'assets/chanakya.mp3';
      }
      this.html5Audio.play().then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch((err) => {
        console.warn('HTML5 audio play error, falling back to Web Audio:', err);
        this.initAudioContext();
        if (this.audioCtx) {
          this.isPlaying = true;
          this.updateUI();
          this.startJoyfulProceduralBGM();
        }
      });
    } else {
      this.initAudioContext();
      if (!this.audioCtx) return;
      this.isPlaying = true;
      this.updateUI();
      this.startJoyfulProceduralBGM();
    }
  },

  stopAudio() {
    this.isPlaying = false;
    this.updateUI();

    if (this.html5Audio) {
      try { this.html5Audio.pause(); } catch (e) {}
    }

    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    this.stopDrone();
  },

  toggle() {
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      this.startAudio();
    }
  },

  updateUI() {
    const toggleBtn = document.getElementById('soundToggle');
    const onIcon = document.querySelector('.sound-on-icon');
    const offIcon = document.querySelector('.sound-off-icon');

    if (!toggleBtn) return;

    if (this.isPlaying) {
      toggleBtn.classList.add('active');
      if (onIcon) onIcon.style.display = 'block';
      if (offIcon) offIcon.style.display = 'none';
      toggleBtn.setAttribute('aria-label', 'Mute joyful wedding music');
      toggleBtn.title = 'Mute joyful wedding background music';
    } else {
      toggleBtn.classList.remove('active');
      if (onIcon) onIcon.style.display = 'none';
      if (offIcon) offIcon.style.display = 'block';
      toggleBtn.setAttribute('aria-label', 'Play joyful wedding music');
      toggleBtn.title = 'Play joyful celebratory wedding music';
    }
  },

  /**
   * Start the festive Indian wedding BGM engine
   */
  startJoyfulProceduralBGM() {
    if (!this.audioCtx) return;

    this.startDrone();
    this.currentStep = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.1;

    // Lookahead scheduler loop
    this.schedulerTimer = setInterval(() => {
      if (!this.isPlaying) return;
      while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        const secondsPerBeat = 60.0 / this.tempo;
        const stepTime = secondsPerBeat / 2; // 8th note steps
        this.nextNoteTime += stepTime;
        this.currentStep = (this.currentStep + 1) % 32; // 4-bar 32-step cycle
      }
    }, this.lookahead);
  },

  /**
   * Warm Tanpura & Harmonium Root Harmonic Drone
   */
  startDrone() {
    if (!this.audioCtx || this.droneOscs.length) return;

    this.droneGain = this.audioCtx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.07, this.audioCtx.currentTime + 1.5);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.audioCtx.currentTime);

    this.droneGain.connect(filter);
    filter.connect(this.masterGain);

    // D3, A3, D4 warm harmonic pad
    [this.notes.D3, this.notes.A3, this.notes.D4].forEach((freq) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.connect(this.droneGain);
      osc.start();
      this.droneOscs.push(osc);
    });
  },

  stopDrone() {
    if (this.droneGain && this.audioCtx) {
      this.droneGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.4);
      setTimeout(() => {
        this.droneOscs.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.droneOscs = [];
      }, 450);
    }
  },

  /**
   * Schedule celebratory musical events for each step
   */
  scheduleStep(step, time) {
    const N = this.notes;

    // 1. Sparkling Santoor / Swarmandal Pluck Arpeggio (Festive Indian Strings)
    const santoorScore = [
      N.D4, N.Fs4, N.A4, N.D5,   N.Fs4, N.A4, N.D5, N.Fs5,   // Bar 1 (D Major)
      N.G4, N.B4,  N.D5, N.G5,   N.B4,  N.D5, N.G5, N.B5,    // Bar 2 (G Major)
      N.A4, N.Cs5, N.E5, N.A5,   N.Cs5, N.E5, N.A5, N.Cs6,   // Bar 3 (A Major)
      N.D4, N.Fs4, N.A4, N.D5,   N.A4,  N.Fs4, N.E4, N.D4    // Bar 4 (Resolve)
    ];

    const pluckFreq = santoorScore[step % 32];
    if (pluckFreq) {
      this.playSantoorPluck(pluckFreq, time, 0.28);
    }

    // 2. Joyful Bansuri Flute Melodic Themes
    const fluteScore = {
      0:  { freq: N.D5, dur: 0.55 },
      2:  { freq: N.E5, dur: 0.5 },
      4:  { freq: N.Fs5, dur: 0.6 },
      6:  { freq: N.A5, dur: 0.8 },

      8:  { freq: N.B5, dur: 0.55 },
      10: { freq: N.D6, dur: 0.6 },
      12: { freq: N.B5, dur: 0.5 },
      14: { freq: N.A5, dur: 0.75 },

      16: { freq: N.Fs5, dur: 0.55 },
      18: { freq: N.A5, dur: 0.55 },
      20: { freq: N.G5, dur: 0.5 },
      22: { freq: N.Fs5, dur: 0.65 },

      24: { freq: N.E5, dur: 0.55 },
      26: { freq: N.Fs5, dur: 0.55 },
      28: { freq: N.E5, dur: 0.5 },
      30: { freq: N.D5, dur: 0.85 }
    };

    if (fluteScore[step]) {
      this.playJoyfulFluteNote(fluteScore[step].freq, time, fluteScore[step].dur);
    }

    // 3. Auspicious Ghungroo & Temple Bell accents
    // Taps on key rhythmic accents (steps 0, 8, 16, 24)
    if (step % 8 === 0) {
      this.playAuspiciousBell(step === 0 ? 576 : 864, time, 1.8);
    }
    // Delicate soft jingle on offbeat steps
    if (step % 4 === 2) {
      this.playSoftGhungrooShimmer(time);
    }
  },

  /**
   * Synthesize bright Santoor / Harp plucked acoustic strings
   */
  playSantoorPluck(freq, time, duration = 0.3) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(700, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.07, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  },

  /**
   * Synthesize joyful singing Bansuri / Shehnai flute
   */
  playJoyfulFluteNote(freq, time, duration = 0.6) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Sweet pitch vibrato (meend/gamak)
    vibrato.frequency.setValueAtTime(5.8, time);
    vibratoGain.gain.setValueAtTime(freq * 0.018, time);
    vibrato.connect(osc.frequency);
    vibrato.start(time);
    vibrato.stop(time + duration);

    // Warm wooden bamboo filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.6, time);
    filter.Q.setValueAtTime(2.2, time);

    // Expressive attack and release envelope
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.13, time + 0.08); // Cheerful swift attack
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  },

  /**
   * Synthesize auspicious temple chime bell
   */
  playAuspiciousBell(baseFreq = 576, time = 0, duration = 2.0) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    [1, 2.76, 5.4].forEach((mult, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * mult, time);

      const amp = [0.08, 0.03, 0.01][idx];
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(amp, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  },

  /**
   * Delicate Ghungroo / soft ankle bells rhythm
   */
  playSoftGhungrooShimmer(time) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Multi-frequency metallic shimmer
    [2600, 3400, 4200].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.012, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.09);
    });
  },

  /**
   * Compatible bell helper for celebratory envelope, downloads, and action chime triggers
   */
  playSoftBell(freq = 540, dur = 3.5) {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (this.audioCtx) {
      this.playAuspiciousBell(freq, this.audioCtx.currentTime, dur);
    }
  }
};

/* ==========================================================================
   5. LIVE WEDDING COUNTDOWN TIMER (IST Timezone)
   Target: 25 November 2026, 7:00 PM IST
   ========================================================================== */
const CountdownController = {
  timerInterval: null,

  init() {
    this.tick();
    this.timerInterval = setInterval(() => this.tick(), 1000);
  },

  tick() {
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');
    const grid = document.getElementById('timerGrid');
    const completedMsg = document.getElementById('countdownCompleted');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const target = new Date(CONFIG.weddingDateIso).getTime();
    const now = new Date().getTime();
    const distance = target - now;

    if (distance <= 0) {
      clearInterval(this.timerInterval);
      if (grid) grid.style.display = 'none';
      if (completedMsg) completedMsg.style.display = 'block';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
};

/* ==========================================================================
   6. 3D CEREMONIAL ENVELOPE & INVITATION CARD
   ========================================================================== */
const EnvelopeCardController = {
  isOpen: false,

  init() {
    const closedEnvelope = document.getElementById('closedEnvelope');
    const openCard = document.getElementById('openCard');
    const btnFoldCard = document.getElementById('btnFoldCard');

    if (!closedEnvelope || !openCard) return;

    closedEnvelope.addEventListener('click', () => this.toggleCard());
    closedEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCard();
      }
    });

    if (btnFoldCard) {
      btnFoldCard.addEventListener('click', () => this.toggleCard());
    }
  },

  toggleCard() {
    const closedEnvelope = document.getElementById('closedEnvelope');
    const openCard = document.getElementById('openCard');
    if (!closedEnvelope || !openCard) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      closedEnvelope.style.display = 'none';
      openCard.style.display = 'block';
      SoundController.playSoftBell(540, 3.5);
    } else {
      openCard.style.display = 'none';
      closedEnvelope.style.display = 'block';
    }

    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }
  }
};

/* ==========================================================================
   7. WHATSAPP ENQUIRIES & BLESSINGS CONTROLLER
   Direct connection to the families for wedding enquiries & warm wishes.
   ========================================================================== */
const WhatsAppContactController = {
  init() {
    const btnContact = document.getElementById('btnWhatsAppContact');
    const btnCopy = document.getElementById('btnCopyWhatsAppNumber');
    const numberDisplay = document.getElementById('whatsappNumberDisplay');

    // Display formatted contact number
    if (numberDisplay && CONFIG.whatsAppContactNumber) {
      const num = CONFIG.whatsAppContactNumber.replace(/[^0-9]/g, '');
      if (num.length >= 10) {
        const formatted = num.length === 12
          ? `+${num.slice(0, 2)} ${num.slice(2, 7)} ${num.slice(7)}`
          : `+${num}`;
        numberDisplay.textContent = formatted;
      }
    }

    // Set dynamic WhatsApp URL
    if (btnContact) {
      btnContact.href = CONFIG.getWhatsAppContactUrl();
      btnContact.addEventListener('click', () => {
        SoundController.playSoftBell(576, 2.0);
        AmbientCanvasController.burstPetals();
      });
    }

    // Copy Phone Number
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const num = (CONFIG.whatsAppContactNumber || "").replace(/[^0-9]/g, '');
        const textToCopy = num ? `+${num}` : "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy)
            .then(() => this.showToast("WhatsApp number copied to clipboard!"))
            .catch(() => this.fallbackCopy(textToCopy));
        } else {
          this.fallbackCopy(textToCopy);
        }
      });
    }
  },

  showToast(msg) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3200);
  },

  fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      this.showToast("WhatsApp number copied to clipboard!");
    } catch (e) {
      console.warn("Copy fallback failed:", e);
    }
    document.body.removeChild(el);
  }
};

/* ==========================================================================
   8. SACRED INVITATION CARD DOWNLOAD CONTROLLER (PDF & HIGH-RES IMAGE)
   Exports dedicated Buddhist invitation card using html2pdf.js & html2canvas.
   ========================================================================== */
const DownloadInvitationController = {
  isGeneratingPdf: false,
  isGeneratingImage: false,

  init() {
    const btnPdf = document.getElementById('btnDownloadPdf');
    const btnImage = document.getElementById('btnDownloadImage');

    if (btnPdf) {
      btnPdf.addEventListener('click', () => this.downloadAsPdf());
    }

    if (btnImage) {
      btnImage.addEventListener('click', () => this.downloadAsImage());
    }
  },

  async renderCardCanvas() {
    const card = document.getElementById('printableInvitationCard');
    if (!card) throw new Error("Invitation card element not found");
    if (typeof html2canvas === 'undefined') throw new Error("html2canvas library is not loaded");

    // Ensure all web fonts (Google Fonts & Devanagari) are fully loaded before capturing
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (fontErr) {
        console.warn("Font loading wait warning:", fontErr);
      }
    }

    // Normalizing scrollY and scrollX to 0 prevents blank canvas when scrolled down
    const canvas = await html2canvas(card, {
      scale: 2.2, // ~1050px - 1200px width for crisp vector-like output
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#0A2252',
      scrollY: 0,
      scrollX: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedCard = clonedDoc.getElementById('printableInvitationCard');
        if (clonedCard) {
          clonedCard.style.transform = 'none';
          clonedCard.style.margin = '0 auto';
          clonedCard.style.maxWidth = '480px';
          clonedCard.style.boxShadow = 'none';
        }
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas render returned empty image dimensions");
    }

    return canvas;
  },

  async downloadAsPdf() {
    if (this.isGeneratingPdf) return;

    const btnPdf = document.getElementById('btnDownloadPdf');
    this.isGeneratingPdf = true;

    if (btnPdf) {
      btnPdf.disabled = true;
      btnPdf.innerHTML = `<span class="btn-spinner">⏳</span><span>Rendering PDF Invitation...</span>`;
    }
    this.showNotice("Preparing high-resolution PDF wedding card...", "info");

    try {
      // Step 1: Render card to a pristine canvas from the live rendered DOM
      const canvas = await this.renderCardCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Step 2: Access jsPDF engine
      const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);

      if (jsPDFConstructor) {
        const pdf = new jsPDFConstructor({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

        // Fill background with royal navy (#06132D) so there is never a blank white page
        pdf.setFillColor(6, 19, 45);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Calculate aspect-ratio preserved dimensions
        const margin = 12; // 12mm margins
        const maxW = pageWidth - (margin * 2);
        const maxH = pageHeight - (margin * 2);

        const canvasRatio = canvas.width / canvas.height;
        let cardW = maxW;
        let cardH = cardW / canvasRatio;

        if (cardH > maxH) {
          cardH = maxH;
          cardW = cardH * canvasRatio;
        }

        const posX = (pageWidth - cardW) / 2;
        const posY = (pageHeight - cardH) / 2;

        pdf.addImage(imgData, 'JPEG', posX, posY, cardW, cardH, undefined, 'FAST');
        pdf.save('Harsh-and-Monika-Wedding-Invitation.pdf');
      } else if (typeof html2pdf !== 'undefined') {
        const card = document.getElementById('printableInvitationCard');
        const opt = {
          margin: 10,
          filename: 'Harsh-and-Monika-Wedding-Invitation.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, backgroundColor: '#0A2252' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(card).save();
      } else {
        throw new Error("No PDF rendering engine available on window");
      }

      SoundController.playSoftBell(528, 3.5);
      AmbientCanvasController.burstPetals();
      this.showNotice("Wedding invitation PDF downloaded successfully! 🌸", "success");
    } catch (err) {
      console.error("PDF generation failed:", err);
      this.showNotice("Could not generate PDF. Please try saving as Image.", "error");
    } finally {
      this.isGeneratingPdf = false;
      if (btnPdf) {
        btnPdf.disabled = false;
        btnPdf.innerHTML = `<span class="btn-icon">📄</span><span class="btn-label">Download Invitation as PDF</span>`;
      }
    }
  },

  async downloadAsImage() {
    if (this.isGeneratingImage) return;

    const btnImage = document.getElementById('btnDownloadImage');
    this.isGeneratingImage = true;

    if (btnImage) {
      btnImage.disabled = true;
      btnImage.innerHTML = `<span class="btn-spinner">⏳</span><span>Rendering High-Res Image...</span>`;
    }
    this.showNotice("Generating crystal-clear 1080p+ invitation image...", "info");

    try {
      const canvas = await this.renderCardCanvas();
      const imageUri = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'Harsh-and-Monika-Wedding-Invitation.png';
      downloadLink.href = imageUri;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      SoundController.playSoftBell(528, 3.5);
      AmbientCanvasController.burstPetals();
      this.showNotice("High-resolution wedding invitation image downloaded! 🌸", "success");
    } catch (err) {
      console.error("Image generation failed:", err);
      this.showNotice("Could not generate image. Please try again.", "error");
    } finally {
      this.isGeneratingImage = false;
      if (btnImage) {
        btnImage.disabled = false;
        btnImage.innerHTML = `<span class="btn-icon">🖼️</span><span class="btn-label">Download Invitation as Image</span>`;
      }
    }
  },

  showNotice(msg, type = "info") {
    const noticeEl = document.getElementById('downloadStatusNotice');
    if (!noticeEl) return;
    noticeEl.textContent = msg;
    noticeEl.className = `download-status-notice ${type}`;
    noticeEl.style.display = 'block';

    setTimeout(() => {
      if (noticeEl.textContent === msg) {
        noticeEl.style.display = 'none';
      }
    }, 4500);
  }
};

/* ==========================================================================
   9. INVISIBLE CINEMATIC AUTO-SCROLL CONTROLLER
   100% autonomous, zero buttons or floating controls.
   Pauses immediately when the user clicks, touches, or scrolls anywhere.
   Resumes automatically after 5 seconds of user inactivity.
   Respects prefers-reduced-motion.
   ========================================================================== */
const AutoScrollController = {
  isPlaying: false,
  isPaused: false,
  isAtBottom: false,
  speed: 38, // Pixels per second (gentle, majestic slow-reading pace)
  animId: null,
  lastTime: null,
  subpixelRemainder: 0,
  reducedMotion: false,
  inactivityTimer: null,
  inactivityDelay: 5000, // Exactly 5 seconds of stillness before auto-resuming

  init() {
    // Check accessibility: prefers-reduced-motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      return; // Respect accessibility - no auto-scroll when reduced motion is preferred
    }

    // Attach user interaction listeners: pause on click, touch, scroll, or keypress
    this.setupInteractivityListeners();

    // Start scrolling automatically only after the page is fully loaded
    window.addEventListener('load', () => {
      const openingScreen = document.getElementById('openingScreen');
      const isOpeningScreenVisible = openingScreen && !openingScreen.classList.contains('dismissed');
      
      // If no opening screen or already dismissed, auto-start after gentle delay
      if (!isOpeningScreenVisible && !this.reducedMotion && !this.isPlaying) {
        setTimeout(() => {
          if (!this.isPlaying) {
            this.start();
          }
        }, 1500);
      }
    });
  },

  setupInteractivityListeners() {
    // Click or tap anywhere on the page pauses auto-scroll immediately
    window.addEventListener('click', (e) => this.handleUserInterrupt(e), { passive: true });

    // Touch events (mobile touch tap or drag)
    window.addEventListener('touchstart', (e) => this.handleUserInterrupt(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.handleUserInterrupt(e), { passive: true });

    // Mouse / trackpad wheel scroll
    window.addEventListener('wheel', (e) => this.handleUserInterrupt(e), { passive: true });

    // Keyboard navigation keys
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }
      const navKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'];
      if (navKeys.includes(e.code) || navKeys.includes(e.key)) {
        this.handleUserInterrupt(e);
      }
    }, { passive: true });
  },

  handleUserInterrupt(e) {
    // Ignore clicks or interactions on the welcome screen
    if (e && e.target && e.target.closest && e.target.closest('#openingScreen')) {
      return;
    }

    // Pause immediately on user click, touch, or manual scroll
    if (this.isPlaying && !this.isPaused) {
      this.pause();
    }

    // Schedule automatic resume after exactly 5 seconds of inactivity
    if (this.isPlaying && !this.isAtBottom) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        if (this.isPlaying && this.isPaused && !this.isAtBottom) {
          this.resume();
        }
      }, this.inactivityDelay);
    }
  },

  start() {
    clearTimeout(this.inactivityTimer);

    // If at bottom, restart from top
    if (this.checkBottom()) {
      this.restartFromTop();
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.isAtBottom = false;
    this.subpixelRemainder = 0;
    this.lastTime = performance.now();
    // Disable CSS smooth scrolling so high-frequency rAF micro-steps glide without interpolation lag
    document.documentElement.style.scrollBehavior = 'auto';

    cancelAnimationFrame(this.animId);
    this.animId = requestAnimationFrame((ts) => this.tick(ts));
  },

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    cancelAnimationFrame(this.animId);
    this.animId = null;
    document.documentElement.style.scrollBehavior = '';
  },

  resume() {
    clearTimeout(this.inactivityTimer);

    if (!this.isPlaying) {
      this.start();
      return;
    }

    if (this.checkBottom()) {
      this.restartFromTop();
      return;
    }

    this.isPaused = false;
    this.subpixelRemainder = 0;
    this.lastTime = performance.now();
    document.documentElement.style.scrollBehavior = 'auto';

    cancelAnimationFrame(this.animId);
    this.animId = requestAnimationFrame((ts) => this.tick(ts));
  },

  stop(finished = false) {
    clearTimeout(this.inactivityTimer);
    this.isPlaying = false;
    this.isPaused = false;
    cancelAnimationFrame(this.animId);
    this.animId = null;
    document.documentElement.style.scrollBehavior = '';

    if (finished) {
      this.isAtBottom = true;
      // After reaching the bottom, wait 5 seconds then gently rewind to top and restart
      setTimeout(() => {
        if (this.isAtBottom) {
          this.restartFromTop();
        }
      }, 5000);
    }
  },

  tick(timestamp) {
    if (!this.isPlaying || this.isPaused) return;

    if (!this.lastTime) this.lastTime = timestamp;
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.subpixelRemainder = (this.subpixelRemainder || 0) + (this.speed * delta);
    if (this.subpixelRemainder >= 1) {
      const step = Math.floor(this.subpixelRemainder);
      this.subpixelRemainder -= step;
      window.scrollBy(0, step);
    }

    if (this.checkBottom()) {
      this.stop(true);
      return;
    }

    this.animId = requestAnimationFrame((ts) => this.tick(ts));
  },

  checkBottom() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
    return scrollY >= maxScroll - 4;
  },

  restartFromTop() {
    // Cancel any existing animation frame (isPlaying may be false here)
    cancelAnimationFrame(this.animId);
    this.animId = null;
    this.isPaused = false;
    document.documentElement.style.scrollBehavior = '';
    this.smoothScrollTo(0, () => {
      setTimeout(() => {
        this.isAtBottom = false;
        this.start();
      }, 1000);
    });
  },

  smoothScrollTo(targetY, callback) {
    document.documentElement.style.scrollBehavior = '';
    if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: targetY, autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
          if (callback) callback();
        }
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (callback) setTimeout(callback, 800);
    }
  }
};

/* ==========================================================================
   10. WHATSAPP & QR CODE SHARING
   ========================================================================== */
const ShareController = {
  qrCodeInstance: null,

  init() {
    const qrContainer = document.getElementById('qrcode');
    const shareUrl = CONFIG.getShareUrl();
    const urlText = document.getElementById('displayShareUrl');
    const btnCopy = document.getElementById('btnCopyShare');
    const btnWhatsApp = document.getElementById('btnWhatsAppShare');
    const btnDownloadQR = document.getElementById('btnDownloadQR');

    if (urlText) urlText.textContent = shareUrl;

    // Generate Scannable QR Code
    if (qrContainer) {
      this.generateQR(qrContainer, shareUrl);
    }

    // WhatsApp Direct Share
    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', () => this.shareWhatsApp(shareUrl));
    }

    // Copy Link
    if (btnCopy) {
      btnCopy.addEventListener('click', () => this.copyLink(shareUrl));
    }

    // Download QR Keepsake PNG
    if (btnDownloadQR) {
      btnDownloadQR.addEventListener('click', () => this.downloadQRImage(shareUrl));
    }
  },

  generateQR(container, url) {
    container.innerHTML = "";
    if (typeof QRCode !== 'undefined') {
      try {
        this.qrCodeInstance = new QRCode(container, {
          text: url,
          width: 180,
          height: 180,
          colorDark: "#0B2559", // Royal Blue
          colorLight: "#FFFFFF",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (err) {
        console.warn("QR Render warning:", err);
      }
    }
  },

  shareWhatsApp(url) {
    const message = `🌸 *Wedding Invitation — Harsh & Monika* 🌸\n\n` +
      `॥ नमो बुद्धाय ॥\n\n` +
      `With the blessings of the Triple Gem, both families warmly invite you to celebrate the sacred wedding of *Harsh & Monika*.\n\n` +
      `📅 *Date:* Wednesday, 25 November 2026\n` +
      `⏰ *Time:* 7:00 PM IST\n` +
      `🏛️ *Venue:* THE ROYAL AVENUE\n` +
      `📍 *Address:* Beside Vijay Farms, Bhadesi Mafi, Aligarh, Uttar Pradesh 202002\n\n` +
      `🌸 *View our digital wedding invitation:* \n${url}\n\n` +
      `॥ सब्वे सत्ता सुखी होन्तु ॥`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  },

  copyLink(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => this.showToast("Invitation link copied to clipboard!"))
        .catch(() => this.fallbackCopy(url));
    } else {
      this.fallbackCopy(url);
    }
  },

  fallbackCopy(url) {
    const el = document.createElement('textarea');
    el.value = url;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      this.showToast("Invitation link copied!");
    } catch (e) {
      this.showToast("Please copy link manually: " + url);
    }
    document.body.removeChild(el);
  },

  downloadQRImage(url) {
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Royal Blue Canvas Background
    ctx.fillStyle = "#0B2559";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold Double Border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 6;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    ctx.strokeStyle = "#F3E5AB";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Invocation
    ctx.fillStyle = "#F3E5AB";
    ctx.font = "bold 20px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillText("॥ नमो बुद्धाय ॥", 325, 90);

    // Couple Names
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 38px 'Cinzel', serif";
    ctx.fillText(`${CONFIG.couple.groom} & ${CONFIG.couple.bride}`, 325, 145);

    // Date & Venue
    ctx.fillStyle = "#F3E5AB";
    ctx.font = "500 17px 'Poppins', sans-serif";
    ctx.fillText(CONFIG.couple.weddingDateFormatted, 325, 185);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "14px 'Poppins', sans-serif";
    ctx.fillText(`${CONFIG.couple.venueName} • Aligarh, UP`, 325, 215);

    // White Backplate for QR
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(150, 255, 350, 350);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 255, 350, 350);

    const qrContainer = document.getElementById('qrcode');
    const sourceCanvas = qrContainer?.querySelector('canvas');

    const finishDownload = () => {
      // Bottom blessing
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "italic 18px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText("Scan with mobile camera to open invitation", 325, 650);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 16px 'Poppins', sans-serif";
      ctx.fillText("🌸 Sabbe Satta Sukhi Hontu 🌸", 325, 695);

      const link = document.createElement('a');
      link.download = `Harsh-Monika-Wedding-QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.showToast("QR Keepsake downloaded!");
    };

    if (sourceCanvas) {
      ctx.drawImage(sourceCanvas, 175, 280, 300, 300);
      finishDownload();
    } else {
      this.showToast("QR is preparing, please try again in a second.");
    }
  },

  showToast(message) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4000);
  }
};

/* ==========================================================================
   11. ADD TO CALENDAR CONTROLLER
   Google Calendar Link & iCal (.ics) Generator
   ========================================================================== */
const CalendarController = {
  init() {
    const btnGCal = document.getElementById('btnGoogleCalendar');
    const btnICal = document.getElementById('btnICalendar');

    if (btnGCal) {
      btnGCal.addEventListener('click', () => this.addToGoogleCalendar());
    }
    if (btnICal) {
      btnICal.addEventListener('click', () => this.downloadICalFile());
    }
  },

  addToGoogleCalendar() {
    // 25 November 2026, 7:00 PM IST (13:30:00 UTC)
    const startIso = "20261125T133000Z";
    const endIso = "20261125T180000Z";

    const title = encodeURIComponent(`Wedding of ${CONFIG.couple.groom} & ${CONFIG.couple.bride}`);
    const details = encodeURIComponent(
      `॥ नमो बुद्धाय ॥\n\n` +
      `With the blessings of the Triple Gem, both families warmly invite you to the sacred Buddhist wedding ceremony and celebration of Harsh & Monika.\n\n` +
      `Venue: ${CONFIG.couple.venueName}\n` +
      `Address: ${CONFIG.couple.venueFullAddress}\n` +
      `Time: ${CONFIG.couple.weddingTimeFormatted}\n\n` +
      `May all beings be happy.`
    );
    const location = encodeURIComponent(`${CONFIG.couple.venueName}, ${CONFIG.couple.venueFullAddress}`);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  downloadICalFile() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Harsh & Monika Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:harsh-monika-wedding-20261125@aligarh",
      "DTSTAMP:20261125T000000Z",
      "DTSTART:20261125T133000Z",
      "DTEND:20261125T180000Z",
      `SUMMARY:Wedding of ${CONFIG.couple.groom} & ${CONFIG.couple.bride}`,
      `DESCRIPTION:Sacred Buddhist Wedding Ceremony and Celebration of Harsh & Monika. With the blessings of the Triple Gem.\\nVenue: ${CONFIG.couple.venueName}, ${CONFIG.couple.venueFullAddress}`,
      `LOCATION:${CONFIG.couple.venueName}\\, ${CONFIG.couple.venueFullAddress}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Harsh-Monika-Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ShareController.showToast("Calendar event (.ics) downloaded!");
  }
};

/* ==========================================================================
   12. CREATOR DETAILS & CREDITS CONTROLLER
   Renders configurable developer credit and optional social links in the footer.
   ========================================================================== */
const CreatorController = {
  init() {
    const config = CONFIG.creator;
    if (!config) return;

    const roleEl = document.getElementById('creatorRole');
    const nameEl = document.getElementById('creatorName');
    const linksContainer = document.getElementById('creatorSocialLinks');

    if (roleEl && config.role) {
      roleEl.textContent = config.role;
    }

    if (nameEl && config.name) {
      nameEl.textContent = config.name;
    }

    if (linksContainer) {
      linksContainer.innerHTML = '';

      const socialMap = [
        { key: 'github', label: 'GitHub', icon: '💻' },
        { key: 'portfolio', label: 'Portfolio', icon: '🌐' },
        { key: 'instagram', label: 'Instagram', icon: '📸' }
      ];

      socialMap.forEach(item => {
        const url = config[item.key];
        if (url && typeof url === 'string' && url.trim() !== '') {
          const a = document.createElement('a');
          a.href = url.trim();
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'creator-link';
          a.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`;
          linksContainer.appendChild(a);
        }
      });

      if (!linksContainer.children.length) {
        linksContainer.style.display = 'none';
      }
    }
  }
};

/* ==========================================================================
   13. AMBIENT CANVAS (Lotus Petals & Golden Light Dust)
   ========================================================================== */
const AmbientCanvasController = {
  canvas: null,
  ctx: null,
  particles: [],
  maxCount: 38,
  width: 0,
  height: 0,
  animId: null,
  isRunning: false,

  init() {
    this.canvas = document.getElementById('ambientCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Respect user's prefers-reduced-motion setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Pause animation when browser tab is inactive to preserve battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    // Populate particles
    for (let i = 0; i < this.maxCount; i++) {
      this.particles.push(this.createParticle(true));
    }

    this.start();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  },

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  },

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  createParticle(randomY = false) {
    const isPetal = Math.random() > 0.45;
    return {
      isPetal,
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: isPetal ? 7 + Math.random() * 8 : 1.5 + Math.random() * 2.5,
      speedY: isPetal ? 0.4 + Math.random() * 0.5 : 0.2 + Math.random() * 0.35,
      speedX: isPetal ? -0.3 + Math.random() * 0.6 : -0.2 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      opacity: isPetal ? 0.35 + Math.random() * 0.35 : 0.25 + Math.random() * 0.45,
      color: isPetal ? 'rgba(244, 114, 182,' : 'rgba(243, 229, 171,'
    };
  },

  burstPetals() {
    for (let i = 0; i < 25; i++) {
      const p = this.createParticle(false);
      p.y = this.height * 0.6;
      p.x = this.width * 0.5 + (Math.random() - 0.5) * 200;
      p.speedY = -1.5 - Math.random() * 2;
      p.speedX = (Math.random() - 0.5) * 4;
      this.particles.push(p);
    }
    if (!this.isRunning) {
      this.start();
    }
  },

  loop() {
    const render = () => {
      if (!this.isRunning) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.5 + p.speedX;
        p.angle += p.spin;

        if (p.y > this.height + 25 || p.x < -30 || p.x > this.width + 30) {
          if (this.particles.length > this.maxCount) {
            this.particles.splice(i, 1);
            i--;
            continue;
          }
          this.particles[i] = this.createParticle(false);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);

        if (p.isPetal) {
          // Petal Shape
          this.ctx.fillStyle = `${p.color} ${p.opacity})`;
          this.ctx.beginPath();
          this.ctx.moveTo(0, -p.size);
          this.ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
          this.ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
          this.ctx.fill();
        } else {
          // Soft Golden Orb
          this.ctx.fillStyle = `${p.color} ${p.opacity})`;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }
};

/* ==========================================================================
   14. NAVIGATION & SCROLLSPY CONTROLLER
   ========================================================================== */
const NavigationController = {
  init() {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('closeDrawer');
    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

    // Sticky scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
      this.updateScrollSpy();
    }, { passive: true });

    // Mobile drawer toggle & accessibility
    const openDrawer = () => {
      drawer.classList.add('open');
      menuBtn?.setAttribute('aria-expanded', 'true');
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    };

    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', () => {
        if (drawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // Close on backdrop click
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDrawer();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer?.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Smooth scroll navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            closeDrawer();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  },

  updateScrollSpy() {
    const sections = ['hero', 'invitationCard', 'blessings', 'countdown', 'events', 'venue', 'contact', 'download', 'share'];
    const scrollPos = window.scrollY + 160;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollPos) {
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${sections[i]}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        break;
      }
    }
  }
};

/* ==========================================================================
   15. THREE.JS 3D HERO SCENE (3D Ashoka Chakra, Starfield & Royal Lighting)
   Optimized with IntersectionObserver to pause rendering when offscreen.
   ========================================================================== */
const HeroThreeSceneController = {
  container: null,
  canvas: null,
  scene: null,
  camera: null,
  renderer: null,
  chakraGroup: null,
  particlesMesh: null,
  animId: null,
  isVisible: true,
  mouseX: 0,
  mouseY: 0,
  targetCamX: 0,
  targetCamY: 0,

  init() {
    this.container = document.getElementById('hero3dContainer');
    this.canvas = document.getElementById('hero3dCanvas');

    if (!this.container || !this.canvas) return;

    // Check Three.js availability & WebGL support
    if (typeof THREE === 'undefined') {
      console.info("Three.js not loaded, using SVG Ashoka Chakra fallback.");
      return;
    }

    try {
      const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (!gl) {
        console.info("WebGL not supported on this device, using fallback.");
        return;
      }
    } catch (e) {
      return;
    }

    this.setupScene();
    this.buildAshokaChakra();
    this.buildGoldenParticles();
    this.setupLighting();
    this.setupEvents();
    this.setupVisibilityObserver();
    this.animate();
  },

  setupScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const isMobile = width < 640;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, isMobile ? 22 : 16);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
  },

  buildAshokaChakra() {
    this.chakraGroup = new THREE.Group();

    // Metallic Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x2A1D05,
      emissiveIntensity: 0.25
    });

    // Royal Blue Material
    const royalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0B2559,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x081D45,
      emissiveIntensity: 0.3
    });

    // 1. Outer Torus Rim (Gold)
    const outerTorusGeo = new THREE.TorusGeometry(5.2, 0.24, 24, 72);
    const outerTorus = new THREE.Mesh(outerTorusGeo, goldMat);
    this.chakraGroup.add(outerTorus);

    // 2. Inner Torus Rim (Royal Blue)
    const innerTorusGeo = new THREE.TorusGeometry(4.7, 0.14, 20, 72);
    const innerTorus = new THREE.Mesh(innerTorusGeo, royalBlueMat);
    this.chakraGroup.add(innerTorus);

    // 3. Central Hub (Gold with Blue Core)
    const hubOuterGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.45, 32);
    hubOuterGeo.rotateX(Math.PI / 2);
    const hubOuter = new THREE.Mesh(hubOuterGeo, goldMat);
    this.chakraGroup.add(hubOuter);

    const hubCoreGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32);
    hubCoreGeo.rotateX(Math.PI / 2);
    const hubCore = new THREE.Mesh(hubCoreGeo, royalBlueMat);
    this.chakraGroup.add(hubCore);

    // 4. 24 Distinct Spokes of the Ashoka Chakra
    const spokeCount = 24;
    const spokeLength = 3.65;
    const spokeGeo = new THREE.CylinderGeometry(0.045, 0.08, spokeLength, 12);
    spokeGeo.translate(0, spokeLength / 2, 0); // Origin at base
    spokeGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * Math.PI * 2) / spokeCount;
      const spoke = new THREE.Mesh(spokeGeo, goldMat);
      spoke.rotation.z = angle;
      this.chakraGroup.add(spoke);

      // Decorative bead on rim for each spoke
      const beadGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const bead = new THREE.Mesh(beadGeo, goldMat);
      bead.position.set(
        Math.cos(angle) * 5.0,
        Math.sin(angle) * 5.0,
        0
      );
      this.chakraGroup.add(bead);
    }

    // Position in hero background (adaptive for mobile screens)
    const isMobile = window.innerWidth < 640;
    this.chakraGroup.position.set(0, isMobile ? 1.0 : 0.5, -2);
    this.chakraGroup.scale.setScalar(isMobile ? 0.65 : 1.0);
    this.chakraGroup.rotation.x = 0.25; // Subtle cinematic tilt
    this.scene.add(this.chakraGroup);
  },

  buildGoldenParticles() {
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 160 : 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldColor = new THREE.Color(0xF3E5AB);
    const blueColor = new THREE.Color(0x2563EB);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 2;

      const mixed = Math.random() > 0.3 ? goldColor : blueColor;
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);
  },

  setupLighting() {
    // Ambient soft royal blue fill
    const ambientLight = new THREE.AmbientLight(0x0E2C68, 1.2);
    this.scene.add(ambientLight);

    // Warm radiant golden key directional light
    const keyGoldLight = new THREE.DirectionalLight(0xF5E5A8, 1.8);
    keyGoldLight.position.set(5, 8, 12);
    this.scene.add(keyGoldLight);

    // Deep royal blue point backlight (rim illumination)
    const bluePoint = new THREE.PointLight(0x2563EB, 3.5, 30);
    bluePoint.position.set(-6, -4, 4);
    this.scene.add(bluePoint);

    // Warm gold specular point light
    const goldPoint = new THREE.PointLight(0xD4AF37, 2.5, 25);
    goldPoint.position.set(4, 5, 6);
    this.scene.add(goldPoint);
  },

  setupEvents() {
    // Pointer parallax movement
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      this.targetCamX = this.mouseX * 1.5;
      this.targetCamY = this.mouseY * 1.0;
    }, { passive: true });

    // Touch parallax on mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        this.targetCamX = this.mouseX * 0.8;
        this.targetCamY = this.mouseY * 0.6;
      }
    }, { passive: true });

    // Responsive resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      const isMobile = width < 640;

      this.camera.aspect = width / height;
      this.camera.position.z = isMobile ? 22 : 16;
      this.camera.updateProjectionMatrix();

      if (this.chakraGroup) {
        this.chakraGroup.scale.setScalar(isMobile ? 0.65 : 1.0);
        this.chakraGroup.position.y = isMobile ? 1.0 : 0.5;
      }

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    }, { passive: true });
  },

  setupVisibilityObserver() {
    // Drops rendering loop when hero is offscreen to preserve CPU/GPU
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting && !document.hidden;
          if (this.isVisible && !this.animId) {
            this.animate();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(this.container);
    }

    // Immediately halt rendering loop when browser tab is hidden/minimized
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isVisible = false;
        if (this.animId) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        }
      } else {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (this.isVisible && !this.animId) {
          this.animate();
        }
      }
    });
  },

  animate() {
    if (!this.isVisible) {
      this.animId = null;
      return;
    }

    const clock = Date.now() * 0.001;

    // Smooth continuous 3D Ashoka Chakra rotation
    if (this.chakraGroup) {
      this.chakraGroup.rotation.z += 0.0035;
      this.chakraGroup.rotation.y = Math.sin(clock * 0.35) * 0.18;
      const isMobile = window.innerWidth < 640;
      this.chakraGroup.position.y = (isMobile ? 1.0 : 0.5) + Math.sin(clock * 0.8) * 0.15; // Gentle float
    }

    // Drift golden particle stars
    if (this.particlesMesh) {
      this.particlesMesh.rotation.y = clock * 0.03;
      this.particlesMesh.rotation.x = Math.sin(clock * 0.02) * 0.1;
    }

    // Camera parallax interpolation
    if (this.camera) {
      this.camera.position.x += (this.targetCamX - this.camera.position.x) * 0.04;
      this.camera.position.y += (this.targetCamY - this.camera.position.y) * 0.04;
      this.camera.lookAt(0, 0.4, 0);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animId = requestAnimationFrame(() => this.animate());
  },

  dispose() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.isMesh || child.isPoints) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
};

/* ==========================================================================
   16. THREE.JS 3D INTERTWINED WEDDING RINGS SCENE
   Features realistic PBR gold bands with continuous specular gleam.
   ========================================================================== */
const RingsThreeSceneController = {
  container: null,
  canvas: null,
  scene: null,
  camera: null,
  renderer: null,
  ringsGroup: null,
  animId: null,
  isVisible: true,

  init() {
    this.container = document.getElementById('rings3dContainer');
    this.canvas = document.getElementById('rings3dCanvas');

    if (!this.container || !this.canvas || typeof THREE === 'undefined') return;

    try {
      const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch (e) {
      return;
    }

    this.setupScene();
    this.buildWeddingRings();
    this.setupLighting();
    this.setupEvents();
    this.setupVisibilityObserver();
    this.animate();
  },

  setupScene() {
    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 180;
    const isMobile = window.innerWidth < 640;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    this.camera.position.set(0, 0, isMobile ? 8.5 : 7.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: !isMobile
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
  },

  buildWeddingRings() {
    this.ringsGroup = new THREE.Group();

    // High-polish 24K Radiant Gold Metallic Material
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.94,
      roughness: 0.12,
      emissive: 0x3A2606,
      emissiveIntensity: 0.2
    });

    // Ring 1 (Groom - Harsh)
    const ringGeo1 = new THREE.TorusGeometry(1.5, 0.22, 28, 64);
    const ring1 = new THREE.Mesh(ringGeo1, ringMaterial);
    ring1.position.set(-0.75, 0, 0);
    ring1.rotation.set(0.5, 0.6, 0.2);
    this.ringsGroup.add(ring1);

    // Ring 2 (Bride - Monika) — Intertwined through Ring 1
    const ringGeo2 = new THREE.TorusGeometry(1.5, 0.22, 28, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMaterial);
    ring2.position.set(0.75, 0, 0);
    ring2.rotation.set(-0.5, -0.6, -0.2);
    this.ringsGroup.add(ring2);

    this.scene.add(this.ringsGroup);
  },

  setupLighting() {
    const ambient = new THREE.AmbientLight(0x0B2559, 1.2);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xFFF7E8, 2.2);
    keyLight.position.set(4, 6, 8);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x2563EB, 3.0, 15);
    rimLight.position.set(-4, -3, 3);
    this.scene.add(rimLight);
  },

  setupEvents() {
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 320;
      const height = this.container.clientHeight || 180;
      const isMobile = window.innerWidth < 640;

      this.camera.aspect = width / height;
      this.camera.position.z = isMobile ? 8.5 : 7.5;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    }, { passive: true });
  },

  setupVisibilityObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting && !document.hidden;
          if (this.isVisible && !this.animId) {
            this.animate();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(this.container);
    }

    // Immediately halt rendering loop when browser tab is hidden/minimized
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isVisible = false;
        if (this.animId) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        }
      } else {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (this.isVisible && !this.animId) {
          this.animate();
        }
      }
    });
  },

  animate() {
    if (!this.isVisible) {
      this.animId = null;
      return;
    }

    const clock = Date.now() * 0.001;

    // Realistic intertwined 3D rotation
    if (this.ringsGroup) {
      this.ringsGroup.rotation.y += 0.008;
      this.ringsGroup.rotation.x = Math.sin(clock * 0.6) * 0.15;
      this.ringsGroup.position.y = Math.sin(clock * 1.2) * 0.12;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animId = requestAnimationFrame(() => this.animate());
  },

  dispose() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
};

/* ==========================================================================
   17. GSAP & SCROLLTRIGGER ANIMATION CONTROLLER
   Delivers smooth cinematic reveals and section transitions.
   Respects user's prefers-reduced-motion settings.
   ========================================================================== */
const GSAPAnimationController = {
  init() {
    // Respect accessibility settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }

    this.animateHeroEntrance();
    this.setupScrollTriggers();
  },

  animateHeroEntrance() {
    const heroElements = document.querySelectorAll('.hero-reveal');
    if (!heroElements.length) return;

    gsap.from(heroElements, {
      opacity: 0,
      y: 35,
      duration: 1.1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2
    });
  },

  setupScrollTriggers() {
    if (typeof ScrollTrigger === 'undefined') return;

    const revealItems = document.querySelectorAll('.gsap-reveal');

    revealItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.95,
        ease: "power2.out"
      });
    });

    // Subtle breathing pulse on countdown digit cards
    const digitCards = document.querySelectorAll('.timer-digit-card');
    if (digitCards.length) {
      gsap.to(digitCards, {
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
        borderColor: "rgba(243, 229, 171, 0.8)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });
    }
  }
};

