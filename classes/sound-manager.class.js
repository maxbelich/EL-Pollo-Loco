/** Plays and manages all game sounds, including looping tracks and mute/volume state. */
class SoundManager {
  muted = false;
  volume = 0.5;
  musicVolume = 0.2;
  loops = {};

  /** Restores mute and volume settings from local storage. */
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
    endbossHit: "assets/audio/endboss/endboss_hit.mp3",
    endbossDead: "assets/audio/endboss/endboss_dead.mp3",
    gameStart: "assets/audio/game/gameStart.mp3",
    win: "assets/audio/game/tunetank.com_win-1.wav",
    lose: "assets/audio/game/tunetank.com_lose.wav",
    bottleBreak: "assets/audio/throwable/bottleBreak.mp3",
    musicTheme: "assets/audio/game/Slinger Swagger (loop).ogg",
  };

  /**
   * Plays a sound once, unless muted.
   * @param {string} name - key from the sounds list
   */
  play(name) {
    if (this.muted) return;
    const path = this.sounds[name];
    if (!path) return;
    const audio = new Audio(path);
    audio.volume = this.volume;
    audio.play();
  }

  /**
   * Starts a looping sound if it isn't already playing.
   * @param {string} name - key from the sounds list
   * @returns {Promise|undefined} play() promise, if started
   */
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

  /**
   * Stops and resets a looping sound.
   * @param {string} name - key from the sounds list
   */
  stopLoop(name) {
    const audio = this.loops[name];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    delete this.loops[name];
  }

  /**
   * Toggles mute on/off.
   * @returns {boolean} new muted state
   */
  toggleMute() {
    return this.setMuted(!this.muted);
  }

  /**
   * Sets the muted state and applies it to all running loops.
   * @param {boolean} muted - new muted state
   * @returns {boolean} the applied muted state
   */
  setMuted(muted) {
    this.muted = muted;
    Object.values(this.loops).forEach((audio) => (audio.muted = this.muted));
    localStorage.setItem("soundMuted", this.muted);
    return this.muted;
  }

  /**
   * Sets the volume and applies it to all running loops.
   * @param {number} value - volume from 0 to 1
   */
  setVolume(value) {
    this.volume = value;
    Object.values(this.loops).forEach((audio) => (audio.volume = value));
    localStorage.setItem("soundVolume", value);
  }
}
