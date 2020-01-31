class Player {
    constructor(id) {
        this.pos = null;
        this.size = null;

        this.inputList = [];

        this.walkSpeed = 0.03125 * 2;
        this.jumpSpeed = 0.15625;
        this.speed = new Vector3D(0, 0, 0);
        this.isJumping = false;
        this.direction = new Vector2D(-0.5, 0.5);
        this.distanceFromFloor = 0;

        this.moveXY = (game, inputs) => {
            this.speed.x = 0;
            this.speed.y = 0;
            var newDirection = new Vector2D(0, 0);

            if (inputs.up) {
                this.speed.x -= this.walkSpeed;
                this.speed.y -= this.walkSpeed;
                newDirection = newDirection.plus(new Vector2D(0.5, -0.5));
            } else if (inputs.down) {
                this.speed.x += this.walkSpeed;
                this.speed.y += this.walkSpeed;
                newDirection = newDirection.plus(new Vector2D(-0.5, 0.5));
            }

            if (inputs.left) {
                this.speed.x -= this.walkSpeed;
                this.speed.y += this.walkSpeed;
                newDirection = newDirection.plus(new Vector2D(-0.5, -0.5));
            } else if (inputs.right) {
                this.speed.x += this.walkSpeed;
                this.speed.y -= this.walkSpeed;
                newDirection = newDirection.plus(new Vector2D(0.5, 0.5));
            }

            if (!newDirection.equals(new Vector2D(0, 0))) {
                this.direction = newDirection;
            }

            // var newPosX = this.pos.plus(new Vector3D(this.speed.x, 0, 0));
            // if (!obstaclesAt(newPosX, this.size, game.scene.blocks).length &&
            //     inBound3D(newPosX, this.size, game.scene)) {
            //     this.pos = newPosX;
            // }

            // var newPosY = this.pos.plus(new Vector3D(0, this.speed.y, 0));
            // if (!obstaclesAt(newPosY, this.size, game.scene.blocks).length &&
            //     inBound3D(newPosY, this.size, game.scene)) {
            //     this.pos = newPosY;
            // }
        }

        this.moveZ = game => {
            this.speed.z -= game.scene.gravity.z;
            if (this.isJumping) this.speed.z = this.jumpSpeed;

            // var newPosZ = this.pos.plus(new Vector3D(0, 0, this.speed.z));
            // if (!obstaclesAt(newPosZ, this.size, game.scene.blocks).length &&
            //     inBound3D(newPosZ, this.size, game.scene)) {
            //     this.pos = newPosZ;
            // } else {
            //     this.speed.z = 0;
            // }

            // var pos = this.pos.plus(this.size.times(0.5)).floor();
            // for (let z = pos.z; z >= 0; z--) {
            //     var tile = game.scene.blocks.get(pos.x + ", " + pos.y + ", " + z);
            //     if (tile) {
            //         this.distanceFromFloor = this.pos.z - (tile.pos.z + tile.size.z);
            //         break;
            //     }
            // }
        }

        this.update = game => {
            this.updateLastInputs(this.socdCleaner({...game.inputList.get(this.id)}));
            var inputs = this.inputList[this.inputList.length - 1].inputs;

            if (this.isJumping) this.isJumping = false;
            else if (
                inputs.a &&
                !this.speed.z &&
                obstaclesAt(this.pos.plus(new Vector3D(0, 0, -this.jumpSpeed)), new Vector3D(this.size.x, this.size.y, this.jumpSpeed), game.scene.blocks).length) {
                this.isJumping = true;
            }

            this.moveXY(game, inputs);
            this.moveZ(game);
        }
        
        this.updateLastInputs = inputs => {
            if (this.inputList.length > 0 && JSON.stringify(inputs) === JSON.stringify(this.inputList[this.inputList.length - 1].inputs)) {
                this.inputList[this.inputList.length - 1].frames++;
            } else {
                if (this.inputList.length === 10) this.inputList.splice(0, 1);
                this.inputList.push({
                    inputs: inputs,
                    frames: 1
                });
            }
        }

        this.socdCleaner = inputs => {
            var cleanedInputs = inputs;
            if (cleanedInputs.left && cleanedInputs.right) {
                cleanedInputs.left = false;
                cleanedInputs.right = false;
            }
            if (cleanedInputs.up && cleanedInputs.down) {
                cleanedInputs.down = false;
            }
            return cleanedInputs;
        }
    }
}