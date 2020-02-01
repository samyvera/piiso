class Scene {
    constructor(players) {
        this.winner = null;
        this.players = players;
        this.player1 = this.players[0];
        this.player1.hammer = null;
        this.player1.index = 1;
        this.player1.collisionBox = new CollisionBox(
            new Vector3D(0.25, 11.25, 0),
            new Vector3D(0.5, 0.5, 1.5)
        );
        this.player1.direction = new Vector2D(0.5, 0.5);
        this.player2 = this.players[1];
        this.player2.hammer = null;
        this.player2.index = 2;
        this.player2.collisionBox = new CollisionBox(
            new Vector3D(11.25, 0.25, 0),
            new Vector3D(0.5, 0.5, 1.5)
        );
        this.player2.direction = new Vector2D(-0.5, -0.5);

        this.introEndFrame = 120;
        this.introFrame = this.introEndFrame;

        this.size = new Vector3D(12, 12, 12);
        this.collisionBox = new CollisionBox(
            new Vector3D(0, 0, 0),
            this.size
        );

        this.blocks = new Map();

        this.gravity = new Vector3D(0, 0, 0.015625);

        this.checkVictory = game => {
            var winner = game.scene.players.find(player => player.collisionBox.pos.z === 10 && !player.isJumping);
            if (winner) this.winner = winner;
        }

        this.update = game => {
            if (this.introFrame) this.introFrame--;
            else if (!this.winner) {
                this.players.forEach(player => {
                    player.update(game);
                });
                this.checkVictory(game);
            }
        }
    }
}