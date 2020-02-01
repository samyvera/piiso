class Display {
    constructor(game) {
        this.frame = 0;
        this.zoom = 4;

        this.game = game;
        this.scale = 16;
        this.shadowStep = 1 / 16;

        this.backgroundImg = document.createElement("img");
        this.backgroundImg.src = "img/background.png";

        this.titleImg = document.createElement("img");
        this.titleImg.src = "img/title.png";
        this.blockImg = document.createElement("img");
        this.blockImg.src = "img/block.png";
        this.playerImg = document.createElement("img");
        this.playerImg.src = "img/player.png";
        this.player2Img = document.createElement("img");
        this.player2Img.src = "img/player2.png";
        this.playerShadowImg = document.createElement("img");
        this.playerShadowImg.src = "img/playerShadow.png";
        this.hammerImg = document.createElement("img");
        this.hammerImg.src = "img/hammer.png";
        this.limitImg = document.createElement("img");
        this.limitImg.src = "img/limit.png";

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

            var modifier = player.coolDown ? player.coolDown % 2 : 1;

            if (modifier) {
                this.cx.drawImage(player.id === this.game.scene.player1.id ? this.playerImg : this.player2Img,
                    10 * xPos,
                    16 * yPos,
                    10,
                    16,
                    playerPos.x * this.scale + this.scale / 8,
                    playerPos.y * this.scale - this.scale / 2 + this.scale / 4,
                    10,
                    16
                );
            }

        }

        this.drawHammer = (hammer, hammerPos) => {
            this.cx.drawImage(this.hammerImg,
                this.scale * (Math.floor(this.frame / 4) % 4),
                0,
                this.scale, this.scale,
                hammerPos.x * this.scale,
                hammerPos.y * this.scale,
                this.scale, this.scale
            );
        }

        this.drawBackground = () => {
            this.cx.drawImage(this.backgroundImg,
                0,
                0,
                192,
                96,
                this.canvas.width / 2 / this.zoom - 192 / 2,
                this.canvas.height / 2 / this.zoom - 24,
                192,
                96
            );
        }

        this.drawScene = () => {
            this.cx.translate(
                this.canvas.width / 2 / this.zoom - this.scale / 2,
                this.canvas.height / 2 / this.zoom - this.scale * 2
            );

            var scene = this.game.scene;

            // for (let i = 0, k = 0; i < scene.size.x * scene.size.z + 2; i++, k = (i + 1) / 2) {
            //     for (let x = 0; x <= k; x++) {
            //         for (let y = 0; y <= k; y++) {
            //             for (let z = 0; z <= k; z++) {
            //                 if (x + y + z === k) {
                
                for (let z = 0; z < scene.size.z; z++) {
                    for (let x = 0; x < scene.size.x; x++) {
                        for (let y = 0; y < scene.size.y; y++) {
                                if (scene.blocks.has(x + ', ' + y + ', ' + z)) {
                                    var tilePos = v3toV2(new Vector3D(x, y, z));

                                    this.cx.drawImage(this.blockImg,
                                        0,
                                        0,
                                        this.scale, this.scale,
                                        tilePos.x * this.scale,
                                        tilePos.y * this.scale,
                                        this.scale, this.scale
                                    );

                                    // this.cx.fillStyle = '#0f0';
                                    // this.cx.fillRect(
                                    //     tilePos.x * this.scale,
                                    //     tilePos.y * this.scale,
                                    //     this.scale, this.scale
                                    // );
                                }

                                scene.players.forEach(player => {
                                    if (player.collisionBox.pos.floor().equals(new Vector3D(x, y, z))) {
                                        this.drawPlayer(player, v3toV2(player.collisionBox.pos));
                                    }
                                });
                        //     }
                        // }
                    }
                }

                scene.players.forEach(player => {
                    if (player.hammer) {
                        this.drawHammer(player.hammer, v3toV2(player.hammer.collisionBox.pos));
                    }
                });
            }

            this.cx.globalAlpha = 0.5;
            scene.players.forEach(player => this.drawPlayer(player, v3toV2(player.collisionBox.pos)));
            this.cx.globalAlpha = 1;

            this.cx.translate(
                -this.canvas.width / 2 / this.zoom + this.scale / 2,
                -this.canvas.height / 2 / this.zoom + this.scale * 2
            );
        }

        this.drawLimit = () => {
            if (this.game.scene.players.find((p) => p.collisionBox.pos.z > 7)) {
                this.cx.drawImage(this.limitImg,
                    0,
                    0,
                    192,
                    96,
                    this.canvas.width / 2 / this.zoom - 192 / 2,
                    this.canvas.height / 2 / this.zoom - 96 / 2 - this.scale * 3.5,
                    192,
                    96
                );
            }
        }
 
        this.drawHUD = () => {
            var scene = this.game.scene;
            scene.players.forEach((player, i) => {
                this.cx.fillStyle = '#f0f0f0';
                this.cx.fillRect(
                    this.canvas.width / 2 / this.zoom + this.scale * 7 + this.scale * 14 * -i,
                    this.canvas.height / 2 / this.zoom - this.scale * 2,
                    2, this.scale * 5
                );
                
                this.cx.fillStyle = '#0f0';
                this.cx.fillRect(
                    this.canvas.width / 2 / this.zoom + this.scale * 7 + this.scale * 14 * -i,
                    this.canvas.height / 2 / this.zoom + this.scale * 3 - this.scale * player.collisionBox.pos.z / 2, // ici
                    2, this.scale * player.collisionBox.pos.z / 2 // ici
                );
            });
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

            //background
            this.drawBackground();

            //scene
            if (this.game.scene) {
                this.drawScene();
                this.drawLimit();

                //hud
                this.drawHUD();
            } else {
                this.cx.drawImage(this.titleImg,
                    0,
                    0,
                    256,
                    64,
                    this.canvas.width / 2 / this.zoom - 256 / 2,
                    this.canvas.height / 2 / this.zoom - 64 / 2,
                    256,
                    64
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