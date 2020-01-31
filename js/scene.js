class Scene {
    constructor(players) {
        this.players = players;
        this.player1 = this.players[0];
        this.player1.collisionBox = new CollisionBox(
            new Vector3D(3.25, 3.25, 2),
            new Vector3D(0.5, 0.5, 1)
        );
        this.player2 = this.players[1];
        this.player2.collisionBox = new CollisionBox(
            new Vector3D(3.25, 3.25, 2),
            new Vector3D(0.5, 0.5, 1)
        );

        this.size = new Vector3D(8, 8, 4);
        this.collisionBox = new CollisionBox(
            new Vector3D(0, 0, 0),
            this.size
        )

        this.blocks = new Map();
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                this.blocks.set(i + ', ' + j + ', ' + 0, new CollisionBox(
                    new Vector3D(i, j, 0),
                    new Vector3D(1, 1, 1)
                ));
            }
        }

        this.gravity = new Vector3D(0, 0, 0.015625);

        this.update = game => {
            this.players.forEach(player => player.update(game));
        }
    }
}