class Scene {
    constructor(players) {
        this.winner = null;
        this.players = players;
        this.player1 = this.players[0];
        this.player1.index = 1;
        this.player1.collisionBox = new CollisionBox(
            new Vector3D(0.25, 0.25, 1),
            new Vector3D(0.5, 0.5, 1.5)
        );
        this.player2 = this.players[1];
        this.player2.index = 2;
        this.player2.collisionBox = new CollisionBox(
            new Vector3D(3.25, 3.25, 0),
            new Vector3D(0.5, 0.5, 1.5)
        );

        this.size = new Vector3D(12, 12, 12);
        this.collisionBox = new CollisionBox(
            new Vector3D(0, 0, 0),
            this.size
        )

        this.blocks = new Map();
        this.blocks.set('0, 0, 0', new CollisionBox(new Vector3D(0, 0, 0), new Vector3D(1, 1, 1)));
        this.blocks.set('11, 0, 0', new CollisionBox(new Vector3D(11, 0, 0), new Vector3D(1, 1, 1)));
        this.blocks.set('0, 11, 0', new CollisionBox(new Vector3D(0, 11, 0), new Vector3D(1, 1, 1)));
        this.blocks.set('11, 11, 0', new CollisionBox(new Vector3D(11, 11, 0), new Vector3D(1, 1, 1)));

        this.gravity = new Vector3D(0, 0, 0.015625);

        this.checkVictory = game => {
            var winner = game.scene.players.find(player => player.collisionBox.pos.z === 10 && !player.isJumping);
            if (winner) this.winner = winner;
        }

        this.update = game => {
            if (!this.winner) {
                this.players.forEach(player => {
                    player.update(game);
                });
                this.checkVictory(game);
            }
        }
    }
}