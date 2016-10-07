import Paddle from './paddle';
import Board from './Board';
import Ball from './Ball';
import ScoreBoard from './ScoreBoard'
import Settings from './Settings'

export default class Game {
    constructor() {
        const canvas = document.getElementById('game');
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.context.fillStyle = 'white';
        this.scorePosition1 = this.width / 2;
        this.scorePosition2 = this.width - (this.width / 2);
        this.board = new Board(this.width, this.height);
        this.ScoreBoard1 = new ScoreBoard(60, 26);
        this.ScoreBoard2 = new ScoreBoard(220, 26);
        this.player1 = new Paddle(this.height, Settings.gap, Settings.p2Keys, this.ScoreBoard1);
        this.player2 = new Paddle(this.height, this.width - 5 - Settings.gap, Settings.p1Keys, this.ScoreBoard2);
        this.ball = new Ball(this.height, this.width);


        document.body.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case p1Keys.addBalls:
                case p2Keys.addBalls:
                    this.addBalls();
                    break;

                case p1Keys.ballSize:
                case p2Keys.ballSize:
                    this.ball1.radius = Math.floor(Math.random() * (9 - 5) + 5);
                    break;
            }
        });

    }
    render() {
        this.board.render(this.context);
        this.player1.render(this.context);
        this.player2.render(this.context);
        this.ball.render({
            ctx: this.context,
            player1: this.player1,
            player2: this.player2,
            height: this.height,
            width: this.width
        });
        this.ScoreBoard1.render(this.context);
        this.ScoreBoard2.render(this.context);
    }

}
