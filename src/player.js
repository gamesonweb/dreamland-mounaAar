import { HighlightLayer, Color3 } from "@babylonjs/core";
import { Chess } from "chess.js";
import { highlightPiece, highlightSquares } from "./highlight.js";

export default class Player {
  constructor(scene, caseMeshes, casePositions, playerColor) {
    this.scene = scene;
    this.caseMeshes = caseMeshes;
    this.casePositions = casePositions;
    this.turn = playerColor;
    this.turnHasChanged = false;
    this.selectedMesh = null;

    // Initialise le moteur d’échecs
    this.chess = new Chess();
    this.chess.reset();
    console.log("État initial du plateau :", this.chess.ascii());

    // HighlightLayers
    this.hlPiece = new HighlightLayer("hlPiece", scene);
    this.hlSquare = new HighlightLayer("hlSquare", scene);
  }

  selectPiece(mesh) {
    this.selectedMesh = mesh;
    const from = mesh.name.split("-")[2];
    console.log(`Sélection de ${mesh.name}, from: ${from}, position réelle: x:${mesh.position.x}, z:${mesh.position.z}`);
    const moves = this.chess.moves({ square: from, verbose: true });
    console.log(`Coups possibles pour ${mesh.name} :`, moves.map(m => m.to));
    return moves.map(m => m.to);
  }

  tryMove(toSquare) {
    if (!this.selectedMesh) {
      console.log("Aucune pièce sélectionnée pour le déplacement.");
      return null;
    }
    const from = this.selectedMesh.name.split("-")[2];
    const to = toSquare;
    console.log("État du plateau avant coup :", this.chess.ascii());
    console.log("Tentative de coup :", { from, to });

    let mv = this.chess.move({ from, to });
    if (mv) return mv;

    const rank = toSquare[1];
    if (this.selectedMesh.name.startsWith("pion-") && (rank === "8" || rank === "1")) {
      try {
        mv = this.chess.move({ from, to, promotion: "q" });
      } catch (e) {
        console.log("Erreur de promotion :", e.message);
      }
    }
    if (!mv) {
      console.log("Coup invalide :", { from, to });
    }
    return mv || null;
  }

  computerPlay() {
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    const mv = moves[Math.floor(Math.random() * moves.length)];
    this.chess.move(mv);
    console.log("Coup IA joué :", mv);
    return mv;
  }

  handlePick(mesh) {
    const name = mesh.name;

    // Sélection d'une pièce
    if (/^[a-z]+-(blanc|noir)-[a-h][1-8]$/.test(name)) {
      const color = name.split("-")[1];
      if ((this.turn === "white" && color !== "blanc") ||
          (this.turn === "black" && color !== "noir")) {
        console.log(`Tour incorrect : ${this.turn} ne peut pas jouer ${color}`);
        return false;
      }

      if (this.selectedMesh && this.selectedMesh.name === name) {
        console.log("Pièce déjà sélectionnée, annulation de la sélection.");
        highlightPiece(this.scene, null);
        highlightSquares(this.scene, []);
        this.selectedMesh = null;
        return false;
      }

      highlightPiece(this.scene, mesh);
      const targets = this.selectPiece(mesh);
      const targetMeshes = targets.map(t => this.caseMeshes[t]).filter(m => m);
      highlightSquares(this.scene, targetMeshes);

      return false;
    }

    // Déplacement vers une case
    if (this.selectedMesh && /^[a-h][1-8]$/.test(name)) {
      const mv = this.tryMove(name);
      if (!mv) {
        console.log("Coup invalide vers", name);
        return false;
      }

      const [type, color] = this.selectedMesh.name.split("-");
      const newName = `${type}-${color}-${name}`;
      this.selectedMesh.name = newName;
      this.selectedMesh.position = this.casePositions[name].clone();
      console.log(`Pièce déplacée : ${newName}`);

      highlightPiece(this.scene, null);
      highlightSquares(this.scene, []);
      this.selectedMesh = null;

      this.turn = this.turn === "white" ? "black" : "white";
      this.turnHasChanged = true;
      return true;
    }

    if (this.selectedMesh) {
      console.log("Clic hors pièce ou case valide, désélection.");
      highlightPiece(this.scene, null);
      highlightSquares(this.scene, []);
      this.selectedMesh = null;
    }

    return false;
  }

  playAI() {
    const comp = this.computerPlay();
    if (!comp) return;
    const map = { p: "pion", r: "tour", n: "cavalier", b: "fou", q: "reine", k: "roi" };
    const meshType = map[comp.piece];
    const meshCol = comp.color === "w" ? "blanc" : "noir";
    const fromName = `${meshType}-${meshCol}-${comp.from}`;
    const toName = `${meshType}-${meshCol}-${comp.to}`;
    const iaMesh = this.scene.getMeshByName(fromName);
    if (iaMesh) {
      iaMesh.name = toName;
      iaMesh.position = this.casePositions[comp.to].clone();
      console.log(`IA déplace ${fromName} vers ${toName}`);
    }
    this.turn = this.turn === "white" ? "black" : "white";
    this.turnHasChanged = false;
  }
}