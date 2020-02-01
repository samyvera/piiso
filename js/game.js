class Game {
    constructor(inputList) {
        this.frame = 0;

        this.introEndFrame = 300;

        this.inputList = inputList;
        this.lastInputList = new Map();

        this.scene = null;

        this.players = [];

        this.update = keys => {
            if (this.frame > this.introEndFrame) {
                if (this.players.length === 2) {
                    if (!this.scene) this.scene = new Scene(this.players);
                    else this.scene.update(this);
                } else if (this.inputList.size !== this.players.size) {
                    this.inputList.forEach((input, id) => {
                        if (!this.players.find(player => player.id === id)) this.players.push(new Player(id));
                    });
                }
                this.inputList.forEach((input, id) => this.lastInputList.set(id, {
                    ...input
                }));
            }
            this.frame++;
        }
    }
}