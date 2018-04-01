// Need to add rotation to the shapes classes

// Shape Class

class Shape {
    constructor(x, y, size, color, time) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.origColor = color
        this.time = time
        this.opacity = 255
        this.origOpacity = this.opacity
        this.fxBool = false
    }
    update () {}
    
    colorFade() {
        var timeTrigger = Math.round((this.time % barTimeLength) * 10) / 10
        var currentTime = Math.round((Tone.now() % barTimeLength) * 10) / 10
        var changeRate = 0.5
        var fadeRate = 8

        if (currentTime !== timeTrigger) {
            for (let i = 0; i < this.color.length; i++) {
                this.color[i] += fadeRate * changeRate
                this.opacity -= fadeRate * changeRate * 2
                this.fxBool = true
            }
        } else {
            for (let i = 0; i < this.color.length; i++) {
                this.color[i] = this.origColor[i]
                this.opacity = this.origOpacity
                this.clickFX()
            }
        }
    }

    clickFX() {
        if (this.fxBool) {
            generateArcs(this.x, this.y)
            this.fxBool = false
        }
        changeDirectionOnMouseClick(this.x, this.y)
    }
}

// Circle Class

class Circle extends Shape {
    constructor(x, y, radius, color, time) {
        super(x, y, radius, color, time)
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.time = time
    }
    
    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }
        ellipse(this.x, this.y, this.radius, this.radius)
    }

    update() {
        this.draw()
        this.colorFade()
    }
}

// Triangle Class

class Triangle extends Shape {
    constructor(x, y, height, color, time) {
        super(x, y, height, color, time)
        this.x = x
        this.y = y
        this.height = height
        this.color = color
        this.time = time
    }

    draw () {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }

        let side = (tan(45) * this.height / 2)
        let x1 = this.x - side / 2
        let y1 = this.y + this.height / 2
        let x2 = this.x + side / 2
        let y2 = this.y + this.height / 2
        let x3 = this.x
        let y3 = this.y - this.height / 2
        triangle(x1, y1, x2, y2, x3, y3)
    }

    update() {
        this.draw()
        this.colorFade()
    }
}

// Square Class

class Square extends Shape {
    constructor(x, y, size, color, time) {
        super(x, y, size, color, time)
        this.x = x
        this.y = y
        this.size = size / 1.4
        this.color = color
        this.time = time
    }

    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }
        rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)
    }

    update() {
        this.draw()
        this.colorFade()
    }
}

// Pentagon Class

class Pentagon extends Shape {
    constructor(x, y, radius, nSides, color, time) {
        super(x, y, radius, color, time)
        this.x = x
        this.y = y
        this.radius = radius / 1.4
        this.nSides = nSides
        this.angle = Math.PI*2 / this.nSides
        this.color = color
        this.time = time
    }

    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }

        beginShape()
        for (let a = 0; a < Math.PI*2; a += this.angle) {
        var sx = this.x + cos(a) * this.radius;
        var sy = this.y + sin(a) * this.radius;
        vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    update() {
        this.draw()
        this.colorFade()
    }
}

// Arc Class

class Arc {
    constructor(x, y, radius, growRate, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.heldRadius = 300
        this.growRate = growRate
        this.color = color
        this.strokeColor = 1
    }

    draw() {
        noFill()
        stroke(this.strokeColor)
        arc(this.x, this.y, this.radius, this.radius, 0, Math.PI * 2, true)
    }

    update() {

        //create x arcs every delta time. 

        this.draw()

        this.colorFade()
        
        if (held == true) {
            this.holdRadius()
        } else {
            this.growRadius()
        }
    }

    colorFade() {
        var timeTrigger = Math.round((this.time % barTimeLength) * 10) / 10
        var currentTime = Math.round((Tone.now() % barTimeLength) * 10) / 10
        if (currentTime !== timeTrigger) {
            this.color += 1
            this.strokeColor += 4
        } else {
            this.color = this.origColor
            this.strokeColor = 1
        }
    }

    holdRadius() {
        if (this.radius < this.heldRadius) {
            this.radius += this.growRate
        } else {
            this.radius = 1000
        }
    }

    growRadius() {
        do {
            this.radius += this.growRate
        } while (this.radius < 1 && this.radius != null)
    }
}