import { AssetsManager, Sound } from "@babylonjs/core";
import music1Url                from "../assets/musics/magic-chessboard-278016.mp3";

class SoundManager {
  Musics = Object.freeze({
    GAME_MUSIC: 1,
    GAME_OVER_MUSIC: 2,
  });

  musics = [];
  sounds = [];
  previousMusic = -1;

  musicEnabled = true;
  soundEnabled = true;

  scene = null;

  static get instance() {
    return (
      globalThis[Symbol.for(`PF_${SoundManager.name}`)] ||
      new SoundManager()
    );
  }

 
  async init(scene) {
    this.scene = scene;
    await this.loadAssets();
    this.playMusic(this.Musics.GAME_MUSIC);
  }

  playMusic(musicId) {
    if (!this.musicEnabled || !this.scene) return false;
    if (this.previousMusic !== -1) {
      this.musics[this.previousMusic]?.stop();
      this.previousMusic = -1;
    }
    const music = this.musics[musicId];
    if (music) {
      music.play();
      this.previousMusic = musicId;
      return true;
    }
    return false;
  }

  playSound(soundId, loop = false) {
    if (!this.soundEnabled || !this.scene) return;
    const sfx = this.sounds[soundId];
    if (sfx) {
      sfx.loop = loop;
      sfx.play();
    }
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled && this.previousMusic !== -1) {
      this.musics[this.previousMusic]?.stop();
      this.previousMusic = -1;
    } else if (enabled && this.previousMusic === -1) {
      this.playMusic(this.Musics.GAME_MUSIC);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  async loadAssets() {
    if (!this.scene) throw new Error("SoundManager: scene not set");
    return new Promise((resolve, reject) => {
      const assetsManager = new AssetsManager(this.scene);

      const musicTask = assetsManager.addBinaryFileTask(
        "music1",
        music1Url
      );

      assetsManager.onFinish = () => {
        // créer l’objet Sound pour la musique
        this.musics[this.Musics.GAME_MUSIC] = new Sound(
          "gameMusic",
          musicTask.data,
          this.scene,
          null,
          { loop: true, autoplay: false, volume: 0.5 }
        );
        resolve(true);
      };

      assetsManager.onTaskError = (task, message) => {
        console.error("Audio task failed", task.name, message);
        reject(false);
      };

      assetsManager.load();
    });
  }
}

const { instance } = SoundManager;
export { instance as SoundManager };
