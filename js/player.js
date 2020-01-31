class Player {
    constructor(id) {
        this.id = id;

        this.collisionBox = null;

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

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(this.speed.x, 0, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, this.speed.y, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            }
        }

        this.moveZ = game => {
            this.speed.z -= game.scene.gravity.z;
            if (this.isJumping) this.speed.z = this.jumpSpeed;

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, this.speed.z)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            } else {
                this.speed.z = 0;
            }

            var pos = this.collisionBox.pos.plus(this.collisionBox.size.times(0.5)).floor();
            for (let z = pos.z; z >= 0; z--) {
                var block = game.scene.blocks.get(pos.x + ", " + pos.y + ", " + z);
                if (block) {
                    this.distanceFromFloor = this.collisionBox.pos.z - (block.pos.z + block.size.z);
                    break;
                }
            }
        }

        this.update = game => {
            var inputs = this.socdCleaner({...game.inputList.get(this.id)});
            var lastInputs = game.lastInputList.get(this.id);

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, -this.jumpSpeed)), this.collisionBox.size.plus(new Vector3D(0, 0, this.jumpSpeed)));
            if (this.isJumping) this.isJumping = false;
            else if (
                !this.speed.z && (this.collisionBox.pos.z === 0 || newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length)) {
                if (inputs.a) this.isJumping = true;
            }

            this.moveXY(game, inputs);
            this.moveZ(game);
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