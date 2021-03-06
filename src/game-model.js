/* jshint undef: true, unused: true, esversion: 6, asi: true*/

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    times(factor) {
        return new Vector(this.x * factor, this.y * factor)
    }
}

const playerXSpeed = 7
const gravity = 30
const jumpSpeed = 17

class Player {
    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5))
        this.size = new Vector(0.8, 1.5)
        this.speed = new Vector(0, 0)
        this.type = 'player'
    }

    moveX(step, level, keys) {
        this.speed.x = 0
        if (keys.left) this.speed.x -= playerXSpeed
        if (keys.right) this.speed.x += playerXSpeed

        let motion = new Vector(this.speed.x * step, 0)
        let newPos = this.pos.plus(motion)
        let obstacle = level.obstacleAt(newPos, this.size)
        if (obstacle) {
            level.playerTouched(obstacle)
        } else {
            this.pos = newPos
        }
    }

    moveY(step, level, keys) {
        this.speed.y += step * gravity
        let motion = new Vector(0, this.speed.y * step)
        let newPos = this.pos.plus(motion)
        let obstacle = level.obstacleAt(newPos, this.size)
        if (obstacle) {
            level.playerTouched(obstacle)
            if (keys.up && this.speed.y > 0) {
                this.speed.y = -jumpSpeed
            } else {
                this.speed.y = 0
            }
        } else {
            this.pos = newPos
        }
    }

    act(step, level, keys) {
        this.moveX(step, level, keys)
        this.moveY(step, level, keys)

        let otherActor = level.actorAt(this)
        if (otherActor) {
            level.playerTouched(otherActor.type, otherActor)
        }

        // Losing animation
        if (level.status == 'lost') {
            this.pos.y += step
            this.size.y -= step
        }
    }
}

class Lava {
    constructor(pos, ch) {
        this.pos = pos
        this.size = new Vector(1, 1)
        this.type = 'lava'
        if (ch == '=') {
            this.speed = new Vector(2, 0)
        } else if (ch == '|') {
            this.speed = new Vector(0, 2)
        } else if (ch == 'v') {
            this.speed = new Vector(0, 3)
            this.repeatPos = pos
        }
    }

    act(step, level) {
        let newPos = this.pos.plus(this.speed.times(step))
        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos
        } else if (this.repeatPos) {
            this.pos = this.repeatPos
        } else {
            this.speed = this.speed.times(-1)
        }
    }
}

const wobbleSpeed = 8
const wobbleDist = 0.07

class Coin {
    constructor(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1))
        this.size = new Vector(0.6, 0.6)
        this.wobble = Math.random() * Math.PI * 2;
        this.type = 'coin'
    }

    act(step) {
        this.wobble += step * wobbleSpeed
        let wobblePos = Math.sin(this.wobble) * wobbleDist
        this.pos = this.basePos.plus(new Vector(0, wobblePos))
    }
}

const actorChars = {
    '@': Player,
    'o': Coin,
    '=': Lava, '|': Lava, 'v': Lava
}
const maxStep = 0.05

class Level {
    constructor(plan) {
        this.width = plan[0].length
        this.height = plan.length
        this.grid = []
        this.actors = []

        for (let y = 0; y < this.height; y++) {
            let line = plan[y], gridLine = []
            for (var x = 0; x < this.width; x++) {
                let ch = line[x], fieldType = null
                let Actor = actorChars[ch]
                if (Actor)
                    this.actors.push(new Actor(new Vector(x, y), ch))
                else if (ch == 'x')
                    fieldType = 'wall'
                else if (ch == '!')
                    fieldType = 'lava'
                gridLine.push(fieldType)
            }
            this.grid.push(gridLine)
        }

        this.player = this.actors.find(actor => actor.type == 'player')
        this.status = this.finishDelay = null
    }

    isFinished() {
        return this.status !== null && this.finishDelay < 0
    }

    obstacleAt(pos, size) {
        let xStart = Math.floor(pos.x)
        let xEnd = Math.ceil(pos.x + size.x)
        let yStart = Math.floor(pos.y)
        let yEnd = Math.ceil(pos.y + size.y)

        if (xStart < 0 || xEnd > this.width || yStart < 0)
            return 'wall'
        if (yEnd > this.height)
            return 'lava'
        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let fieldType = this.grid[y][x]
                if (fieldType) return fieldType
            }
        }
    }

    actorAt(actor) {
        for (let other of this.actors) {
            if (other != actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y) {
                return other
            }
        }
    }

    animate(step, keys) {
        if (this.status !== null) {
            this.finishDelay -= step
        }

        while (step > 0) {
            let thisStep = Math.min(step, maxStep)
            this.actors.forEach(actor => {
                actor.act(thisStep, this, keys)
            })
            step -= thisStep
        }
    }

    playerTouched(type, actor) {
        if (type == 'lava' && this.status === null) {
            this.status = 'lost'
            this.finishDelay = 1
        } else if (type == 'coin') {
            this.actors = this.actors.filter(other => other != actor)
            if (!this.actors.some(actor => actor.type == 'coin')) {
                this.status = 'won'
                this.finishDelay = 1
            }
        }
    }
}
