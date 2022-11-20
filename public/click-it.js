/**
 * Defines the base for a labeled component.
 * @param {string} labelText The text to display.
 * @param {string} labelColor The CSS color of the text to display.
 */
function LabeledComponent(labelText, labelColor) {
    /**
     * The color of the label. Default is "white".
     * @type {string}
     * */
    this.labelColor = labelColor || "white";
    /**
     * The text of the label.
     * @type {string}
     * */
    this.labelText = labelText;
    /**
     * The horizontal position of the center of the label text.
     * @type {number}
     * */
    this.labelX = -1;
    /**
     * The vertical position of the center of the label text.
     * @type {number}
     * */
    this.labelY = -1;
    /**
     * The size (in pixels) of the label text.
     * @type {number}
     * */
    this.labelSize = -1;
    /**
     * The size of the component.
     * @description This is calculated by multiplying the ComponentSize by the scale of the game area.
     * @type {number}
     * */
    this.size = -1;
    /**
     * The margin of the component.
     * @description This is calculated by multiplying the ComponentMargin by the scale of the game area.
     * @type {number}
     * */
    this.margin = -1;
    /**
     * The offset of the component.
     * @description This is calculated by adding the margin and size of each earlier component and multiplying that by the number of earlier components.
     * @type {number}
     * */
    this.offset = -1;
}
/**
 * Called when the window size is calculated.
 * @param {number} index The position of the component in the collection of components.
 */
LabeledComponent.prototype.update = function (index) {
    this.size = ComponentSize * gameArea.scale;
    this.margin = ComponentMargin * gameArea.scale;
    this.offset = (this.size + this.margin) * index;
    const halfSize = this.size / 2;
    this.labelX = gameArea.left + this.margin + halfSize + (gameArea.height > gameArea.width ? 0 : this.offset);
    this.labelY = gameArea.top + this.margin + halfSize + (gameArea.width > gameArea.height ? 0 : this.offset);
    this.labelSize = this.size * .2;
};
/**
 * Called to draw the label.
 */
