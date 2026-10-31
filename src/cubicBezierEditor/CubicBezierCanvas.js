'use strict';
/**
 * Cubic Bezier Canvas, just for help for Canvas. as a draw.
 */
export class CubicBezierCanvas {
    /**
     * Setup program
     */
    constructor(canvas, bezier) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bezier = bezier;
    }

    plot() {
        const ctx = this.ctx;
        const theme = this.bezier.theme;
        const [x1, y1, x2, y2] = this.bezier.coordinates;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (theme.backgroundColor && theme.backgroundColor !== 'transparent') {
            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        ctx.save();
        ctx.translate(0, this.canvas.height);
        ctx.scale(this.canvas.width, -this.canvas.height);

        ctx.lineWidth = 0.01;
        ctx.strokeStyle = theme.lineColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.moveTo(1, 1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = theme.handleColor;
        ctx.beginPath();
        ctx.arc(x1, y1, 0.015, 0, Math.PI * 2);
        ctx.arc(x2, y2, 0.015, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = theme.curveColor;
        ctx.lineWidth = 0.02;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(x1, y1, x2, y2, 1, 1);
        ctx.stroke();

        ctx.restore();
    }

    canvasToBezier(px, py) {
        const clampedPx = Math.max(0, Math.min(this.canvas.width, Math.round(px)));
        const clampedPy = Math.max(0, Math.min(this.canvas.height, Math.round(py)));
        return [clampedPx / this.canvas.width, 1 - clampedPy / this.canvas.height];
    }

    bezierToCanvas(x, y) {
        return [
            Math.round(x * this.canvas.width),
            Math.round((1 - y) * this.canvas.height)
        ];
    }
}
