var maxRadius = 40
var minRadius = 1
var randomRadiusVal = 20
var windowSize
var touchRadius
var touchRadiusRate = 10
var ballsRate = 20
var held;
var time
var currentTime

var mouseHeld

var bgColorArray = []
var backgroundColor

var ballsArray = []
var arcArray = []
var heldArcs = []
var mouseFollow = []
var shapesArray = []

var colorPalette = [
  [[1, 22, 39],
  [255, 255, 255],
  [46, 196, 182],
  [231, 29, 54],
  [255, 159, 28]],

  [[43, 45, 66],
  [141, 153, 174],
  [237, 242, 244],
  [239, 35, 60],
  [217, 4, 41]],

  [[198, 78, 63],
  [170, 42, 76],
  [139, 19, 86],
  [71, 26, 100],
  [344, 91, 100]],

  [[90, 2, 32],
  [1, 62, 95],
  [48, 60, 100],
  [198, 78, 63],
  [170, 42, 76]],

  [[0, 0, 100],
  [195, 100, 12],
  [205, 100, 35],
  [195, 100, 65],
  [197, 100, 91]]
  ]

var notesArray = [
  "C3",
  "D3",
  "F3",
  "G3",
  "A3",
  "D4",
  "F4",
  "G4"
]

function init() {
  getWindowSize()

  //create balls
  touchRadius = Math.round(windowSize / touchRadiusRate);
  ballsArray = []
  let ballsNumber = Math.round(windowSize/ballsRate)
  for (let i = 0; i < ballsNumber; i++) {
    var x = Math.random() * (windowWidth - radius * 2) + radius
    var y = Math.random() * (windowHeight - radius * 2) + radius
    var xVelocity = (3 * Math.random() - 1.5) / 5
    var yVelocity = (3 * Math.random() - 1.5) / 5
    var radius = maxRadius;
    var color = getRandomColor(colorArray);
    ballsArray.push(new Ball(x, y, xVelocity, yVelocity, radius, color))
    ballsArray[i].position = i
    ballsArray[0].x = x
    ballsArray[0].y = y
  }
}

// P5JS Commands

function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(RGB);
  colorArray = colorPalette[getRandomInt(0, colorPalette.length)]
  init()

  backgroundColor = new Color(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255))

  kickSeq.mute = true

  for (let i = 0; i < 16; i++) {
    shapesArray.push(new Shape())
  }
}

function draw() {
  updateBackground(getRandomInt(90, 100), getRandomInt(180, 240), .1)
  background(backgroundColor.rgb)

  ballsArray.forEach((ball) => {
    ball.update(ballsArray)
  })

  shapesArray.forEach((shape) => {
    shape.update()
    // need to have a function that lerps the color of the shapes until fading 
    // for the duration of a barlength. 
  })

  if (arcArray !== undefined) {
    updateArcs()
  }

  if (mouseHeld === false) {
    synth1.mute = true
    synth1.hold = false
  }
}

function mouseClicked() {
  let x = mouseX
  let y = mouseY

  time = Tone.now()
  
  playNote(time)

  let radius = setSize()
  let col = new Color(50, 100, 150)
  let shapes = [
    new Triangle(x, y, radius, col.rgb, time), 
    new Square(x, y, radius, col.rgb, time),
    new Circle(x, y, radius, col.rgb, time),
    new Pentagon(x, y, radius, 5, col.rgb, time)
  ]
  
  let randomShape = shapes[getRandomInt(0, shapes.length)]
  shapesArray.splice(timeTrack, 1, randomShape)
}

function mouseReleased() {

  changeDirectionOnMouseClick(mouseX, mouseY);

  generateArcs(mouseX, mouseY)

  kickSeq.mute = true

  mouseHeld = false
}

function mouseDragged() {
  mouseHeld = true
  // synth.modulation.frequency.value = 3000/windowWidth * mouseX
  // console.log("hellos")

  kickSeq.mute = false

  if (synth1.hold === false) {
    synth1.mute = false
    // vol.volume.value++
    synth1.hold = true
  }

}

