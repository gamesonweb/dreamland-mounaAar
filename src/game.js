import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Vector3,
  SceneLoader
} from "@babylonjs/core";
import { registerBoardClicks } from "./caseSelector.js";
import { loadPieces }        from "./pieces.js";

export default class Game {
  
  constructor(canvasOrId, playerColor = "white") {
    const canvas = typeof canvasOrId === "string"
      ? document.getElementById(canvasOrId)
      : canvasOrId;
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Game: attendu un <canvas> ou son id");
    }

    this.engine = new Engine(canvas, true);
    this.scene  = new Scene(this.engine);

    const target    = Vector3.Zero();
    const baseAlpha = (playerColor === "white" ? Math.PI/2 : 3*Math.PI/2);
    const beta      = Math.PI / 3.3;
    const radius    = 15;

    this.camera = new ArcRotateCamera("cam", baseAlpha, beta, radius, target, this.scene);
    this.camera.attachControl(canvas, true);

    this.camera.lowerRadiusLimit = 10;
    this.camera.upperRadiusLimit = 55;

    const halfView = Math.PI / 2;
    this.camera.lowerAlphaLimit = baseAlpha - halfView/2;
    this.camera.upperAlphaLimit = baseAlpha + halfView/2;

    this.camera.lowerBetaLimit = 0.5;
    this.camera.upperBetaLimit = Math.PI / 2;

    this.camera.panningSensibility = 0;

    this._camState = {
      alpha:             this.camera.alpha,
      beta:              this.camera.beta,
      radius:            this.camera.radius,
      lowerAlphaLimit:   this.camera.lowerAlphaLimit,
      upperAlphaLimit:   this.camera.upperAlphaLimit,
      lowerBetaLimit:    this.camera.lowerBetaLimit,
      upperBetaLimit:    this.camera.upperBetaLimit,
      lowerRadiusLimit:  this.camera.lowerRadiusLimit,
      upperRadiusLimit:  this.camera.upperRadiusLimit,
      panningSensibility:this.camera.panningSensibility
    };
    this._topDown = false;

    const hemi = new HemisphericLight("hemi", Vector3.Up(), this.scene);
    hemi.intensity = 0.4;
    const dir = new DirectionalLight("dir", new Vector3(-1, -2, -1), this.scene);
    dir.intensity = 3;

    const shadowGen = new ShadowGenerator(2048, dir);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;

    SceneLoader.ImportMesh(
      "", "assets/models/", "echec.glb", this.scene,
      (meshes) => {
        const casePositions = {};
        meshes.forEach(m => {
          m.isPickable = true;
          shadowGen.addShadowCaster(m, true);
          if (/^[A-H][1-8]$/.test(m.name)) {
            casePositions[m.name] = m.getBoundingInfo()
                                      .boundingBox
                                      .centerWorld
                                      .clone();
          }
        });

        registerBoardClicks(this.scene, casePositions);
        loadPieces(this.scene, casePositions, shadowGen);
      }
    );

    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener("resize", () => this.engine.resize());
  }


toggleTopDownView() {
  if (!this.camera) return;
  this._topDown = !this._topDown;

  if (this._topDown) {
  
    const topRadius = 80;
    const topBeta   = 0.05;  

    this.camera.lowerBetaLimit    =
    this.camera.upperBetaLimit    = topBeta;
    this.camera.lowerRadiusLimit  =
    this.camera.upperRadiusLimit  = topRadius;

    this.camera.beta   = topBeta;
    this.camera.radius = topRadius;

    this.camera.lowerAlphaLimit   =
    this.camera.upperAlphaLimit   = this.camera.alpha;
    this.camera.panningSensibility = 0;
  } else {
    const s = this._camState;
    this.camera.alpha              = s.alpha;
    this.camera.beta               = s.beta;
    this.camera.radius             = s.radius;
    this.camera.lowerAlphaLimit    = s.lowerAlphaLimit;
    this.camera.upperAlphaLimit    = s.upperAlphaLimit;
    this.camera.lowerBetaLimit     = s.lowerBetaLimit;
    this.camera.upperBetaLimit     = s.upperBetaLimit;
    this.camera.lowerRadiusLimit   = s.lowerRadiusLimit;
    this.camera.upperRadiusLimit   = s.upperRadiusLimit;
    this.camera.panningSensibility  = s.panningSensibility;
  }
}

}
