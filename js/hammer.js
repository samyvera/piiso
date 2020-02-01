class Hammer {

    constructor(pos, direction) {
        this.speed = new Vector3D(0, 0, 0.3);
        this.xSpeed = 0.1;
        // this.degrees = 90;
        this.direction = {
            ...direction
        };
        this.collisionBox = new CollisionBox({
            ...pos
        }, new Vector3D(0.5, 0.5, 0.5));
        this.isDestroyed = false;

        this.touch = (game, player) => {
            game.players.map((p) => {
                if (p.id != player.id && this.collisionBox.collidesWith(p.collisionBox)) {
                    console.log('touch');
                    p.coolDown = 180;
                }
            })
        }

        this.moveXY = (game, player) => {
            this.speed.x = 0;
            this.speed.y = 0;

            if (this.direction.x === -0.5 && this.direction.y === 0.5) {
                this.speed.x += this.xSpeed;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 0.5 && this.direction.y === -0.5) {
                this.speed.x -= this.xSpeed;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === 0.5 && this.direction.y === 0.5) {
                this.speed.x += this.xSpeed;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === -0.5 && this.direction.y === -0.5) {
                this.speed.x -= this.xSpeed;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 1 && this.direction.y === 0) {
                this.speed.x = 0;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === 0 && this.direction.y === 1) {
                this.speed.x += this.xSpeed;
                this.speed.y = 0;
            } else if (this.direction.x === -1 && this.direction.y === 0) {
                this.speed.x = 0;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 0 && this.direction.y === -1) {
                this.speed.x -= this.xSpeed;
                this.speed.y = 0;
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(this.speed.x, 0, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length) {
                this.collisionBox = newCollisionBox;
            } else if (!this.isDestroyed) {
                this.isDestroyed = true;
                var blocks = newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]);
                blocks.forEach(block => {
                    game.scene.blocks.delete(Math.floor(block.pos.x) + ", " + Math.floor(block.pos.y) + ", " + Math.floor(block.pos.z));
                });
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, this.speed.y, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length) {
                this.collisionBox = newCollisionBox;
            } else if (!this.isDestroyed) {
                this.isDestroyed = true;
                var blocks = newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]);
                blocks.forEach(block => {
                    game.scene.blocks.delete(Math.floor(block.pos.x) + ", " + Math.floor(block.pos.y) + ", " + Math.floor(block.pos.z));
                });
            }

            this.touch(game, player);
        }



        this.moveZ = (game, player) => {
            this.speed.z -= game.scene.gravity.z;
            
            game.scene.players.map((p) => {
                if (p.id != player.id && this.collisionBox.collidesWith(p.collisionBox)) {
                    console.log('touch');
                    
                    p.coolDown = 180;
                }
            })

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, this.speed.z)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length && this.collisionBox.pos.z >= 0) {
                this.collisionBox = newCollisionBox;
            } else if (!this.isDestroyed) {
                this.isDestroyed = true;
                var blocks = newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]);
                blocks.forEach(block => {
                    game.scene.blocks.delete(Math.floor(block.pos.x) + ", " + Math.floor(block.pos.y) + ", " + Math.floor(block.pos.z));
                });
            }

            this.touch(game, player);
        }

        this.update = (game, player) => {
            this.moveXY(game, player);
            this.moveZ(game, player);
            if (this.isDestroyed) {
                player.hammer = null;
            }
        }
    }
}