class SoundManager {
  muted = false;
  volume = 0.5;
  musicVolume = 0.2;
  loops = {};

  constructor() {
    const storedMuted = localStorage.getItem("soundMuted");
    const storedVolume = localStorage.getItem("soundVolume");
    if (storedMuted !== null) this.muted = storedMuted === "true";
    if (storedVolume !== null) this.volume = Number(storedVolume);
  }

  sounds = {
    jump: "assets/audio/character/characterJump.wav",
    hit: "assets/audio/character/characterDamage.mp3",
    characterDead: "assets/audio/character/characterDead.wav",
    snoring: "assets/audio/character/characterSnoring.mp3",
    chickenDead: "assets/audio/chicken/chickenDead.mp3",
    chickenSmallDead: "assets/audio/chicken/chickenDead2.mp3",
    collectCoin: "assets/audio/collectibles/collectSound.wav",
    collectBottle: "assets/audio/collectibles/bottleCollectSound.wav",
    endbossApproach: "assets/audio/endboss/endbossApproach.wav",
    gameStart: "assets/audio/game/gameStart.mp3",
    win: "assets/audio/game/tunetank.com_win-1.wav",
    lose: "assets/audio/game/tunetank.com_lose.wav",
    bottleBreak: "assets/audio/throwable/bottleBreak.mp3",
    musicTheme: "assets/audio/game/Slinger Swagger (loop).ogg",
  };

  play(name) {
    if (this.muted) return;
    const path = this.sounds[name];
    if (!path) return;
    const audio = new Audio(path);
    audio.volume = this.volume;
    audio.play();
  }

  startLoop(name) {
    if (this.loops[name]) return;
    const path = this.sounds[name];
    if (!path) return;
    const audio = new Audio(path);
    audio.loop = true;
    audio.muted = this.muted;
    audio.volume = name === "musicTheme" ? this.musicVolume : this.volume;
    this.loops[name] = audio;
    return audio.play();
  }

  stopLoop(name) {
    const audio = this.loops[name];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    delete this.loops[name];
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  setMuted(muted) {
    this.muted = muted;
    Object.values(this.loops).forEach((audio) => (audio.muted = this.muted));
    localStorage.setItem("soundMuted", this.muted);
    return this.muted;
  }

  setVolume(value) {
    this.volume = value;
    Object.values(this.loops).forEach((audio) => (audio.volume = value));
    localStorage.setItem("soundVolume", value);
  }
}
