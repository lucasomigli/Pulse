// Circle Class

class Circle {
    constructor(x, y, xVelocity, yVelocity, radius, color, time, isShape = false) {
        this.x = x
        this.y = y
        this.xVelocity = xVelocity
        this.yVelocity = yVelocity
        this.radius = this.randomizeRadius()
        this.tempRadius
        this.heldRadius = 2000
        this.color = color
        this.shapeColor = 1
        this.origColor = this.shapeColor
        this.opacity = 255
        this.origOpacity = this.opacity
        this.strokeColor = 1
        this.time = time
        this.isShape = isShape
        this.fxBool = false
    }

    draw() {
        if (this.color != null) {
            if (this.isShape) {
                fill(1)
                noStroke()
            } else {
                fill(this.color)
                stroke(this.strokeColor)
            }
        }
        ellipse(this.x, this.y, this.radius, this.radius)
    }

    update(circles) {
        // Bouncing off the sides of widow
        let tempRadius
        if (!this.isShape) {
            if (this.y + minRadius > windowHeight ||
                this.y - minRadius < 0) {
                this.yVelocity = -this.yVelocity
            }
    
            if (this.x + minRadius > windowWidth ||
                this.x - minRadius < 0) {
                this.xVelocity = -this.xVelocity
            }
    
            this.x += this.xVelocity
            this.y += this.yVelocity
    
            this.changeDirectionOnCollision(circles)

            // mouse interactivity
            this.mouseInteraction()
        }

        this.draw()

        if (this.isShape) {
            this.colorFade()
        }
    }

    changeDirectionOnCollision(circles) {
        for (let i = 0; i < circles.length; i++) {
            if (this === circles[i]) continue;
            if (distance(this.x, this.y, circles[i].x, circles[i].y) -
                this.radius * 2 < 0) {
                // resolveCollision(this, circles[i])
            }
        }
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

    mouseInteraction() {
        let mouseRadius = touchRadius/2
        if (mouseX - this.x < mouseRadius && mouseX - this.x > -mouseRadius &&
            mouseY - this.y < mouseRadius && mouseY - this.y > -mouseRadius
        ) {
            if (this.radius < maxRadius) {
                this.radius += 2
            }
        } else if (this.radius > this.tempRadius) {
            this.radius -= 2
        }
    }

    randomizeRadius() {
        var randomVal = Math.round(Math.random() * randomRadiusVal);
        this.tempRadius = randomVal;
        return randomVal
    }
}