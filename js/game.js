class Game {
    constructor(inputList) {
        this.frame = 0;

        this.inputList = inputList;
        this.lastInputList = new Map();

        this.scene = null;

        this.players = [];

        this.antiCheat = () => {
            if (this.keys.up && this.keys.down) {
                this.keys.down = false;
            }
            if (this.keys.left && this.keys.right) {
                this.keys.left = false;
                this.keys.right = false;
            }
        }
        
        this.update = keys => {
            if (this.inputList.size !== this.players.size) {
                this.inputList.forEach((input, id) => {
                    if (!this.players.find(player => player.id === id)) this.players.push(new Player(id));
                });
            }

            if (this.players.length > 2) {
                if (!this.scene) this.scene = new Scene(this.players);
                else this.scene.update(this);
            }

            this.inputList.forEach((input, id) => this.lastInputList.set(id, { ...input }));
            this.frame++;
        }
    }
}