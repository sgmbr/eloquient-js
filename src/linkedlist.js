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

    add(value) {
        let newNode = new Node(value)
        let currentNode = this.head

        if (!currentNode) {
            this.head = newNode
            return
        }

        while (currentNode.next) {
            currentNode = currentNode.next
        }
        currentNode.next = newNode
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
