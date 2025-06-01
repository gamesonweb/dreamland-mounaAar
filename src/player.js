class Player {
  constructor(scene, caseMeshes, casePositions, playerColor) {
    this.scene = scene;
    this.caseMeshes = caseMeshes;
    this.casePositions = casePositions;
    this.selectedMesh = null;
    this.playerColor = playerColor; // 'white' ou 'black'

    // Initialise le moteur d’échecs
    this.chess = new Chess();
    this.chess.reset();
    console.log("État initial du plateau :", this.chess.ascii());

    // HighlightLayers
    this.hlPiece = new BABYLON.HighlightLayer("hlPiece", scene);
    this.hlSquare = new BABYLON.HighlightLayer("hlSquare", scene);
  }

  selectPiece(mesh) {
    this.selectedMesh = mesh;
    const from = mesh.name.split("-")[2];
    console.log(`Sélection de ${mesh.name}, from: ${from}`);
    const moves = this.chess.moves({ square: from, verbose: true });
    console.log(`Coups possibles :`, moves.map(m => m.to));
    return moves.map(m => m.to);
  }

  tryMove(toSquare) {
    if (!this.selectedMesh) {
      console.log("Aucune pièce sélectionnée.");
      return null;
    }

    const from = this.selectedMesh.name.split("-")[2];
    console.log("Tentative de coup :", { from, to: toSquare });

    let mv = this.chess.move({ from, to: toSquare });

    // Gestion promotion
    if (!mv && this.selectedMesh.name.startsWith("pion-")) {
      const rank = toSquare[1];
      if (rank === "8" || rank === "1") {
        mv = this.chess.move({ from, to: toSquare, promotion: "q" });
      }
    }

    if (!mv) {
      console.log("Coup invalide :", { from, to: toSquare });
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
    const chessTurn = this.chess.turn(); // 'w' ou 'b'
    console.log("Tour attendu par chess.js :", chessTurn);

    const name = mesh.name;

    // Clic sur une pièce
    if (/^[a-z]+-(blanc|noir)-[a-h][1-8]$/.test(name)) {
      const color = name.split("-")[1];

      if ((chessTurn === "w" && color !== "blanc") ||
          (chessTurn === "b" && color !== "noir")) {
        console.log(`Ce n'est pas au tour de ${color}`);
        return false;
      }

      // Si déjà sélectionnée, on annule
      if (this.selectedMesh && this.selectedMesh.name === name) {
        console.log("Sélection annulée.");
        highlightPiece(this.scene, null);
        highlightSquares(this.scene, []);
        this.selectedMesh = null;
        return false;
      }

      // Sinon, on sélectionne
      highlightPiece(this.scene, mesh);
      const targets = this.selectPiece(mesh);
      const targetMeshes = targets.map(t => this.caseMeshes[t]).filter(m => m);
      highlightSquares(this.scene, targetMeshes);
      return false;
    }

    // Clic sur une case
    if (this.selectedMesh && /^[a-h][1-8]$/.test(name)) {
      const mv = this.tryMove(name);
      if (!mv) {
        console.log("Coup refusé vers", name);
        return false;
      }

      // Supprime la pièce prise (si elle existe)
      const taken = this.scene.getMeshByName(name);
      if (taken) {
        taken.dispose();
        console.log(`Pièce capturée supprimée : ${taken.name}`);
      }

      // Récupère l'ancienne case
      const from = this.selectedMesh.name.split("-")[2];

      // Met à jour le nom et la position de la pièce
      const [type, color] = this.selectedMesh.name.split("-");
      const newName = `${type}-${color}-${name}`;
      this.selectedMesh.name = newName;
      this.selectedMesh.position = this.casePositions[name].clone();

      // Met à jour caseMeshes
      this.caseMeshes[from] = null;        // l'ancienne case est maintenant vide
      this.caseMeshes[name] = this.selectedMesh; // la pièce est maintenant sur la nouvelle case

      console.log(`Déplacement effectué : ${newName}`);

      highlightPiece(this.scene, null);
      highlightSquares(this.scene, []);
      this.selectedMesh = null;

      return true;

    }

    // Clic hors-cible, annule la sélection
    if (this.selectedMesh) {
      console.log("Clic hors zone valide, désélection.");
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
      // Supprime la pièce prise
      const taken = this.scene.getMeshByName(comp.to);
      if (taken) {
        taken.dispose();
        console.log(`Pièce capturée supprimée (IA) : ${taken.name}`);
      }

      // Ancienne position
      const from = comp.from;

      iaMesh.name = toName;
      iaMesh.position = this.casePositions[comp.to].clone();

      // Mise à jour caseMeshes
      this.caseMeshes[from] = null;
      this.caseMeshes[comp.to] = iaMesh;

      console.log(`IA déplace ${fromName} vers ${toName}`);
    }
  }
}
