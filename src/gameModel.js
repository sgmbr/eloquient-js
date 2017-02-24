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

class Player {
    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5))
        this.size = new Vector(0.8, 1.5)
        this.speed = new Vector(0, 0)
        this.type = 'player'
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
}

class Coin {
    constructor(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1))
        this.size = new Vector(0.6, 0.6)
        this.wobble = Math.random() * Math.PI * 2;
        this.type = 'coin'
    }
}

let actorChars = {
    '@': Player,
    'o': Coin,
    '=': Lava, '|': Lava, 'v': Lava
}

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
}
