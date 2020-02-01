class Player {
    constructor(id) {
        this.id = id;

        this.collisionBox = null;

        this.action = null;

        this.coolDown = 0;

        this.ACTIONS = ["THROW_HAMMER", "ADD_BLOCK"];

        this.walkSpeed = 0.03125 * 2;
        this.jumpSpeed = 0.15625;
        this.speed = new Vector3D(0, 0, 0);
        this.isJumping = false;
        this.direction = new Vector2D(-0.5, 0.5);
        this.distanceFromFloor = 0;
        this.hammer = null;

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
                else if (z === 0) this.distanceFromFloor = this.collisionBox.pos.z;
            }
        }

        this.addBlock = game => {
            this.speed.z = 1;

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, this.speed.z)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                var pos = this.collisionBox.pos.floor();
                game.scene.blocks.set(pos.x + ", " + pos.y + ", " + pos.z, new CollisionBox({...pos}, new Vector3D(1, 1, 1)));
                this.collisionBox = newCollisionBox;
                this.coolDown = 30;
            }

            this.speed.z = 0;
        }

        this.throwHammer = () => {
            // if (hammer === null) {
                this.hammer = new Hammer(this.collisionBox.pos, this.direction);
                // (this.hammer);
            // }
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

        this.update = game => {
            var inputs = this.socdCleaner({...game.inputList.get(this.id)});
            var lastInputs = game.lastInputList.get(this.id);

            var newCollisionBox = new CollisionBox(
                this.collisionBox.pos.plus(new Vector3D(0, 0, -0.0001)),
                this.collisionBox.size.plus(new Vector3D(0, 0, 0.0001))
            );
            var isOnFloor = !this.speed.z && (this.collisionBox.pos.z === 0 || newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length);

            if (isOnFloor) {
                if (inputs.c) {
                    this.speed.z = this.jumpSpeed;
                }
                else if (inputs.a && !this.coolDown) {
                    this.addBlock(game);
                } else if (inputs.b && !this.hammer) {
                    this.throwHammer();
                }
            }


            if (this.coolDown) this.coolDown--;

            this.moveXY(game, inputs);
            this.moveZ(game);
        }
    }
}