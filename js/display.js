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
        this.hammerImg = document.createElement("img");
        this.hammerImg.src = "img/hammer.png";

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

            this.cx.drawImage(this.playerImg,
                0,
                0,
                this.scale / 2, this.scale,
                playerPos.x * this.scale + this.scale / 4,
                playerPos.y * this.scale - this.scale / 4,
                this.scale / 2, this.scale
            );
        }

        // this.drawRotated = (degrees) => {
        //     context.clearRect(0,0,canvas.width,canvas.height);
        //     context.save();
        //     context.translate(canvas.width/2,canvas.height/2);
        //     context.rotate(degrees*Math.PI/180);
        //     context.drawImage(image,-image.width/2,-image.width/2);
        //     context.restore();
        // }

        this.drawHammer = (hammer,hammerPos) => {
            this.cx.fillStyle = '#000';
            this.cx.drawImage(this.hammerImg,
                0,
                0,
                this.scale, this.scale,
                hammerPos.x * this.scale,
                hammerPos.y * this.scale,
                this.scale, this.scale
            );
            console.log('drawHammer');
            console.log('hammerPos :', hammerPos);
            // this.drawRotated(hammer.degrees)
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

        this.drawBackground = () => {
            this.cx.drawImage(this.backgroundImg,
                0,
                0,
                128,
                64,
                this.canvas.width / 2 / this.zoom - 128 / 2,
                this.canvas.height / 2 / this.zoom - 64 / 2,
                128,
                64
            );
        }

        this.drawScene = () => {
            this.cx.translate(
                this.canvas.width / 2 / this.zoom - this.scale / 2,
                this.canvas.height / 2 / this.zoom - this.scale * 2.5
            );

            var scene = this.game.scene;

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

                        // if (player.pos.plus(new Vector3D(0, 0, -player.distanceFromFloor)).round().equals(new Vector3D(x, y, z))) {
                        //     this.drawPlayerShadow(v3toV2(player.pos.plus(new Vector3D(0, 0, -player.distanceFromFloor))));
                        // }

                        scene.players.forEach(player => {
                            if (player.collisionBox.pos.floor().equals(new Vector3D(x, y, z))) {
                                this.drawPlayer(player, v3toV2(player.collisionBox.pos));
                            }
                        });
                    }
                }
            }

            this.cx.globalAlpha = 0.25;
            scene.players.forEach(player => this.drawPlayer(player, v3toV2(player.collisionBox.pos)));
            this.cx.globalAlpha = 1;

            this.cx.translate(
                -this.canvas.width / 2 / this.zoom + this.scale / 2,
                -this.canvas.height / 2 / this.zoom + this.scale * 2.5
            );
        }

        this.drawHUD = () => {
            var scene = this.game.scene;

            scene.players.forEach((player, i) => {
                this.cx.fillStyle = "#fff";
                this.cx.font = 8 + "px consolas";
                this.cx.fillText(
                    "posX:" + player.collisionBox.pos.x + " posY:" + player.collisionBox.pos.y + " posZ:" + player.collisionBox.pos.z,
                    2,
                    8 + i * 16
                );
                this.cx.fillText(
                    "dirX:" + player.direction.x + " dirY:" + player.direction.y,
                    2,
                    16 + i * 16
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