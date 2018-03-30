// Shape Class

class Shape {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
    }

    draw() {}
    update() {this.draw()}

    colorFade() {}

    updateSize() {}
}

// Triangle Class

class Triangle {
    constructor(x, y, height, rotation, color, time) {
        this.x = x
        this.y = y
        this.height = height
        this.rotation = rotation
        this.color = color
        this.origColor = color
        this.opacity = 255
        this.origOpacity = this.opacity
        this.time = time
        this.tint = 0
        this.fxBool = false
    }

    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }

        // add rotation 

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
        // add tilt

        this.draw()

        this.colorFade()
    }

    colorFade() {
        var timeTrigger = Math.round((this.time % barTimeLength) * 10) / 10
        var currentTime = Math.round((Tone.now() % barTimeLength) * 10) / 10
        var changeRate = 0.5
        var fadeRate = 8
        if (currentTime !== timeTrigger) {
            this.color += fadeRate/this.origColor * changeRate
            this.opacity -= fadeRate/this.origColor * changeRate * 2
            this.fxBool = true
        } else {
            this.color = this.origColor
            this.opacity = this.origOpacity
            this.clickFX()
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

// Square Class

class Square {
    constructor(x, y, size, rotation, color, time) {
        this.x = x
        this.y = y
        this.size = size / 1.4
        this.rotation = rotation
        this.color = color
        this.origColor = color
        this.opacity = 255
        this.origOpacity = this.opacity
        this.time = time
        this.tint = 0
        this.fxBool = false
    }

    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }

        // add rotation 

        rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)
    }

    update() {
        // add tilt

        this.draw()

        this.colorFade()
    }

    colorFade() {
        var timeTrigger = Math.round((this.time % barTimeLength) * 10) / 10
        var currentTime = Math.round((Tone.now() % barTimeLength) * 10) / 10
        var changeRate = 0.5
        var fadeRate = 8
        if (currentTime !== timeTrigger) {
            this.color += fadeRate/this.origColor * changeRate
            this.opacity -= fadeRate/this.origColor * changeRate * 2
            this.fxBool = true
        } else {
            this.color = this.origColor
            this.opacity = this.origOpacity
            this.clickFX()
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

// Pentagon Class

class Pentagon {
    constructor(x, y, radius, rotation, nSides, color, time) {
        this.x = x
        this.y = y
        this.radius = radius / 1.4
        this.rotation = rotation
        this.nSides = nSides
        this.angle = Math.PI*2 / this.nSides
        this.color = color
        this.origColor = color
        this.opacity = 255
        this.origOpacity = this.opacity
        this.time = time
        this.tint = 0
        this.fxBool = false
    }

    draw() {
        if (this.color != null) {
            fill(this.color, this.opacity)
            noStroke()
        }

        // add rotation 

        beginShape()
        for (let a = 0; a < Math.PI*2; a += this.angle) {
        var sx = this.x + cos(a) * this.radius;
        var sy = this.y + sin(a) * this.radius;
        vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    update() {
        // add tilt

        this.draw()

        this.colorFade()
    }

    colorFade() {
        var timeTrigger = Math.round((this.time % barTimeLength) * 10) / 10
        var currentTime = Math.round((Tone.now() % barTimeLength) * 10) / 10
        var changeRate = 0.5
        var fadeRate = 8
        if (currentTime !== timeTrigger) {
            this.color += fadeRate/this.origColor * changeRate
            this.opacity -= fadeRate/this.origColor * changeRate * 2
            this.fxBool = true
        } else {
            this.color = this.origColor
            this.opacity = this.origOpacity
            this.clickFX()
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