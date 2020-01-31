class Display {
    constructor(game) {
        this.frame = 0;
        this.zoom = 3;

        this.game = game;
        this.scale = 16;
        this.shadowStep = 1 / 16;

        // this.blockImg = document.createElement("img");
        // this.blockImg.src = "img/block.png";
        // this.playerImg = document.createElement("img");
        // this.playerImg.src = "img/player.png";

        this.drawPlayer = (player, playerPos) => {
            var playerFrameSpeed = 16;
            var playerFrameLength = 4;
            var yPos = 0;

            if (player.direction.x === -0.5 && player.direction.y === 0.5) {
                yPos = 0;
            } else if (player.direction.x === 0.5 && player.direction.y === -0.5) {
                yPos = 1;
            } else if (player.direction.x === -0.5 && player.direction.y === -0.5) {
                yPos = 2;
            } else if (player.direction.x === 0.5 && player.direction.y === 0.5) {
                yPos = 3;
            }

            if (player.speed.x || player.speed.y) {
                playerFrameSpeed = 12;
                if (player.direction.x === 1 && player.direction.y === 0) {
                    yPos = 6;
                } else if (player.direction.x === 0 && player.direction.y === 1) {
                    yPos = 6;
                } else if (player.direction.x === -1 && player.direction.y === 0) {
                    yPos = 5;
                } else if (player.direction.x === 0 && player.direction.y === -1) {
                    yPos = 5;
                } else if (player.direction.x === 0.5 && player.direction.y === -0.5) {
                    yPos = 7;
                } else if (player.direction.x === -0.5 && player.direction.y === 0.5) {
                    yPos = 4;
                } else if (player.direction.x === 0.5 && player.direction.y === 0.5) {
                    yPos = 6;
                } else if (player.direction.x === -0.5 && player.direction.y === -0.5) {
                    yPos = 5;
                }
            }

            var xPos = Math.floor(this.frame / playerFrameSpeed) % playerFrameLength;

            // this.cx.drawImage(this.playerImg,
            //     this.scale * 1.5 * xPos,
            //     this.scale * 1.5 * yPos,
            //     this.scale * 1.5,
            //     this.scale * 1.5,
            //     playerPos.x * this.scale - this.scale / 4,
            //     playerPos.y * this.scale - this.scale / 2 - this.scale / 4,
            //     this.scale * 1.5,
            //     this.scale * 1.5
            // );

            this.cx.fillRect(
                playerPos.x * this.scale - this.scale / 4,
                playerPos.y * this.scale - this.scale / 2 - this.scale / 4,
                this.scale * 1.5,
                this.scale * 1.5
            );
        }

        this.drawPlayerShadow = playerShadowPos => {
            this.cx.drawImage(this.playerImg,
                0,
                this.scale * 1.5 * 8,
                this.scale * 1.5,
                this.scale * 1.5,
                playerShadowPos.x * this.scale - this.scale / 4,
                playerShadowPos.y * this.scale - this.scale / 2 - this.scale / 4,
                this.scale * 1.5,
                this.scale * 1.5
            );
        }

        this.drawScene = () => {
            this.cx.translate(
                this.canvas.width / 2 / this.zoom,
                this.canvas.height / 2 / this.zoom
            );

            var scene = this.game.scene;
            var player = scene.players[0];

            for (let i = 0, k = 0; i < scene.size.x * scene.size.z + 2; i++, k = (i + 1) / 2) {
                for (let x = 0; x <= k; x++) {
                    for (let y = 0; y <= k; y++) {
                        for (let z = 0; z <= k; z++) {
                            if (x + y + z === k) {
                                if (!scene.blocks.has(x + ', ' + y + ', ' + z)) continue;
                                else {
                                    var tilePos = v3toV2(new Vector3D(x, y, z));

                                    // this.cx.drawImage(this.blockImg,
                                    //     texturePos.x * this.scale,
                                    //     texturePos.y * this.scale,
                                    //     this.scale, this.scale,
                                    //     tilePos.x * this.scale,
                                    //     tilePos.y * this.scale,
                                    //     this.scale, this.scale
                                    // );

                                    this.cx.fillRect(
                                        tilePos.x * this.scale,
                                        tilePos.y * this.scale,
                                        this.scale, this.scale
                                    );
                                }

                                if (player.pos.plus(new Vector3D(0, 0, -player.distanceFromFloor)).round().equals(new Vector3D(x, y, z))) {
                                    this.drawPlayerShadow(v3toV2(player.pos.plus(new Vector3D(0, 0, -player.distanceFromFloor))));
                                }
                                if (new Vector3D(Math.round(player.pos.x), Math.round(player.pos.y), Math.floor(player.pos.z)).equals(new Vector3D(x, y, z))) {
                                    this.drawPlayer(player, v3toV2(player.pos));
                                }
                            }
                        }
                    }
                }
            }

            this.cx.translate(
                -this.canvas.width / 2 / this.zoom,
                -this.canvas.height / 2 / this.zoom
            );
        }

        this.update = () => {

            //skybox

            var gradient = this.cx.createLinearGradient(0, 0, 0, this.canvas.height / this.zoom);
            gradient.addColorStop(0, "rgba(128, 128, 160, 1)");
            gradient.addColorStop(1, "rgba(32, 32, 64, 1)");

            this.cx.fillStyle = gradient;
            this.cx.fillRect(
                0,
                0,
                this.canvas.width / this.zoom,
                this.canvas.height / this.zoom
            );

            //scene

            if (this.game.scene) this.drawScene();

            //interface

            if (this.game.scene) {
                var scene = this.game.scene;
                var player = scene.players[0];
                this.cx.fillStyle = "#fff";
                this.cx.font = 8 + "px consolas";
                this.cx.fillText(
                    "posX:" + player.pos.x + " posY:" + player.pos.y + " posZ:" + player.pos.z,
                    2,
                    8
                );
                this.cx.fillText(
                    "dirX:" + player.direction.x + " dirY:" + player.direction.y,
                    2,
                    16
                );

            }

            this.frame++;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = innerWidth - (innerWidth % 2);
        this.canvas.height = innerHeight - (innerHeight % 2);

        this.cx = this.canvas.getContext("2d");
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        document.body.appendChild(this.canvas);
        window.addEventListener('resize', () => {
            this.canvas.width = innerWidth - (innerWidth % 2);
            this.canvas.height = innerHeight - (innerHeight % 2);
            this.cx.scale(this.zoom, this.zoom);
            this.cx.imageSmoothingEnabled = false;
        });
    }
}