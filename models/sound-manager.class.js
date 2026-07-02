class SoundManager {
  muted = false;
  loops = {};

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
    bottleBreak: "assets/audio/throwable/bottleBreak.mp3",
  };

  play(name) {
    if (this.muted) return;
    const path = this.sounds[name];
    if (!path) return;
    new Audio(path).play();
  }

  startLoop(name) {
    if (this.loops[name]) return;
    const path = this.sounds[name];
    if (!path) return;
    const audio = new Audio(path);
    audio.loop = true;
    audio.muted = this.muted;
    this.loops[name] = audio;
    audio.play();
  }

  stopLoop(name) {
    const audio = this.loops[name];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    delete this.loops[name];
  }

  toggleMute() {
    this.muted = !this.muted;
    Object.values(this.loops).forEach((audio) => (audio.muted = this.muted));
    return this.muted;
  }
}
