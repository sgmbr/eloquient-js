/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, devel:true*/

class Node {
    constructor(newData) {
        this.data = newData
        this.next = null
    }
}

class LinkedList {
    constructor() {
        this.head = null
    }

    unshift(data) {
        let newNode = new Node(data)
        newNode.next = this.head
        this.head = newNode
    }

    push(data) {
        let newNode = new Node(data)

        if (!this.head) {
            this.head = newNode
            return
        }

        let currentNode = this.head
        while (currentNode.next) {
            currentNode = currentNode.next
        }
        currentNode.next = newNode
    }

    search(key) {
        let currentNode = this.head
        while (currentNode) {
            if (currentNode.data == key) {
                return currentNode
            }
            currentNode = currentNode.next
        }
        return null
    }

    deleteNode(key) {
        if (this.head && this.head.data == key) {
            this.head = this.head.next
            return
        }

        let currentNode = this.head.next
        let previous = this.head
        while (currentNode) {
            if (currentNode.data == key) {
                previous.next = currentNode.next
                return
            }
            previous = currentNode
            currentNode = currentNode.next
        }
        throw new Error(`Node not found. key: ${key}`)
    }

    deleteNodeAt(position) {
        if (position === 0) {
            this.head = this.head.next
            return
        }

        let currentNode = this.head.next
        let previous = this.head
        let currentPosition = 1
        while (currentNode) {
            if (currentPosition == position) {
                previous.next = currentNode.next
                return
            }
            previous = currentNode
            currentNode = currentNode.next
            currentPosition++
        }
        throw new Error(`Node not found. position: ${position}`)
    }

    revert() {
        let currentNode = this.head
        let previous = null
        let next = null

        while (currentNode) {
            next = currentNode.next
            currentNode.next = previous
            previous = currentNode
            currentNode = next
        }

        this.head = previous
    }

    toString() {
        let currentNode = this.head
        let result = ''

        while (currentNode) {
            result += currentNode.data
            if (currentNode.next) {
                result += ', '
            }
            currentNode = currentNode.next
        }

        return result
    }

    toStringRevert() {
        let currentNode = this.head
        let result = ''

        while (currentNode) {
            result = currentNode.data + result
            if (currentNode.next) {
                result = ', ' + result
            }
            currentNode = currentNode.next
        }

        return result
    }
}
