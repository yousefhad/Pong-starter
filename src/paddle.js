export default class Paddle {
    constructor(height, x, control, score) {
        this.width = 4;
        this.height = 60;
        this.x = x;
        this.y = (height / 2) - (this.height / 2);
        this.speed = 15;
        this.maxHeight = height;
        this.score = score;

        document.addEventListener('keydown', event => {
            switch (event.keyCode) {
                case control.up:
                    this.y = Math.max(
                        0,
                        this.y - this.speed
                    );
                    break;
                case control.down:
                    this.y = Math.min(
                        this.maxHeight - this.height,
                        this.y + this.speed
                    );
                    break;
            }
        });
    }
    addScore(player1, player2) {
        this.score.score++;
    }

    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(
            this.x, this.y,
            this.width, this.height
        );

    }
}
