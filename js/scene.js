class Scene {
    constructor(players) {
        this.players = players;

        this.player1 = this.players[0];
        this.player1.pos = new Vector3D(3.25, 3.25, 0);
        this.player1.size = new Vector3D(0.5, 0.5, 1.5);
        // this.player2 = this.players[1];

        this.size = new Vector3D(8, 8, 4);

        this.blocks = new Map();

        this.gravity = new Vector3D(0, 0, 0.015625);

        this.update = game => {
            this.players.forEach(player => player.update(game));
        }
    }
}