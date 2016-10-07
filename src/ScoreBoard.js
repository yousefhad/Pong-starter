export default class ScoreBoard {
    constructor(x, y, score) {
        this.x = x;
        this.y = y;
        this.score = 0;
    }
    render(ctx) {
        ctx.font = "30px Helvetica";
        ctx.fillText(this.score, this.x, this.y);
    }
}
