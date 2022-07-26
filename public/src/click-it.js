const GameComponentMargin = 28;
const GameComponentSize = 96;
const MinLongDimension = (GameComponentSize * 3) + (GameComponentMargin * 4);
const MinShortDimension = GameComponentSize + (GameComponentMargin * 2);
const ShortDimensionToLong = MinLongDimension / MinShortDimension;
const LongDimensionToShort = MinShortDimension / MinLongDimension;
const gameArea = { top: 0, left: 0, width: 0, height: 0, scale: 0 };
const setGameBoardArea = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    let longDimension = orientation === "landscape" ? canvas.width : canvas.height;
    let shortDimension = orientation === "landscape" ? canvas.height : canvas.width;
    const proportionateShortDimension = longDimension * LongDimensionToShort;
    if (proportionateShortDimension > shortDimension) { // If the proportionate short dimension does not fit in the available space of the short dimension, we use the available space and calculate the long dimension.
        longDimension = shortDimension * ShortDimensionToLong;
    }
    else { // If the available short dimension space fits the desired short dimension, we just use the desired short dimension.
        shortDimension = proportionateShortDimension;
    }
    switch (orientation) {
        case "portrait": {
            gameArea.width = Math.max(shortDimension, MinShortDimension);
            gameArea.height = Math.max(longDimension, MinLongDimension);
            gameArea.scale = gameArea.height / MinLongDimension;
            gameArea.top = 0;
            gameArea.left = (canvas.width - gameArea.width) / 2;
            break;
        }
        case "landscape": {
            gameArea.width = Math.max(longDimension, MinLongDimension);
            gameArea.height = Math.max(shortDimension, MinShortDimension);
            gameArea.scale = gameArea.height / MinShortDimension;
            gameArea.left = 0;
            gameArea.top = (canvas.height - gameArea.height) / 2;
            break;
        }
    }

};
const canvas = document.getElementById('root');
setGameBoardArea();
window.addEventListener('resize', setGameBoardArea);

function roundRect(context, x, y, width, height, radius = 5, fill = false, stroke = true) {
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    if (fill) {
        context.fill();
    }
    if (stroke) {
        context.stroke();
    }
}

function GameComponent(kind) {
    this.kind = kind;
    this.label = `${kind} It!`;
}
GameComponent.prototype.draw = function (context) {
    if (context instanceof CanvasRenderingContext2D) {
        switch (this.kind) {
            case "Tap": {
                context.fillStyle = "red";
                context.beginPath();
                const size = GameComponentSize * gameArea.scale;
                const radius = size / 2;
                const start = (GameComponentMargin * gameArea.scale) + radius;
                const x = gameArea.left + start;
                const y = gameArea.top + start;
                context.arc(x, y, radius, 0, Math.PI * 2, false);
                context.fill();
                context.fillStyle = "white"
                context.font = `bold ${size * .2}px sans-serif`;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(this.label, x, y);
                break;
            }
            case "Turn": {
                context.fillStyle = "green";
                context.beginPath();
                const size = GameComponentSize * gameArea.scale;
                const margin = GameComponentMargin * gameArea.scale;
                const radius = size / 2;
                const offset = size + margin;
                const top = gameArea.top + margin + radius + (gameArea.width > gameArea.height ? 0 : offset);
                const left = gameArea.left + margin + radius + (gameArea.height > gameArea.width ? 0 : offset);
                context.arc(left, top, radius, 0, Math.PI * 2, false);
                context.fill();
                context.fillStyle = "white"
                context.font = `bold ${size * .2}px sans-serif`;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(this.label, left, top);
                break;
            }
            case "Slide": {
                context.fillStyle = "blue";
                context.beginPath();
                const width = GameComponentSize * gameArea.scale;
                const margin = GameComponentMargin * gameArea.scale;
                const height = width / 2;
                const offset = (width + margin) * 2;
                const top = gameArea.top + margin + (gameArea.width > gameArea.height ? 0 : offset);
                const left = gameArea.left + margin + (gameArea.height > gameArea.width ? 0 : offset);
                roundRect(context, left, top + (height / 2), width, height, width * .1, true, false);
                context.fillStyle = "white"
                context.font = `bold ${width * .2}px sans-serif`;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(this.label, left + height, top + height);
                break;
            }
        }
    }
};
GameComponent.prototype.constructor = GameComponent;

const tapIt = new GameComponent('Tap'), turnIt = new GameComponent('Turn'), slideIt = new GameComponent('Slide');

const animate = () => {
    const ctx = canvas && canvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tapIt.draw(ctx);
        turnIt.draw(ctx);
        slideIt.draw(ctx);
    }
    requestAnimationFrame(animate);
};
animate();