// Other Functions

function playNote() {
  let note = Math.floor(notesArray.length / windowWidth * mouseX)
  let tone = notesArray[note]
  triggerNote(tone, time)
}

function generateArcs(x, y) {
  var arcRadius = getRandomInt(1, 50)
  var arcGrowRate = getRandomInt(5, 8)

  arcArray.push(new Arc(x, y, arcRadius, arcGrowRate))
}

function updateArcs() {
  for (let i = 0; i < arcArray.length; i++) {
    if (arcArray[i].radius > windowHeight * 4) {
      arcArray.splice(i, i + 1)
    } else {
      arcArray[i].update()
    }
  }
  if (arcArray.length > 8) {
    arcArray.splice(0, 5)
  }
}

function changeDirectionOnMouseClick(xPos, yPos) {
  for (let i = 0; i < ballsArray.length; i++) {
    if (xPos - ballsArray[i].x < touchRadius && xPos - ballsArray[i].x > -touchRadius &&
      yPos - ballsArray[i].y < touchRadius && yPos - ballsArray[i].y > -touchRadius
    ) {
      var newDx = Math.random(Math.sqrt(xPos - ballsArray[i].xVelocity)) * 3
      var newDy = Math.random(Math.sqrt(yPos - ballsArray[i].yVelocity)) * 3
      if (ballsArray[i].x > xPos) {
        if (ballsArray[i].y > yPos) {
          ballsArray[i].xVelocity = Math.abs(newDx)
          ballsArray[i].yVelocity = Math.abs(newDy)
        } else {
          ballsArray[i].xVelocity = Math.abs(newDx)
          ballsArray[i].yVelocity = -Math.abs(newDy)
        }
      } else {
        if (ballsArray[i].y > yPos) {
          ballsArray[i].xVelocity = -Math.abs(newDx)
          ballsArray[i].yVelocity = Math.abs(newDy)
        } else {
          ballsArray[i].xVelocity = -Math.abs(newDx)
          ballsArray[i].yVelocity = -Math.abs(newDy)
        }
      }
    }
  }
}

var previousCol = []
var speedvals = []

function updateBackground(minCol, maxCol, speed) {
  for (let i = 0; i < 3; i++) {
    if (!speedvals[i]) {
      speedvals[i] = Math.random() * speed + .01
    }
    if (previousCol[i] === undefined) {
      previousCol.push(backgroundColor.rgb[i] - speedvals[i])
    }
    if (previousCol[i] < backgroundColor.rgb[i] && backgroundColor.rgb[i] <= maxCol) {
      previousCol[i] = backgroundColor.rgb[i]
      backgroundColor.rgb[i] += speedvals[i]
    } else if (backgroundColor.rgb[i] > maxCol || previousCol[i] > backgroundColor.rgb[i]) {
      if (backgroundColor.rgb[i] < minCol) {
        previousCol[i] = backgroundColor.rgb[i]
        backgroundColor.rgb[i] += speedvals[i]
      } else {
        previousCol[i] = backgroundColor.rgb[i]
        backgroundColor.rgb[i] -= speedvals[i]
      }
    }
  }
}

// function resolveCollisions

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  }

  return rotatedVelocities;
}

function setSize () {
  let normalise = (windowSize / 13)
  let sizeRate = 1.2
  return getRandomInt(normalise - sizeRate, normalise + sizeRate)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
}

function getRandomColor(array) {
  let i = Math.round(Math.random() * array.length);
  return array[i];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)

  getWindowSize()
  shapesArray.forEach(shape => {
    shape.size = setSize()
    shape.radius = setSize()
    shape.height = setSize()
  })
  init()
}

function getWindowSize() {
  windowSize = (Math.sqrt(Math.pow(windowWidth, 2) + Math.pow(windowHeight, 2)));
}