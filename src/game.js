import "@babylonjs/loaders";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Vector3,
  SceneLoader,
  PointerEventTypes,
  AbstractMesh
} from "@babylonjs/core";
import { loadPieces } from "./pieces.js";
import Player from "./player.js";
import { highlightPiece, highlightSquares } from "./highlight.js";

export default class Game {
  constructor(canvasOrId, playerColor = "white") {
    this.playerColor = playerColor;
    const canvas = typeof canvasOrId === "string"
      ? document.getElementById(canvasOrId)
      : canvasOrId;
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Game: attendu un <canvas> ou son id");
    }
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.isProcessingClick = false;

    // Caméra
    const target = Vector3.Zero();
    this.camera = new ArcRotateCamera(
      "cam", Math.PI / 2, Math.PI / 3.3, 15, target, this.scene
    );
    this.camera.attachControl(canvas, true);
    this.camera.lowerRadiusLimit = 10;
    this.camera.upperRadiusLimit = 55;
    this.camera.lowerBetaLimit = 0.5;
    this.camera.upperBetaLimit = Math.PI / 2;
    const half = Math.PI / 2;
    this.camera.lowerAlphaLimit = Math.PI / 2 - half / 2;
    this.camera.upperAlphaLimit = Math.PI / 2 + half / 2;
    this.camera.panningSensibility = 0;

    // Lumières & ombres
    new HemisphericLight("hemi", Vector3.Up(), this.scene).intensity = 0.5;
    const dir = new DirectionalLight(
      "dir", new Vector3(-1, -2, -1).normalize(), this.scene
    );
    dir.intensity = 1.2;
    this.shadowGen = new ShadowGenerator(1024, dir);
    this.shadowGen.usePoissonSampling = true;

    // Map case
    this.caseMeshes = {};
    this.casePositions = {};

    // Chargement  plateau
    SceneLoader.ImportMesh("", "assets/models/", "echec.glb", this.scene, meshes => {
      meshes.forEach(node => {
        if (!(node instanceof AbstractMesh)) return;
        const n = node.name;
        if (/^[a-h][1-8]$/.test(n)) {
          node.isPickable = true;
          this.caseMeshes[n] = node;
          const center = node.getBoundingInfo().boundingBox.centerWorld.clone();
meshes.forEach(node => {
  if (!(node instanceof AbstractMesh)) return;
  const n = node.name;
  if (/^[a-h][1-8]$/.test(n)) {
    node.isPickable = true;
    this.caseMeshes[n] = node;
    const center = node.getBoundingInfo().boundingBox.centerWorld.clone();
    this.casePositions[n] = new Vector3(-center.x, center.y, center.z); // Inverse l'axe x
    console.log(`Case ${n} positionnée à x:${center.x}, y:${center.y}, z:${center.z}`);
  }
});   
    console.log(`Case ${n} positionnée à x:${center.x}, y:${center.y}, z:${center.z}`);
        }
      });

      // Vérif ces cases
      const a2Pos = this.casePositions['a2'];
      const h2Pos = this.casePositions['h2'];
      console.log(`Position de a2 : x:${a2Pos.x}, z:${a2Pos.z}`);
      console.log(`Position de h2 : x:${h2Pos.x}, z:${h2Pos.z}`);

      // Place les pièces
      loadPieces(this.scene, this.casePositions, this.shadowGen);

      // Player
      this.player = new Player(
        this.scene,
        this.caseMeshes,
        this.casePositions,
        this.playerColor
      );

      // Gestion de clic
      this.scene.onPointerObservable.add(evt => {
        if (evt.type !== PointerEventTypes.POINTERPICK || !evt.pickInfo.hit) return;
        if (this.isProcessingClick) return;
        this.isProcessingClick = true;

        const mesh = evt.pickInfo.pickedMesh;
        if (!mesh) {
          this.isProcessingClick = false;
          return;
        }
        console.log("Clic sur :", mesh.name);
        const moved = this.player.handlePick(mesh);
        if (moved && this.player.turnHasChanged) {
          this.player.turnHasChanged = false;
          this.player.playAI();
        }
        this.isProcessingClick = false;
      });
    });

    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener("resize", () => this.engine.resize());
  }
//Caméra vu du dessus
  toggleTopDownView() {
    if (!this.camera) return;
    this._topDown = !this._topDown;

    if (this._topDown) {
      const topRadius = 80;
      const topBeta = 0.05;
      this.camera.lowerBetaLimit = this.camera.upperBetaLimit = topBeta;
      this.camera.lowerRadiusLimit = this.camera.upperRadiusLimit = topRadius;
      this.camera.beta = topBeta;
      this.camera.radius = topRadius;
      this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit = this.camera.alpha;
      this.camera.panningSensibility = 0;
    } else {
      const s = this._camState || {};
      this.camera.alpha = s.alpha || Math.PI / 2;
      this.camera.beta = s.beta || Math.PI / 3.3;
      this.camera.radius = s.radius || 15;
      this.camera.lowerAlphaLimit = s.lowerAlphaLimit || Math.PI / 2 - Math.PI / 4;
      this.camera.upperAlphaLimit = s.upperAlphaLimit || Math.PI / 2 + Math.PI / 4;
      this.camera.lowerBetaLimit = s.lowerBetaLimit || 0.5;
      this.camera.upperBetaLimit = s.upperBetaLimit || Math.PI / 2;
      this.camera.lowerRadiusLimit = s.lowerRadiusLimit || 10;
      this.camera.upperRadiusLimit = s.upperRadiusLimit || 55;
      this.camera.panningSensibility = s.panningSensibility || 0;
    }
    this._camState = {
      alpha: this.camera.alpha,
      beta: this.camera.beta,
      radius: this.camera.radius,
      lowerAlphaLimit: this.camera.lowerAlphaLimit,
      upperAlphaLimit: this.camera.upperAlphaLimit,
      lowerBetaLimit: this.camera.lowerBetaLimit,
      upperBetaLimit: this.camera.upperBetaLimit,
      lowerRadiusLimit: this.camera.lowerRadiusLimit,
      upperRadiusLimit: this.camera.upperRadiusLimit,
      panningSensibility: this.camera.panningSensibility
    };
  }
}