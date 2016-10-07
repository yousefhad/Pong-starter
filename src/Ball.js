const size = 4;
const wallSound = document.getElementById('sound-01');
const victorySound = document.getElementById('sound-02');
const paddleSound = document.getElementById('sound-03');


export default class Ball {
    constructor(height, width) {
        this.x = width / 2;
        this.y = height / 2;
        this.vy = Math.floor(Math.random() * 12 - 6);
        this.vx = (7 - Math.abs(this.vy) - 7);
        this.size = size;
        this.height = height;
        this.width = width;
    }
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    wallbounce() {
        const hitLeft = this.x >= this.width;
        const hitRight = this.x + this.size <= 0;
        const hitTop = this.y - this.size <= 0;
        const hitBottom = this.y + this.size >= this.height;

        if (hitLeft || hitRight) {
            this.vx = -this.vx;
            wallSound.play();
        } else if (hitTop || hitBottom) {
            this.vy = -this.vy;
            wallSound.play();
        }
    }

    goal(width, height) {
        this.x = width / 2;
        this.y = height / 2;
        this.vx = Math.floor(Math.random() * 12 - 6);
        this.vy = -this.vy;

    }


    paddleCollision(player1, player2) {
        if (this.vx > 0) {
            const inRightEnd = player2.x <= this.x + this.size &&
                player2.x > this.x - this.vx + this.size;
            if (inRightEnd) {
                const collisionDiff = this.x + this.size - player2.x;
                const k = collisionDiff / this.vx;
                const y = this.vy * k + (this.y - this.vy);
                const hitRightPaddle = y >= player2.y && y + this.size <= player2.y + player2.height;
                if (hitRightPaddle) {
                    this.x = player2.x - this.size;
                    this.y = Math.floor(this.y - this.vy + this.vy * k);
                    this.vx = -this.vx;
                    victorySound.play();
                }
            }
        } else {
            const inLeftEnd = player1.x + player1.width >= this.x;
            if (inLeftEnd) {
                const collisionDiff = player1.x + player1.width - this.x;
                const k = collisionDiff / -this.vx;
                const y = this.vy * k + (this.y - this.vy);
                const hitLeftPaddle = y >= player1.y && y + this.size <= player1.y + player1.height;
                if (hitLeftPaddle) {
                    this.x = player1.x + player1.width;
                    this.y = Math.floor(this.y - this.vy + this.vy * k);
                    this.vx = -this.vx;
                    victorySound.play();
                }
            }
        }
    }

    render({
        ctx,
        player1,
        player2,
        height,
        width
    }) {
        this.draw(ctx);
        this.paddleCollision(player1, player2);
        this.wallbounce();
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0) {
            player2.addScore();
            this.goal(width, height);
            paddleSound.play();
        } else if (this.x >= width) {
            player1.addScore();
            this.goal(width, height);
          paddleSound.play();
        }

    }

}