LabeledComponent.prototype.draw = function () {
    if (this.labelText && this.labelX >= 0 && this.labelY >= 0 && this.labelSize > 0) {
        context.fillStyle = this.labelColor;
        context.font = `bold ${this.labelSize}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.labelText, this.labelX, this.labelY);
    }
};

/**
 * Defines the base component for interactive components.
 * @param {CallableFunction} onGetShape A function that will draw the shapre of the component without filling or stroking it.
 * @param {string} labelText The text to display.
 * @param {string} labelColor The CSS color of the text to display.
 */
function InteractiveComponent(onGetShape, labelText, labelColor) {
    // Call the base component.
    LabeledComponent.call(this, labelText, labelColor);
    /**
     * A function that will draw the shape of the component without filling or stroking it.
     * @type {CallableFunction}
     */
    this.onGetShape = onGetShape;
    /**
     * Indicates if the mouse is currently over the component.
     * @type {boolean}
     */
    this.isMouseOver = false;
    /**
     * Indicates if the mouse is currently pressed in the component.
     * @type {boolean}
     */
    this.isPressStarted = false;
}
InteractiveComponent.prototype = new LabeledComponent();
/**
 * Called when the mouse is moved on the canvas.
 */
InteractiveComponent.prototype.onMouseMove = function (mouseX, mouseY) {
    this.onGetShape();
    const isMouseOver = context.isPointInPath(mouseX, mouseY);
    if (!this.isMouseOver && isMouseOver) {
        this.onMouseEnter();
    }
    else if (this.isMouseOver && !isMouseOver) {
        this.onMouseLeave();
    }
    this.isMouseOver = isMouseOver;
};
/**
 * Called when the mouse is pressed on the canvas.
 */
InteractiveComponent.prototype.onMouseDown = function (mouseX, mouseY) {
    this.onGetShape();
    const isMouseOver = context.isPointInPath(mouseX, mouseY);
    if (isMouseOver) {
        this.isPressStarted = true;
        this.onMousePressed(mouseX, mouseY);
    }
};
/**
 * Called when the mouse is released on the canvas.
 */
InteractiveComponent.prototype.onMouseUp = function (mouseX, mouseY) {
    this.onGetShape();
    this.onMouseReleased(mouseX, mouseY);
    this.isPressStarted = false;
};
/**
 * Called when the mouse is pressed within the bounds of the component.
 */
InteractiveComponent.prototype.onMousePressed = function (mouseX, mouseY) {
    /* NO-OP */
};
/**
 * Called when the mouse is released after being pressed within the bounds of the component.
 */
InteractiveComponent.prototype.onMouseReleased = function (mouseX, mouseY) {
    /* NO-OP */
};
/**
 * Called when the mouse enters the bounds of the component.
 */
InteractiveComponent.prototype.onMouseEnter = function () {
    /* NO-OP */
};
/**
 * Called when the mouse leaves the bounds of the component.
 */
InteractiveComponent.prototype.onMouseLeave = function () {
    /* NO-OP */
};

/**
 * Defines the base component for circle components.
 * @param {string} color The CSS color of the circle.
 * @param {string} labelText The text to display.
 * @param {string} labelColor The CSS color of the text to display.
 */
function CircleComponent(color, labelText, labelColor) {
    // Call the base component.
    InteractiveComponent.call(this, this.getCircle, labelText, labelColor);
    /**
     * The CSS color of the circle.
     * @type {string}
     * */
    this.color = color;
    /**
     * The radius of the circle.
     * @type {number}
     */
    this.radius = -1;
    /**
     * The horizontal center of the circle.
     * @type {number}
     */
    this.x = -1;
    /**
     * The vertical center of the circle.
     * @type {number}
     */
    this.y = -1;
}
// Inherit from InteractiveComponent
CircleComponent.prototype = new InteractiveComponent();
/**
 * Called when the window size is calculated.
 * @param {number} index The position of the circle component in the collection of components.
 */
CircleComponent.prototype.update = function (index) {
    // Call the LabeledComponent to update the label.
    LabeledComponent.prototype.update.call(this, index);
    this.radius = this.size / 2;
    const center = (ComponentMargin * gameArea.scale) + this.radius;
    this.x = gameArea.left + center + (gameArea.height > gameArea.width ? 0 : this.offset);
    this.y = gameArea.top + center + (gameArea.width > gameArea.height ? 0 : this.offset);
};
/**
 * Called by the game loop to draw the circle component.
 */
CircleComponent.prototype.draw = function () {
    this.getCircle();
    context.fillStyle = this.color;
    context.fill();
    // Call the LabeledComponent to draw the label.
    LabeledComponent.prototype.draw.call(this);
};
/**
 * Called to draw a circle with the current position and radius to the context without filling or stroking it.
 */
CircleComponent.prototype.getCircle = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, CircleStartAngle, CircleEndAngle, false);
    context.closePath();
};

/**
 * Defines the base component for rectangular components.
 * @param {string} color The CSS color of the rectangle.
 * @param {string} labelText The text to display.
 * @param {string} labelColor The CSS color of the text to display.
 */
function RectangleComponent(color, labelText, labelColor) {
    // Call the base component.
    InteractiveComponent.call(this, this.getRectangle, labelText, labelColor);
    /**
     * The CSS color of the rectangle.
     * @type {string}
     * */
    this.color = color;
    /**
     * The radius of the rectangle.
     * @type {number}
     */
    this.cornerRadius = -1;
    /**
     * The left of the rectangle.
     * @type {number}
     */
    this.x = -1;
    /**
     * The top side of the rectangle.
     * @type {number}
     */
    this.y = -1;
}
// Inherit from InteractiveComponent
RectangleComponent.prototype = new InteractiveComponent();
/**
 * Called when the window size is calculated.
 * @param {number} index The position of the rectangle component in the collection of components.
 */
RectangleComponent.prototype.update = function (index) {
    // Call the LabeledComponent to update the label.
    LabeledComponent.prototype.update.call(this, index);
    this.height = this.size / 2;
    this.y = gameArea.top + this.margin + (gameArea.width > gameArea.height ? 0 : this.offset) + (this.height / 2);
    this.x = gameArea.left + this.margin + (gameArea.height > gameArea.width ? 0 : this.offset);
    this.cornerRadius = this.size * .12;
};
/**
 * Called by the game loop to draw the rectangle component.
 */
RectangleComponent.prototype.draw = function () {
    this.getRectangle();
    context.fillStyle = this.color;
    context.fill();
    // Call the LabeledComponent to draw the label.
    LabeledComponent.prototype.draw.call(this);
};
/**
 * Called to draw a rectangle with the current position and cornerRadius to the context without filling or stroking it.
 */
RectangleComponent.prototype.getRectangle = function () {
    context.beginPath();
    context.moveTo(this.x + this.cornerRadius, this.y);
    context.lineTo(this.x + this.size - this.cornerRadius, this.y);
    context.quadraticCurveTo(this.x + this.size, this.y, this.x + this.size, this.y + this.cornerRadius);
    context.lineTo(this.x + this.size, this.y + this.height - this.cornerRadius);
    context.quadraticCurveTo(this.x + this.size, this.y + this.height, this.x + this.size - this.cornerRadius, this.y + this.height);
    context.lineTo(this.x + this.cornerRadius, this.y + this.height);
    context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.cornerRadius);
    context.lineTo(this.x, this.y + this.cornerRadius);
    context.quadraticCurveTo(this.x, this.y, this.x + this.cornerRadius, this.y);
    context.closePath();
};

/**
 * Defines the Tap It! component.
 */
function TapIt() {
    // Call the base component.
    CircleComponent.call(this, "red", "Tap It!");
}
// Inherit from CircleComponent
TapIt.prototype = new CircleComponent();
/**
 * Called when the user taps within the bounds of the Tap It! circle.
 */
TapIt.prototype.onTapped = function () {
    // TODO: Implement
    console.log("Tapped It!");
}
/**
 * Called when the mouse button is released after being pressed within the bounds of the Tap It! circle.
 */
TapIt.prototype.onMouseReleased = function () {
    if (this.isPressStarted) {
        this.onTapped();
    }
}

/**
 * Defines the Turn It! component.
 */
function TurnIt() {
    // Call the base component.
    CircleComponent.call(this, "green", "Turn It!");
    /**
     * The horizontal position of the mouse when it was pressed.
     * @type {number}
     */
    this.downX = -1;
    /**
     * The vertical position of the mouse when it was pressed.
     * @type {boolean}
     */
    this.downY = -1;
}
// Inherit from CircleComponent
TurnIt.prototype = new CircleComponent();
/**
 * Called when the user turns the knob and started the turn within the bounds of the Turn It! circle.
 */
TurnIt.prototype.onTurned = function () {
    console.log("Turned it!")
}
/**
 * Called when the mouse button is pressed within the bounds of the Turn It! circle.
 */
TurnIt.prototype.onMousePressed = function (mouseX, mouseY) {
    this.downX = mouseX;
    this.downY = mouseY;
}
/**
 * Called when the mouse button is released after being pressed within the bounds of the Turn It! circle.
 */
TurnIt.prototype.onMouseReleased = function (mouseX, mouseY) {
    if (this.isPressStarted) {
        const xMove = Math.max(mouseX, this.downX) - Math.min(mouseX, this.downX);
        const yMove = Math.max(mouseY, this.downY) - Math.min(mouseY, this.downY);
        const requiredMovement = this.size * .30;
        if (xMove > requiredMovement && yMove > requiredMovement) {
            this.onTurned();
        }
    }
}

/**
 * Defines the Slide It! component.
 */
function SlideIt() {
    // Call the base component.
    RectangleComponent.call(this, "blue", "Slide It!");
    /**
     * The horizontal position of the mouse when it was pressed.
     * @type {number}
     */
    this.downX = -1;
}
// Inherit from RectangleComponent
SlideIt.prototype = new RectangleComponent();
/**
 * Called when the user slide the bar and started the slide within the bounds of the Slide It! bar.
 */
SlideIt.prototype.onSlid = function () {
    console.log("Slid it!")
}
/**
 * Called when the mouse button is pressed within the bounds of the Slide It! bar.
 */
SlideIt.prototype.onMousePressed = function (mouseX) {
    this.downX = mouseX;
}
/**
 * Called when the mouse button is released after being pressed within the bounds of the Slide It! bar.
 */
SlideIt.prototype.onMouseReleased = function (mouseX) {
    if (this.isPressStarted) {
        const xMove = Math.max(mouseX, this.downX) - Math.min(mouseX, this.downX);
        const requiredMovement = this.size * .45;
        if (xMove > requiredMovement) {
            this.onSlid();
        }
    }
}

// Define the game constants
const CircleStartAngle = 0;
const CircleEndAngle = Math.PI * 2;
const ComponentMargin = 7;
const ComponentSize = 24;
const MinLongDimension = (ComponentSize * 3) + (ComponentMargin * 4);
const MinShortDimension = ComponentSize + (ComponentMargin * 2);
const ShortDimensionToLong = MinLongDimension / MinShortDimension;
const LongDimensionToShort = MinShortDimension / MinLongDimension;

// Create the game.
const gameArea = { top: 0, left: 0, width: 0, height: 0, scale: 0 };
const gameComponents = [new TapIt(), new TurnIt(), new SlideIt()];

// Setup the game area.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('root');
let context = canvas.getContext('2d');
const setupGameArea = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d');
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    let longDimension = orientation === "landscape" ? canvas.width : canvas.height;
    let shortDimension = orientation === "landscape" ? canvas.height : canvas.width;
    const proportionateShortDimension = longDimension * LongDimensionToShort;
    if (proportionateShortDimension > shortDimension) {
        // If the proportionate short dimension does not fit in the available space of the short dimension, we use the available space and calculate the long dimension.
        longDimension = shortDimension * ShortDimensionToLong;
    }
    else {
        // If the available short dimension space fits the desired short dimension, we just use the desired short dimension.
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
    gameComponents.forEach((x, i) => x.update(i));
};
setupGameArea();
window.addEventListener("orientationchange" in window ? "orientationchange" : 'resize', setupGameArea);

const getMousePosition = (event) => {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,      // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;    // relationship bitmap vs. element for y
    const mouse = {
        x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (event.clientY - rect.top) * scaleY,    // been adjusted to be relative to element
    };
    return mouse;
}

// Wire up mouse tracking.
const onMouseMove = (event) => {
    const mouse = getMousePosition(event);
    gameComponents.forEach(x => x.onMouseMove(mouse.x, mouse.y));
};
window.addEventListener('mousemove', onMouseMove);
const onMouseDown = (event) => {
    if (event.which === 1) {
        const mouse = getMousePosition(event);
        gameComponents.forEach(x => x.onMouseDown(mouse.x, mouse.y));
    }
    else {
        console.log("Mouse button " + event.which);
    }
};
window.addEventListener('mousedown', onMouseDown);
const onMouseUp = (event) => {
    if (event.which === 1) {
        const mouse = getMousePosition(event);
        gameComponents.forEach(x => x.onMouseUp(mouse.x, mouse.y));
    }
    else {
        console.log("Mouse button " + event.which);
    }
};
window.addEventListener('mouseup', onMouseUp);

// Start the game loop.
const animate = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameComponents.forEach(x => x.draw());
    requestAnimationFrame(animate);
};
animate();