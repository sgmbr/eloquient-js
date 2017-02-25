/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true*/

function elt(name, className) {
    let elt = document.createElement(name)
    if (className) elt.className = className
    return elt
}

const scale = 20

class DOMDisplay {
    constructor(parent, level) {
        this.wrap = parent.appendChild(elt('div', 'game'))
        this.level = level

        this.wrap.appendChild(this.drawBackground())
        this.actorLayer = null
        this.drawFrame()
    }

    drawBackground() {
        let table = elt('table', 'background')
        table.style.width = this.level.width * scale + 'px'
        this.level.grid.forEach(row => {
            let rowElt = table.appendChild(elt('tr'))
            rowElt.style.height = scale + 'px'
            row.forEach(type => {
                rowElt.appendChild(elt('td', type))
            })
        })
        return table
    }

    drawActors() {
        let wrap = elt('div')
        this.level.actors.forEach(actor => {
            let rect = wrap.appendChild(elt('div', `actor ${actor.type}`))
            rect.style.width = actor.size.x * scale + 'px'
            rect.style.height = actor.size.y * scale + 'px'
            rect.style.left = actor.pos.x * scale + 'px'
            rect.style.top = actor.pos.y * scale + 'px'
        })
        return wrap
    }

    drawFrame() {
        if (this.actorLayer)
            this.wrap.removeChild(this.actorLayer)
        this.actorLayer = this.wrap.appendChild(this.drawActors())
        this.wrap.className = `game ${(this.level.status || "")}`
        this.scrollPlayerIntoView();
    }

    scrollPlayerIntoView() {
        let width = this.wrap.clientWidth
        let height = this.wrap.clientHeight
        let margin = width / 3

        // The viewport
        let left = this.wrap.scrollLeft, right = left + width
        let top = this.wrap.scrollTop, bottom = top + height

        let player = this.level.player
        let center = player.pos.plus(player.size.times(0.5)).times(scale)

        if (center.x < left + margin)
            this.wrap.scrollLeft = center.x - margin
        else if (center.x > right - margin)
            this.wrap.scrollLeft = center.x + margin - width
        if (center.y < top + margin)
            this.wrap.scrollTop = center.y - margin
        else if (center.y > bottom - margin)
            this.wrap.scrollTop = center.y + margin - height
    }

    clear() {
        this.wrap.parentNode.removeChild(this.wrap)
    }
}

const arrowCodes = {37: 'left', 38: 'up', 39: 'right'}

function trackKeys(codes) {
    let pressed = Object.create(null)
    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            let down = event.type == 'keydown'
            pressed[codes[event.keyCode]] = down
            event.preventDefault()
        }
    }
    addEventListener('keydown', handler)
    addEventListener('keyup', handler)
    return pressed
}

function runAnimation(frameFunc) {
    let lastTime = null
    function frame(time) {
        let stop = false
        if (lastTime !== null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000
            stop = frameFunc(timeStep) === false
        }
        lastTime = time
        if (!stop) {
            requestAnimationFrame(frame)
        }
    }
    requestAnimationFrame(frame)
}

let arrows = trackKeys(arrowCodes)

function runLevel(level, Display, andThen) {
    let display = new Display(document.body, level)
    runAnimation(step => {
        level.animate(step, arrows)
        display.drawFrame(step)
        if (level.isFinished()) {
            display.clear()
            if (andThen) andThen(level.status)
            return false
        }
    })
}

function runGame(plans, Display) {
    function startLevel(n) {
        runLevel(new Level(plans[n]), Display, (status) => {
            if (status == 'lost') {
                startLevel(n)
            } else if (n < plans.length -1) {
                startLevel(n + 1)
            } else {
                console.log('You win!')
            }
        })
    }
    startLevel(0)
}
