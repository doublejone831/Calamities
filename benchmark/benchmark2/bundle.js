(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
/**
 * A manager class for all of the AI in a scene.
 * Keeps a list of registered actors and handles AI generation for actors.
 */
var AIManager = /** @class */ (function () {
    function AIManager() {
        this.actors = new Array();
        this.registeredAI = new Map_1["default"]();
    }
    /**
     * Registers an actor with the AIManager
     * @param actor The actor to register
     */
    AIManager.prototype.registerActor = function (actor) {
        this.actors.push(actor);
    };
    AIManager.prototype.removeActor = function (actor) {
        var index = this.actors.indexOf(actor);
        if (index !== -1) {
            this.actors.splice(index, 1);
        }
    };
    /**
     * Registers an AI with the AIManager for use later on
     * @param name The name of the AI to register
     * @param constr The constructor for the AI
     */
    AIManager.prototype.registerAI = function (name, constr) {
        this.registeredAI.add(name, constr);
    };
    /**
     * Generates an AI instance from its name
     * @param name The name of the AI to add
     * @returns A new AI instance
     */
    AIManager.prototype.generateAI = function (name) {
        if (this.registeredAI.has(name)) {
            return new (this.registeredAI.get(name))();
        }
        else {
            throw "Cannot create AI with name ".concat(name, ", no AI with that name is registered");
        }
    };
    AIManager.prototype.update = function (deltaT) {
        // Run the ai for every active actor
        this.actors.forEach(function (actor) { if (actor.aiActive)
            actor.ai.update(deltaT); });
    };
    return AIManager;
}());
exports["default"] = AIManager;
},{"../DataTypes/Map":8}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var StateMachine_1 = require("../DataTypes/State/StateMachine");
/**
 * A version of a @reference[StateMachine] that is configured to work as an AI controller for a @reference[GameNode]
 */
var StateMachineAI = /** @class */ (function (_super) {
    __extends(StateMachineAI, _super);
    function StateMachineAI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // @implemented
    StateMachineAI.prototype.initializeAI = function (owner, config) { };
    // @implemented
    StateMachineAI.prototype.destroy = function () {
        // Get rid of our reference to the owner
        delete this.owner;
        this.receiver.destroy();
    };
    // @implemented
    StateMachineAI.prototype.activate = function (options) { };
    return StateMachineAI;
}(StateMachine_1["default"]));
exports["default"] = StateMachineAI;
},{"../DataTypes/State/StateMachine":18}],3:[function(require,module,exports){
"use strict";
// @ignorePage
exports.__esModule = true;
/**
 * A placeholder function for No Operation. Does nothing
 */
var NullFunc = function () { };
exports["default"] = NullFunc;
},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * A linked-list for the edges in a @reference[Graph].
 */
var EdgeNode = /** @class */ (function () {
    /**
     * Creates a new EdgeNode
     * @param index The index of the node this edge connects to
     * @param weight The weight of this edge
     */
    function EdgeNode(index, weight) {
        this.y = index;
        this.next = null;
        this.weight = weight ? weight : 1;
    }
    return EdgeNode;
}());
exports["default"] = EdgeNode;
},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.MAX_V = void 0;
var EdgeNode_1 = require("./EdgeNode");
exports.MAX_V = 100;
/**
 * An implementation of a graph data structure using edge lists. Inspired by The Algorithm Design Manual.
 */
var Graph = /** @class */ (function () {
    /**
     * Constructs a new graph
     * @param directed Whether or not this graph is directed
     */
    function Graph(directed) {
        if (directed === void 0) { directed = false; }
        this.directed = directed;
        this.weighted = false;
        this.numVertices = 0;
        this.numEdges = 0;
        this.edges = new Array(exports.MAX_V);
        this.degree = new Array(exports.MAX_V);
    }
    /** Adds a node to this graph and returns the index of it
     * @returns The index of the new node
    */
    Graph.prototype.addNode = function () {
        this.numVertices++;
        return this.numVertices;
    };
    /** Adds an edge between node x and y, with an optional weight
     * @param x The index of the start of the edge
     * @param y The index of the end of the edge
     * @param weight The optional weight of the new edge
    */
    Graph.prototype.addEdge = function (x, y, weight) {
        var edge = new EdgeNode_1["default"](y, weight);
        if (this.edges[x]) {
            edge.next = this.edges[x];
        }
        this.edges[x] = edge;
        if (!this.directed) {
            edge = new EdgeNode_1["default"](x, weight);
            if (this.edges[y]) {
                edge.next = this.edges[y];
            }
            this.edges[y] = edge;
        }
        this.numEdges += 1;
    };
    /**
     * Checks whether or not an edge exists between two nodes.
     * This check is directional if this is a directed graph.
     * @param x The first node
     * @param y The second node
     * @returns true if an edge exists, false otherwise
     */
    Graph.prototype.edgeExists = function (x, y) {
        var edge = this.edges[x];
        while (edge !== null) {
            if (edge.y === y) {
                return true;
            }
            edge = edge.next;
        }
    };
    /**
     * Gets the edge list associated with node x
     * @param x The index of the node
     * @returns The head of a linked-list of edges
     */
    Graph.prototype.getEdges = function (x) {
        return this.edges[x];
    };
    /**
     * Gets the degree associated with node x
     * @param x The index of the node
     */
    Graph.prototype.getDegree = function (x) {
        return this.degree[x];
    };
    /**
     * Converts the specifed node into a string
     * @param index The index of the node to convert to a string
     * @returns The string representation of the node: "Node x"
     */
    Graph.prototype.nodeToString = function (index) {
        return "Node " + index;
    };
    /**
     * Converts the Graph into a string format
     * @returns The graph as a string
     */
    Graph.prototype.toString = function () {
        var retval = "";
        for (var i = 0; i < this.numVertices; i++) {
            var edge = this.edges[i];
            var edgeStr = "";
            while (edge !== undefined && edge !== null) {
                edgeStr += edge.y.toString();
                if (this.weighted) {
                    edgeStr += " (" + edge.weight + ")";
                }
                if (edge.next !== null) {
                    edgeStr += ", ";
                }
                edge = edge.next;
            }
            retval += this.nodeToString(i) + ": " + edgeStr + "\n";
        }
        return retval;
    };
    return Graph;
}());
exports["default"] = Graph;
},{"./EdgeNode":4}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Graph_1 = require("./Graph");
/**
 * An extension of Graph that has nodes with positions in 2D space.
 * This is a weighted graph (though not inherently directd)
*/
var PositionGraph = /** @class */ (function (_super) {
    __extends(PositionGraph, _super);
    /**
     * Createes a new PositionGraph
     * @param directed Whether or not this graph is directed
     */
    function PositionGraph(directed) {
        if (directed === void 0) { directed = false; }
        var _this = _super.call(this, directed) || this;
        _this.debugRender = function () {
            // for(let point of this.positions){
            // 	ctx.fillRect((point.x - origin.x - 4)*zoom, (point.y - origin.y - 4)*zoom, 8, 8);
            // }
        };
        _this.positions = new Array(Graph_1.MAX_V);
        return _this;
    }
    /**
     * Adds a positioned node to this graph
     * @param position The position of the node to add
     * @returns The index of the added node
     */
    PositionGraph.prototype.addPositionedNode = function (position) {
        this.positions[this.numVertices] = position;
        return this.addNode();
    };
    /**
     * Changes the position of a node.
     * Automatically adjusts the weights of the graph tied to this node.
     * As such, be warned that this function has an O(n + m) running time, and use it sparingly.
     * @param index The index of the node
     * @param position The new position of the node
     */
    PositionGraph.prototype.setNodePosition = function (index, position) {
        this.positions[index] = position;
        // Recalculate all weights associated with this index
        for (var i = 0; i < this.numEdges; i++) {
            var edge = this.edges[i];
            while (edge !== null) {
                // If this node is on either side of the edge, recalculate weight
                if (i === index || edge.y === index) {
                    edge.weight = this.positions[i].distanceTo(this.positions[edge.y]);
                }
                edge = edge.next;
            }
        }
    };
    /**
     * Gets the position of a node
     * @param index The index of the node
     * @returns The position of the node
     */
    PositionGraph.prototype.getNodePosition = function (index) {
        return this.positions[index];
    };
    /**
     * Adds an edge to this graph between node x and y.
     * Automatically calculates the weight of the edge as the distance between the nodes.
     * @param x The beginning of the edge
     * @param y The end of the edge
     */
    PositionGraph.prototype.addEdge = function (x, y) {
        if (!this.positions[x] || !this.positions[y]) {
            throw "Can't add edge to un-positioned node!";
        }
        // Weight is the distance between the nodes
        var weight = this.positions[x].distanceTo(this.positions[y]);
        _super.prototype.addEdge.call(this, x, y, weight);
    };
    // @override
    PositionGraph.prototype.nodeToString = function (index) {
        return "Node " + index + " - " + this.positions[index].toString();
    };
    return PositionGraph;
}(Graph_1["default"]));
exports["default"] = PositionGraph;
},{"./Graph":5}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.isRegion = void 0;
function isRegion(arg) {
    return arg && arg.size && arg.scale && arg.boundary;
}
exports.isRegion = isRegion;
},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Associates strings with elements of type T
 */
var Map = /** @class */ (function () {
    /** Creates a new map */
    function Map() {
        this.map = {};
    }
    /**
     * Adds a value T stored at a key.
     * @param key The key of the item to be stored
     * @param value The item to be stored
     */
    Map.prototype.add = function (key, value) {
        this.map[key] = value;
    };
    /**
     * Get the value associated with a key.
     * @param key The key of the item
     * @returns The item at the key or undefined
     */
    Map.prototype.get = function (key) {
        return this.map[key];
    };
    /**
     * An alias of add. Sets the value stored at key to the new specified value
     * @param key The key of the item to be stored
     * @param value The item to be stored
     */
    Map.prototype.set = function (key, value) {
        this.add(key, value);
    };
    /**
     * Returns true if there is a value stored at the specified key, false otherwise.
     * @param key The key to check
     * @returns A boolean representing whether or not there is an item at the given key.
     */
    Map.prototype.has = function (key) {
        return this.map[key] !== undefined;
    };
    /**
     * Returns an array of all of the keys in this map.
     * @returns An array containing all keys in the map.
     */
    Map.prototype.keys = function () {
        return Object.keys(this.map);
    };
    // @implemented
    Map.prototype.forEach = function (func) {
        Object.keys(this.map).forEach(function (key) { return func(key); });
    };
    /**
     * Deletes an item associated with a key
     * @param key The key at which to delete an item
     */
    Map.prototype["delete"] = function (key) {
        delete this.map[key];
    };
    // @implemented
    Map.prototype.clear = function () {
        var _this = this;
        this.forEach(function (key) { return delete _this.map[key]; });
    };
    /**
     * Converts this map to a string representation.
     * @returns The string representation of this map.
     */
    Map.prototype.toString = function () {
        var _this = this;
        var str = "";
        this.forEach(function (key) { return str += key + " -> " + _this.get(key).toString() + "\n"; });
        return str;
    };
    return Map;
}());
exports["default"] = Map;
},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
/** A 4x4 matrix0 */
var Mat4x4 = /** @class */ (function () {
    function Mat4x4() {
        this.mat = new Float32Array([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]);
    }
    Object.defineProperty(Mat4x4, "IDENTITY", {
        // Static members
        get: function () {
            return new Mat4x4().identity();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4x4, "ZERO", {
        get: function () {
            return new Mat4x4().zero();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mat4x4.prototype, "_00", {
        // Accessors
        set: function (x) {
            this.mat[0] = x;
        },
        enumerable: false,
        configurable: true
    });
    Mat4x4.prototype.set = function (col, row, value) {
        if (col < 0 || col > 3 || row < 0 || row > 3) {
            throw "Error - index (".concat(col, ", ").concat(row, ") is out of bounds for Mat4x4");
        }
        this.mat[row * 4 + col] = value;
        return this;
    };
    Mat4x4.prototype.get = function (col, row) {
        return this.mat[row * 4 + col];
    };
    Mat4x4.prototype.setAll = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.mat.set(items);
        return this;
    };
    Mat4x4.prototype.identity = function () {
        return this.setAll(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    Mat4x4.prototype.zero = function () {
        return this.setAll(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    /**
     * Makes this Mat4x4 a rotation matrix of the specified number of radians ccw
     * @param zRadians The number of radians to rotate
     * @returns this Mat4x4
     */
    Mat4x4.prototype.rotate = function (zRadians) {
        return this.setAll(Math.cos(zRadians), -Math.sin(zRadians), 0, 0, Math.sin(zRadians), Math.cos(zRadians), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    /**
     * Turns this Mat4x4 into a translation matrix of the specified translation
     * @param translation The translation in x and y
     * @returns this Mat4x4
     */
    Mat4x4.prototype.translate = function (translation) {
        // If translation is a vec, get its array
        if (translation instanceof Vec2_1["default"]) {
            translation = translation.toArray();
        }
        return this.setAll(1, 0, 0, translation[0], 0, 1, 0, translation[1], 0, 0, 1, 0, 0, 0, 0, 1);
    };
    Mat4x4.prototype.scale = function (scale) {
        // Make sure scale is a float32Array
        if (scale instanceof Vec2_1["default"]) {
            scale = scale.toArray();
        }
        else if (!(scale instanceof Float32Array)) {
            scale = new Float32Array([scale, scale]);
        }
        return this.setAll(scale[0], 0, 0, 0, 0, scale[1], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    /**
     * Returns a new Mat4x4 that represents the right side multiplication THIS x OTHER
     * @param other The other Mat4x4 to multiply by
     * @returns a new Mat4x4 containing the product of these two Mat4x4s
     */
    Mat4x4.prototype.mult = function (other, out) {
        var _a;
        var temp = new Float32Array(16);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var value = 0;
                for (var k = 0; k < 4; k++) {
                    value += this.get(k, i) * other.get(j, k);
                }
                temp[j * 4 + i] = value;
            }
        }
        if (out !== undefined) {
            return out.setAll.apply(out, temp);
        }
        else {
            return (_a = new Mat4x4()).setAll.apply(_a, temp);
        }
    };
    /**
     * Multiplies all given matricies in order. e.g. MULT(A, B, C) -> A*B*C
     * @param mats A list of Mat4x4s to multiply in order
     * @returns A new Mat4x4 holding the result of the operation
     */
    Mat4x4.MULT = function () {
        var mats = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mats[_i] = arguments[_i];
        }
        // Create a new array
        var temp = Mat4x4.IDENTITY;
        // Multiply by every array in order, in place
        for (var i = 0; i < mats.length; i++) {
            temp.mult(mats[i], temp);
        }
        return temp;
    };
    Mat4x4.prototype.toArray = function () {
        return this.mat;
    };
    Mat4x4.prototype.toString = function () {
        return "|".concat(this.mat[0].toFixed(2), ", ").concat(this.mat[1].toFixed(2), ", ").concat(this.mat[2].toFixed(2), ", ").concat(this.mat[3].toFixed(2), "|\n") +
            "|".concat(this.mat[4].toFixed(2), ", ").concat(this.mat[5].toFixed(2), ", ").concat(this.mat[6].toFixed(2), ", ").concat(this.mat[7].toFixed(2), "|\n") +
            "|".concat(this.mat[8].toFixed(2), ", ").concat(this.mat[9].toFixed(2), ", ").concat(this.mat[10].toFixed(2), ", ").concat(this.mat[11].toFixed(2), "|\n") +
            "|".concat(this.mat[12].toFixed(2), ", ").concat(this.mat[13].toFixed(2), ", ").concat(this.mat[14].toFixed(2), ", ").concat(this.mat[15].toFixed(2), "|");
    };
    return Mat4x4;
}());
exports["default"] = Mat4x4;
},{"./Vec2":20}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * A class that contains the area of overlap of two colliding objects to allow for sorting by the physics system.
 */
var AreaCollision = /** @class */ (function () {
    /**
     * Creates a new AreaCollision object
     * @param area The area of the collision
     * @param collider The other collider
     */
    function AreaCollision(area, collider, other, type, tile) {
        this.area = area;
        this.collider = collider;
        this.other = other;
        this.type = type;
        this.tile = tile;
    }
    return AreaCollision;
}());
exports["default"] = AreaCollision;
},{}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../Vec2");
/**
 * An object representing the data collected from a physics hit between two geometric objects.
 * Inspired by the helpful collision documentation @link(here)(https://noonat.github.io/intersect/).
 */
var Hit = /** @class */ (function () {
    function Hit() {
        /** The near times of the collision */
        this.nearTimes = Vec2_1["default"].ZERO;
        /** The position of the collision */
        this.pos = Vec2_1["default"].ZERO;
        /** The overlap distance of the hit */
        this.delta = Vec2_1["default"].ZERO;
        /** The normal vector of the hit */
        this.normal = Vec2_1["default"].ZERO;
    }
    return Hit;
}());
exports["default"] = Hit;
},{"../Vec2":20}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * A FIFO queue with elements of type T
 */
var Queue = /** @class */ (function () {
    /**
     * Constructs a new queue
     * @param maxElements The maximum size of the stack
     */
    function Queue(maxElements) {
        if (maxElements === void 0) { maxElements = 100; }
        this.MAX_ELEMENTS = maxElements;
        this.q = new Array(this.MAX_ELEMENTS);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    /**
     * Adds an item to the back of the queue
     * @param item The item to add to the back of the queue
     */
    Queue.prototype.enqueue = function (item) {
        if ((this.tail + 1) % this.MAX_ELEMENTS === this.head) {
            throw new Error("Queue full - cannot add element");
        }
        this.size += 1;
        this.q[this.tail] = item;
        this.tail = (this.tail + 1) % this.MAX_ELEMENTS;
    };
    /**
     * Retrieves an item from the front of the queue
     * @returns The item at the front of the queue
     */
    Queue.prototype.dequeue = function () {
        if (this.head === this.tail) {
            throw new Error("Queue empty - cannot remove element");
        }
        this.size -= 1;
        var item = this.q[this.head];
        // Now delete the item
        delete this.q[this.head];
        this.head = (this.head + 1) % this.MAX_ELEMENTS;
        return item;
    };
    /**
     * Returns the item at the front of the queue, but does not remove it
     * @returns The item at the front of the queue
     */
    Queue.prototype.peekNext = function () {
        if (this.head === this.tail) {
            throw "Queue empty - cannot get element";
        }
        var item = this.q[this.head];
        return item;
    };
    /**
     * Returns true if the queue has items in it, false otherwise
     * @returns A boolean representing whether or not this queue has items
     */
    Queue.prototype.hasItems = function () {
        return this.head !== this.tail;
    };
    /**
     * Returns the number of elements in the queue.
     * @returns The size of the queue
     */
    Queue.prototype.getSize = function () {
        return this.size;
    };
    // @implemented
    Queue.prototype.clear = function () {
        var _this = this;
        this.forEach(function (item, index) { return delete _this.q[index]; });
        this.size = 0;
        this.head = this.tail;
    };
    // @implemented
    Queue.prototype.forEach = function (func) {
        var i = this.head;
        while (i !== this.tail) {
            func(this.q[i], i);
            i = (i + 1) % this.MAX_ELEMENTS;
        }
    };
    /**
     * Converts this queue into a string format
     * @returns A string representing this queue
     */
    Queue.prototype.toString = function () {
        var retval = "";
        this.forEach(function (item, index) {
            var str = item.toString();
            if (index !== 0) {
                str += " -> ";
            }
            retval = str + retval;
        });
        return "Top -> " + retval;
    };
    return Queue;
}());
exports["default"] = Queue;
},{}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/** A container for info about a webGL shader program */
var WebGLProgramType = /** @class */ (function () {
    function WebGLProgramType() {
    }
    /**
     * Deletes this shader program
     */
    WebGLProgramType.prototype["delete"] = function (gl) {
        // Clean up all aspects of this program
        if (this.program) {
            gl.deleteProgram(this.program);
        }
        if (this.vertexShader) {
            gl.deleteShader(this.vertexShader);
        }
        if (this.fragmentShader) {
            gl.deleteShader(this.fragmentShader);
        }
    };
    return WebGLProgramType;
}());
exports["default"] = WebGLProgramType;
},{}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Shape_1 = require("./Shape");
var Vec2_1 = require("../Vec2");
var MathUtils_1 = require("../../Utils/MathUtils");
var Circle_1 = require("./Circle");
var Hit_1 = require("../Physics/Hit");
/**
 * An Axis-Aligned Bounding Box. In other words, a rectangle that is always aligned to the x-y grid.
 * Inspired by the helpful collision documentation @link(here)(https://noonat.github.io/intersect/).
 */
var AABB = /** @class */ (function (_super) {
    __extends(AABB, _super);
    /**
     * Creates a new AABB
     * @param center The center of the AABB
     * @param halfSize The half size of the AABB - The distance from the center to an edge in x and y
     */
    function AABB(center, halfSize) {
        var _this = _super.call(this) || this;
        _this.center = center ? center : new Vec2_1["default"](0, 0);
        _this.halfSize = halfSize ? halfSize : new Vec2_1["default"](0, 0);
        return _this;
    }
    Object.defineProperty(AABB.prototype, "topLeft", {
        /** Returns a point representing the top left corner of the AABB */
        get: function () {
            return new Vec2_1["default"](this.left, this.top);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "topRight", {
        /** Returns a point representing the top right corner of the AABB */
        get: function () {
            return new Vec2_1["default"](this.right, this.top);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "bottomLeft", {
        /** Returns a point representing the bottom left corner of the AABB */
        get: function () {
            return new Vec2_1["default"](this.left, this.bottom);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "bottomRight", {
        /** Returns a point representing the bottom right corner of the AABB */
        get: function () {
            return new Vec2_1["default"](this.right, this.bottom);
        },
        enumerable: false,
        configurable: true
    });
    // @override
    AABB.prototype.getBoundingRect = function () {
        return this.clone();
    };
    // @override
    AABB.prototype.getBoundingCircle = function () {
        var r = Math.max(this.hw, this.hh);
        return new Circle_1["default"](this.center.clone(), r);
    };
    // @deprecated
    AABB.prototype.getHalfSize = function () {
        return this.halfSize;
    };
    // @deprecated
    AABB.prototype.setHalfSize = function (halfSize) {
        this.halfSize = halfSize;
    };
    // TODO - move these all to the Shape class
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    AABB.prototype.containsPoint = function (point) {
        return point.x >= this.x - this.hw && point.x <= this.x + this.hw
            && point.y >= this.y - this.hh && point.y <= this.y + this.hh;
    };
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    AABB.prototype.intersectPoint = function (point) {
        var dx = point.x - this.x;
        var px = this.hw - Math.abs(dx);
        if (px <= 0) {
            return false;
        }
        var dy = point.y - this.y;
        var py = this.hh - Math.abs(dy);
        if (py <= 0) {
            return false;
        }
        return true;
    };
    /**
     * A boolean check of whether this AABB contains a point with soft left and top boundaries.
     * In other words, if the top left is (0, 0), the point (0, 0) is not in the AABB
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    AABB.prototype.containsPointSoft = function (point) {
        return point.x > this.x - this.hw && point.x <= this.x + this.hw
            && point.y > this.y - this.hh && point.y <= this.y + this.hh;
    };
    /**
     * Returns the data from the intersection of this AABB with a line segment from a point in a direction
     * @param point The point that the line segment starts from
     * @param delta The direction and distance of the segment
     * @param padding Pads the AABB to make it wider for the intersection test
     * @returns The Hit object representing the intersection, or null if there was no intersection
     */
    AABB.prototype.intersectSegment = function (point, delta, padding) {
        var paddingX = padding ? padding.x : 0;
        var paddingY = padding ? padding.y : 0;
        var scaleX = 1 / delta.x;
        var scaleY = 1 / delta.y;
        var signX = MathUtils_1["default"].sign(scaleX);
        var signY = MathUtils_1["default"].sign(scaleY);
        var tnearx = scaleX * (this.x - signX * (this.hw + paddingX) - point.x);
        var tneary = scaleY * (this.y - signY * (this.hh + paddingY) - point.y);
        var tfarx = scaleX * (this.x + signX * (this.hw + paddingX) - point.x);
        var tfary = scaleY * (this.y + signY * (this.hh + paddingY) - point.y);
        if (tnearx > tfary || tneary > tfarx) {
            // We aren't colliding - we clear one axis before intersecting another
            return null;
        }
        var tnear = Math.max(tnearx, tneary);
        // Double check for NaNs
        if (tnearx !== tnearx) {
            tnear = tneary;
        }
        else if (tneary !== tneary) {
            tnear = tnearx;
        }
        var tfar = Math.min(tfarx, tfary);
        if (tnear === -Infinity) {
            return null;
        }
        if (tnear >= 1 || tfar <= 0) {
            return null;
        }
        // We are colliding
        var hit = new Hit_1["default"]();
        hit.time = MathUtils_1["default"].clamp01(tnear);
        hit.nearTimes.x = tnearx;
        hit.nearTimes.y = tneary;
        if (tnearx > tneary) {
            // We hit on the left or right size
            hit.normal.x = -signX;
            hit.normal.y = 0;
        }
        else if (Math.abs(tnearx - tneary) < 0.0001) {
            // We hit on the corner
            hit.normal.x = -signX;
            hit.normal.y = -signY;
            hit.normal.normalize();
        }
        else {
            // We hit on the top or bottom
            hit.normal.x = 0;
            hit.normal.y = -signY;
        }
        hit.delta.x = (1.0 - hit.time) * -delta.x;
        hit.delta.y = (1.0 - hit.time) * -delta.y;
        hit.pos.x = point.x + delta.x * hit.time;
        hit.pos.y = point.y + delta.y * hit.time;
        return hit;
    };
    // @override
    AABB.prototype.overlaps = function (other) {
        if (other instanceof AABB) {
            return this.overlapsAABB(other);
        }
        throw "Overlap not defined between these shapes.";
    };
    /**
     * A simple boolean check of whether this AABB overlaps another
     * @param other The other AABB to check against
     * @returns True if this AABB overlaps the other, false otherwise
     */
    AABB.prototype.overlapsAABB = function (other) {
        var dx = other.x - this.x;
        var px = this.hw + other.hw - Math.abs(dx);
        if (px <= 0) {
            return false;
        }
        var dy = other.y - this.y;
        var py = this.hh + other.hh - Math.abs(dy);
        if (py <= 0) {
            return false;
        }
        return true;
    };
    /**
     * Determines whether these AABBs are JUST touching - not overlapping.
     * Vec2.x is -1 if the other is to the left, 1 if to the right.
     * Likewise, Vec2.y is -1 if the other is on top, 1 if on bottom.
     * @param other The other AABB to check
     * @returns The collision sides stored in a Vec2 if the AABBs are touching, null otherwise
     */
    AABB.prototype.touchesAABB = function (other) {
        var dx = other.x - this.x;
        var px = this.hw + other.hw - Math.abs(dx);
        var dy = other.y - this.y;
        var py = this.hh + other.hh - Math.abs(dy);
        // If one axis is just touching and the other is overlapping, true
        if ((px === 0 && py >= 0) || (py === 0 && px >= 0)) {
            var ret = new Vec2_1["default"]();
            if (px === 0) {
                ret.x = other.x < this.x ? -1 : 1;
            }
            if (py === 0) {
                ret.y = other.y < this.y ? -1 : 1;
            }
            return ret;
        }
        else {
            return null;
        }
    };
    /**
     * Determines whether these AABBs are JUST touching - not overlapping.
     * Also, if they are only touching corners, they are considered not touching.
     * Vec2.x is -1 if the other is to the left, 1 if to the right.
     * Likewise, Vec2.y is -1 if the other is on top, 1 if on bottom.
     * @param other The other AABB to check
     * @returns The side of the touch, stored as a Vec2, or null if there is no touch
     */
    AABB.prototype.touchesAABBWithoutCorners = function (other) {
        var dx = other.x - this.x;
        var px = this.hw + other.hw - Math.abs(dx);
        var dy = other.y - this.y;
        var py = this.hh + other.hh - Math.abs(dy);
        // If one axis is touching, and the other is strictly overlapping
        if ((px === 0 && py > 0) || (py === 0 && px > 0)) {
            var ret = new Vec2_1["default"]();
            if (px === 0) {
                ret.x = other.x < this.x ? -1 : 1;
            }
            else {
                ret.y = other.y < this.y ? -1 : 1;
            }
            return ret;
        }
        else {
            return null;
        }
    };
    /**
     * Calculates the area of the overlap between this AABB and another
     * @param other The other AABB
     * @returns The area of the overlap between the AABBs
     */
    AABB.prototype.overlapArea = function (other) {
        var leftx = Math.max(this.x - this.hw, other.x - other.hw);
        var rightx = Math.min(this.x + this.hw, other.x + other.hw);
        var dx = rightx - leftx;
        var lefty = Math.max(this.y - this.hh, other.y - other.hh);
        var righty = Math.min(this.y + this.hh, other.y + other.hh);
        var dy = righty - lefty;
        if (dx < 0 || dy < 0)
            return 0;
        return dx * dy;
    };
    /**
     * Moves and resizes this rect from its current position to the position specified
     * @param velocity The movement of the rect from its position
     * @param fromPosition A position specified to be the starting point of sweeping
     * @param halfSize The halfSize of the sweeping rect
     */
    AABB.prototype.sweep = function (velocity, fromPosition, halfSize) {
        if (!fromPosition) {
            fromPosition = this.center;
        }
        if (!halfSize) {
            halfSize = this.halfSize;
        }
        var centerX = fromPosition.x + velocity.x / 2;
        var centerY = fromPosition.y + velocity.y / 2;
        var minX = Math.min(fromPosition.x - halfSize.x, fromPosition.x + velocity.x - halfSize.x);
        var minY = Math.min(fromPosition.y - halfSize.y, fromPosition.y + velocity.y - halfSize.y);
        this.center.set(centerX, centerY);
        this.halfSize.set(centerX - minX, centerY - minY);
    };
    // @override
    AABB.prototype.clone = function () {
        return new AABB(this.center.clone(), this.halfSize.clone());
    };
    /**
     * Converts this AABB to a string format
     * @returns (center: (x, y), halfSize: (x, y))
     */
    AABB.prototype.toString = function () {
        return "(center: " + this.center.toString() + ", half-size: " + this.halfSize.toString() + ")";
    };
    return AABB;
}(Shape_1["default"]));
exports["default"] = AABB;
},{"../../Utils/MathUtils":97,"../Physics/Hit":11,"../Vec2":20,"./Circle":15,"./Shape":16}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../Vec2");
var AABB_1 = require("./AABB");
var Shape_1 = require("./Shape");
/**
 * A Circle
 */
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    /**
     * Creates a new Circle
     * @param center The center of the circle
     * @param radius The radius of the circle
     */
    function Circle(center, radius) {
        var _this = _super.call(this) || this;
        _this._center = center ? center : new Vec2_1["default"](0, 0);
        _this.radius = radius ? radius : 0;
        return _this;
    }
    Object.defineProperty(Circle.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (center) {
            this._center = center;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "halfSize", {
        get: function () {
            return new Vec2_1["default"](this.radius, this.radius);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "r", {
        get: function () {
            return this.radius;
        },
        set: function (radius) {
            this.radius = radius;
        },
        enumerable: false,
        configurable: true
    });
    // @override
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    Circle.prototype.containsPoint = function (point) {
        return this.center.distanceSqTo(point) <= this.radius * this.radius;
    };
    // @override
    Circle.prototype.getBoundingRect = function () {
        return new AABB_1["default"](this._center.clone(), new Vec2_1["default"](this.radius, this.radius));
    };
    // @override
    Circle.prototype.getBoundingCircle = function () {
        return this.clone();
    };
    // @override
    Circle.prototype.overlaps = function (other) {
        throw new Error("Method not implemented.");
    };
    // @override
    Circle.prototype.clone = function () {
        return new Circle(this._center.clone(), this.radius);
    };
    Circle.prototype.toString = function () {
        return "(center: " + this.center.toString() + ", radius: " + this.radius + ")";
    };
    return Circle;
}(Shape_1["default"]));
exports["default"] = Circle;
},{"../Vec2":20,"./AABB":14,"./Shape":16}],16:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../Vec2");
var AABB_1 = require("./AABB");
/**
 * An abstract Shape class that acts as an interface for better interactions with subclasses.
 */
var Shape = /** @class */ (function () {
    function Shape() {
    }
    Object.defineProperty(Shape.prototype, "x", {
        get: function () {
            return this.center.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "y", {
        get: function () {
            return this.center.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "hw", {
        get: function () {
            return this.halfSize.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "hh", {
        get: function () {
            return this.halfSize.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "top", {
        get: function () {
            return this.y - this.hh;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "bottom", {
        get: function () {
            return this.y + this.hh;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "left", {
        get: function () {
            return this.x - this.hw;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "right", {
        get: function () {
            return this.x + this.hw;
        },
        enumerable: false,
        configurable: true
    });
    Shape.getTimeOfCollision = function (A, velA, B, velB) {
        if (A instanceof AABB_1["default"] && B instanceof AABB_1["default"]) {
            return Shape.getTimeOfCollision_AABB_AABB(A, velA, B, velB);
        }
    };
    Shape.getTimeOfCollision_AABB_AABB = function (A, velA, B, velB) {
        var posSmaller = A.center;
        var posLarger = B.center;
        var sizeSmaller = A.halfSize;
        var sizeLarger = B.halfSize;
        var firstContact = new Vec2_1["default"](0, 0);
        var lastContact = new Vec2_1["default"](0, 0);
        var collidingX = false;
        var collidingY = false;
        // Sort by position
        if (posLarger.x < posSmaller.x) {
            // Swap, because smaller is further right than larger
            var temp = void 0;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
            temp = velA;
            velA = velB;
            velB = temp;
        }
        // A is left, B is right
        firstContact.x = Infinity;
        lastContact.x = Infinity;
        if (posLarger.x - sizeLarger.x >= posSmaller.x + sizeSmaller.x) {
            // If we aren't currently colliding
            var relVel = velA.x - velB.x;
            if (relVel > 0) {
                // If they are moving towards each other
                firstContact.x = ((posLarger.x - sizeLarger.x) - (posSmaller.x + sizeSmaller.x)) / (relVel);
                lastContact.x = ((posLarger.x + sizeLarger.x) - (posSmaller.x - sizeSmaller.x)) / (relVel);
            }
        }
        else {
            collidingX = true;
        }
        if (posLarger.y < posSmaller.y) {
            // Swap, because smaller is further up than larger
            var temp = void 0;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
            temp = velA;
            velA = velB;
            velB = temp;
        }
        // A is top, B is bottom
        firstContact.y = Infinity;
        lastContact.y = Infinity;
        if (posLarger.y - sizeLarger.y >= posSmaller.y + sizeSmaller.y) {
            // If we aren't currently colliding
            var relVel = velA.y - velB.y;
            if (relVel > 0) {
                // If they are moving towards each other
                firstContact.y = ((posLarger.y - sizeLarger.y) - (posSmaller.y + sizeSmaller.y)) / (relVel);
                lastContact.y = ((posLarger.y + sizeLarger.y) - (posSmaller.y - sizeSmaller.y)) / (relVel);
            }
        }
        else {
            collidingY = true;
        }
        return [firstContact, lastContact, collidingX, collidingY];
    };
    return Shape;
}());
exports["default"] = Shape;
},{"../Vec2":20,"./AABB":14}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * A LIFO stack with items of type T
 */
var Stack = /** @class */ (function () {
    /**
     * Constructs a new stack
     * @param maxElements The maximum size of the stack
     */
    function Stack(maxElements) {
        if (maxElements === void 0) { maxElements = 100; }
        this.MAX_ELEMENTS = maxElements;
        this.stack = new Array(this.MAX_ELEMENTS);
        this.head = -1;
    }
    /**
     * Adds an item to the top of the stack
     * @param item The new item to add to the stack
     */
    Stack.prototype.push = function (item) {
        if (this.head + 1 === this.MAX_ELEMENTS) {
            throw "Stack full - cannot add element";
        }
        this.head += 1;
        this.stack[this.head] = item;
    };
    /**
     * Removes an item from the top of the stack
     * @returns The item at the top of the stack
     */
    Stack.prototype.pop = function () {
        if (this.head === -1) {
            throw "Stack empty - cannot remove element";
        }
        this.head -= 1;
        return this.stack[this.head + 1];
    };
    /**
     * Returns the element currently at the top of the stack
     * @returns The item at the top of the stack
     */
    Stack.prototype.peek = function () {
        if (this.head === -1) {
            throw "Stack empty - cannot get element";
        }
        return this.stack[this.head];
    };
    /** Returns true if this stack is empty
     * @returns A boolean that represents whether or not the stack is empty
    */
    Stack.prototype.isEmpty = function () {
        return this.head === -1;
    };
    // @implemented
    Stack.prototype.clear = function () {
        var _this = this;
        this.forEach(function (item, index) { return delete _this.stack[index]; });
        this.head = -1;
    };
    /**
     * Returns the number of items currently in the stack
     * @returns The number of items in the stack
     */
    Stack.prototype.size = function () {
        return this.head + 1;
    };
    // @implemented
    Stack.prototype.forEach = function (func) {
        var i = 0;
        while (i <= this.head) {
            func(this.stack[i], i);
            i += 1;
        }
    };
    /**
     * Converts this stack into a string format
     * @returns A string representing this stack
     */
    Stack.prototype.toString = function () {
        var retval = "";
        this.forEach(function (item, index) {
            var str = item.toString();
            if (index !== 0) {
                str += " -> ";
            }
            retval = str + retval;
        });
        return "Top -> " + retval;
    };
    return Stack;
}());
exports["default"] = Stack;
},{}],18:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Stack_1 = require("../Stack");
var Map_1 = require("../Map");
var Receiver_1 = require("../../Events/Receiver");
var Emitter_1 = require("../../Events/Emitter");
/**
 * An implementation of a Push Down Automata State machine. States can also be hierarchical
 * for more flexibility, as described in @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/state.html).
 */
var StateMachine = /** @class */ (function () {
    /**
     * Creates a new StateMachine
     */
    function StateMachine() {
        this.stack = new Stack_1["default"]();
        this.stateMap = new Map_1["default"]();
        this.receiver = new Receiver_1["default"]();
        this.emitter = new Emitter_1["default"]();
        this.emitEventOnStateChange = false;
    }
    /**
     * Sets the activity state of this state machine
     * @param flag True if you want to set this machine running, false otherwise
     */
    StateMachine.prototype.setActive = function (flag) {
        this.active = flag;
    };
    /**
     * Makes this state machine emit an event any time its state changes
     * @param stateChangeEventName The name of the event to emit
     */
    StateMachine.prototype.setEmitEventOnStateChange = function (stateChangeEventName) {
        this.emitEventOnStateChange = true;
        this.stateChangeEventName = stateChangeEventName;
    };
    /**
     * Stops this state machine from emitting events on state change.
     */
    StateMachine.prototype.cancelEmitEventOnStateChange = function () {
        this.emitEventOnStateChange = false;
    };
    /**
     * Initializes this state machine with an initial state and sets it running
     * @param initialState The name of initial state of the state machine
     */
    StateMachine.prototype.initialize = function (initialState, options) {
        this.stack.push(this.stateMap.get(initialState));
        this.currentState = this.stack.peek();
        this.currentState.onEnter(options);
        this.setActive(true);
    };
    /**
     * Adds a state to this state machine
     * @param stateName The name of the state to add
     * @param state The state to add
     */
    StateMachine.prototype.addState = function (stateName, state) {
        this.stateMap.add(stateName, state);
    };
    /**
     * Changes the state of this state machine to the provided string
     * @param state The string name of the state to change to
     */
    StateMachine.prototype.changeState = function (state) {
        // Exit the current state
        var options = this.currentState.onExit();
        // Make sure the correct state is at the top of the stack
        if (state === "previous") {
            // Pop the current state off the stack
            this.stack.pop();
        }
        else {
            // Retrieve the new state from the statemap and put it at the top of the stack
            this.stack.pop();
            this.stack.push(this.stateMap.get(state));
        }
        // Retreive the new state from the stack
        this.currentState = this.stack.peek();
        // Emit an event if turned on
        if (this.emitEventOnStateChange) {
            this.emitter.fireEvent(this.stateChangeEventName, { state: this.currentState });
        }
        // Enter the new state
        this.currentState.onEnter(options);
    };
    /**
     * Handles input. This happens at the very beginning of this state machine's update cycle.
     * @param event The game event to process
     */
    StateMachine.prototype.handleEvent = function (event) {
        if (this.active) {
            this.currentState.handleInput(event);
        }
    };
    // @implemented
    StateMachine.prototype.update = function (deltaT) {
        // Distribute events
        while (this.receiver.hasNextEvent()) {
            var event_1 = this.receiver.getNextEvent();
            this.handleEvent(event_1);
        }
        // Delegate the update to the current state
        this.currentState.update(deltaT);
    };
    return StateMachine;
}());
exports["default"] = StateMachine;
},{"../../Events/Emitter":23,"../../Events/Receiver":27,"../Map":8,"../Stack":17}],19:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var Vec2_1 = require("../Vec2");
/**
 * The data representation of a Tileset for the game engine. This represents one image,
 * with a startIndex if required (as it is with Tiled using two images in one tilset).
 */
var Tileset = /** @class */ (function () {
    // TODO: Change this to be more general and work with other tileset formats
    function Tileset(tilesetData) {
        // Defer handling of the data to a helper class
        this.initFromTiledData(tilesetData);
    }
    /**
     * Initialize the tileset from the data from a Tiled json file
     * @param tiledData The parsed object from a Tiled json file
     */
    Tileset.prototype.initFromTiledData = function (tiledData) {
        this.numRows = tiledData.tilecount / tiledData.columns;
        this.numCols = tiledData.columns;
        this.startIndex = tiledData.firstgid;
        this.endIndex = this.startIndex + tiledData.tilecount - 1;
        this.tileSize = new Vec2_1["default"](tiledData.tilewidth, tiledData.tilewidth);
        this.imageKey = tiledData.image;
        this.imageSize = new Vec2_1["default"](tiledData.imagewidth, tiledData.imageheight);
    };
    /**
     * Gets the image key associated with this tilemap
     * @returns The image key of this tilemap
     */
    Tileset.prototype.getImageKey = function () {
        return this.imageKey;
    };
    /**
     * Returns a Vec2 containing the left and top offset from the image origin for this tile.
     * @param tileIndex The index of the tile from startIndex to endIndex of this tileset
     * @returns A Vec2 containing the offset for the specified tile.
     */
    Tileset.prototype.getImageOffsetForTile = function (tileIndex) {
        // Get the true index
        var index = tileIndex - this.startIndex;
        var row = Math.floor(index / this.numCols);
        var col = index % this.numCols;
        var width = this.tileSize.x;
        var height = this.tileSize.y;
        // Calculate the position to start a crop in the tileset image
        var left = col * width;
        var top = row * height;
        return new Vec2_1["default"](left, top);
    };
    /**
     * Gets the start index
     * @returns The start index
     */
    Tileset.prototype.getStartIndex = function () {
        return this.startIndex;
    };
    /**
     * Gets the tile set
     * @returns A Vec2 containing the tile size
     */
    Tileset.prototype.getTileSize = function () {
        return this.tileSize;
    };
    /**
     * Gets the number of rows in the tileset
     * @returns The number of rows
     */
    Tileset.prototype.getNumRows = function () {
        return this.numRows;
    };
    /**
     * Gets the number of columns in the tilset
     * @returns The number of columns
     */
    Tileset.prototype.getNumCols = function () {
        return this.numCols;
    };
    Tileset.prototype.getTileCount = function () {
        return this.endIndex - this.startIndex + 1;
    };
    /**
     * Checks whether or not this tilset contains the specified tile index. This is used for rendering.
     * @param tileIndex The index of the tile to check
     * @returns A boolean representing whether or not this tilset uses the specified index
     */
    Tileset.prototype.hasTile = function (tileIndex) {
        return tileIndex >= this.startIndex && tileIndex <= this.endIndex;
    };
    /**
     * Render a singular tile with index tileIndex from the tileset located at position dataIndex
     * @param ctx The rendering context
     * @param tileIndex The value of the tile to render
     * @param dataIndex The index of the tile in the data array
     * @param worldSize The size of the world
     * @param origin The viewport origin in the current layer
     * @param scale The scale of the tilemap
     */
    Tileset.prototype.renderTile = function (ctx, tileIndex, dataIndex, maxCols, origin, scale, zoom) {
        var image = ResourceManager_1["default"].getInstance().getImage(this.imageKey);
        // Get the true index
        var index = tileIndex - this.startIndex;
        var row = Math.floor(index / this.numCols);
        var col = index % this.numCols;
        var width = this.tileSize.x;
        var height = this.tileSize.y;
        // Calculate the position to start a crop in the tileset image
        var left = col * width;
        var top = row * height;
        // Calculate the position in the world to render the tile
        var x = Math.floor((dataIndex % maxCols) * width * scale.x);
        var y = Math.floor(Math.floor(dataIndex / maxCols) * height * scale.y);
        ctx.drawImage(image, left, top, width, height, Math.floor((x - origin.x) * zoom), Math.floor((y - origin.y) * zoom), Math.ceil(width * scale.x * zoom), Math.ceil(height * scale.y * zoom));
    };
    return Tileset;
}());
exports["default"] = Tileset;
},{"../../ResourceManager/ResourceManager":79,"../Vec2":20}],20:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var MathUtils_1 = require("../Utils/MathUtils");
/**
 * A two-dimensional vector (x, y)
 */
var Vec2 = /** @class */ (function () {
    /**
     * Creates a new Vec2
     * @param x The x value of the vector
     * @param y The y value of the vector
     */
    function Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        /**
         * When this vector changes its value, do something
         */
        this.onChange = function () { };
        this.vec = new Float32Array(2);
        this.vec[0] = x;
        this.vec[1] = y;
    }
    Object.defineProperty(Vec2.prototype, "x", {
        // Expose x and y with getters and setters
        get: function () {
            return this.vec[0];
        },
        set: function (x) {
            this.vec[0] = x;
            if (this.onChange) {
                this.onChange();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "y", {
        get: function () {
            return this.vec[1];
        },
        set: function (y) {
            this.vec[1] = y;
            if (this.onChange) {
                this.onChange();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "ZERO", {
        get: function () {
            return new Vec2(0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "INF", {
        get: function () {
            return new Vec2(Infinity, Infinity);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "UP", {
        get: function () {
            return new Vec2(0, -1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "DOWN", {
        get: function () {
            return new Vec2(0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "LEFT", {
        get: function () {
            return new Vec2(-1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "RIGHT", {
        get: function () {
            return new Vec2(1, 0);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The squared magnitude of the vector. This tends to be faster, so use it in situations where taking the
     * square root doesn't matter, like for comparing distances.
     * @returns The squared magnitude of the vector
     */
    Vec2.prototype.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    /**
     * The magnitude of the vector.
     * @returns The magnitude of the vector.
     */
    Vec2.prototype.mag = function () {
        return Math.sqrt(this.magSq());
    };
    /**
     * Divdes x and y by the magnitude to obtain the unit vector in the direction of this vector.
     * @returns This vector as a unit vector.
     */
    Vec2.prototype.normalize = function () {
        if (this.x === 0 && this.y === 0)
            return this;
        var mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        return this;
    };
    /**
     * Works like normalize(), but returns a new Vec2
     * @returns A new vector that is the unit vector for this one
     */
    Vec2.prototype.normalized = function () {
        if (this.isZero()) {
            return this;
        }
        var mag = this.mag();
        return new Vec2(this.x / mag, this.y / mag);
    };
    /**
     * Sets the x and y elements of this vector to zero.
     * @returns This vector, with x and y set to zero.
     */
    Vec2.prototype.zero = function () {
        return this.set(0, 0);
    };
    /**
     * Sets the vector's x and y based on the angle provided. Goes counter clockwise.
     * @param angle The angle in radians
     * @param radius The magnitude of the vector at the specified angle
     * @returns This vector.
     */
    Vec2.prototype.setToAngle = function (angle, radius) {
        if (radius === void 0) { radius = 1; }
        this.x = MathUtils_1["default"].floorToPlace(Math.cos(angle) * radius, 5);
        this.y = MathUtils_1["default"].floorToPlace(-Math.sin(angle) * radius, 5);
        return this;
    };
    /**
     * Returns a vector that point from this vector to another one
     * @param other The vector to point to
     * @returns A new Vec2 that points from this vector to the one provided
     */
    Vec2.prototype.vecTo = function (other) {
        return new Vec2(other.x - this.x, other.y - this.y);
    };
    /**
     * Returns a vector containing the direction from this vector to another
     * @param other The vector to point to
     * @returns A new Vec2 that points from this vector to the one provided. This new Vec2 will be a unit vector.
     */
    Vec2.prototype.dirTo = function (other) {
        return this.vecTo(other).normalize();
    };
    /**
     * Keeps the vector's direction, but sets its magnitude to be the provided magnitude
     * @param magnitude The magnitude the vector should be
     * @returns This vector with its magnitude set to the new magnitude
     */
    Vec2.prototype.scaleTo = function (magnitude) {
        return this.normalize().scale(magnitude);
    };
    /**
     * Scales x and y by the number provided, or if two number are provided, scales them individually.
     * @param factor The scaling factor for the vector, or for only the x-component if yFactor is provided
     * @param yFactor The scaling factor for the y-component of the vector
     * @returns This vector after scaling
     */
    Vec2.prototype.scale = function (factor, yFactor) {
        if (yFactor === void 0) { yFactor = null; }
        if (yFactor !== null) {
            this.x *= factor;
            this.y *= yFactor;
            return this;
        }
        this.x *= factor;
        this.y *= factor;
        return this;
    };
    /**
     * Returns a scaled version of this vector without modifying it.
     * @param factor The scaling factor for the vector, or for only the x-component if yFactor is provided
     * @param yFactor The scaling factor for the y-component of the vector
     * @returns A new vector that has the values of this vector after scaling
     */
    Vec2.prototype.scaled = function (factor, yFactor) {
        if (yFactor === void 0) { yFactor = null; }
        return this.clone().scale(factor, yFactor);
    };
    /**
     * Rotates the vector counter-clockwise by the angle amount specified
     * @param angle The angle to rotate by in radians
     * @returns This vector after rotation.
     */
    Vec2.prototype.rotateCCW = function (angle) {
        var cs = Math.cos(angle);
        var sn = Math.sin(angle);
        var tempX = this.x * cs - this.y * sn;
        var tempY = this.x * sn + this.y * cs;
        this.x = tempX;
        this.y = tempY;
        return this;
    };
    /**
     * Sets the vectors coordinates to be the ones provided
     * @param x The new x value for this vector
     * @param y The new y value for this vector
     * @returns This vector
     */
    Vec2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    /**
     * Copies the values of the other Vec2 into this one.
     * @param other The Vec2 to copy
     * @returns This vector with its values set to the vector provided
     */
    Vec2.prototype.copy = function (other) {
        return this.set(other.x, other.y);
    };
    /**
     * Adds this vector the another vector
     * @param other The Vec2 to add to this one
     * @returns This vector after adding the one provided
     */
    Vec2.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    };
    /**
     * Increments the fields of this vector. Both are incremented with a, if only a is provided.
     * @param a The first number to increment by
     * @param b The second number to increment by
     * @returnss This vector after incrementing
     */
    Vec2.prototype.inc = function (a, b) {
        if (b === undefined) {
            this.x += a;
            this.y += a;
        }
        else {
            this.x += a;
            this.y += b;
        }
        return this;
    };
    /**
     * Subtracts another vector from this vector
     * @param other The Vec2 to subtract from this one
     * @returns This vector after subtracting the one provided
     */
    Vec2.prototype.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };
    /**
     * Multiplies this vector with another vector element-wise. In other words, this.x *= other.x and this.y *= other.y
     * @param other The Vec2 to multiply this one by
     * @returns This vector after multiplying its components by this one
     */
    Vec2.prototype.mult = function (other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    };
    /**
     * Divides this vector with another vector element-wise. In other words, this.x /= other.x and this.y /= other.y
     * @param other The vector to divide this one by
     * @returns This vector after division
     */
    Vec2.prototype.div = function (other) {
        if (other.x === 0 || other.y === 0)
            throw "Divide by zero error";
        this.x /= other.x;
        this.y /= other.y;
        return this;
    };
    /**
     * Does an element wise remainder operation on this vector. this.x %= other.x and this.y %= other.y
     * @param other The other vector
     * @returns this vector
     */
    Vec2.prototype.remainder = function (other) {
        this.x = this.x % other.x;
        this.y = this.y % other.y;
        return this;
    };
    /**
     * Returns the squared distance between this vector and another vector
     * @param other The vector to compute distance squared to
     * @returns The squared distance between this vector and the one provided
     */
    Vec2.prototype.distanceSqTo = function (other) {
        return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y);
    };
    /**
     * Returns the distance between this vector and another vector
     * @param other The vector to compute distance to
     * @returns The distance between this vector and the one provided
     */
    Vec2.prototype.distanceTo = function (other) {
        return Math.sqrt(this.distanceSqTo(other));
    };
    /**
     * Returns the dot product of this vector and another
     * @param other The vector to compute the dot product with
     * @returns The dot product of this vector and the one provided.
     */
    Vec2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    /**
     * Returns the angle counter-clockwise in radians from this vector to another vector
     * @param other The vector to compute the angle to
     * @returns The angle, rotating CCW, from this vector to the other vector
     */
    Vec2.prototype.angleToCCW = function (other) {
        var dot = this.dot(other);
        var det = this.x * other.y - this.y * other.x;
        var angle = -Math.atan2(det, dot);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    };
    /**
     * Returns a string representation of this vector rounded to 1 decimal point
     * @returns This vector as a string
     */
    Vec2.prototype.toString = function () {
        return this.toFixed();
    };
    /**
     * Returns a string representation of this vector rounded to the specified number of decimal points
     * @param numDecimalPoints The number of decimal points to create a string to
     * @returns This vector as a string
     */
    Vec2.prototype.toFixed = function (numDecimalPoints) {
        if (numDecimalPoints === void 0) { numDecimalPoints = 1; }
        return "(" + this.x.toFixed(numDecimalPoints) + ", " + this.y.toFixed(numDecimalPoints) + ")";
    };
    /**
     * Returns a new vector with the same coordinates as this one.
     * @returns A new Vec2 with the same values as this one
     */
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };
    /**
     * Returns true if this vector and other have the EXACT same x and y (not assured to be safe for floats)
     * @param other The vector to check against
     * @returns A boolean representing the equality of the two vectors
     */
    Vec2.prototype.strictEquals = function (other) {
        return this.x === other.x && this.y === other.y;
    };
    /**
     * Returns true if this vector and other have the same x and y
     * @param other The vector to check against
     * @returns A boolean representing the equality of the two vectors
     */
    Vec2.prototype.equals = function (other) {
        var xEq = Math.abs(this.x - other.x) < 0.0000001;
        var yEq = Math.abs(this.y - other.y) < 0.0000001;
        return xEq && yEq;
    };
    /**
     * Returns true if this vector is the zero vector exactly (not assured to be safe for floats).
     * @returns A boolean representing the equality of this vector and the zero vector
     */
    Vec2.prototype.strictIsZero = function () {
        return this.x === 0 && this.y === 0;
    };
    /**
     * Returns true if this x and y for this vector are both zero.
     * @returns A boolean representing the equality of this vector and the zero vector
     */
    Vec2.prototype.isZero = function () {
        return Math.abs(this.x) < 0.0000001 && Math.abs(this.y) < 0.0000001;
    };
    /**
     * Sets the function that is called whenever this vector is changed.
     * @param f The function to be called
     */
    Vec2.prototype.setOnChange = function (f) {
        this.onChange = f;
    };
    Vec2.prototype.toArray = function () {
        return this.vec;
    };
    /**
     * Performs linear interpolation between two vectors
     * @param a The first vector
     * @param b The second vector
     * @param t The time of the lerp, with 0 being vector A, and 1 being vector B
     * @returns A new Vec2 representing the lerp between vector a and b.
     */
    Vec2.lerp = function (a, b, t) {
        return new Vec2(MathUtils_1["default"].lerp(a.x, b.x, t), MathUtils_1["default"].lerp(a.y, b.y, t));
    };
    Vec2.ZERO_STATIC = new Vec2(0, 0);
    return Vec2;
}());
exports["default"] = Vec2;
},{"../Utils/MathUtils":97}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
var Vec2_1 = require("../DataTypes/Vec2");
var Color_1 = require("../Utils/Color");
/**
 * A util class for rendering Debug messages to the canvas.
 */
var Debug = /** @class */ (function () {
    function Debug() {
    }
    /**
     * Add a message to display on the debug screen
     * @param id A unique ID for this message
     * @param messages The messages to print to the debug screen
     */
    Debug.log = function (id) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        // let message = "";
        // for(let i = 0; i < messages.length; i++){
        // 	message += messages[i].toString();
        // }
        // Join all messages with spaces
        var message = messages.map(function (m) { return m.toString(); }).join(" ");
        this.logMessages.add(id, message);
    };
    /**
     * Deletes a a key from the log and stops it from keeping up space on the screen
     * @param id The id of the log item to clear
     */
    Debug.clearLogItem = function (id) {
        this.logMessages["delete"](id);
    };
    /**
     * Sets the list of nodes to render with the debugger
     * @param nodes The new list of nodes
     */
    Debug.setNodes = function (nodes) {
        this.nodes = nodes;
    };
    /**
     * Draws a box at the specified position
     * @param center The center of the box
     * @param halfSize The dimensions of the box
     * @param filled A boolean for whether or not the box is filled
     * @param color The color of the box to draw
     */
    Debug.drawBox = function (center, halfSize, filled, color) {
        var alpha = this.debugRenderingContext.globalAlpha;
        this.debugRenderingContext.globalAlpha = color.a;
        if (filled) {
            this.debugRenderingContext.fillStyle = color.toString();
            this.debugRenderingContext.fillRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x * 2, halfSize.y * 2);
        }
        else {
            var lineWidth = 2;
            this.debugRenderingContext.lineWidth = lineWidth;
            this.debugRenderingContext.strokeStyle = color.toString();
            this.debugRenderingContext.strokeRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x * 2, halfSize.y * 2);
        }
        this.debugRenderingContext.globalAlpha = alpha;
    };
    /**
     * Draws a circle at the specified position
     * @param center The center of the circle
     * @param radius The dimensions of the box
     * @param filled A boolean for whether or not the circle is filled
     * @param color The color of the circle
     */
    Debug.drawCircle = function (center, radius, filled, color) {
        var alpha = this.debugRenderingContext.globalAlpha;
        this.debugRenderingContext.globalAlpha = color.a;
        if (filled) {
            this.debugRenderingContext.fillStyle = color.toString();
            this.debugRenderingContext.beginPath();
            this.debugRenderingContext.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            this.debugRenderingContext.closePath();
            this.debugRenderingContext.fill();
        }
        else {
            var lineWidth = 2;
            this.debugRenderingContext.lineWidth = lineWidth;
            this.debugRenderingContext.strokeStyle = color.toString();
            this.debugRenderingContext.beginPath();
            this.debugRenderingContext.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            this.debugRenderingContext.closePath();
            this.debugRenderingContext.stroke();
        }
        this.debugRenderingContext.globalAlpha = alpha;
    };
    /**
     * Draws a ray at the specified position
     * @param from The starting position of the ray
     * @param to The ending position of the ray
     * @param color The color of the ray
     */
    Debug.drawRay = function (from, to, color) {
        this.debugRenderingContext.lineWidth = 2;
        this.debugRenderingContext.strokeStyle = color.toString();
        this.debugRenderingContext.beginPath();
        this.debugRenderingContext.moveTo(from.x, from.y);
        this.debugRenderingContext.lineTo(to.x, to.y);
        this.debugRenderingContext.closePath();
        this.debugRenderingContext.stroke();
    };
    /**
     * Draws a point at the specified position
     * @param pos The position of the point
     * @param color The color of the point
     */
    Debug.drawPoint = function (pos, color) {
        var pointSize = 6;
        this.debugRenderingContext.fillStyle = color.toString();
        this.debugRenderingContext.fillRect(pos.x - pointSize / 2, pos.y - pointSize / 2, pointSize, pointSize);
    };
    /**
     * Sets the default rendering color for text for the debugger
     * @param color The color to render the text
     */
    Debug.setDefaultTextColor = function (color) {
        this.defaultTextColor = color;
    };
    /**
     * Performs any necessary setup operations on the Debug canvas
     * @param canvas The debug canvas
     * @param width The desired width of the canvas
     * @param height The desired height of the canvas
     * @returns The rendering context extracted from the canvas
     */
    Debug.initializeDebugCanvas = function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.debugCanvasSize = new Vec2_1["default"](width, height);
        this.debugRenderingContext = canvas.getContext("2d");
        return this.debugRenderingContext;
    };
    /** Clears the debug canvas */
    Debug.clearCanvas = function () {
        this.debugRenderingContext.clearRect(0, 0, this.debugCanvasSize.x, this.debugCanvasSize.y);
    };
    /** Renders the text and nodes sent to the Debug system */
    Debug.render = function () {
        this.renderText();
        this.renderNodes();
    };
    /** Renders the text sent to the Debug canvas */
    Debug.renderText = function () {
        var _this = this;
        var y = 20;
        this.debugRenderingContext.font = "20px Arial";
        this.debugRenderingContext.fillStyle = this.defaultTextColor.toString();
        // Draw all of the text
        this.logMessages.forEach(function (key) {
            _this.debugRenderingContext.fillText(_this.logMessages.get(key), 10, y);
            y += 30;
        });
    };
    /** Renders the nodes registered with the debug canvas */
    Debug.renderNodes = function () {
        if (this.nodes) {
            this.nodes.forEach(function (node) {
                node.debugRender();
            });
        }
    };
    /** A map of log messages to display on the screen */
    Debug.logMessages = new Map_1["default"]();
    /** The rendering color for text */
    Debug.defaultTextColor = Color_1["default"].WHITE;
    return Debug;
}());
exports["default"] = Debug;
},{"../DataTypes/Map":8,"../DataTypes/Vec2":20,"../Utils/Color":94}],22:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Color_1 = require("../Utils/Color");
// @ignorePage
var Stats = /** @class */ (function (_super) {
    __extends(Stats, _super);
    function Stats() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stats.initStats = function () {
        var canvas = document.getElementById("stats-canvas");
        canvas.width = this.CANVAS_WIDTH;
        canvas.height = this.CANVAS_HEIGHT;
        this.ctx = canvas.getContext("2d");
        this.statsDiv = document.getElementById("stats-display");
        this.prevfps = new Array();
        this.prevClearTimes = new Array();
        this.SGClearTimes = new Array();
        this.avgSGClearTime = 0;
        this.prevFillTimes = new Array();
        this.SGFillTimes = new Array();
        this.avgSGFillTime = 0;
        this.prevUpdateTimes = new Array();
        this.SGUpdateTimes = new Array();
        this.avgSGUpdateTime = 0;
        this.prevQueryTimes = new Array();
        this.SGQueryTimes = new Array();
        this.avgSGQueryTime = 0;
        var clearTime = document.createElement("span");
        clearTime.setAttribute("id", "sgclear");
        var fillTime = document.createElement("span");
        fillTime.setAttribute("id", "sgfill");
        var updateTime = document.createElement("span");
        updateTime.setAttribute("id", "sgupdate");
        var queryTime = document.createElement("span");
        queryTime.setAttribute("id", "sgquery");
        var br1 = document.createElement("br");
        var br2 = document.createElement("br");
        var br3 = document.createElement("br");
        this.statsDiv.append(clearTime, br1, fillTime, br2, updateTime, br3, queryTime);
        this.graphChoices = document.getElementById("chart-option");
        var option1 = document.createElement("option");
        option1.value = "prevfps";
        option1.label = "FPS";
        var option2 = document.createElement("option");
        option2.value = "prevClearTimes";
        option2.label = "Clear Time";
        var option3 = document.createElement("option");
        option3.value = "prevFillTimes";
        option3.label = "Fill time";
        var option4 = document.createElement("option");
        option4.value = "prevUpdateTimes";
        option4.label = "Update time";
        var option5 = document.createElement("option");
        option5.value = "prevQueryTimes";
        option5.label = "Query Time";
        var optionAll = document.createElement("option");
        optionAll.value = "all";
        optionAll.label = "All";
        this.graphChoices.append(option1, option2, option3, option4, option5, optionAll);
    };
    Stats.updateFPS = function (fps) {
        this.prevfps.push(fps);
        if (this.prevfps.length > Stats.NUM_POINTS) {
            this.prevfps.shift();
        }
        if (this.SGClearTimes.length > 0) {
            this.prevClearTimes.push(this.avgSGClearTime);
            if (this.prevClearTimes.length > this.NUM_POINTS) {
                this.prevClearTimes.shift();
            }
        }
        if (this.SGFillTimes.length > 0) {
            this.prevFillTimes.push(this.avgSGFillTime);
            if (this.prevFillTimes.length > this.NUM_POINTS) {
                this.prevFillTimes.shift();
            }
        }
        if (this.SGUpdateTimes.length > 0) {
            this.prevUpdateTimes.push(this.avgSGUpdateTime);
            if (this.prevUpdateTimes.length > this.NUM_POINTS) {
                this.prevUpdateTimes.shift();
            }
        }
        if (this.SGQueryTimes.length > 0) {
            this.prevQueryTimes.push(this.avgSGQueryTime);
            if (this.prevQueryTimes.length > this.NUM_POINTS) {
                this.prevQueryTimes.shift();
            }
        }
        this.updateSGStats();
    };
    Stats.log = function (key, data) {
        if (key === "sgclear") {
            this.SGClearTimes.push(data);
            if (this.SGClearTimes.length > 100) {
                this.SGClearTimes.shift();
            }
        }
        else if (key === "sgfill") {
            this.SGFillTimes.push(data);
            if (this.SGFillTimes.length > 100) {
                this.SGFillTimes.shift();
            }
        }
        else if (key === "sgupdate") {
            this.SGUpdateTimes.push(data);
            if (this.SGUpdateTimes.length > 100) {
                this.SGUpdateTimes.shift();
            }
        }
        else if (key === "sgquery") {
            this.SGQueryTimes.push(data);
            if (this.SGQueryTimes.length > 1000) {
                this.SGQueryTimes.shift();
            }
        }
    };
    Stats.render = function () {
        // Display stats
        this.drawCharts();
    };
    Stats.drawCharts = function () {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        var paramString = this.graphChoices.value;
        if (paramString === "prevfps" || paramString === "all") {
            var param = this.prevfps;
            var color = Color_1["default"].BLUE.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevClearTimes" || paramString === "all") {
            var param = this.prevClearTimes;
            var color = Color_1["default"].RED.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevFillTimes" || paramString === "all") {
            var param = this.prevFillTimes;
            var color = Color_1["default"].GREEN.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevUpdateTimes" || paramString === "all") {
            var param = this.prevUpdateTimes;
            var color = Color_1["default"].CYAN.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevQueryTimes" || paramString === "all") {
            var param = this.prevQueryTimes;
            var color = Color_1["default"].ORANGE.toString();
            this.drawChart(param, color);
        }
    };
    Stats.drawChart = function (param, color) {
        this.ctx.strokeStyle = Color_1["default"].BLACK.toString();
        this.ctx.beginPath();
        this.ctx.moveTo(10, 10);
        this.ctx.lineTo(10, this.CANVAS_HEIGHT - 10);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(10, this.CANVAS_HEIGHT - 10);
        this.ctx.lineTo(this.CANVAS_WIDTH - 10, this.CANVAS_HEIGHT - 10);
        this.ctx.closePath();
        this.ctx.stroke();
        var max = Math.max.apply(Math, param);
        var prevX = 10;
        var prevY = this.CANVAS_HEIGHT - 10 - param[0] / max * (this.CANVAS_HEIGHT - 20);
        this.ctx.strokeStyle = color;
        for (var i = 1; i < param.length; i++) {
            var fps = param[i];
            var x = 10 + i * (this.CANVAS_WIDTH - 20) / this.NUM_POINTS;
            var y = this.CANVAS_HEIGHT - 10 - fps / max * (this.CANVAS_HEIGHT - 20);
            this.ctx.beginPath();
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            this.ctx.stroke();
            prevX = x;
            prevY = y;
        }
    };
    Stats.updateSGStats = function () {
        if (this.SGClearTimes.length > 0) {
            this.avgSGClearTime = this.SGClearTimes.reduce(function (acc, val) { return acc + val; }) / this.SGClearTimes.length;
        }
        if (this.SGFillTimes.length > 0) {
            this.avgSGFillTime = this.SGFillTimes.reduce(function (acc, val) { return acc + val; }) / this.SGFillTimes.length;
        }
        if (this.SGUpdateTimes.length > 0) {
            this.avgSGUpdateTime = this.SGUpdateTimes.reduce(function (acc, val) { return acc + val; }) / this.SGUpdateTimes.length;
        }
        if (this.SGQueryTimes.length > 0) {
            this.avgSGQueryTime = this.SGQueryTimes.reduce(function (acc, val) { return acc + val; }) / this.SGQueryTimes.length;
        }
        document.getElementById("sgclear").innerHTML = "Avg SG clear time: " + this.avgSGClearTime;
        document.getElementById("sgfill").innerHTML = "Avg SG fill time: " + this.avgSGFillTime;
        document.getElementById("sgupdate").innerHTML = "Avg SG update time: " + this.avgSGUpdateTime;
        document.getElementById("sgquery").innerHTML = "Avg SG query time: " + this.avgSGQueryTime;
    };
    Stats.NUM_POINTS = 60;
    Stats.CANVAS_WIDTH = 300;
    Stats.CANVAS_HEIGHT = 300;
    return Stats;
}(Object));
exports["default"] = Stats;
},{"../Utils/Color":94}],23:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var EventQueue_1 = require("./EventQueue");
var GameEvent_1 = require("./GameEvent");
/**
 * An event emitter object other systems can use to hook into the EventQueue.
 * Provides an easy interface for firing off events.
 */
var Emitter = /** @class */ (function () {
    /** Creates a new Emitter */
    function Emitter() {
        this.eventQueue = EventQueue_1["default"].getInstance();
    }
    /**
     * Emit and event of type eventType with the data packet data
     * @param eventType The name of the event to fire off
     * @param data A @reference[Map] or record containing any data about the event
     */
    Emitter.prototype.fireEvent = function (eventType, data) {
        if (data === void 0) { data = null; }
        this.eventQueue.addEvent(new GameEvent_1["default"](eventType, data));
    };
    return Emitter;
}());
exports["default"] = Emitter;
},{"./EventQueue":24,"./GameEvent":25}],24:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Queue_1 = require("../DataTypes/Queue");
var Map_1 = require("../DataTypes/Map");
var GameEventType_1 = require("./GameEventType");
/**
 * The main event system of the game engine.
 * Events are sent to the EventQueue, which handles distribution to any systems that are listening for those events.
 * This allows for handling of input without having classes directly hook into javascript event handles,
 * and allows otherwise separate classes to communicate with each other cleanly, such as a Player object
 * requesting a sound be played by the audio system.
 *
 * The distribution of @reference[GameEvent]s happens as follows:
 *
 * Events are recieved throughout a frame and are queued up by the EventQueue.
 * At the beginning of the next frame, events are sent out to any receivers that are hooked into the event type.
 * @reference[Receiver]s are then free to process events as they see fit.
 *
 * Overall, the EventQueue can be considered as something similar to an email server,
 * and the @reference[Receiver]s can be considered as the client inboxes.
 *
 * See @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/event-queue.html) for more discussion on EventQueues
 */
var EventQueue = /** @class */ (function () {
    function EventQueue() {
        this.MAX_SIZE = 100;
        this.q = new Queue_1["default"](this.MAX_SIZE);
        this.receivers = new Map_1["default"]();
    }
    /** Retrieves the instance of the Singleton EventQueue */
    EventQueue.getInstance = function () {
        if (this.instance === null) {
            this.instance = new EventQueue();
        }
        return this.instance;
    };
    /** Adds an event to the EventQueue.
     * This is exposed to the rest of the game engine through the @reference[Emitter] class */
    EventQueue.prototype.addEvent = function (event) {
        this.q.enqueue(event);
    };
    /**
     * Associates a receiver with a type of event. Every time this event appears in the future,
     * it will be given to the receiver (and any others watching that type).
     * This is exposed to the rest of the game engine through the @reference[Receiver] class
     * @param receiver The event receiver
     * @param type The type or types of events to subscribe to
     */
    EventQueue.prototype.subscribe = function (receiver, type) {
        if (type instanceof Array) {
            // If it is an array, subscribe to all event types
            for (var _i = 0, type_1 = type; _i < type_1.length; _i++) {
                var t = type_1[_i];
                this.addListener(receiver, t);
            }
        }
        else {
            this.addListener(receiver, type);
        }
    };
    /**
     * Unsubscribes the specified receiver from all events, or from whatever events are provided
     * @param receiver The receiver to unsubscribe
     * @param keys The events to unsubscribe from. If none are provided, unsubscribe from all
     */
    EventQueue.prototype.unsubscribe = function (receiver) {
        var _this = this;
        var events = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            events[_i - 1] = arguments[_i];
        }
        this.receivers.forEach(function (eventName) {
            // If keys were provided, only continue if this key is one of them
            if (events.length > 0 && events.indexOf(eventName) === -1)
                return;
            // Find the index of our receiver for this key
            var index = _this.receivers.get(eventName).indexOf(receiver);
            // If an index was found, remove the receiver
            if (index !== -1) {
                _this.receivers.get(eventName).splice(index, 1);
            }
        });
    };
    // Associate the receiver and the type
    EventQueue.prototype.addListener = function (receiver, type) {
        if (this.receivers.has(type)) {
            this.receivers.get(type).push(receiver);
        }
        else {
            this.receivers.add(type, [receiver]);
        }
    };
    EventQueue.prototype.update = function (deltaT) {
        while (this.q.hasItems()) {
            // Retrieve each event
            var event_1 = this.q.dequeue();
            // If a receiver has this event type, send it the event
            if (this.receivers.has(event_1.type)) {
                for (var _i = 0, _a = this.receivers.get(event_1.type); _i < _a.length; _i++) {
                    var receiver = _a[_i];
                    receiver.receive(event_1);
                }
            }
            // If a receiver is subscribed to all events, send it the event
            if (this.receivers.has(GameEventType_1.GameEventType.ALL)) {
                for (var _b = 0, _c = this.receivers.get(GameEventType_1.GameEventType.ALL); _b < _c.length; _b++) {
                    var receiver = _c[_b];
                    receiver.receive(event_1);
                }
            }
        }
    };
    EventQueue.instance = null;
    return EventQueue;
}());
exports["default"] = EventQueue;
},{"../DataTypes/Map":8,"../DataTypes/Queue":12,"./GameEventType":26}],25:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
/**
 * A representation of an in-game event that is passed through the @reference[EventQueue]
 */
var GameEvent = /** @class */ (function () {
    /**
     * Creates a new GameEvent.
     * This is handled implicitly through the @reference[Emitter] class
     * @param type The type of the GameEvent
     * @param data The data contained by the GameEvent
     */
    function GameEvent(type, data) {
        if (data === void 0) { data = null; }
        // Parse the game event data
        if (data === null) {
            this.data = new Map_1["default"]();
        }
        else if (!(data instanceof Map_1["default"])) {
            // data is a raw object, unpack
            this.data = new Map_1["default"]();
            for (var key in data) {
                this.data.add(key, data[key]);
            }
        }
        else {
            this.data = data;
        }
        this.type = type;
        this.time = Date.now();
    }
    /**
     * Checks the type of the GameEvent
     * @param type The type to check
     * @returns True if the GameEvent is the specified type, false otherwise.
     */
    GameEvent.prototype.isType = function (type) {
        return this.type === type;
    };
    /**
     * Returns this GameEvent as a string
     * @returns The string representation of the GameEvent
     */
    GameEvent.prototype.toString = function () {
        return this.type + ": @" + this.time;
    };
    return GameEvent;
}());
exports["default"] = GameEvent;
},{"../DataTypes/Map":8}],26:[function(require,module,exports){
"use strict";
// @ignorePage
exports.__esModule = true;
exports.GameEventType = void 0;
var GameEventType;
(function (GameEventType) {
    /**
     * Mouse Down event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_DOWN"] = "mouse_down";
    /**
     * Mouse Up event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_UP"] = "mouse_up";
    /**
     * Mouse Move event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_MOVE"] = "mouse_move";
    /**
     * Key Down event. Has data: {key: string - The key that is down}
     */
    GameEventType["KEY_DOWN"] = "key_down";
    /**
     * Key Up event. Has data: {key: string - The key that is up}
     */
    GameEventType["KEY_UP"] = "key_up";
    /**
     * Canvas Blur event. Has data: {}
     */
    GameEventType["CANVAS_BLUR"] = "canvas_blur";
    /**
     * Mouse wheel up event. Has data: {}
     */
    GameEventType["WHEEL_UP"] = "wheel_up";
    /**
     * Mouse wheel down event. Has data: {}
     */
    GameEventType["WHEEL_DOWN"] = "wheel_down";
    /**
     * Start Recording event. Has data: {}
     */
    GameEventType["START_RECORDING"] = "start_recording";
    /**
     * Stop Recording event. Has data: {}
     */
    GameEventType["STOP_RECORDING"] = "stop_recording";
    /**
     * Play Recording event. Has data: {}
     */
    GameEventType["PLAY_RECORDING"] = "play_recording";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
     */
    GameEventType["PLAY_SOUND"] = "play_sound";
    /**
     * Play Sound event. Has data: {key: string}
     */
    GameEventType["STOP_SOUND"] = "stop_sound";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean, channel: AudioChannelType }
     */
    GameEventType["PLAY_SFX"] = "play_sfx";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
     */
    GameEventType["PLAY_MUSIC"] = "play_music";
    /**
     * Mute audio channel event. Has data: {channel: AudioChannelType}
     */
    GameEventType["MUTE_CHANNEL"] = "mute_channel";
    /**
     * Unmute audio channel event. Has data: {channel: AudioChannelType}
     */
    GameEventType["UNMUTE_CHANNEL"] = "unmute_channel";
    /**
     * Encompasses all event types. Used for receivers only.
     */
    GameEventType["ALL"] = "all";
})(GameEventType = exports.GameEventType || (exports.GameEventType = {}));
},{}],27:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Queue_1 = require("../DataTypes/Queue");
var EventQueue_1 = require("./EventQueue");
/**
 * Receives subscribed events from the EventQueue.
 */
var Receiver = /** @class */ (function () {
    /** Creates a new Receiver */
    function Receiver() {
        this.MAX_SIZE = 100;
        this.q = new Queue_1["default"](this.MAX_SIZE);
    }
    Receiver.prototype.destroy = function () {
        EventQueue_1["default"].getInstance().unsubscribe(this);
    };
    /**
     * Adds these types of events to this receiver's queue every update.
     * @param eventTypes The types of events this receiver will be subscribed to
     */
    Receiver.prototype.subscribe = function (eventTypes) {
        EventQueue_1["default"].getInstance().subscribe(this, eventTypes);
        this.q.clear();
    };
    /**
     * Adds an event to the queue of this reciever. This is used by the @reference[EventQueue] to distribute events
     * @param event The event to receive
     */
    Receiver.prototype.receive = function (event) {
        try {
            this.q.enqueue(event);
        }
        catch (e) {
            console.warn("Receiver overflow for event " + event.toString());
            throw e;
        }
    };
    /**
     * Retrieves the next event from the receiver's queue
     * @returns The next GameEvent
     */
    Receiver.prototype.getNextEvent = function () {
        return this.q.dequeue();
    };
    /**
     * Looks at the next event in the receiver's queue, but doesn't remove it from the queue
     * @returns The next GameEvent
     */
    Receiver.prototype.peekNextEvent = function () {
        return this.q.peekNext();
    };
    /**
     * Returns true if the receiver has any events in its queue
     * @returns True if the receiver has another event, false otherwise
     */
    Receiver.prototype.hasNextEvent = function () {
        return this.q.hasItems();
    };
    /**
     * Ignore all events this frame
     */
    Receiver.prototype.ignoreEvents = function () {
        this.q.clear();
    };
    return Receiver;
}());
exports["default"] = Receiver;
},{"../DataTypes/Queue":12,"./EventQueue":24}],28:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Receiver_1 = require("../Events/Receiver");
var Map_1 = require("../DataTypes/Map");
var Vec2_1 = require("../DataTypes/Vec2");
var EventQueue_1 = require("../Events/EventQueue");
var GameEventType_1 = require("../Events/GameEventType");
/**
 * Receives input events from the @reference[EventQueue] and allows for easy access of information about input by other systems
 */
var Input = /** @class */ (function () {
    function Input() {
    }
    /**
     * Initializes the Input object
     * @param viewport A reference to the viewport of the game
     */
    Input.initialize = function (viewport, keyMap) {
        Input.viewport = viewport;
        Input.mousePressed = false;
        Input.mouseJustPressed = false;
        Input.receiver = new Receiver_1["default"]();
        Input.keyJustPressed = new Map_1["default"]();
        Input.keyPressed = new Map_1["default"]();
        Input.mousePosition = new Vec2_1["default"](0, 0);
        Input.mousePressPosition = new Vec2_1["default"](0, 0);
        Input.scrollDirection = 0;
        Input.justScrolled = false;
        Input.keysDisabled = false;
        Input.mouseDisabled = false;
        // Initialize the keymap
        Input.keyMap = new Map_1["default"]();
        // Add all keys to the keymap
        for (var entry in keyMap) {
            var name_1 = keyMap[entry].name;
            var keys = keyMap[entry].keys;
            Input.keyMap.add(name_1, keys);
        }
        Input.eventQueue = EventQueue_1["default"].getInstance();
        // Subscribe to all input events
        Input.eventQueue.subscribe(Input.receiver, [GameEventType_1.GameEventType.MOUSE_DOWN, GameEventType_1.GameEventType.MOUSE_UP, GameEventType_1.GameEventType.MOUSE_MOVE,
            GameEventType_1.GameEventType.KEY_DOWN, GameEventType_1.GameEventType.KEY_UP, GameEventType_1.GameEventType.CANVAS_BLUR, GameEventType_1.GameEventType.WHEEL_UP, GameEventType_1.GameEventType.WHEEL_DOWN]);
    };
    Input.update = function (deltaT) {
        // Reset the justPressed values to false
        Input.mouseJustPressed = false;
        Input.keyJustPressed.forEach(function (key) { return Input.keyJustPressed.set(key, false); });
        Input.justScrolled = false;
        Input.scrollDirection = 0;
        while (Input.receiver.hasNextEvent()) {
            var event_1 = Input.receiver.getNextEvent();
            // Handle each event type
            if (event_1.type === GameEventType_1.GameEventType.MOUSE_DOWN) {
                Input.mouseJustPressed = true;
                Input.mousePressed = true;
                Input.mousePressPosition = event_1.data.get("position");
                Input.mouseButtonPressed = event_1.data.get("button");
            }
            if (event_1.type === GameEventType_1.GameEventType.MOUSE_UP) {
                Input.mousePressed = false;
            }
            if (event_1.type === GameEventType_1.GameEventType.MOUSE_MOVE) {
                Input.mousePosition = event_1.data.get("position");
            }
            if (event_1.type === GameEventType_1.GameEventType.KEY_DOWN) {
                var key = event_1.data.get("key");
                // Handle space bar
                if (key === " ") {
                    key = "space";
                }
                if (!Input.keyPressed.get(key)) {
                    Input.keyJustPressed.set(key, true);
                    Input.keyPressed.set(key, true);
                }
            }
            if (event_1.type === GameEventType_1.GameEventType.KEY_UP) {
                var key = event_1.data.get("key");
                // Handle space bar
                if (key === " ") {
                    key = "space";
                }
                Input.keyPressed.set(key, false);
            }
            if (event_1.type === GameEventType_1.GameEventType.CANVAS_BLUR) {
                Input.clearKeyPresses();
            }
            if (event_1.type === GameEventType_1.GameEventType.WHEEL_UP) {
                Input.scrollDirection = -1;
                Input.justScrolled = true;
            }
            else if (event_1.type === GameEventType_1.GameEventType.WHEEL_DOWN) {
                Input.scrollDirection = 1;
                Input.justScrolled = true;
            }
        }
    };
    Input.clearKeyPresses = function () {
        Input.keyJustPressed.forEach(function (key) { return Input.keyJustPressed.set(key, false); });
        Input.keyPressed.forEach(function (key) { return Input.keyPressed.set(key, false); });
    };
    /**
     * Returns whether or not a key was newly pressed Input frame.
     * If the key is still pressed from last frame and wasn't re-pressed, Input will return false.
     * @param key The key
     * @returns True if the key was just pressed, false otherwise
     */
    Input.isKeyJustPressed = function (key) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyJustPressed.has(key)) {
            return Input.keyJustPressed.get(key);
        }
        else {
            return false;
        }
    };
    /**
     * Returns an array of all of the keys that are newly pressed Input frame.
     * If a key is still pressed from last frame and wasn't re-pressed, it will not be in Input list.
     * @returns An array of all of the newly pressed keys.
     */
    Input.getKeysJustPressed = function () {
        if (Input.keysDisabled)
            return [];
        var keys = Array();
        Input.keyJustPressed.forEach(function (key) {
            if (Input.keyJustPressed.get(key)) {
                keys.push(key);
            }
        });
        return keys;
    };
    /**
     * Returns whether or not a key is being pressed.
     * @param key The key
     * @returns True if the key is currently pressed, false otherwise
     */
    Input.isKeyPressed = function (key) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyPressed.has(key)) {
            return Input.keyPressed.get(key);
        }
        else {
            return false;
        }
    };
    /**
     * Changes the binding of an input name to keys
     * @param inputName The name of the input
     * @param keys The corresponding keys
     */
    Input.changeKeyBinding = function (inputName, keys) {
        Input.keyMap.set(inputName, keys);
    };
    /**
     * Clears all key bindings
     */
    Input.clearAllKeyBindings = function () {
        Input.keyMap.clear();
    };
    /**
     * Returns whether or not an input was just pressed this frame
     * @param inputName The name of the input
     * @returns True if the input was just pressed, false otherwise
     */
    Input.isJustPressed = function (inputName) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyMap.has(inputName)) {
            var keys = Input.keyMap.get(inputName);
            var justPressed = false;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                justPressed = justPressed || Input.isKeyJustPressed(key);
            }
            return justPressed;
        }
        else {
            return false;
        }
    };
    /**
     * Returns whether or not an input is currently pressed
     * @param inputName The name of the input
     * @returns True if the input is pressed, false otherwise
     */
    Input.isPressed = function (inputName) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyMap.has(inputName)) {
            var keys = Input.keyMap.get(inputName);
            var pressed = false;
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                pressed = pressed || Input.isKeyPressed(key);
            }
            return pressed;
        }
        else {
            return false;
        }
    };
    /**
     *
     * Returns whether or not the mouse was newly pressed Input frame.
     * @param mouseButton Optionally specify which mouse click you want to know was pressed.
     * 0 for left click, 1 for middle click, 2 for right click.
     * @returns True if the mouse was just pressed, false otherwise
     */
    Input.isMouseJustPressed = function (mouseButton) {
        if (mouseButton) {
            return Input.mouseJustPressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
        }
        return Input.mouseJustPressed && !Input.mouseDisabled;
    };
    /**
     * Returns whether or not the mouse is currently pressed
     * @param mouseButton Optionally specify which mouse click you want to know was pressed.
     * 0 for left click, 1 for middle click, 2 for right click.
     * @returns True if the mouse is currently pressed, false otherwise
     */
    Input.isMousePressed = function (mouseButton) {
        if (mouseButton) {
            return Input.mousePressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
        }
        return Input.mousePressed && !Input.mouseDisabled;
    };
    /**
     * Returns whether the user scrolled or not
     * @returns True if the user just scrolled Input frame, false otherwise
     */
    Input.didJustScroll = function () {
        return Input.justScrolled && !Input.mouseDisabled;
    };
    /**
     * Gets the direction of the scroll
     * @returns -1 if the user scrolled up, 1 if they scrolled down
     */
    Input.getScrollDirection = function () {
        return Input.scrollDirection;
    };
    /**
     * Gets the position of the player's mouse
     * @returns The mouse position stored as a Vec2
     */
    Input.getMousePosition = function () {
        return Input.mousePosition.scaled(1 / this.viewport.getZoomLevel());
    };
    /**
     * Gets the position of the player's mouse in the game world,
     * taking into consideration the scrolling of the viewport
     * @returns The mouse position stored as a Vec2
     */
    Input.getGlobalMousePosition = function () {
        return Input.mousePosition.clone().scale(1 / this.viewport.getZoomLevel()).add(Input.viewport.getOrigin());
    };
    /**
     * Gets the position of the last mouse press
     * @returns The mouse position stored as a Vec2
     */
    Input.getMousePressPosition = function () {
        return Input.mousePressPosition;
    };
    /**
     * Gets the position of the last mouse press in the game world,
     * taking into consideration the scrolling of the viewport
     * @returns The mouse position stored as a Vec2
     */
    Input.getGlobalMousePressPosition = function () {
        return Input.mousePressPosition.clone().add(Input.viewport.getOrigin());
    };
    /**
     * Disables all keypress and mouse click inputs
     */
    Input.disableInput = function () {
        Input.keysDisabled = true;
        Input.mouseDisabled = true;
    };
    /**
     * Enables all keypress and mouse click inputs
     */
    Input.enableInput = function () {
        Input.keysDisabled = false;
        Input.mouseDisabled = false;
    };
    return Input;
}());
exports["default"] = Input;
},{"../DataTypes/Map":8,"../DataTypes/Vec2":20,"../Events/EventQueue":24,"../Events/GameEventType":26,"../Events/Receiver":27}],29:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var EventQueue_1 = require("../Events/EventQueue");
var Vec2_1 = require("../DataTypes/Vec2");
var GameEvent_1 = require("../Events/GameEvent");
var GameEventType_1 = require("../Events/GameEventType");
/**
 * Handles communication with the web browser to receive asynchronous events and send them to the @reference[EventQueue]
 */
var InputHandler = /** @class */ (function () {
    /**
     * Creates a new InputHandler
     * @param canvas The game canvas
     */
    function InputHandler(canvas) {
        var _this = this;
        this.handleMouseDown = function (event, canvas) {
            var pos = _this.getMousePosition(event, canvas);
            var button = event.button;
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.MOUSE_DOWN, { position: pos, button: button });
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleMouseUp = function (event, canvas) {
            var pos = _this.getMousePosition(event, canvas);
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.MOUSE_UP, { position: pos });
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleMouseMove = function (event, canvas) {
            var pos = _this.getMousePosition(event, canvas);
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.MOUSE_MOVE, { position: pos });
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleKeyDown = function (event) {
            var key = _this.getKey(event);
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.KEY_DOWN, { key: key });
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleKeyUp = function (event) {
            var key = _this.getKey(event);
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.KEY_UP, { key: key });
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleBlur = function (event) {
            var gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.CANVAS_BLUR, {});
            _this.eventQueue.addEvent(gameEvent);
        };
        this.handleContextMenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        this.handleWheel = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var gameEvent;
            if (event.deltaY < 0) {
                gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.WHEEL_UP, {});
            }
            else {
                gameEvent = new GameEvent_1["default"](GameEventType_1.GameEventType.WHEEL_DOWN, {});
            }
            _this.eventQueue.addEvent(gameEvent);
        };
        this.eventQueue = EventQueue_1["default"].getInstance();
        canvas.onmousedown = function (event) { return _this.handleMouseDown(event, canvas); };
        canvas.onmouseup = function (event) { return _this.handleMouseUp(event, canvas); };
        canvas.oncontextmenu = this.handleContextMenu;
        canvas.onmousemove = function (event) { return _this.handleMouseMove(event, canvas); };
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        document.onblur = this.handleBlur;
        document.oncontextmenu = this.handleBlur;
        document.onwheel = this.handleWheel;
    }
    InputHandler.prototype.getKey = function (keyEvent) {
        return keyEvent.key.toLowerCase();
    };
    InputHandler.prototype.getMousePosition = function (mouseEvent, canvas) {
        var rect = canvas.getBoundingClientRect();
        var x = mouseEvent.clientX - rect.left;
        var y = mouseEvent.clientY - rect.top;
        return new Vec2_1["default"](x, y);
    };
    return InputHandler;
}());
exports["default"] = InputHandler;
},{"../DataTypes/Vec2":20,"../Events/EventQueue":24,"../Events/GameEvent":25,"../Events/GameEventType":26}],30:[function(require,module,exports){
"use strict";
exports.__esModule = true;
// @ignorePage
/**
 * Sets up the environment of the game engine
 */
var EnvironmentInitializer = /** @class */ (function () {
    function EnvironmentInitializer() {
    }
    EnvironmentInitializer.setup = function () {
        CanvasRenderingContext2D.prototype.roundedRect = function (x, y, w, h, r) {
            // Clamp the radius between 0 and the min of the width or height
            if (r < 0)
                r = 0;
            if (r > Math.min(w, h))
                r = Math.min(w, h);
            // Draw the rounded rect
            this.beginPath();
            // Top
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.arcTo(x + w, y, x + w, y + r, r);
            // Right
            this.lineTo(x + w, y + h - r);
            this.arcTo(x + w, y + h, x + w - r, y + h, r);
            // Bottom
            this.lineTo(x + r, y + h);
            this.arcTo(x, y + h, x, y + h - r, r);
            // Left
            this.lineTo(x, y + r);
            this.arcTo(x, y, x + r, y, r);
            this.closePath();
        };
        CanvasRenderingContext2D.prototype.strokeRoundedRect = function (x, y, w, h, r) {
            this.roundedRect(x, y, w, h, r);
            this.stroke();
        };
        CanvasRenderingContext2D.prototype.fillRoundedRect = function (x, y, w, h, r) {
            this.roundedRect(x, y, w, h, r);
            this.fill();
        };
    };
    return EnvironmentInitializer;
}());
exports["default"] = EnvironmentInitializer;
},{}],31:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GameLoop_1 = require("./GameLoop");
var Debug_1 = require("../Debug/Debug");
var Stats_1 = require("../Debug/Stats");
/**
 * A game loop with a fixed update time and a variable render time.
 * Every frame, the game updates until all time since the last frame has been processed.
 * If too much time has passed, such as if the last update was too slow,
 * or if the browser was put into the background, the loop will panic and discard time.
 * A render happens at the end of every frame. This happens as fast as possible unless specified.
 * A loop of this type allows for deterministic behavior - No matter what the frame rate is, the update should behave the same,
 * as it is occuring in a fixed interval.
 */
var FixedUpdateGameLoop = /** @class */ (function (_super) {
    __extends(FixedUpdateGameLoop, _super);
    function FixedUpdateGameLoop() {
        var _this = _super.call(this) || this;
        /**
         * The main loop of the game. Updates until the current time is reached. Renders once
         * @param timestamp The current time in ms
         */
        _this.doFrame = function (timestamp) {
            // If a pause was executed, stop doing the loop.
            if (_this.paused) {
                return;
            }
            // Request animation frame to prepare for another update or render
            window.requestAnimationFrame(function (t) { return _this.doFrame(t); });
            // If we are trying to render too soon, do nothing.
            if (timestamp < _this.lastFrameTime + _this.minFrameDelay) {
                return;
            }
            // A frame is actually happening
            _this.startFrame(timestamp);
            // Update while there is still time to make up. If we do too many update steps, panic and exit the loop.
            _this.numUpdateSteps = 0;
            var panic = false;
            while (_this.frameDelta >= _this.updateTimestep) {
                // Do an update
                _this._doUpdate(_this.updateTimestep / 1000);
                // Remove the update step time from the time we have to process
                _this.frameDelta -= _this.updateTimestep;
                // Increment steps and check if we've done too many
                _this.numUpdateSteps++;
                if (_this.numUpdateSteps > 100) {
                    panic = true;
                    break;
                }
            }
            // Updates are done, render
            _this._doRender();
            // Wrap up the frame
            _this.finishFrame(panic);
        };
        _this.maxUpdateFPS = 60;
        _this.updateTimestep = Math.floor(1000 / _this.maxUpdateFPS);
        _this.frameDelta = 0;
        _this.lastFrameTime = 0;
        _this.minFrameDelay = 0;
        _this.frame = 0;
        _this.fps = _this.maxUpdateFPS; // Initialize the fps to the max allowed fps
        _this.fpsUpdateInterval = 1000;
        _this.lastFpsUpdate = 0;
        _this.framesSinceLastFpsUpdate = 0;
        _this.started = false;
        _this.paused = false;
        _this.running = false;
        _this.numUpdateSteps = 0;
        return _this;
    }
    FixedUpdateGameLoop.prototype.getFPS = function () {
        return 0;
    };
    /**
     * Updates the frame count and sum of time for the framerate of the game
     * @param timestep The current time in ms
     */
    FixedUpdateGameLoop.prototype.updateFPS = function (timestamp) {
        this.fps = 0.9 * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) + (1 - 0.9) * this.fps;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        Debug_1["default"].log("fps", "FPS: " + this.fps.toFixed(1));
        Stats_1["default"].updateFPS(this.fps);
    };
    /**
 * Changes the maximum allowed physics framerate of the game
 * @param initMax The max framerate
 */
    FixedUpdateGameLoop.prototype.setMaxUpdateFPS = function (initMax) {
        this.maxUpdateFPS = initMax;
        this.updateTimestep = Math.floor(1000 / this.maxUpdateFPS);
    };
    /**
     * Sets the maximum rendering framerate
     * @param maxFPS The max framerate
     */
    FixedUpdateGameLoop.prototype.setMaxFPS = function (maxFPS) {
        this.minFrameDelay = 1000 / maxFPS;
    };
    /**
     * This function is called when the game loop panics, i.e. it tries to process too much time in an entire frame.
     * This will reset the amount of time back to zero.
     * @returns The amount of time we are discarding from processing.
     */
    FixedUpdateGameLoop.prototype.resetFrameDelta = function () {
        var oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    };
    /**
     * Starts up the game loop and calls the first requestAnimationFrame
     */
    FixedUpdateGameLoop.prototype.start = function () {
        var _this = this;
        if (!this.started) {
            this.started = true;
            window.requestAnimationFrame(function (timestamp) { return _this.doFirstFrame(timestamp); });
        }
    };
    FixedUpdateGameLoop.prototype.pause = function () {
        this.paused = true;
    };
    FixedUpdateGameLoop.prototype.resume = function () {
        this.paused = false;
    };
    /**
     * The first game frame - initializes the first frame time and begins the render
     * @param timestamp The current time in ms
     */
    FixedUpdateGameLoop.prototype.doFirstFrame = function (timestamp) {
        var _this = this;
        this.running = true;
        this._doRender();
        this.lastFrameTime = timestamp;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        window.requestAnimationFrame(function (t) { return _this.doFrame(t); });
    };
    /**
     * Handles any processing that needs to be done at the start of the frame
     * @param timestamp The time of the frame in ms
     */
    FixedUpdateGameLoop.prototype.startFrame = function (timestamp) {
        // Update the amount of time we need our update to process
        this.frameDelta += timestamp - this.lastFrameTime;
        // Set the new time of the last frame
        this.lastFrameTime = timestamp;
        // Update the estimate of the framerate
        if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.updateFPS(timestamp);
        }
        // Increment the number of frames
        this.frame++;
        this.framesSinceLastFpsUpdate++;
    };
    /**
     * Wraps up the frame and handles the panic state if there is one
     * @param panic Whether or not the loop panicked
     */
    FixedUpdateGameLoop.prototype.finishFrame = function (panic) {
        if (panic) {
            var discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    };
    return FixedUpdateGameLoop;
}(GameLoop_1["default"]));
exports["default"] = FixedUpdateGameLoop;
},{"../Debug/Debug":21,"../Debug/Stats":22,"./GameLoop":33}],32:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var EventQueue_1 = require("../Events/EventQueue");
var Input_1 = require("../Input/Input");
var InputHandler_1 = require("../Input/InputHandler");
var Recorder_1 = require("../Playback/Recorder");
var Debug_1 = require("../Debug/Debug");
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
var Viewport_1 = require("../SceneGraph/Viewport");
var SceneManager_1 = require("../Scene/SceneManager");
var AudioManager_1 = require("../Sound/AudioManager");
var Stats_1 = require("../Debug/Stats");
var CanvasRenderer_1 = require("../Rendering/CanvasRenderer");
var Color_1 = require("../Utils/Color");
var GameOptions_1 = require("./GameOptions");
var FixedUpdateGameLoop_1 = require("./FixedUpdateGameLoop");
var EnvironmentInitializer_1 = require("./EnvironmentInitializer");
var Vec2_1 = require("../DataTypes/Vec2");
var RegistryManager_1 = require("../Registry/RegistryManager");
var WebGLRenderer_1 = require("../Rendering/WebGLRenderer");
/**
 * The main loop of the game engine.
 * Handles the update order, and initializes all subsystems.
 * The Game manages the update cycle, and requests animation frames to render to the browser.
 */
var Game = /** @class */ (function () {
    /**
     * Creates a new Game
     * @param options The options for Game initialization
     */
    function Game(options) {
        // Before anything else, build the environment
        EnvironmentInitializer_1["default"].setup();
        // Typecast the config object to a GameConfig object
        this.gameOptions = GameOptions_1["default"].parse(options);
        this.showDebug = this.gameOptions.showDebug;
        this.showStats = this.gameOptions.showStats;
        // Create an instance of a game loop
        this.loop = new FixedUpdateGameLoop_1["default"]();
        // Get the game canvas and give it a background color
        this.GAME_CANVAS = document.getElementById("game-canvas");
        this.DEBUG_CANVAS = document.getElementById("debug-canvas");
        // Give the canvas a size and get the rendering context
        this.WIDTH = this.gameOptions.canvasSize.x;
        this.HEIGHT = this.gameOptions.canvasSize.y;
        // This step MUST happen before the resource manager does anything
        if (this.gameOptions.useWebGL) {
            this.renderingManager = new WebGLRenderer_1["default"]();
        }
        else {
            this.renderingManager = new CanvasRenderer_1["default"]();
        }
        this.initializeGameWindow();
        this.ctx = this.renderingManager.initializeCanvas(this.GAME_CANVAS, this.WIDTH, this.HEIGHT);
        this.clearColor = new Color_1["default"](this.gameOptions.clearColor.r, this.gameOptions.clearColor.g, this.gameOptions.clearColor.b);
        // Initialize debugging and stats
        Debug_1["default"].initializeDebugCanvas(this.DEBUG_CANVAS, this.WIDTH, this.HEIGHT);
        Stats_1["default"].initStats();
        if (this.gameOptions.showStats) {
            // Find the stats output and make it no longer hidden
            document.getElementById("stats").hidden = false;
        }
        // Size the viewport to the game canvas
        var canvasSize = new Vec2_1["default"](this.WIDTH, this.HEIGHT);
        this.viewport = new Viewport_1["default"](canvasSize, this.gameOptions.zoomLevel);
        // Initialize all necessary game subsystems
        this.eventQueue = EventQueue_1["default"].getInstance();
        this.inputHandler = new InputHandler_1["default"](this.GAME_CANVAS);
        Input_1["default"].initialize(this.viewport, this.gameOptions.inputs);
        this.recorder = new Recorder_1["default"]();
        this.resourceManager = ResourceManager_1["default"].getInstance();
        this.sceneManager = new SceneManager_1["default"](this.viewport, this.renderingManager);
        this.audioManager = AudioManager_1["default"].getInstance();
    }
    /**
     * Set up the game window that holds the canvases
     */
    Game.prototype.initializeGameWindow = function () {
        var gameWindow = document.getElementById("game-window");
        // Set the height of the game window
        gameWindow.style.width = this.WIDTH + "px";
        gameWindow.style.height = this.HEIGHT + "px";
    };
    /**
     * Retreives the SceneManager from the Game
     * @returns The SceneManager
     */
    Game.prototype.getSceneManager = function () {
        return this.sceneManager;
    };
    /**
     * Starts the game
     */
    Game.prototype.start = function (InitialScene, options) {
        var _this = this;
        // Set the update function of the loop
        this.loop.doUpdate = function (deltaT) { return _this.update(deltaT); };
        // Set the render function of the loop
        this.loop.doRender = function () { return _this.render(); };
        // Preload registry items
        RegistryManager_1["default"].preload();
        // Load the items with the resource manager
        this.resourceManager.loadResourcesFromQueue(function () {
            // When we're done loading, start the loop
            console.log("Finished Preload - loading first scene");
            _this.sceneManager.changeToScene(InitialScene, {}, options);
            _this.loop.start();
        });
    };
    /**
     * Updates all necessary subsystems of the game. Defers scene updates to the sceneManager
     * @param deltaT The time sine the last update
     */
    Game.prototype.update = function (deltaT) {
        try {
            // Handle all events that happened since the start of the last loop
            this.eventQueue.update(deltaT);
            // Update the input data structures so game objects can see the input
            Input_1["default"].update(deltaT);
            // Update the recording of the game
            this.recorder.update(deltaT);
            // Update all scenes
            this.sceneManager.update(deltaT);
            // Update all sounds
            this.audioManager.update(deltaT);
            // Load or unload any resources if needed
            this.resourceManager.update(deltaT);
        }
        catch (e) {
            this.loop.pause();
            console.warn("Uncaught Error in Update - Crashing gracefully");
            console.error(e);
        }
    };
    /**
     * Clears the canvas and defers scene rendering to the sceneManager. Renders the debug canvas
     */
    Game.prototype.render = function () {
        try {
            // Clear the canvases
            Debug_1["default"].clearCanvas();
            this.renderingManager.clear(this.clearColor);
            this.sceneManager.render();
            // Hacky debug mode
            if (Input_1["default"].isKeyJustPressed("g")) {
                this.showDebug = !this.showDebug;
            }
            // Debug render
            if (this.showDebug) {
                Debug_1["default"].render();
            }
            if (this.showStats) {
                Stats_1["default"].render();
            }
        }
        catch (e) {
            this.loop.pause();
            console.warn("Uncaught Error in Render - Crashing gracefully");
            console.error(e);
        }
    };
    return Game;
}());
exports["default"] = Game;
},{"../DataTypes/Vec2":20,"../Debug/Debug":21,"../Debug/Stats":22,"../Events/EventQueue":24,"../Input/Input":28,"../Input/InputHandler":29,"../Playback/Recorder":58,"../Registry/RegistryManager":61,"../Rendering/CanvasRenderer":67,"../Rendering/WebGLRenderer":72,"../ResourceManager/ResourceManager":79,"../Scene/SceneManager":90,"../SceneGraph/Viewport":82,"../Sound/AudioManager":92,"../Utils/Color":94,"./EnvironmentInitializer":30,"./FixedUpdateGameLoop":31,"./GameOptions":34}],33:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var NullFunc_1 = require("../DataTypes/Functions/NullFunc");
/**
 * The main game loop of the game. Keeps track of fps and handles scheduling of updates and rendering.
 * This class is left abstract, so that a subclass can handle exactly how the loop is scheduled.
 * For an example of different types of game loop scheduling, check out @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/game-loop.html)
 */
var GameLoop = /** @class */ (function () {
    function GameLoop() {
        /** The function to call when an update occurs */
        this._doUpdate = NullFunc_1["default"];
        /** The function to call when a render occurs */
        this._doRender = NullFunc_1["default"];
    }
    Object.defineProperty(GameLoop.prototype, "doUpdate", {
        set: function (update) {
            this._doUpdate = update;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameLoop.prototype, "doRender", {
        set: function (render) {
            this._doRender = render;
        },
        enumerable: false,
        configurable: true
    });
    return GameLoop;
}());
exports["default"] = GameLoop;
},{"../DataTypes/Functions/NullFunc":3}],34:[function(require,module,exports){
"use strict";
// @ignorePage
exports.__esModule = true;
/** The options for initializing the @reference[GameLoop] */
var GameOptions = /** @class */ (function () {
    function GameOptions() {
    }
    /**
     * Parses the data in the raw options object
     * @param options The game options as a Record
     * @returns A version of the options converted to a GameOptions object
     */
    GameOptions.parse = function (options) {
        var gOpt = new GameOptions();
        gOpt.canvasSize = options.canvasSize ? options.canvasSize : { x: 800, y: 600 };
        gOpt.zoomLevel = options.zoomLevel ? options.zoomLevel : 1;
        gOpt.clearColor = options.clearColor ? options.clearColor : { r: 255, g: 255, b: 255 };
        gOpt.inputs = options.inputs ? options.inputs : [];
        gOpt.showDebug = !!options.showDebug;
        gOpt.showStats = !!options.showStats;
        gOpt.useWebGL = !!options.useWebGL;
        return gOpt;
    };
    return GameOptions;
}());
exports["default"] = GameOptions;
},{}],35:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GameNode_1 = require("./GameNode");
var Vec2_1 = require("../DataTypes/Vec2");
var AABB_1 = require("../DataTypes/Shapes/AABB");
var Debug_1 = require("../Debug/Debug");
var Color_1 = require("../Utils/Color");
/**
 * The representation of an object in the game world that can be drawn to the screen
 */
var CanvasNode = /** @class */ (function (_super) {
    __extends(CanvasNode, _super);
    function CanvasNode() {
        var _this = _super.call(this) || this;
        /** A flag for whether or not the CanvasNode is visible */
        _this.visible = true;
        _this._size = new Vec2_1["default"](0, 0);
        _this._size.setOnChange(function () { return _this.sizeChanged(); });
        _this._scale = new Vec2_1["default"](1, 1);
        _this._scale.setOnChange(function () { return _this.scaleChanged(); });
        _this._boundary = new AABB_1["default"]();
        _this.updateBoundary();
        _this._hasCustomShader = false;
        return _this;
    }
    Object.defineProperty(CanvasNode.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (a) {
            this._alpha = a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            var _this = this;
            this._size = size;
            // Enter as a lambda to bind "this"
            this._size.setOnChange(function () { return _this.sizeChanged(); });
            this.sizeChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (scale) {
            var _this = this;
            this._scale = scale;
            // Enter as a lambda to bind "this"
            this._scale.setOnChange(function () { return _this.scaleChanged(); });
            this.scaleChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "scaleX", {
        set: function (value) {
            this.scale.x = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "scaleY", {
        set: function (value) {
            this.scale.y = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "hasCustomShader", {
        get: function () {
            return this._hasCustomShader;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "customShaderKey", {
        get: function () {
            return this._customShaderKey;
        },
        enumerable: false,
        configurable: true
    });
    // @override
    CanvasNode.prototype.positionChanged = function () {
        _super.prototype.positionChanged.call(this);
        this.updateBoundary();
    };
    /** Called if the size vector is changed or replaced. */
    CanvasNode.prototype.sizeChanged = function () {
        this.updateBoundary();
    };
    /** Called if the scale vector is changed or replaced */
    CanvasNode.prototype.scaleChanged = function () {
        this.updateBoundary();
    };
    // @docIgnore
    /** Called if the position, size, or scale of the CanvasNode is changed. Updates the boundary. */
    CanvasNode.prototype.updateBoundary = function () {
        this._boundary.center.set(this.position.x, this.position.y);
        this._boundary.halfSize.set(this.size.x * this.scale.x / 2, this.size.y * this.scale.y / 2);
    };
    Object.defineProperty(CanvasNode.prototype, "boundary", {
        get: function () {
            return this._boundary;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasNode.prototype, "sizeWithZoom", {
        get: function () {
            var zoom = this.scene.getViewScale();
            return this.boundary.halfSize.clone().scaled(zoom, zoom);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a custom shader to this CanvasNode
     * @param key The registry key of the ShaderType
     */
    CanvasNode.prototype.useCustomShader = function (key) {
        this._hasCustomShader = true;
        this._customShaderKey = key;
    };
    /**
     * Returns true if the point (x, y) is inside of this canvas object
     * @param x The x position of the point
     * @param y The y position of the point
     * @returns A flag representing whether or not this node contains the point.
     */
    CanvasNode.prototype.contains = function (x, y) {
        return this._boundary.containsPoint(new Vec2_1["default"](x, y));
    };
    // @implemented
    CanvasNode.prototype.debugRender = function () {
        Debug_1["default"].drawBox(this.relativePosition, this.sizeWithZoom, false, Color_1["default"].BLUE);
        _super.prototype.debugRender.call(this);
    };
    return CanvasNode;
}(GameNode_1["default"]));
exports["default"] = CanvasNode;
},{"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":20,"../Debug/Debug":21,"../Utils/Color":94,"./GameNode":36}],36:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.TweenableProperties = void 0;
var Vec2_1 = require("../DataTypes/Vec2");
var Receiver_1 = require("../Events/Receiver");
var Emitter_1 = require("../Events/Emitter");
var Region_1 = require("../DataTypes/Interfaces/Region");
var AABB_1 = require("../DataTypes/Shapes/AABB");
var TweenController_1 = require("../Rendering/Animations/TweenController");
var Debug_1 = require("../Debug/Debug");
var Color_1 = require("../Utils/Color");
var Circle_1 = require("../DataTypes/Shapes/Circle");
/**
 * The representation of an object in the game world.
 * To construct GameNodes, see the @reference[Scene] documentation.
 */
var GameNode = /** @class */ (function () {
    // Constructor docs are ignored, as the user should NOT create new GameNodes with a raw constructor
    function GameNode() {
        var _this = this;
        /*---------- PHYSICAL ----------*/
        this.hasPhysics = false;
        this.moving = false;
        this.frozen = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = false;
        this.isColliding = false;
        this.pathfinding = false;
        this._position = new Vec2_1["default"](0, 0);
        this._position.setOnChange(function () { return _this.positionChanged(); });
        this.receiver = new Receiver_1["default"]();
        this.emitter = new Emitter_1["default"]();
        this.tweens = new TweenController_1["default"](this);
        this.rotation = 0;
    }
    GameNode.prototype.destroy = function () {
        this.tweens.destroy();
        this.receiver.destroy();
        if (this.hasPhysics) {
            this.removePhysics();
        }
        if (this._ai) {
            this._ai.destroy();
            delete this._ai;
            this.scene.getAIManager().removeActor(this);
        }
        this.scene.remove(this);
        this.layer.removeNode(this);
    };
    Object.defineProperty(GameNode.prototype, "position", {
        /*---------- POSITIONED ----------*/
        get: function () {
            return this._position;
        },
        set: function (pos) {
            var _this = this;
            this._position = pos;
            this._position.setOnChange(function () { return _this.positionChanged(); });
            this.positionChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameNode.prototype, "relativePosition", {
        get: function () {
            return this.inRelativeCoordinates(this.position);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Converts a point to coordinates relative to the zoom and origin of this node
     * @param point The point to conver
     * @returns A new Vec2 representing the point in relative coordinates
     */
    GameNode.prototype.inRelativeCoordinates = function (point) {
        var origin = this.scene.getViewTranslation(this);
        var zoom = this.scene.getViewScale();
        return point.clone().sub(origin).scale(zoom);
    };
    Object.defineProperty(GameNode.prototype, "id", {
        /*---------- UNIQUE ----------*/
        get: function () {
            return this._id;
        },
        set: function (id) {
            // id can only be set once
            if (this._id === undefined) {
                this._id = id;
            }
            else {
                throw "Attempted to assign id to object that already has id.";
            }
        },
        enumerable: false,
        configurable: true
    });
    /*---------- PHYSICAL ----------*/
    // @implemented
    /**
     * @param velocity The velocity with which to move the object.
     */
    GameNode.prototype.move = function (velocity) {
        if (this.frozen)
            return;
        this.moving = true;
        this._velocity = velocity;
    };
    ;
    GameNode.prototype.moveOnPath = function (speed, path) {
        if (this.frozen)
            return;
        this.path = path;
        var dir = path.getMoveDirection(this);
        this.moving = true;
        this.pathfinding = true;
        this._velocity = dir.scale(speed);
    };
    // @implemented
    /**
     * @param velocity The velocity with which the object will move.
     */
    GameNode.prototype.finishMove = function () {
        this.moving = false;
        this.position.add(this._velocity);
        if (this.pathfinding) {
            this.path.handlePathProgress(this);
            this.path = null;
            this.pathfinding = false;
        }
    };
    // @implemented
    /**
     * @param collisionShape The collider for this object. If this has a region (implements Region),
     * it will be used when no collision shape is specified (or if collision shape is null).
     * @param isCollidable Whether this is collidable or not. True by default.
     * @param isStatic Whether this is static or not. False by default
     */
    GameNode.prototype.addPhysics = function (collisionShape, colliderOffset, isCollidable, isStatic) {
        if (isCollidable === void 0) { isCollidable = true; }
        if (isStatic === void 0) { isStatic = false; }
        // Initialize the physics variables
        this.hasPhysics = true;
        this.moving = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = true;
        this.isCollidable = isCollidable;
        this.isStatic = isStatic;
        this.isTrigger = false;
        this.triggerMask = 0;
        this.triggerEnters = new Array(32);
        this.triggerExits = new Array(32);
        this._velocity = Vec2_1["default"].ZERO;
        this.sweptRect = new AABB_1["default"]();
        this.collidedWithTilemap = false;
        this.group = -1; // The default group, collides with everything
        // Set the collision shape if provided, or simply use the the region if there is one.
        if (collisionShape) {
            this.collisionShape = collisionShape;
            this.collisionShape.center = this.position;
        }
        else if ((0, Region_1.isRegion)(this)) {
            // If the gamenode has a region and no other is specified, use that
            this.collisionShape = this.boundary.clone();
        }
        else {
            throw "No collision shape specified for physics object.";
        }
        // If we were provided with a collider offset, set it. Otherwise there is no offset, so use the zero vector
        if (colliderOffset) {
            this.colliderOffset = colliderOffset;
        }
        else {
            this.colliderOffset = Vec2_1["default"].ZERO;
        }
        // Initialize the swept rect
        this.sweptRect = this.collisionShape.getBoundingRect();
        // Register the object with physics
        this.scene.getPhysicsManager().registerObject(this);
    };
    /** Removes this object from the physics system */
    GameNode.prototype.removePhysics = function () {
        // Remove this from the physics manager
        this.scene.getPhysicsManager().deregisterObject(this);
        // Nullify all physics fields
        this.hasPhysics = false;
        this.moving = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = false;
        this.isCollidable = false;
        this.isStatic = false;
        this.isTrigger = false;
        this.triggerMask = 0;
        this.triggerEnters = null;
        this.triggerExits = null;
        this._velocity = Vec2_1["default"].ZERO;
        this.sweptRect = null;
        this.collidedWithTilemap = false;
        this.group = -1;
        this.collisionShape = null;
        this.colliderOffset = Vec2_1["default"].ZERO;
        this.sweptRect = null;
    };
    /** Disables physics movement for this node */
    GameNode.prototype.freeze = function () {
        this.frozen = true;
    };
    /** Reenables physics movement for this node */
    GameNode.prototype.unfreeze = function () {
        this.frozen = false;
    };
    /** Prevents this object from participating in all collisions and triggers. It can still move. */
    GameNode.prototype.disablePhysics = function () {
        this.active = false;
    };
    /** Enables this object to participate in collisions and triggers. This is only necessary if disablePhysics was called */
    GameNode.prototype.enablePhysics = function () {
        this.active = true;
    };
    /**
     * Sets the collider for this GameNode
     * @param collider The new collider to use
     */
    GameNode.prototype.setCollisionShape = function (collider) {
        this.collisionShape = collider;
        this.collisionShape.center.copy(this.position);
    };
    // @implemented
    /**
     * Sets this object to be a trigger for a specific group
     * @param group The name of the group that activates the trigger
     * @param onEnter The name of the event to send when this trigger is activated
     * @param onExit The name of the event to send when this trigger stops being activated
     */
    GameNode.prototype.setTrigger = function (group, onEnter, onExit) {
        // Make this object a trigger
        this.isTrigger = true;
        // Get the number of the physics layer
        var layerNumber = this.scene.getPhysicsManager().getGroupNumber(group);
        if (layerNumber === 0) {
            console.warn("Trigger for GameNode ".concat(this.id, " not set - group \"").concat(group, "\" was not recognized by the physics manager."));
            return;
        }
        // Add this to the trigger mask
        this.triggerMask |= layerNumber;
        // Layer numbers are bits, so get which bit it is
        var index = Math.log2(layerNumber);
        // Set the event names
        this.triggerEnters[index] = onEnter;
        this.triggerExits[index] = onExit;
    };
    ;
    // @implemented
    /**
     * @param group The physics group this node should belong to
     */
    GameNode.prototype.setGroup = function (group) {
        this.scene.getPhysicsManager().setGroup(this, group);
    };
    // @implemened
    GameNode.prototype.getLastVelocity = function () {
        return this._velocity;
    };
    Object.defineProperty(GameNode.prototype, "ai", {
        /*---------- ACTOR ----------*/
        get: function () {
            return this._ai;
        },
        set: function (ai) {
            if (!this._ai) {
                // If we haven't been previously had an ai, register us with the ai manager
                this.scene.getAIManager().registerActor(this);
            }
            this._ai = ai;
            this.aiActive = true;
        },
        enumerable: false,
        configurable: true
    });
    // @implemented
    GameNode.prototype.addAI = function (ai, options, type) {
        if (!this._ai) {
            this.scene.getAIManager().registerActor(this);
        }
        if (typeof ai === "string") {
            this._ai = this.scene.getAIManager().generateAI(ai);
        }
        else {
            this._ai = new ai();
        }
        // Question, how much do we want different type of AI to be handled the same, i.e. should GoapAI and AI similar methods and signatures for the sake of unity
        this._ai.initializeAI(this, options);
        this.aiActive = true;
    };
    // @implemented
    GameNode.prototype.setAIActive = function (active, options) {
        this.aiActive = active;
        if (this.aiActive) {
            this.ai.activate(options);
        }
    };
    Object.defineProperty(GameNode.prototype, "positionX", {
        /*---------- TWEENABLE PROPERTIES ----------*/
        set: function (value) {
            this.position.x = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameNode.prototype, "positionY", {
        set: function (value) {
            this.position.y = value;
        },
        enumerable: false,
        configurable: true
    });
    /*---------- GAME NODE ----------*/
    /**
     * Sets the scene for this object.
     * @param scene The scene this object belongs to.
     */
    GameNode.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    /**
     * Gets the scene this object is in.
     * @returns The scene this object belongs to
    */
    GameNode.prototype.getScene = function () {
        return this.scene;
    };
    /**
     * Sets the layer of this object.
     * @param layer The layer this object will be on.
     */
    GameNode.prototype.setLayer = function (layer) {
        this.layer = layer;
    };
    /**
     * Returns the layer this object is on.
     * @returns This layer this object is on.
    */
    GameNode.prototype.getLayer = function () {
        return this.layer;
    };
    /** Called if the position vector is modified or replaced */
    GameNode.prototype.positionChanged = function () {
        if (this.collisionShape) {
            if (this.colliderOffset) {
                this.collisionShape.center = this.position.clone().add(this.colliderOffset);
            }
            else {
                this.collisionShape.center = this.position.clone();
            }
        }
    };
    ;
    /**
     * Updates this GameNode
     * @param deltaT The timestep of the update.
     */
    GameNode.prototype.update = function (deltaT) {
        // Defer event handling to AI.
        while (this.receiver.hasNextEvent()) {
            this._ai.handleEvent(this.receiver.getNextEvent());
        }
    };
    // @implemented
    GameNode.prototype.debugRender = function () {
        // Draw the position of this GameNode
        Debug_1["default"].drawPoint(this.relativePosition, Color_1["default"].BLUE);
        // If velocity is not zero, draw a vector for it
        if (this._velocity && !this._velocity.isZero()) {
            Debug_1["default"].drawRay(this.relativePosition, this._velocity.clone().scaleTo(20).add(this.relativePosition), Color_1["default"].BLUE);
        }
        // If this has a collider, draw it
        if (this.collisionShape) {
            var color = this.isColliding ? Color_1["default"].RED : Color_1["default"].GREEN;
            if (this.isTrigger) {
                color = Color_1["default"].MAGENTA;
            }
            color.a = 0.2;
            if (this.collisionShape instanceof AABB_1["default"]) {
                Debug_1["default"].drawBox(this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale()), true, color);
            }
            else if (this.collisionShape instanceof Circle_1["default"]) {
                Debug_1["default"].drawCircle(this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.hw * this.scene.getViewScale(), true, color);
            }
        }
    };
    return GameNode;
}());
exports["default"] = GameNode;
var TweenableProperties;
(function (TweenableProperties) {
    TweenableProperties["posX"] = "positionX";
    TweenableProperties["posY"] = "positionY";
    TweenableProperties["scaleX"] = "scaleX";
    TweenableProperties["scaleY"] = "scaleY";
    TweenableProperties["rotation"] = "rotation";
    TweenableProperties["alpha"] = "alpha";
})(TweenableProperties = exports.TweenableProperties || (exports.TweenableProperties = {}));
},{"../DataTypes/Interfaces/Region":7,"../DataTypes/Shapes/AABB":14,"../DataTypes/Shapes/Circle":15,"../DataTypes/Vec2":20,"../Debug/Debug":21,"../Events/Emitter":23,"../Events/Receiver":27,"../Rendering/Animations/TweenController":65,"../Utils/Color":94}],37:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CanvasNode_1 = require("./CanvasNode");
var Color_1 = require("../Utils/Color");
/**
 * The representation of a game object that doesn't rely on any resources to render - it is drawn to the screen by the canvas
 */
var Graphic = /** @class */ (function (_super) {
    __extends(Graphic, _super);
    function Graphic() {
        var _this = _super.call(this) || this;
        _this.color = Color_1["default"].RED;
        return _this;
    }
    Object.defineProperty(Graphic.prototype, "alpha", {
        get: function () {
            return this.color.a;
        },
        set: function (a) {
            this.color.a = a;
        },
        enumerable: false,
        configurable: true
    });
    // @deprecated
    /**
     * Sets the color of the Graphic. DEPRECATED
     * @param color The new color of the Graphic.
     */
    Graphic.prototype.setColor = function (color) {
        this.color = color;
    };
    Object.defineProperty(Graphic.prototype, "colorR", {
        get: function () {
            return this.color.r;
        },
        set: function (r) {
            this.color.r = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "colorG", {
        get: function () {
            return this.color.g;
        },
        set: function (g) {
            this.color.g = g;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "colorB", {
        get: function () {
            return this.color.b;
        },
        set: function (b) {
            this.color.b = b;
        },
        enumerable: false,
        configurable: true
    });
    return Graphic;
}(CanvasNode_1["default"]));
exports["default"] = Graphic;
},{"../Utils/Color":94,"./CanvasNode":35}],38:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.GraphicType = void 0;
var GraphicType;
(function (GraphicType) {
    GraphicType["POINT"] = "POINT";
    GraphicType["RECT"] = "RECT";
    GraphicType["LINE"] = "LINE";
    GraphicType["PARTICLE"] = "PARTICLE";
})(GraphicType = exports.GraphicType || (exports.GraphicType = {}));
},{}],39:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Graphic_1 = require("../Graphic");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(start, end) {
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.end = end;
        _this.thickness = 2;
        // Does this really have a meaning for lines?
        _this.size.set(5, 5);
        return _this;
    }
    Object.defineProperty(Line.prototype, "start", {
        get: function () {
            return this.position;
        },
        set: function (pos) {
            this.position = pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "end", {
        get: function () {
            return this._end;
        },
        set: function (pos) {
            this._end = pos;
        },
        enumerable: false,
        configurable: true
    });
    return Line;
}(Graphic_1["default"]));
exports["default"] = Line;
},{"../Graphic":37}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Point_1 = require("./Point");
/**
 * - Position X
- Velocity (speed and direction) X
- Color X
- Lifetime
- Age can be handled as lifetime
- Shape X
- Size X
- Transparency X
 */
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(position, size, mass) {
        var _this = 
        // Are we making this a circle?
        _super.call(this, position) || this;
        _this.inUse = false;
        _this.mass = mass;
        return _this;
    }
    Particle.prototype.setParticleActive = function (lifetime, position) {
        this.age = lifetime;
        this.inUse = true;
        this.visible = true;
        this.position = position;
    };
    Particle.prototype.decrementAge = function (decay) {
        this.age -= decay;
    };
    Particle.prototype.setParticleInactive = function () {
        this.inUse = false;
        this.visible = false;
    };
    Object.defineProperty(Particle.prototype, "velY", {
        get: function () {
            return this.vel.y;
        },
        set: function (y) {
            this.vel.y = y;
        },
        enumerable: false,
        configurable: true
    });
    return Particle;
}(Point_1["default"]));
exports["default"] = Particle;
},{"./Point":41}],41:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Graphic_1 = require("../Graphic");
/** A basic point to be drawn on the screen. */
var Point = /** @class */ (function (_super) {
    __extends(Point, _super);
    function Point(position) {
        var _this = 
        // Are we making this a circle?
        _super.call(this) || this;
        _this.position = position;
        _this.size.set(5, 5);
        return _this;
    }
    return Point;
}(Graphic_1["default"]));
exports["default"] = Point;
},{"../Graphic":37}],42:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Graphic_1 = require("../Graphic");
var Color_1 = require("../../Utils/Color");
/** A basic rectangle to be drawn on the screen. */
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(position, size) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.size = size;
        _this.borderColor = Color_1["default"].TRANSPARENT;
        _this.borderWidth = 0;
        return _this;
    }
    /**
     * Sets the border color of this rectangle
     * @param color The border color
     */
    Rect.prototype.setBorderColor = function (color) {
        this.borderColor = color;
    };
    // @deprecated
    Rect.prototype.getBorderColor = function () {
        return this.borderColor;
    };
    /**
     * Sets the border width of this rectangle
     * @param width The width of the rectangle in pixels
     */
    Rect.prototype.setBorderWidth = function (width) {
        this.borderWidth = width;
    };
    Rect.prototype.getBorderWidth = function () {
        return this.borderWidth;
    };
    return Rect;
}(Graphic_1["default"]));
exports["default"] = Rect;
},{"../../Utils/Color":94,"../Graphic":37}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Sprite_1 = require("./Sprite");
var AnimationManager_1 = require("../../Rendering/Animations/AnimationManager");
var Vec2_1 = require("../../DataTypes/Vec2");
/** An sprite with specified animation frames. */
var AnimatedSprite = /** @class */ (function (_super) {
    __extends(AnimatedSprite, _super);
    function AnimatedSprite(spritesheet) {
        var _this = _super.call(this, spritesheet.name) || this;
        _this.numCols = spritesheet.columns;
        _this.numRows = spritesheet.rows;
        // Set the size of the sprite to the sprite size specified by the spritesheet
        _this.size.set(spritesheet.spriteWidth, spritesheet.spriteHeight);
        _this.animation = new AnimationManager_1["default"](_this);
        // Add the animations to the animated sprite
        for (var _i = 0, _a = spritesheet.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            _this.animation.add(animation.name, animation);
        }
        return _this;
    }
    Object.defineProperty(AnimatedSprite.prototype, "cols", {
        get: function () {
            return this.numCols;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimatedSprite.prototype, "rows", {
        get: function () {
            return this.numRows;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the image offset for the current index of animation
     * @param index The index we're at in the animation
     * @returns A Vec2 containing the image offset
     */
    AnimatedSprite.prototype.getAnimationOffset = function (index) {
        return new Vec2_1["default"]((index % this.numCols) * this.size.x, Math.floor(index / this.numCols) * this.size.y);
    };
    return AnimatedSprite;
}(Sprite_1["default"]));
exports["default"] = AnimatedSprite;
},{"../../DataTypes/Vec2":20,"../../Rendering/Animations/AnimationManager":62,"./Sprite":44}],44:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CanvasNode_1 = require("../CanvasNode");
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var Vec2_1 = require("../../DataTypes/Vec2");
/**
 * The representation of a sprite - an in-game image
 */
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(imageId) {
        var _this = _super.call(this) || this;
        _this.imageId = imageId;
        var image = ResourceManager_1["default"].getInstance().getImage(_this.imageId);
        _this.size = new Vec2_1["default"](image.width, image.height);
        _this.imageOffset = Vec2_1["default"].ZERO;
        _this.invertX = false;
        _this.invertY = false;
        return _this;
    }
    /**
     * Sets the offset of the sprite from (0, 0) in the image's coordinates
     * @param offset The offset of the sprite from (0, 0) in image coordinates
     */
    Sprite.prototype.setImageOffset = function (offset) {
        this.imageOffset = offset;
    };
    return Sprite;
}(CanvasNode_1["default"]));
exports["default"] = Sprite;
},{"../../DataTypes/Vec2":20,"../../ResourceManager/ResourceManager":79,"../CanvasNode":35}],45:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../DataTypes/Vec2");
var CanvasNode_1 = require("./CanvasNode");
/**
 * The representation of a tilemap - this can consist of a combination of tilesets in one layer
 */
var Tilemap = /** @class */ (function (_super) {
    __extends(Tilemap, _super);
    // TODO: Make this no longer be specific to Tiled
    function Tilemap(tilemapData, layer, tilesets, scale) {
        var _this = _super.call(this) || this;
        _this.tilesets = tilesets;
        _this.tileSize = new Vec2_1["default"](0, 0);
        _this.name = layer.name;
        var tilecount = 0;
        for (var _i = 0, tilesets_1 = tilesets; _i < tilesets_1.length; _i++) {
            var tileset = tilesets_1[_i];
            tilecount += tileset.getTileCount() + 1;
        }
        _this.collisionMap = new Array(tilecount);
        for (var i = 0; i < _this.collisionMap.length; i++) {
            _this.collisionMap[i] = false;
        }
        // Defer parsing of the data to child classes - this allows for isometric vs. orthographic tilemaps and handling of Tiled data or other data
        _this.parseTilemapData(tilemapData, layer);
        _this.scale.set(scale.x, scale.y);
        return _this;
    }
    /**
     * Returns an array of the tilesets associated with this tilemap
     * @returns An array of all of the tilesets assocaited with this tilemap.
     */
    Tilemap.prototype.getTilesets = function () {
        return this.tilesets;
    };
    /**
     * Returns the size of tiles in this tilemap as they appear in the game world after scaling
     * @returns A vector containing the size of tiles in this tilemap as they appear in the game world after scaling.
     */
    Tilemap.prototype.getTileSize = function () {
        return this.tileSize.scaled(this.scale.x, this.scale.y);
    };
    /**
     * Gets the tile size taking zoom into account
     * @returns The tile size with zoom
    */
    Tilemap.prototype.getTileSizeWithZoom = function () {
        var zoom = this.scene.getViewScale();
        return this.getTileSize().scale(zoom);
    };
    /**
     * Adds this tilemap to the physics system
    */
    Tilemap.prototype.addPhysics = function () {
        this.hasPhysics = true;
        this.active = true;
        this.group = -1;
        this.scene.getPhysicsManager().registerTilemap(this);
    };
    return Tilemap;
}(CanvasNode_1["default"]));
exports["default"] = Tilemap;
},{"../DataTypes/Vec2":20,"./CanvasNode":35}],46:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Tilemap_1 = require("../Tilemap");
var Vec2_1 = require("../../DataTypes/Vec2");
var Debug_1 = require("../../Debug/Debug");
var Color_1 = require("../../Utils/Color");
/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
var OrthogonalTilemap = /** @class */ (function (_super) {
    __extends(OrthogonalTilemap, _super);
    function OrthogonalTilemap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // @override
    OrthogonalTilemap.prototype.parseTilemapData = function (tilemapData, layer) {
        // The size of the tilemap in local space
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;
        // The size of tiles
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        // The size of the tilemap on the canvas
        this.size.set(this.numCols * this.tileSize.x, this.numRows * this.tileSize.y);
        this.position.copy(this.size.scaled(0.5));
        this.data = layer.data;
        this.visible = layer.visible;
        // Whether the tilemap is collidable or not
        this.isCollidable = false;
        if (layer.properties) {
            for (var _i = 0, _a = layer.properties; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.name === "Collidable") {
                    this.isCollidable = item.value;
                    // Set all tiles besides "empty: 0" to be collidable
                    for (var i = 1; i < this.collisionMap.length; i++) {
                        this.collisionMap[i] = true;
                    }
                }
            }
        }
    };
    /**
     * Gets the dimensions of the tilemap
     * @returns A Vec2 containing the number of columns and the number of rows in the tilemap.
     */
    OrthogonalTilemap.prototype.getDimensions = function () {
        return new Vec2_1["default"](this.numCols, this.numRows);
    };
    /**
     * Gets the data value of the tile at the specified world position
     * @param worldCoords The coordinates in world space
     * @returns The data value of the tile
     */
    OrthogonalTilemap.prototype.getTileAtWorldPosition = function (worldCoords) {
        var localCoords = this.getColRowAt(worldCoords);
        return this.getTileAtRowCol(localCoords);
    };
    /**
     * Get the tile at the specified row and column
     * @param rowCol The coordinates in tilemap space
     * @returns The data value of the tile
     */
    OrthogonalTilemap.prototype.getTileAtRowCol = function (rowCol) {
        if (rowCol.x < 0 || rowCol.x >= this.numCols || rowCol.y < 0 || rowCol.y >= this.numRows) {
            return -1;
        }
        return this.data[rowCol.y * this.numCols + rowCol.x];
    };
    /**
     * Gets the world position of the tile at the specified index
     * @param index The index of the tile
     * @returns A Vec2 containing the world position of the tile
     */
    OrthogonalTilemap.prototype.getTileWorldPosition = function (index) {
        // Get the local position
        var col = index % this.numCols;
        var row = Math.floor(index / this.numCols);
        // Get the world position
        var x = col * this.tileSize.x;
        var y = row * this.tileSize.y;
        return new Vec2_1["default"](x, y);
    };
    /**
     * Gets the data value of the tile at the specified index
     * @param index The index of the tile
     * @returns The data value of the tile
     */
    OrthogonalTilemap.prototype.getTile = function (index) {
        return this.data[index];
    };
    // @override
    OrthogonalTilemap.prototype.setTile = function (index, type) {
        this.data[index] = type;
    };
    /**
     * Sets the tile at the specified row and column
     * @param rowCol The position of the tile in tilemap space
     * @param type The new data value of the tile
     */
    OrthogonalTilemap.prototype.setTileAtRowCol = function (rowCol, type) {
        var index = rowCol.y * this.numCols + rowCol.x;
        this.setTile(index, type);
    };
    /**
     * Returns true if the tile at the specified row and column of the tilemap is collidable
     * @param indexOrCol The index of the tile or the column it is in
     * @param row The row the tile is in
     * @returns A flag representing whether or not the tile is collidable.
     */
    OrthogonalTilemap.prototype.isTileCollidable = function (indexOrCol, row) {
        // The value of the tile
        var tile = 0;
        if (row) {
            // We have a column and a row
            tile = this.getTileAtRowCol(new Vec2_1["default"](indexOrCol, row));
            if (tile < 0) {
                return false;
            }
        }
        else {
            if (indexOrCol < 0 || indexOrCol >= this.data.length) {
                // Tiles that don't exist aren't collidable
                return false;
            }
            // We have an index
            tile = this.getTile(indexOrCol);
        }
        return this.collisionMap[tile];
    };
    /**
     * Takes in world coordinates and returns the row and column of the tile at that position
     * @param worldCoords The coordinates of the potential tile in world space
     * @returns A Vec2 containing the coordinates of the potential tile in tilemap space
     */
    OrthogonalTilemap.prototype.getColRowAt = function (worldCoords) {
        var col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        var row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);
        return new Vec2_1["default"](col, row);
    };
    // @override
    OrthogonalTilemap.prototype.update = function (deltaT) { };
    // @override
    OrthogonalTilemap.prototype.debugRender = function () {
        // Half of the tile size
        var zoomedHalfTileSize = this.getTileSizeWithZoom().scaled(0.5);
        var halfTileSize = this.getTileSize().scaled(0.5);
        // The center of the top left tile
        var topLeft = this.position.clone().sub(this.size.scaled(0.5));
        // A vec to store the center
        var center = Vec2_1["default"].ZERO;
        for (var col = 0; col < this.numCols; col++) {
            // Calculate the x-position
            center.x = topLeft.x + col * 2 * halfTileSize.x + halfTileSize.x;
            for (var row = 0; row < this.numRows; row++) {
                if (this.isCollidable && this.isTileCollidable(col, row)) {
                    // Calculate the y-position
                    center.y = topLeft.y + row * 2 * halfTileSize.y + halfTileSize.y;
                    // Draw a box for this tile
                    Debug_1["default"].drawBox(this.inRelativeCoordinates(center), zoomedHalfTileSize, false, Color_1["default"].BLUE);
                }
            }
        }
    };
    return OrthogonalTilemap;
}(Tilemap_1["default"]));
exports["default"] = OrthogonalTilemap;
},{"../../DataTypes/Vec2":20,"../../Debug/Debug":21,"../../Utils/Color":94,"../Tilemap":45}],47:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CanvasNode_1 = require("./CanvasNode");
var Color_1 = require("../Utils/Color");
var Vec2_1 = require("../DataTypes/Vec2");
var Input_1 = require("../Input/Input");
/**
 * The representation of a UIElement - the parent class of things like buttons
 */
var UIElement = /** @class */ (function (_super) {
    __extends(UIElement, _super);
    function UIElement(position) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.backgroundColor = new Color_1["default"](0, 0, 0, 0);
        _this.borderColor = new Color_1["default"](0, 0, 0, 0);
        _this.borderRadius = 5;
        _this.borderWidth = 1;
        _this.padding = Vec2_1["default"].ZERO;
        _this.onClick = null;
        _this.onClickEventId = null;
        _this.onRelease = null;
        _this.onReleaseEventId = null;
        _this.onEnter = null;
        _this.onEnterEventId = null;
        _this.onLeave = null;
        _this.onLeaveEventId = null;
        _this.isClicked = false;
        _this.isEntered = false;
        return _this;
    }
    // @deprecated
    UIElement.prototype.setBackgroundColor = function (color) {
        this.backgroundColor = color;
    };
    // @deprecated
    UIElement.prototype.setPadding = function (padding) {
        this.padding.copy(padding);
    };
    UIElement.prototype.update = function (deltaT) {
        _super.prototype.update.call(this, deltaT);
        // See of this object was just clicked
        if (Input_1["default"].isMouseJustPressed()) {
            var clickPos = Input_1["default"].getMousePressPosition();
            if (this.contains(clickPos.x, clickPos.y) && this.visible && !this.layer.isHidden()) {
                this.isClicked = true;
                if (this.onClick !== null) {
                    this.onClick();
                }
                if (this.onClickEventId !== null) {
                    var data = {};
                    this.emitter.fireEvent(this.onClickEventId, data);
                }
            }
        }
        // If the mouse wasn't just pressed, then we definitely weren't clicked
        if (!Input_1["default"].isMousePressed()) {
            if (this.isClicked) {
                this.isClicked = false;
            }
        }
        // Check if the mouse is hovering over this element
        var mousePos = Input_1["default"].getMousePosition();
        if (mousePos && this.contains(mousePos.x, mousePos.y)) {
            this.isEntered = true;
            if (this.onEnter !== null) {
                this.onEnter();
            }
            if (this.onEnterEventId !== null) {
                var data = {};
                this.emitter.fireEvent(this.onEnterEventId, data);
            }
        }
        else if (this.isEntered) {
            this.isEntered = false;
            if (this.onLeave !== null) {
                this.onLeave();
            }
            if (this.onLeaveEventId !== null) {
                var data = {};
                this.emitter.fireEvent(this.onLeaveEventId, data);
            }
        }
        else if (this.isClicked) {
            // If mouse is dragged off of element while down, it is not clicked anymore
            this.isClicked = false;
        }
    };
    /**
     * Overridable method for calculating background color - useful for elements that want to be colored on different after certain events
     * @returns The background color of the UIElement
     */
    UIElement.prototype.calculateBackgroundColor = function () {
        return this.backgroundColor;
    };
    /**
     * Overridable method for calculating border color - useful for elements that want to be colored on different after certain events
     * @returns The border color of the UIElement
     */
    UIElement.prototype.calculateBorderColor = function () {
        return this.borderColor;
    };
    return UIElement;
}(CanvasNode_1["default"]));
exports["default"] = UIElement;
},{"../DataTypes/Vec2":20,"../Input/Input":28,"../Utils/Color":94,"./CanvasNode":35}],48:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Label_1 = require("./Label");
var Color_1 = require("../../Utils/Color");
/** A clickable button UIElement */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(position, text) {
        var _this = _super.call(this, position, text) || this;
        _this.backgroundColor = new Color_1["default"](150, 75, 203);
        _this.borderColor = new Color_1["default"](41, 46, 30);
        _this.textColor = new Color_1["default"](255, 255, 255);
        return _this;
    }
    // @override
    Button.prototype.calculateBackgroundColor = function () {
        // Change the background color if clicked or hovered
        if (this.isEntered && !this.isClicked) {
            return this.backgroundColor.lighten();
        }
        else if (this.isClicked) {
            return this.backgroundColor.darken();
        }
        else {
            return this.backgroundColor;
        }
    };
    Button.prototype.clone = function (orig, onClickEventId) {
        this.backgroundColor = orig.backgroundColor;
        this.borderColor = orig.borderColor;
        this.textColor = orig.textColor;
        this.size = orig.size;
        this.borderWidth = orig.borderWidth;
        this.onClickEventId = onClickEventId;
    };
    return Button;
}(Label_1["default"]));
exports["default"] = Button;
},{"../../Utils/Color":94,"./Label":49}],49:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HAlign = exports.VAlign = void 0;
var Vec2_1 = require("../../DataTypes/Vec2");
var Color_1 = require("../../Utils/Color");
var UIElement_1 = require("../UIElement");
/** A basic text-containing label */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(position, text) {
        var _this = _super.call(this, position) || this;
        _this.text = text;
        _this.textColor = new Color_1["default"](0, 0, 0, 1);
        _this.font = "Arial";
        _this.fontSize = 30;
        _this.hAlign = "center";
        _this.vAlign = "center";
        _this.sizeAssigned = false;
        return _this;
    }
    // @deprecated
    Label.prototype.setText = function (text) {
        this.text = text;
    };
    // @deprecated
    Label.prototype.setTextColor = function (color) {
        this.textColor = color;
    };
    /**
     * Gets a string containg the font details for rendering
     * @returns A string containing the font details
     */
    Label.prototype.getFontString = function () {
        return this.fontSize + "px " + this.font;
    };
    /**
     * Overridable method for calculating text color - useful for elements that want to be colored on different after certain events
     * @returns a string containg the text color
     */
    Label.prototype.calculateTextColor = function () {
        return this.textColor.toStringRGBA();
    };
    /**
     * Uses the canvas to calculate the width of the text
     * @param ctx The rendering context
     * @returns A number representing the rendered text width
     */
    Label.prototype.calculateTextWidth = function (ctx) {
        ctx.font = this.fontSize + "px " + this.font;
        return ctx.measureText(this.text).width;
    };
    Label.prototype.setHAlign = function (align) {
        this.hAlign = align;
    };
    Label.prototype.setVAlign = function (align) {
        this.vAlign = align;
    };
    /**
     * Calculate the offset of the text - this is used for rendering text with different alignments
     * @param ctx The rendering context
     * @returns The offset of the text in a Vec2
     */
    Label.prototype.calculateTextOffset = function (ctx) {
        var textWidth = this.calculateTextWidth(ctx);
        var offset = new Vec2_1["default"](0, 0);
        var hDiff = this.size.x - textWidth;
        if (this.hAlign === HAlign.CENTER) {
            offset.x = hDiff / 2;
        }
        else if (this.hAlign === HAlign.RIGHT) {
            offset.x = hDiff;
        }
        if (this.vAlign === VAlign.TOP) {
            ctx.textBaseline = "top";
            offset.y = 0;
        }
        else if (this.vAlign === VAlign.BOTTOM) {
            ctx.textBaseline = "bottom";
            offset.y = this.size.y;
        }
        else {
            ctx.textBaseline = "middle";
            offset.y = this.size.y / 2;
        }
        return offset;
    };
    Label.prototype.sizeChanged = function () {
        _super.prototype.sizeChanged.call(this);
        this.sizeAssigned = true;
    };
    /**
     * Automatically sizes the element to the text within it
     * @param ctx The rendering context
     */
    Label.prototype.autoSize = function (ctx) {
        var width = this.calculateTextWidth(ctx);
        var height = this.fontSize;
        this.size.set(width + this.padding.x * 2, height + this.padding.y * 2);
        this.sizeAssigned = true;
    };
    /**
     * Initially assigns a size to the UIElement if none is provided
     * @param ctx The rendering context
     */
    Label.prototype.handleInitialSizing = function (ctx) {
        if (!this.sizeAssigned) {
            this.autoSize(ctx);
        }
    };
    /** On the next render, size this element to it's current text using its current font size */
    Label.prototype.sizeToText = function () {
        this.sizeAssigned = false;
    };
    Object.defineProperty(Label.prototype, "textAlpha", {
        get: function () {
            return this.textColor.a;
        },
        set: function (a) {
            this.textColor.a = a;
        },
        enumerable: false,
        configurable: true
    });
    return Label;
}(UIElement_1["default"]));
exports["default"] = Label;
var VAlign;
(function (VAlign) {
    VAlign["TOP"] = "top";
    VAlign["CENTER"] = "center";
    VAlign["BOTTOM"] = "bottom";
})(VAlign = exports.VAlign || (exports.VAlign = {}));
var HAlign;
(function (HAlign) {
    HAlign["LEFT"] = "left";
    HAlign["CENTER"] = "center";
    HAlign["RIGHT"] = "right";
})(HAlign = exports.HAlign || (exports.HAlign = {}));
},{"../../DataTypes/Vec2":20,"../../Utils/Color":94,"../UIElement":47}],50:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../DataTypes/Vec2");
var Input_1 = require("../../Input/Input");
var Color_1 = require("../../Utils/Color");
var MathUtils_1 = require("../../Utils/MathUtils");
var UIElement_1 = require("../UIElement");
/** A slider UIElement */
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(position, initValue) {
        var _this = _super.call(this, position) || this;
        _this.value = initValue;
        _this.nibColor = Color_1["default"].RED;
        _this.sliderColor = Color_1["default"].BLACK;
        _this.backgroundColor = Color_1["default"].TRANSPARENT;
        _this.borderColor = Color_1["default"].TRANSPARENT;
        _this.nibSize = new Vec2_1["default"](10, 20);
        // Set a default size
        _this.size.set(200, 20);
        return _this;
    }
    /**
     * Retrieves the value of the slider
     * @returns The value of the slider
     */
    Slider.prototype.getValue = function () {
        return this.value;
    };
    /** A method called in response to the value changing */
    Slider.prototype.valueChanged = function () {
        if (this.onValueChange) {
            this.onValueChange(this.value);
        }
        if (this.onValueChangeEventId) {
            this.emitter.fireEvent(this.onValueChangeEventId, { target: this, value: this.value });
        }
    };
    Slider.prototype.update = function (deltaT) {
        _super.prototype.update.call(this, deltaT);
        if (this.isClicked) {
            var val = MathUtils_1["default"].invLerp(this.position.x - this.size.x / 2, this.position.x + this.size.x / 2, Input_1["default"].getMousePosition().x);
            this.value = MathUtils_1["default"].clamp01(val);
            this.valueChanged();
        }
    };
    return Slider;
}(UIElement_1["default"]));
exports["default"] = Slider;
},{"../../DataTypes/Vec2":20,"../../Input/Input":28,"../../Utils/Color":94,"../../Utils/MathUtils":97,"../UIElement":47}],51:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Color_1 = require("../../Utils/Color");
var Label_1 = require("./Label");
var Input_1 = require("../../Input/Input");
/** A text input UIElement */
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(position) {
        var _this = _super.call(this, position, "") || this;
        _this.focused = false;
        _this.cursorCounter = 0;
        // Give a default size to the x only
        _this.size.set(200, _this.fontSize);
        _this.hAlign = "left";
        _this.borderColor = Color_1["default"].BLACK;
        _this.backgroundColor = Color_1["default"].WHITE;
        return _this;
    }
    TextInput.prototype.update = function (deltaT) {
        _super.prototype.update.call(this, deltaT);
        if (Input_1["default"].isMouseJustPressed()) {
            var clickPos = Input_1["default"].getMousePressPosition();
            if (this.contains(clickPos.x, clickPos.y)) {
                this.focused = true;
                this.cursorCounter = 30;
            }
            else {
                this.focused = false;
            }
        }
        if (this.focused) {
            var keys = Input_1["default"].getKeysJustPressed();
            var nums = "1234567890";
            var specialChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
            var letters = "qwertyuiopasdfghjklzxcvbnm";
            var mask_1 = nums + specialChars + letters;
            keys = keys.filter(function (key) { return mask_1.includes(key); });
            var shiftPressed = Input_1["default"].isKeyPressed("shift");
            var backspacePressed = Input_1["default"].isKeyJustPressed("backspace");
            var spacePressed = Input_1["default"].isKeyJustPressed("space");
            if (backspacePressed) {
                this.text = this.text.substring(0, this.text.length - 1);
            }
            else if (spacePressed) {
                this.text += " ";
            }
            else if (keys.length > 0) {
                if (shiftPressed) {
                    this.text += keys[0].toUpperCase();
                }
                else {
                    this.text += keys[0];
                }
            }
        }
    };
    return TextInput;
}(Label_1["default"]));
exports["default"] = TextInput;
},{"../../Input/Input":28,"../../Utils/Color":94,"./Label":49}],52:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.UIElementType = void 0;
var UIElementType;
(function (UIElementType) {
    UIElementType["BUTTON"] = "BUTTON";
    UIElementType["LABEL"] = "LABEL";
    UIElementType["SLIDER"] = "SLIDER";
    UIElementType["TEXT_INPUT"] = "TEXTINPUT";
})(UIElementType = exports.UIElementType || (exports.UIElementType = {}));
},{}],53:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
/**
 * The manager class for navigation.
 * Handles all navigable entities, such and allows them to be accessed by outside systems by requesting a path
 * from one position to another.
 */
var NavigationManager = /** @class */ (function () {
    function NavigationManager() {
        this.navigableEntities = new Map_1["default"]();
    }
    /**
     * Adds a navigable entity to the NavigationManager
     * @param navName The name of the navigable entitry
     * @param nav The actual Navigable instance
     */
    NavigationManager.prototype.addNavigableEntity = function (navName, nav) {
        this.navigableEntities.add(navName, nav);
    };
    /**
     * Gets a path frome one point to another using a specified Navigable object
     * @param navName The name of the registered Navigable object
     * @param fromPosition The starting position of navigation
     * @param toPosition The ending position of Navigation
     * @param direct If true, go direct from fromPosition to toPosition, don't use NavMesh
     * @returns A NavigationPath containing the route to take over the Navigable entity to get between the provided positions.
     */
    NavigationManager.prototype.getPath = function (navName, fromPosition, toPosition, direct) {
        var nav = this.navigableEntities.get(navName);
        return nav.getNavigationPath(fromPosition.clone(), toPosition.clone(), direct);
    };
    return NavigationManager;
}());
exports["default"] = NavigationManager;
},{"../DataTypes/Map":8}],54:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../DataTypes/Vec2");
/**
 * A path that AIs can follow. Uses finishMove() in Physical to determine progress on the route
 */
var NavigationPath = /** @class */ (function () {
    /**
     * Constructs a new NavigationPath
     * @param path The path of nodes to take
     */
    function NavigationPath(path) {
        this.path = path;
        this.currentMoveDirection = Vec2_1["default"].ZERO;
        this.distanceThreshold = 4;
    }
    /**
     * Returns the status of navigation along this NavigationPath
     * @returns True if the node has reached the end of the path, false otherwise
     */
    NavigationPath.prototype.isDone = function () {
        return this.path.isEmpty();
    };
    /**
     * Gets the movement direction in the current position along the path
     * @param node The node to move along the path
     * @returns The movement direction as a Vec2
     */
    NavigationPath.prototype.getMoveDirection = function (node) {
        // Return direction to next point in the nav
        return node.position.dirTo(this.path.peek());
    };
    /**
     * Updates this NavigationPath to the current state of the GameNode
     * @param node The node moving along the path
     */
    NavigationPath.prototype.handlePathProgress = function (node) {
        if (node.position.distanceSqTo(this.path.peek()) < this.distanceThreshold * this.distanceThreshold) {
            // We've reached our node, move on to the next destination
            this.path.pop();
        }
    };
    NavigationPath.prototype.toString = function () {
        return this.path.toString();
    };
    return NavigationPath;
}());
exports["default"] = NavigationPath;
},{"../DataTypes/Vec2":20}],55:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Stack_1 = require("../DataTypes/Stack");
var GraphUtils_1 = require("../Utils/GraphUtils");
var NavigationPath_1 = require("./NavigationPath");
/**
 * An implementation of a Navmesh. Navmeshes are graphs in the game world along which nodes can move.
 */
var Navmesh = /** @class */ (function () {
    /**
     * Creates a new Navmesh from the points in the speecified graph
     * @param graph The graph to construct a navmesh from
     */
    function Navmesh(graph) {
        this.graph = graph;
    }
    // @implemented
    Navmesh.prototype.getNavigationPath = function (fromPosition, toPosition, direct) {
        var start = this.getClosestNode(fromPosition);
        var end = this.getClosestNode(toPosition);
        var pathStack = new Stack_1["default"](this.graph.numVertices);
        // Push the final position and the final position in the graph
        pathStack.push(toPosition.clone());
        if (direct) {
            return new NavigationPath_1["default"](pathStack);
        }
        pathStack.push(this.graph.positions[end]);
        var parent = GraphUtils_1["default"].djikstra(this.graph, start);
        // Add all parents along the path
        var i = end;
        while (parent[i] !== -1) {
            pathStack.push(this.graph.positions[parent[i]]);
            i = parent[i];
        }
        return new NavigationPath_1["default"](pathStack);
    };
    /**
     * Gets the closest node in this Navmesh to the specified position
     * @param position The position to query
     * @returns The index of the closest node in the Navmesh to the position
     */
    Navmesh.prototype.getClosestNode = function (position) {
        var n = this.graph.numVertices;
        var i = 1;
        var index = 0;
        var dist = position.distanceSqTo(this.graph.positions[0]);
        while (i < n) {
            var d = position.distanceSqTo(this.graph.positions[i]);
            if (d < dist) {
                dist = d;
                index = i;
            }
            i++;
        }
        return index;
    };
    return Navmesh;
}());
exports["default"] = Navmesh;
},{"../DataTypes/Stack":17,"../Utils/GraphUtils":96,"./NavigationPath":54}],56:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var PhysicsManager_1 = require("./PhysicsManager");
var Vec2_1 = require("../DataTypes/Vec2");
var AABB_1 = require("../DataTypes/Shapes/AABB");
var OrthogonalTilemap_1 = require("../Nodes/Tilemaps/OrthogonalTilemap");
var AreaCollision_1 = require("../DataTypes/Physics/AreaCollision");
/**
 * ALGORITHM:
 * 	In an effort to keep things simple and working effectively, each dynamic node will resolve its
 * 	collisions considering the rest of the world as static.
 *
 * 	Collision detecting will happen first. This can be considered a broad phase, but it is not especially
 * 	efficient, as it does not need to be for this game engine. Every dynamic node is checked against every
 * 	other node for collision area. If collision area is non-zero (meaning the current node sweeps into another),
 * 	it is added to a list of hits.
 *
 * 	INITIALIZATION:
 * 		- Physics constants are reset
 * 		- Swept shapes are recalculated. If a node isn't moving, it is skipped.
 *
 * 	COLLISION DETECTION:
 * 		- For a node, collision area will be calculated using the swept AABB of the node against every other AABB in a static state
 * 		- These collisions will be sorted by area in descending order
 *
 * 	COLLISION RESOLUTION:
 * 		- For each hit, time of collision is calculated using a swept line through the AABB of the static node expanded
 * 			with minkowski sums (discretely, but the concept is there)
 * 		- The collision is resolved based on the near time of the collision (from method of separated axes)
 * 			- X is resolved by near x, Y by near y.
 * 			- There is some fudging to allow for sliding along walls of separate colliders. Sorting by area also helps with this.
 * 			- Corner to corner collisions are resolve to favor x-movement. This is in consideration of platformers, to give
 * 				the player some help with jumps
 *
 * 	Pros:
 * 		- Everything happens with a consistent time. There is a distinct before and after for each resolution.
 * 		- No back-tracking needs to be done. Once we resolve a node, it is definitively resolved.
 *
 * 	Cons:
 * 		- Nodes that are processed early have movement priority over other nodes. This can lead to some undesirable interactions.
 */
var BasicPhysicsManager = /** @class */ (function (_super) {
    __extends(BasicPhysicsManager, _super);
    function BasicPhysicsManager(options) {
        var _this = _super.call(this) || this;
        _this.staticNodes = new Array();
        _this.dynamicNodes = new Array();
        _this.tilemaps = new Array();
        _this.collisionMasks = new Array(32);
        // Parse options
        _this.parseOptions(options);
        return _this;
    }
    /**
     * Parses the options for constructing the physics manager
     * @param options A record of options
     */
    BasicPhysicsManager.prototype.parseOptions = function (options) {
        if (options.groupNames !== undefined && options.collisions !== undefined) {
            for (var i = 0; i < options.groupNames.length; i++) {
                var group = options.groupNames[i];
                // Register the group name and number
                this.groupNames[i] = group;
                this.groupMap.set(group, 1 << i);
                var collisionMask = 0;
                for (var j = 0; j < options.collisions[i].length; j++) {
                    if (options.collisions[i][j]) {
                        collisionMask |= 1 << j;
                    }
                }
                this.collisionMasks[i] = collisionMask;
            }
        }
    };
    // @override
    BasicPhysicsManager.prototype.registerObject = function (node) {
        if (node.isStatic) {
            // Static and not collidable
            this.staticNodes.push(node);
        }
        else {
            // Dynamic and not collidable
            this.dynamicNodes.push(node);
        }
    };
    // @override
    BasicPhysicsManager.prototype.deregisterObject = function (node) {
        if (node.isStatic) {
            // Remove the node from the static list
            var index = this.staticNodes.indexOf(node);
            this.staticNodes.splice(index, 1);
        }
        else {
            // Remove the node from the dynamic list
            var index = this.dynamicNodes.indexOf(node);
            this.dynamicNodes.splice(index, 1);
        }
    };
    // @override
    BasicPhysicsManager.prototype.registerTilemap = function (tilemap) {
        this.tilemaps.push(tilemap);
    };
    // @override
    BasicPhysicsManager.prototype.deregisterTilemap = function (tilemap) {
        var index = this.tilemaps.indexOf(tilemap);
        this.tilemaps.splice(index, 1);
    };
    // @override
    BasicPhysicsManager.prototype.update = function (deltaT) {
        for (var _i = 0, _a = this.dynamicNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            /*---------- INITIALIZATION PHASE ----------*/
            // Clear frame dependent boolean values for each node
            node.onGround = false;
            node.onCeiling = false;
            node.onWall = false;
            node.collidedWithTilemap = false;
            node.isColliding = false;
            // If this node is not active, don't process it
            if (!node.active) {
                continue;
            }
            // Update the swept shapes of each node
            if (node.moving) {
                // If moving, reflect that in the swept shape
                node.sweptRect.sweep(node._velocity, node.collisionShape.center, node.collisionShape.halfSize);
            }
            else {
                // If our node isn't moving, don't bother to check it (other nodes will detect if they run into it)
                node._velocity.zero();
                continue;
            }
            /*---------- DETECTION PHASE ----------*/
            // Gather a set of overlaps
            var overlaps = new Array();
            var groupIndex = node.group === -1 ? -1 : Math.log2(node.group);
            // First, check this node against every static node (order doesn't actually matter here, since we sort anyways)
            for (var _b = 0, _c = this.staticNodes; _b < _c.length; _b++) {
                var other = _c[_b];
                // Ignore inactive nodes
                if (!other.active)
                    continue;
                var collider = other.collisionShape.getBoundingRect();
                var area = node.sweptRect.overlapArea(collider);
                if (area > 0) {
                    // We had a collision
                    overlaps.push(new AreaCollision_1["default"](area, collider, other, "GameNode", null));
                }
            }
            // Then, check it against every dynamic node
            for (var _d = 0, _e = this.dynamicNodes; _d < _e.length; _d++) {
                var other = _e[_d];
                // Ignore ourselves
                if (node === other)
                    continue;
                // Ignore inactive nodes
                if (!other.active)
                    continue;
                var collider = other.collisionShape.getBoundingRect();
                var area = node.sweptRect.overlapArea(collider);
                if (area > 0) {
                    // We had a collision
                    overlaps.push(new AreaCollision_1["default"](area, collider, other, "GameNode", null));
                }
            }
            // Lastly, gather a set of AABBs from the tilemap.
            // This step involves the most extra work, so it is abstracted into a method
            for (var _f = 0, _g = this.tilemaps; _f < _g.length; _f++) {
                var tilemap = _g[_f];
                // Ignore inactive tilemaps
                if (!tilemap.active)
                    continue;
                if (tilemap instanceof OrthogonalTilemap_1["default"]) {
                    this.collideWithOrthogonalTilemap(node, tilemap, overlaps);
                }
            }
            // Sort the overlaps by area
            overlaps = overlaps.sort(function (a, b) { return b.area - a.area; });
            // Keep track of hits to use later
            var hits = [];
            /*---------- RESOLUTION PHASE ----------*/
            // For every overlap, determine if we need to collide with it and when
            for (var _h = 0, overlaps_1 = overlaps; _h < overlaps_1.length; _h++) {
                var overlap = overlaps_1[_h];
                // Ignore nodes we don't interact with
                if (groupIndex !== -1 && overlap.other.group !== -1 && ((this.collisionMasks[groupIndex] & overlap.other.group) === 0))
                    continue;
                // Do a swept line test on the static AABB with this AABB size as padding (this is basically using a minkowski sum!)
                // Start the sweep at the position of this node with a delta of _velocity
                var point = node.collisionShape.center;
                var delta = node._velocity;
                var padding = node.collisionShape.halfSize;
                var otherAABB = overlap.collider;
                var hit = otherAABB.intersectSegment(node.collisionShape.center, node._velocity, node.collisionShape.halfSize);
                overlap.hit = hit;
                if (hit !== null) {
                    hits.push(hit);
                    // We got a hit, resolve with the time inside of the hit
                    var tnearx = hit.nearTimes.x;
                    var tneary = hit.nearTimes.y;
                    // Allow edge clipping (edge overlaps don't count, only area overlaps)
                    // Importantly don't allow both cases to be true. Then we clip through corners. Favor x to help players land jumps
                    if (tnearx < 1.0 && (point.y === otherAABB.top - padding.y || point.y === otherAABB.bottom + padding.y) && delta.x !== 0) {
                        tnearx = 1.0;
                    }
                    else if (tneary < 1.0 && (point.x === otherAABB.left - padding.x || point.x === otherAABB.right + padding.x) && delta.y !== 0) {
                        tneary = 1.0;
                    }
                    if (hit.nearTimes.x >= 0 && hit.nearTimes.x < 1) {
                        // Any tilemap objects that made it here are collidable
                        if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                            node._velocity.x = node._velocity.x * tnearx;
                            node.isColliding = true;
                        }
                    }
                    if (hit.nearTimes.y >= 0 && hit.nearTimes.y < 1) {
                        // Any tilemap objects that made it here are collidable
                        if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                            node._velocity.y = node._velocity.y * tneary;
                            node.isColliding = true;
                        }
                    }
                }
            }
            /*---------- INFORMATION/TRIGGER PHASE ----------*/
            // Check if we ended up on the ground, ceiling or wall
            // Also check for triggers
            for (var _j = 0, overlaps_2 = overlaps; _j < overlaps_2.length; _j++) {
                var overlap = overlaps_2[_j];
                // Check for a trigger. If we care about the trigger, react
                if (overlap.other.isTrigger && (overlap.other.triggerMask & node.group)) {
                    // Get the bit that this group is represented by
                    var index = Math.floor(Math.log2(node.group));
                    // Extract the triggerEnter event name
                    this.emitter.fireEvent(overlap.other.triggerEnters[index], {
                        node: node.id,
                        other: overlap.other.id
                    });
                }
                // Ignore collision sides for nodes we don't interact with
                if (groupIndex !== -1 && overlap.other.group !== -1 && ((this.collisionMasks[groupIndex] & overlap.other.group) === 0))
                    continue;
                // Only check for direction if the overlap was collidable
                if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                    var collisionSide = overlap.collider.touchesAABBWithoutCorners(node.collisionShape.getBoundingRect());
                    if (collisionSide !== null) {
                        // If we touch, not including corner cases, check the collision normal
                        if (overlap.hit !== null) {
                            // If we hit a tilemap, keep track of it
                            if (overlap.type == "Tilemap") {
                                node.collidedWithTilemap = true;
                            }
                            if (collisionSide.y === -1) {
                                // Node is on top of overlap, so onGround
                                node.onGround = true;
                            }
                            else if (collisionSide.y === 1) {
                                // Node is on bottom of overlap, so onCeiling
                                node.onCeiling = true;
                            }
                            else {
                                // Node wasn't touching on y, so it is touching on x
                                node.onWall = true;
                            }
                        }
                    }
                }
            }
            // Resolve the collision with the node, and move it
            node.finishMove();
        }
    };
    /**
     * Handles a collision between this node and an orthogonal tilemap
     * @param node The node
     * @param tilemap The tilemap the node may be colliding with
     * @param overlaps The list of overlaps
     */
    BasicPhysicsManager.prototype.collideWithOrthogonalTilemap = function (node, tilemap, overlaps) {
        // Get the min and max x and y coordinates of the moving node
        var min = new Vec2_1["default"](node.sweptRect.left, node.sweptRect.top);
        var max = new Vec2_1["default"](node.sweptRect.right, node.sweptRect.bottom);
        // Convert the min/max x/y to the min and max row/col in the tilemap array
        var minIndex = tilemap.getColRowAt(min);
        var maxIndex = tilemap.getColRowAt(max);
        var tileSize = tilemap.getTileSize();
        // Loop over all possible tiles (which isn't many in the scope of the velocity per frame)
        for (var col = minIndex.x; col <= maxIndex.x; col++) {
            for (var row = minIndex.y; row <= maxIndex.y; row++) {
                if (tilemap.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    var tilePos = new Vec2_1["default"](col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);
                    // Create a new collider for this tile
                    var collider = new AABB_1["default"](tilePos, tileSize.scaled(1 / 2));
                    // Calculate collision area between the node and the tile
                    var area = node.sweptRect.overlapArea(collider);
                    if (area > 0) {
                        // We had a collision
                        overlaps.push(new AreaCollision_1["default"](area, collider, tilemap, "Tilemap", new Vec2_1["default"](col, row)));
                    }
                }
            }
        }
    };
    return BasicPhysicsManager;
}(PhysicsManager_1["default"]));
exports["default"] = BasicPhysicsManager;
},{"../DataTypes/Physics/AreaCollision":10,"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":20,"../Nodes/Tilemaps/OrthogonalTilemap":46,"./PhysicsManager":57}],57:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Receiver_1 = require("../Events/Receiver");
var Emitter_1 = require("../Events/Emitter");
var Map_1 = require("../DataTypes/Map");
/**
 * An abstract physics manager.
 * This class exposes functions for subclasses to implement that should allow for a working physics system to be created.
 */
var PhysicsManager = /** @class */ (function () {
    function PhysicsManager() {
        this.receiver = new Receiver_1["default"]();
        this.emitter = new Emitter_1["default"]();
        // The creation and implementation of layers is deferred to the subclass
        this.groupMap = new Map_1["default"]();
        this.groupNames = new Array();
    }
    PhysicsManager.prototype.destroy = function () {
        this.receiver.destroy();
    };
    /**
     * Sets the physics layer of the GameNode
     * @param node The GameNode
     * @param group The group that the GameNode should be on
     */
    PhysicsManager.prototype.setGroup = function (node, group) {
        node.group = this.groupMap.get(group);
    };
    /**
     * Retrieves the layer number associated with the provided name
     * @param layer The name of the layer
     * @returns The layer number, or 0 if there is not a layer with that name registered
     */
    PhysicsManager.prototype.getGroupNumber = function (group) {
        if (this.groupMap.has(group)) {
            return this.groupMap.get(group);
        }
        else {
            return 0;
        }
    };
    /**
     * Gets all group names associated with the number provided
     * @param groups A mask of groups
     * @returns All groups contained in the mask
     */
    PhysicsManager.prototype.getGroupNames = function (groups) {
        if (groups === -1) {
            return [PhysicsManager.DEFAULT_GROUP];
        }
        else {
            var g = 1;
            var names = [];
            for (var i = 0; i < 32; i++) {
                if (g & groups) {
                    // This group is in the groups number
                    names.push(this.groupNames[i]);
                }
                // Shift the bit over
                g = g << 1;
            }
        }
    };
    /** The default group name */
    PhysicsManager.DEFAULT_GROUP = "Default";
    return PhysicsManager;
}());
exports["default"] = PhysicsManager;
},{"../DataTypes/Map":8,"../Events/Emitter":23,"../Events/Receiver":27}],58:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Queue_1 = require("../DataTypes/Queue");
var Receiver_1 = require("../Events/Receiver");
var EventQueue_1 = require("../Events/EventQueue");
var GameEventType_1 = require("../Events/GameEventType");
// @ignorePage
var Recorder = /** @class */ (function () {
    function Recorder() {
        this.receiver = new Receiver_1["default"]();
        this.log = new Queue_1["default"](1000);
        this.recording = false;
        this.playing = false;
        this.frame = 0;
        this.eventQueue = EventQueue_1["default"].getInstance();
        this.eventQueue.subscribe(this.receiver, "all");
    }
    Recorder.prototype.update = function (deltaT) {
        if (this.recording) {
            this.frame += 1;
        }
        if (this.playing) {
            // If playing, ignore events, just feed the record to the event queue
            this.receiver.ignoreEvents();
            /*
                While there is a next item, and while it should occur in this frame,
                send the event. i.e., while current_frame * current_delta_t is greater
                than recorded_frame * recorded_delta_t
            */
            while (this.log.hasItems()
                && this.log.peekNext().frame * this.log.peekNext().delta < this.frame * deltaT) {
                var event_1 = this.log.dequeue().event;
                console.log(event_1);
                this.eventQueue.addEvent(event_1);
            }
            if (!this.log.hasItems()) {
                this.playing = false;
            }
            this.frame += 1;
        }
        else {
            // If not playing, handle events
            while (this.receiver.hasNextEvent()) {
                var event_2 = this.receiver.getNextEvent();
                if (event_2.type === GameEventType_1.GameEventType.STOP_RECORDING) {
                    this.recording = false;
                }
                if (this.recording) {
                    this.log.enqueue(new LogItem(this.frame, deltaT, event_2));
                }
                if (event_2.type === GameEventType_1.GameEventType.START_RECORDING) {
                    this.log.clear();
                    this.recording = true;
                    this.frame = 0;
                }
                if (event_2.type === GameEventType_1.GameEventType.PLAY_RECORDING) {
                    this.frame = 0;
                    this.recording = false;
                    this.playing = true;
                }
            }
        }
    };
    return Recorder;
}());
exports["default"] = Recorder;
var LogItem = /** @class */ (function () {
    function LogItem(frame, deltaT, event) {
        this.frame = frame;
        this.delta = deltaT;
        this.event = event;
    }
    return LogItem;
}());
},{"../DataTypes/Queue":12,"../Events/EventQueue":24,"../Events/GameEventType":26,"../Events/Receiver":27}],59:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Map_1 = require("../../DataTypes/Map");
/** */
var Registry = /** @class */ (function (_super) {
    __extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(Map_1["default"]));
exports["default"] = Registry;
},{"../../DataTypes/Map":8}],60:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var LabelShaderType_1 = require("../../Rendering/WebGLRendering/ShaderTypes/LabelShaderType");
var PointShaderType_1 = require("../../Rendering/WebGLRendering/ShaderTypes/PointShaderType");
var RectShaderType_1 = require("../../Rendering/WebGLRendering/ShaderTypes/RectShaderType");
var SpriteShaderType_1 = require("../../Rendering/WebGLRendering/ShaderTypes/SpriteShaderType");
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var Registry_1 = require("./Registry");
/**
 * A registry that handles shaders
 */
var ShaderRegistry = /** @class */ (function (_super) {
    __extends(ShaderRegistry, _super);
    function ShaderRegistry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registryItems = new Array();
        return _this;
    }
    /**
     * Preloads all built-in shaders
     */
    ShaderRegistry.prototype.preload = function () {
        // Get the resourceManager and queue all built-in shaders for preloading
        var rm = ResourceManager_1["default"].getInstance();
        // Queue a load for the point shader
        this.registerAndPreloadItem(ShaderRegistry.POINT_SHADER, PointShaderType_1["default"], "builtin/shaders/point.vshader", "builtin/shaders/point.fshader");
        // Queue a load for the rect shader
        this.registerAndPreloadItem(ShaderRegistry.RECT_SHADER, RectShaderType_1["default"], "builtin/shaders/rect.vshader", "builtin/shaders/rect.fshader");
        // Queue a load for the sprite shader
        this.registerAndPreloadItem(ShaderRegistry.SPRITE_SHADER, SpriteShaderType_1["default"], "builtin/shaders/sprite.vshader", "builtin/shaders/sprite.fshader");
        // Queue a load for the label shader
        this.registerAndPreloadItem(ShaderRegistry.LABEL_SHADER, LabelShaderType_1["default"], "builtin/shaders/label.vshader", "builtin/shaders/label.fshader");
        // Queue a load for any preloaded items
        for (var _i = 0, _a = this.registryItems; _i < _a.length; _i++) {
            var item = _a[_i];
            var shader = new item.constr(item.key);
            shader.initBufferObject();
            this.add(item.key, shader);
            // Load if desired
            if (item.preload !== undefined) {
                rm.shader(item.key, item.preload.vshaderLocation, item.preload.fshaderLocation);
            }
        }
    };
    /**
     * Registers a shader in the registry and loads it before the game begins
     * @param key The key you wish to assign to the shader
     * @param constr The constructor of the ShaderType
     * @param vshaderLocation The location of the vertex shader
     * @param fshaderLocation the location of the fragment shader
     */
    ShaderRegistry.prototype.registerAndPreloadItem = function (key, constr, vshaderLocation, fshaderLocation) {
        var shaderPreload = new ShaderPreload();
        shaderPreload.vshaderLocation = vshaderLocation;
        shaderPreload.fshaderLocation = fshaderLocation;
        var registryItem = new ShaderRegistryItem();
        registryItem.key = key;
        registryItem.constr = constr;
        registryItem.preload = shaderPreload;
        this.registryItems.push(registryItem);
    };
    /**
     * Registers a shader in the registry. NOTE: If you use this, you MUST load the shader before use.
     * If you wish to preload the shader, use registerAndPreloadItem()
     * @param key The key you wish to assign to the shader
     * @param constr The constructor of the ShaderType
     */
    ShaderRegistry.prototype.registerItem = function (key, constr) {
        var registryItem = new ShaderRegistryItem();
        registryItem.key = key;
        registryItem.constr = constr;
        this.registryItems.push(registryItem);
    };
    // Shader names
    ShaderRegistry.POINT_SHADER = "point";
    ShaderRegistry.RECT_SHADER = "rect";
    ShaderRegistry.SPRITE_SHADER = "sprite";
    ShaderRegistry.LABEL_SHADER = "label";
    return ShaderRegistry;
}(Registry_1["default"]));
exports["default"] = ShaderRegistry;
var ShaderRegistryItem = /** @class */ (function () {
    function ShaderRegistryItem() {
    }
    return ShaderRegistryItem;
}());
var ShaderPreload = /** @class */ (function () {
    function ShaderPreload() {
    }
    return ShaderPreload;
}());
},{"../../Rendering/WebGLRendering/ShaderTypes/LabelShaderType":74,"../../Rendering/WebGLRendering/ShaderTypes/PointShaderType":75,"../../Rendering/WebGLRendering/ShaderTypes/RectShaderType":77,"../../Rendering/WebGLRendering/ShaderTypes/SpriteShaderType":78,"../../ResourceManager/ResourceManager":79,"./Registry":59}],61:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
var ShaderRegistry_1 = require("./Registries/ShaderRegistry");
/**
 * The Registry is the system's way of converting classes and types into string
 * representations for use elsewhere in the application.
 * It allows classes to be accessed without explicitly using constructors in code,
 * and for resources to be loaded at Game creation time.
 */
var RegistryManager = /** @class */ (function () {
    function RegistryManager() {
    }
    RegistryManager.preload = function () {
        var _this = this;
        this.shaders.preload();
        this.registries.forEach(function (key) { return _this.registries.get(key).preload(); });
    };
    RegistryManager.addCustomRegistry = function (name, registry) {
        this.registries.add(name, registry);
    };
    RegistryManager.getRegistry = function (key) {
        return this.registries.get(key);
    };
    RegistryManager.shaders = new ShaderRegistry_1["default"]();
    /** Additional custom registries to add to the registry manager */
    RegistryManager.registries = new Map_1["default"]();
    return RegistryManager;
}());
exports["default"] = RegistryManager;
},{"../DataTypes/Map":8,"./Registries/ShaderRegistry":60}],62:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../../DataTypes/Map");
var Emitter_1 = require("../../Events/Emitter");
var AnimationTypes_1 = require("./AnimationTypes");
/**
 * An animation manager class for an animated CanvasNode.
 * This class keeps track of the possible animations, as well as the current animation state,
 * and abstracts all interactions with playing, pausing, and stopping animations as well as
 * creating new animations from the CanvasNode.
 */
var AnimationManager = /** @class */ (function () {
    /**
     * Creates a new AnimationManager
     * @param owner The owner of the AnimationManager
     */
    function AnimationManager(owner) {
        this.owner = owner;
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
        this.currentAnimation = "";
        this.currentFrame = 0;
        this.frameProgress = 0;
        this.loop = false;
        this.animations = new Map_1["default"]();
        this.onEndEvent = null;
        this.emitter = new Emitter_1["default"]();
    }
    /**
     * Add an animation to this sprite
     * @param key The unique key of the animation
     * @param animation The animation data
     */
    AnimationManager.prototype.add = function (key, animation) {
        this.animations.add(key, animation);
    };
    /**
     * Gets the index specified by the current animation and current frame
     * @returns The index in the current animation
     */
    AnimationManager.prototype.getIndex = function () {
        if (this.animations.has(this.currentAnimation)) {
            return this.animations.get(this.currentAnimation).frames[this.currentFrame].index;
        }
        else {
            // No current animation, warn the user
            console.warn("Animation index was requested, but the current animation: ".concat(this.currentAnimation, " was invalid"));
            return 0;
        }
    };
    /**
     * Determines whether the specified animation is currently playing
     * @param key The key of the animation to check
     * @returns true if the specified animation is playing, false otherwise
     */
    AnimationManager.prototype.isPlaying = function (key) {
        return this.currentAnimation === key && this.animationState === AnimationTypes_1.AnimationState.PLAYING;
    };
    /**
     * Retrieves the current animation index and advances the animation frame
     * @returns The index of the animation frame
     */
    AnimationManager.prototype.getIndexAndAdvanceAnimation = function () {
        // If we aren't playing, we won't be advancing the animation
        if (!(this.animationState === AnimationTypes_1.AnimationState.PLAYING)) {
            return this.getIndex();
        }
        if (this.animations.has(this.currentAnimation)) {
            var currentAnimation = this.animations.get(this.currentAnimation);
            var index = currentAnimation.frames[this.currentFrame].index;
            // Advance the animation
            this.frameProgress += 1;
            if (this.frameProgress >= currentAnimation.frames[this.currentFrame].duration) {
                // We have been on this frame for its whole duration, go to the next one
                this.frameProgress = 0;
                this.currentFrame += 1;
                if (this.currentFrame >= currentAnimation.frames.length) {
                    // We have reached the end of this animation
                    if (this.loop) {
                        this.currentFrame = 0;
                        this.frameProgress = 0;
                    }
                    else {
                        this.endCurrentAnimation();
                    }
                }
            }
            // Return the current index
            return index;
        }
        else {
            // No current animation, can't advance. Warn the user
            console.warn("Animation index and advance was requested, but the current animation (".concat(this.currentAnimation, ") in node with id: ").concat(this.owner.id, " was invalid"));
            return 0;
        }
    };
    /** Ends the current animation and fires any necessary events, as well as starting any new animations */
    AnimationManager.prototype.endCurrentAnimation = function () {
        this.currentFrame = 0;
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
        if (this.onEndEvent !== null) {
            this.emitter.fireEvent(this.onEndEvent, { owner: this.owner.id, animation: this.currentAnimation });
        }
        // If there is a pending animation, play it
        if (this.pendingAnimation !== null) {
            this.play(this.pendingAnimation, this.pendingLoop, this.pendingOnEnd);
        }
    };
    /**
     * Plays the specified animation. Does not restart it if it is already playing
     * @param animation The name of the animation to play
     * @param loop Whether or not to loop the animation. False by default
     * @param onEnd The name of an event to send when this animation naturally stops playing. This only matters if loop is false.
     */
    AnimationManager.prototype.playIfNotAlready = function (animation, loop, onEnd) {
        if (this.currentAnimation !== animation) {
            this.play(animation, loop, onEnd);
        }
    };
    /**
     * Plays the specified animation
     * @param animation The name of the animation to play
     * @param loop Whether or not to loop the animation. False by default
     * @param onEnd The name of an event to send when this animation naturally stops playing. This only matters if loop is false.
     */
    AnimationManager.prototype.play = function (animation, loop, onEnd) {
        this.currentAnimation = animation;
        this.currentFrame = 0;
        this.frameProgress = 0;
        this.animationState = AnimationTypes_1.AnimationState.PLAYING;
        // If loop arg was provided, use that
        if (loop !== undefined) {
            this.loop = loop;
        }
        else {
            // Otherwise, use what the json file specified
            this.loop = this.animations.get(animation).repeat;
        }
        if (onEnd !== undefined) {
            this.onEndEvent = onEnd;
        }
        else {
            this.onEndEvent = null;
        }
        // Reset pending animation
        this.pendingAnimation = null;
    };
    /**
     * Queues a single animation to be played after the current one. Does NOT stack.
     * Queueing additional animations past 1 will just replace the queued animation
     * @param animation The animation to queue
     * @param loop Whether or not the loop the queued animation
     * @param onEnd The event to fire when the queued animation ends
     */
    AnimationManager.prototype.queue = function (animation, loop, onEnd) {
        if (loop === void 0) { loop = false; }
        this.pendingAnimation = animation;
        this.pendingLoop = loop;
        if (onEnd !== undefined) {
            this.pendingOnEnd = onEnd;
        }
        else {
            this.pendingOnEnd = null;
        }
    };
    /** Pauses the current animation */
    AnimationManager.prototype.pause = function () {
        this.animationState = AnimationTypes_1.AnimationState.PAUSED;
    };
    /** Resumes the current animation if possible */
    AnimationManager.prototype.resume = function () {
        if (this.animationState === AnimationTypes_1.AnimationState.PAUSED) {
            this.animationState = AnimationTypes_1.AnimationState.PLAYING;
        }
    };
    /** Stops the current animation. The animation cannot be resumed after this. */
    AnimationManager.prototype.stop = function () {
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
    };
    return AnimationManager;
}());
exports["default"] = AnimationManager;
},{"../../DataTypes/Map":8,"../../Events/Emitter":23,"./AnimationTypes":63}],63:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.TweenData = exports.TweenEffect = exports.AnimationData = exports.AnimationState = void 0;
// @ignorePage
var AnimationState;
(function (AnimationState) {
    AnimationState[AnimationState["STOPPED"] = 0] = "STOPPED";
    AnimationState[AnimationState["PAUSED"] = 1] = "PAUSED";
    AnimationState[AnimationState["PLAYING"] = 2] = "PLAYING";
})(AnimationState = exports.AnimationState || (exports.AnimationState = {}));
var AnimationData = /** @class */ (function () {
    function AnimationData() {
        this.repeat = false;
    }
    return AnimationData;
}());
exports.AnimationData = AnimationData;
var TweenEffect = /** @class */ (function () {
    function TweenEffect() {
    }
    return TweenEffect;
}());
exports.TweenEffect = TweenEffect;
var TweenData = /** @class */ (function () {
    function TweenData() {
    }
    return TweenData;
}());
exports.TweenData = TweenData;
},{}],64:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ParticleSystemManager = /** @class */ (function () {
    function ParticleSystemManager() {
        this.particleSystems = new Array();
    }
    ParticleSystemManager.getInstance = function () {
        if (ParticleSystemManager.instance === null) {
            ParticleSystemManager.instance = new ParticleSystemManager();
        }
        return ParticleSystemManager.instance;
    };
    ParticleSystemManager.prototype.registerParticleSystem = function (system) {
        this.particleSystems.push(system);
    };
    ParticleSystemManager.prototype.deregisterParticleSystem = function (system) {
        var index = this.particleSystems.indexOf(system);
        this.particleSystems.splice(index, 1);
    };
    ParticleSystemManager.prototype.clearParticleSystems = function () {
        this.particleSystems = new Array();
    };
    ParticleSystemManager.prototype.update = function (deltaT) {
        for (var _i = 0, _a = this.particleSystems; _i < _a.length; _i++) {
            var particleSystem = _a[_i];
            particleSystem.update(deltaT);
        }
    };
    ParticleSystemManager.instance = null;
    return ParticleSystemManager;
}());
exports["default"] = ParticleSystemManager;
},{}],65:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../../DataTypes/Map");
var AnimationTypes_1 = require("./AnimationTypes");
var EaseFunctions_1 = require("../../Utils/EaseFunctions");
var MathUtils_1 = require("../../Utils/MathUtils");
var TweenManager_1 = require("./TweenManager");
var Emitter_1 = require("../../Events/Emitter");
/**
 * A manager for the tweens of a GameNode.
 * Tweens are short animations played by interpolating between two properties using an easing function.
 * For a good visual representation of easing functions, check out @link(https://easings.net/)(https://easings.net/).
 * Multiple tween can be played at the same time, as long as they don't change the same property.
 * This allows for some interesting polishes or animations that may be very difficult to do with sprite work alone
 * - especially pixel art (such as rotations or scaling).
 */
var TweenController = /** @class */ (function () {
    /**
     * Creates a new TweenController
     * @param owner The owner of the TweenController
     */
    function TweenController(owner) {
        this.owner = owner;
        this.tweens = new Map_1["default"]();
        this.emitter = new Emitter_1["default"]();
        // Give ourselves to the TweenManager
        TweenManager_1["default"].getInstance().registerTweenController(this);
    }
    /**
     * Destroys this TweenController
     */
    TweenController.prototype.destroy = function () {
        // Only the gamenode and the tween manager should have a reference to this
        delete this.owner.tweens;
        TweenManager_1["default"].getInstance().deregisterTweenController(this);
    };
    /**
     * Add a tween to this game node
     * @param key The name of the tween
     * @param tween The data of the tween
     */
    TweenController.prototype.add = function (key, tween) {
        var typedTween = tween;
        // Initialize members that we need (and the user didn't provide)
        typedTween.progress = 0;
        typedTween.elapsedTime = 0;
        typedTween.animationState = AnimationTypes_1.AnimationState.STOPPED;
        this.tweens.add(key, typedTween);
    };
    /**
     * Play a tween with a certain name
     * @param key The name of the tween to play
     * @param loop Whether or not the tween should loop
     */
    TweenController.prototype.play = function (key, loop) {
        if (this.tweens.has(key)) {
            var tween = this.tweens.get(key);
            // Set loop if needed
            if (loop !== undefined) {
                tween.loop = loop;
            }
            // Set the initial values
            for (var _i = 0, _a = tween.effects; _i < _a.length; _i++) {
                var effect = _a[_i];
                if (effect.resetOnComplete) {
                    effect.initialValue = this.owner[effect.property];
                }
            }
            // Start the tween running
            tween.animationState = AnimationTypes_1.AnimationState.PLAYING;
            tween.elapsedTime = 0;
            tween.progress = 0;
            tween.reversing = false;
        }
        else {
            console.warn("Tried to play tween \"".concat(key, "\" on node with id ").concat(this.owner.id, ", but no such tween exists"));
        }
    };
    /**
     * Pauses a playing tween. Does not affect tweens that are stopped.
     * @param key The name of the tween to pause.
     */
    TweenController.prototype.pause = function (key) {
        if (this.tweens.has(key)) {
            this.tweens.get(key).animationState = AnimationTypes_1.AnimationState.PAUSED;
        }
    };
    /**
     * Resumes a paused tween.
     * @param key The name of the tween to resume
     */
    TweenController.prototype.resume = function (key) {
        if (this.tweens.has(key)) {
            var tween = this.tweens.get(key);
            if (tween.animationState === AnimationTypes_1.AnimationState.PAUSED)
                tween.animationState = AnimationTypes_1.AnimationState.PLAYING;
        }
    };
    /**
     * Stops a currently playing tween
     * @param key The key of the tween
     */
    TweenController.prototype.stop = function (key) {
        if (this.tweens.has(key)) {
            var tween = this.tweens.get(key);
            tween.animationState = AnimationTypes_1.AnimationState.STOPPED;
            // Return to the initial values
            for (var _i = 0, _a = tween.effects; _i < _a.length; _i++) {
                var effect = _a[_i];
                if (effect.resetOnComplete) {
                    this.owner[effect.property] = effect.initialValue;
                }
            }
        }
    };
    /**
     * The natural stop of a currently playing tween
     * @param key The key of the tween
     */
    TweenController.prototype.end = function (key) {
        this.stop(key);
        if (this.tweens.has(key)) {
            // Get the tween
            var tween = this.tweens.get(key);
            // If it has an onEnd, send an event
            if (tween.onEnd) {
                this.emitter.fireEvent(tween.onEnd, { key: key, node: this.owner.id });
            }
        }
    };
    /**
     * Stops all currently playing tweens
     */
    TweenController.prototype.stopAll = function () {
        var _this = this;
        this.tweens.forEach(function (key) { return _this.stop(key); });
    };
    TweenController.prototype.update = function (deltaT) {
        var _this = this;
        this.tweens.forEach(function (key) {
            var tween = _this.tweens.get(key);
            if (tween.animationState === AnimationTypes_1.AnimationState.PLAYING) {
                // Update the progress of the tween
                tween.elapsedTime += deltaT * 1000;
                // If we're past the startDelay, do the tween
                if (tween.elapsedTime >= tween.startDelay) {
                    if (!tween.reversing && tween.elapsedTime >= tween.startDelay + tween.duration) {
                        // If we're over time, stop the tween, loop, or reverse
                        if (tween.reverseOnComplete) {
                            // If we're over time and can reverse, do so
                            tween.reversing = true;
                        }
                        else if (tween.loop) {
                            // If we can't reverse and can loop, do so
                            tween.elapsedTime -= tween.duration;
                        }
                        else {
                            // We aren't looping and can't reverse, so stop
                            _this.end(key);
                        }
                    }
                    // Check for the end of reversing
                    if (tween.reversing && tween.elapsedTime >= tween.startDelay + 2 * tween.duration) {
                        if (tween.loop) {
                            tween.reversing = false;
                            tween.elapsedTime -= 2 * tween.duration;
                        }
                        else {
                            _this.end(key);
                        }
                    }
                    // Update the progress, make sure it is between 0 and 1. Errors from this should never be large
                    if (tween.reversing) {
                        tween.progress = MathUtils_1["default"].clamp01((2 * tween.duration - (tween.elapsedTime - tween.startDelay)) / tween.duration);
                    }
                    else {
                        tween.progress = MathUtils_1["default"].clamp01((tween.elapsedTime - tween.startDelay) / tween.duration);
                    }
                    for (var _i = 0, _a = tween.effects; _i < _a.length; _i++) {
                        var effect = _a[_i];
                        // Get the value from the ease function that corresponds to our progress
                        var ease = EaseFunctions_1["default"][effect.ease](tween.progress);
                        // Use the value to lerp the property
                        var value = MathUtils_1["default"].lerp(effect.start, effect.end, ease);
                        // Assign the value of the property
                        _this.owner[effect.property] = value;
                    }
                }
            }
        });
    };
    return TweenController;
}());
exports["default"] = TweenController;
},{"../../DataTypes/Map":8,"../../Events/Emitter":23,"../../Utils/EaseFunctions":95,"../../Utils/MathUtils":97,"./AnimationTypes":63,"./TweenManager":66}],66:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TweenManager = /** @class */ (function () {
    function TweenManager() {
        this.tweenControllers = new Array();
    }
    TweenManager.getInstance = function () {
        if (TweenManager.instance === null) {
            TweenManager.instance = new TweenManager();
        }
        return TweenManager.instance;
    };
    TweenManager.prototype.registerTweenController = function (controller) {
        this.tweenControllers.push(controller);
    };
    TweenManager.prototype.deregisterTweenController = function (controller) {
        var index = this.tweenControllers.indexOf(controller);
        this.tweenControllers.splice(index, 1);
    };
    TweenManager.prototype.clearTweenControllers = function () {
        this.tweenControllers = new Array();
    };
    TweenManager.prototype.update = function (deltaT) {
        for (var _i = 0, _a = this.tweenControllers; _i < _a.length; _i++) {
            var tweenController = _a[_i];
            tweenController.update(deltaT);
        }
    };
    TweenManager.instance = null;
    return TweenManager;
}());
exports["default"] = TweenManager;
},{}],67:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Graphic_1 = require("../Nodes/Graphic");
var Point_1 = require("../Nodes/Graphics/Point");
var Rect_1 = require("../Nodes/Graphics/Rect");
var Sprite_1 = require("../Nodes/Sprites/Sprite");
var OrthogonalTilemap_1 = require("../Nodes/Tilemaps/OrthogonalTilemap");
var UIElement_1 = require("../Nodes/UIElement");
var GraphicRenderer_1 = require("./CanvasRendering/GraphicRenderer");
var RenderingManager_1 = require("./RenderingManager");
var TilemapRenderer_1 = require("./CanvasRendering/TilemapRenderer");
var UIElementRenderer_1 = require("./CanvasRendering/UIElementRenderer");
var Label_1 = require("../Nodes/UIElements/Label");
var Button_1 = require("../Nodes/UIElements/Button");
var Slider_1 = require("../Nodes/UIElements/Slider");
var TextInput_1 = require("../Nodes/UIElements/TextInput");
var AnimatedSprite_1 = require("../Nodes/Sprites/AnimatedSprite");
var Vec2_1 = require("../DataTypes/Vec2");
var Line_1 = require("../Nodes/Graphics/Line");
var Debug_1 = require("../Debug/Debug");
/**
 * An implementation of the RenderingManager class using CanvasRenderingContext2D.
 */
var CanvasRenderer = /** @class */ (function (_super) {
    __extends(CanvasRenderer, _super);
    function CanvasRenderer() {
        return _super.call(this) || this;
    }
    // @override
    CanvasRenderer.prototype.setScene = function (scene) {
        this.scene = scene;
        this.graphicRenderer.setScene(scene);
        this.tilemapRenderer.setScene(scene);
        this.uiElementRenderer.setScene(scene);
    };
    // @override
    CanvasRenderer.prototype.initializeCanvas = function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.worldSize = new Vec2_1["default"](width, height);
        this.ctx = canvas.getContext("2d");
        this.graphicRenderer = new GraphicRenderer_1["default"](this.ctx);
        this.tilemapRenderer = new TilemapRenderer_1["default"](this.ctx);
        this.uiElementRenderer = new UIElementRenderer_1["default"](this.ctx);
        // For crisp pixel art
        this.ctx.imageSmoothingEnabled = false;
        return this.ctx;
    };
    // @override
    CanvasRenderer.prototype.render = function (visibleSet, tilemaps, uiLayers) {
        var _this = this;
        // Sort by depth, then by visible set by y-value
        visibleSet.sort(function (a, b) {
            if (a.getLayer().getDepth() === b.getLayer().getDepth()) {
                return (a.boundary.bottom) - (b.boundary.bottom);
            }
            else {
                return a.getLayer().getDepth() - b.getLayer().getDepth();
            }
        });
        var tilemapIndex = 0;
        var tilemapLength = tilemaps.length;
        var visibleSetIndex = 0;
        var visibleSetLength = visibleSet.length;
        while (tilemapIndex < tilemapLength || visibleSetIndex < visibleSetLength) {
            // Check conditions where we've already reached the edge of one list
            if (tilemapIndex >= tilemapLength) {
                // Only render the remaining visible set
                var node = visibleSet[visibleSetIndex++];
                if (node.visible) {
                    this.renderNode(node);
                }
                continue;
            }
            if (visibleSetIndex >= visibleSetLength) {
                // Only render tilemaps
                this.renderTilemap(tilemaps[tilemapIndex++]);
                continue;
            }
            // Render whichever is further down
            if (tilemaps[tilemapIndex].getLayer().getDepth() <= visibleSet[visibleSetIndex].getLayer().getDepth()) {
                this.renderTilemap(tilemaps[tilemapIndex++]);
            }
            else {
                var node = visibleSet[visibleSetIndex++];
                if (node.visible) {
                    this.renderNode(node);
                }
            }
        }
        // Render the uiLayers on top of everything else
        var sortedUILayers = new Array();
        uiLayers.forEach(function (key) { return sortedUILayers.push(uiLayers.get(key)); });
        sortedUILayers = sortedUILayers.sort(function (ui1, ui2) { return ui1.getDepth() - ui2.getDepth(); });
        sortedUILayers.forEach(function (uiLayer) {
            if (!uiLayer.isHidden())
                uiLayer.getItems().forEach(function (node) {
                    if (node.visible) {
                        _this.renderNode(node);
                    }
                });
        });
    };
    /**
     * Renders a specified CanvasNode
     * @param node The CanvasNode to render
     */
    CanvasRenderer.prototype.renderNode = function (node) {
        // Calculate the origin of the viewport according to this sprite
        this.origin = this.scene.getViewTranslation(node);
        // Get the zoom level of the scene
        this.zoom = this.scene.getViewScale();
        // Move the canvas to the position of the node and rotate
        var xScale = 1;
        var yScale = 1;
        if (node instanceof Sprite_1["default"]) {
            xScale = node.invertX ? -1 : 1;
            yScale = node.invertY ? -1 : 1;
        }
        this.ctx.setTransform(xScale, 0, 0, yScale, (node.position.x - this.origin.x) * this.zoom, (node.position.y - this.origin.y) * this.zoom);
        this.ctx.rotate(-node.rotation);
        var globalAlpha = this.ctx.globalAlpha;
        if (node instanceof Rect_1["default"]) {
            Debug_1["default"].log("node" + node.id, "Node" + node.id + " Alpha: " + node.alpha);
        }
        this.ctx.globalAlpha = node.alpha;
        if (node instanceof AnimatedSprite_1["default"]) {
            this.renderAnimatedSprite(node);
        }
        else if (node instanceof Sprite_1["default"]) {
            this.renderSprite(node);
        }
        else if (node instanceof Graphic_1["default"]) {
            this.renderGraphic(node);
        }
        else if (node instanceof UIElement_1["default"]) {
            this.renderUIElement(node);
        }
        this.ctx.globalAlpha = globalAlpha;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    // @override
    CanvasRenderer.prototype.renderSprite = function (sprite) {
        // Get the image from the resource manager
        var image = this.resourceManager.getImage(sprite.imageId);
        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world
                image draw start -> x, y
                image draw size  -> w, h
        */
        this.ctx.drawImage(image, sprite.imageOffset.x, sprite.imageOffset.y, sprite.size.x, sprite.size.y, (-sprite.size.x * sprite.scale.x / 2) * this.zoom, (-sprite.size.y * sprite.scale.y / 2) * this.zoom, sprite.size.x * sprite.scale.x * this.zoom, sprite.size.y * sprite.scale.y * this.zoom);
    };
    // @override
    CanvasRenderer.prototype.renderAnimatedSprite = function (sprite) {
        // Get the image from the resource manager
        var image = this.resourceManager.getImage(sprite.imageId);
        var animationIndex = sprite.animation.getIndexAndAdvanceAnimation();
        var animationOffset = sprite.getAnimationOffset(animationIndex);
        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world (given we moved)
                image draw start -> -w/2, -h/2
                image draw size  -> w, h
        */
        this.ctx.drawImage(image, sprite.imageOffset.x + animationOffset.x, sprite.imageOffset.y + animationOffset.y, sprite.size.x, sprite.size.y, (-sprite.size.x * sprite.scale.x / 2) * this.zoom, (-sprite.size.y * sprite.scale.y / 2) * this.zoom, sprite.size.x * sprite.scale.x * this.zoom, sprite.size.y * sprite.scale.y * this.zoom);
    };
    // @override
    CanvasRenderer.prototype.renderGraphic = function (graphic) {
        if (graphic instanceof Point_1["default"]) {
            this.graphicRenderer.renderPoint(graphic, this.zoom);
        }
        else if (graphic instanceof Line_1["default"]) {
            this.graphicRenderer.renderLine(graphic, this.origin, this.zoom);
        }
        else if (graphic instanceof Rect_1["default"]) {
            this.graphicRenderer.renderRect(graphic, this.zoom);
        }
    };
    // @override
    CanvasRenderer.prototype.renderTilemap = function (tilemap) {
        if (tilemap instanceof OrthogonalTilemap_1["default"]) {
            this.tilemapRenderer.renderOrthogonalTilemap(tilemap);
        }
    };
    // @override
    CanvasRenderer.prototype.renderUIElement = function (uiElement) {
        if (uiElement instanceof Label_1["default"]) {
            this.uiElementRenderer.renderLabel(uiElement);
        }
        else if (uiElement instanceof Button_1["default"]) {
            this.uiElementRenderer.renderButton(uiElement);
        }
        else if (uiElement instanceof Slider_1["default"]) {
            this.uiElementRenderer.renderSlider(uiElement);
        }
        else if (uiElement instanceof TextInput_1["default"]) {
            this.uiElementRenderer.renderTextInput(uiElement);
        }
    };
    CanvasRenderer.prototype.clear = function (clearColor) {
        this.ctx.clearRect(0, 0, this.worldSize.x, this.worldSize.y);
        this.ctx.fillStyle = clearColor.toString();
        this.ctx.fillRect(0, 0, this.worldSize.x, this.worldSize.y);
    };
    return CanvasRenderer;
}(RenderingManager_1["default"]));
exports["default"] = CanvasRenderer;
},{"../DataTypes/Vec2":20,"../Debug/Debug":21,"../Nodes/Graphic":37,"../Nodes/Graphics/Line":39,"../Nodes/Graphics/Point":41,"../Nodes/Graphics/Rect":42,"../Nodes/Sprites/AnimatedSprite":43,"../Nodes/Sprites/Sprite":44,"../Nodes/Tilemaps/OrthogonalTilemap":46,"../Nodes/UIElement":47,"../Nodes/UIElements/Button":48,"../Nodes/UIElements/Label":49,"../Nodes/UIElements/Slider":50,"../Nodes/UIElements/TextInput":51,"./CanvasRendering/GraphicRenderer":68,"./CanvasRendering/TilemapRenderer":69,"./CanvasRendering/UIElementRenderer":70,"./RenderingManager":71}],68:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
/**
 * A utility class to help the @reference[CanvasRenderer] render @reference[Graphic]s
 */
var GraphicRenderer = /** @class */ (function () {
    function GraphicRenderer(ctx) {
        this.resourceManager = ResourceManager_1["default"].getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this GraphicRenderer
     * @param scene The current scene
     */
    GraphicRenderer.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    /**
     * Renders a point
     * @param point The point to render
     * @param zoom The zoom level
     */
    GraphicRenderer.prototype.renderPoint = function (point, zoom) {
        this.ctx.fillStyle = point.color.toStringRGBA();
        this.ctx.fillRect((-point.size.x / 2) * zoom, (-point.size.y / 2) * zoom, point.size.x * zoom, point.size.y * zoom);
    };
    GraphicRenderer.prototype.renderLine = function (line, origin, zoom) {
        this.ctx.strokeStyle = line.color.toStringRGBA();
        this.ctx.lineWidth = line.thickness;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo((line.end.x - line.start.x) * zoom, (line.end.y - line.start.y) * zoom);
        this.ctx.closePath();
        this.ctx.stroke();
    };
    /**
     * Renders a rect
     * @param rect The rect to render
     * @param zoom The zoom level
     */
    GraphicRenderer.prototype.renderRect = function (rect, zoom) {
        // Draw the interior of the rect
        if (rect.color.a !== 0) {
            this.ctx.fillStyle = rect.color.toStringRGB();
            this.ctx.fillRect((-rect.size.x / 2) * zoom, (-rect.size.y / 2) * zoom, rect.size.x * zoom, rect.size.y * zoom);
        }
        // Draw the border of the rect if it isn't transparent
        if (rect.borderColor.a !== 0) {
            this.ctx.strokeStyle = rect.getBorderColor().toStringRGB();
            this.ctx.lineWidth = rect.getBorderWidth();
            this.ctx.strokeRect((-rect.size.x / 2) * zoom, (-rect.size.y / 2) * zoom, rect.size.x * zoom, rect.size.y * zoom);
        }
    };
    return GraphicRenderer;
}());
exports["default"] = GraphicRenderer;
},{"../../ResourceManager/ResourceManager":79}],69:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var Vec2_1 = require("../../DataTypes/Vec2");
/**
 * A utility class for the @reference[CanvasRenderer] to render @reference[Tilemap]s
 */
var TilemapRenderer = /** @class */ (function () {
    function TilemapRenderer(ctx) {
        this.resourceManager = ResourceManager_1["default"].getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this TilemapRenderer
     * @param scene The current scene
     */
    TilemapRenderer.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    /**
     * Renders an orthogonal tilemap
     * @param tilemap The tilemap to render
     */
    TilemapRenderer.prototype.renderOrthogonalTilemap = function (tilemap) {
        var previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = tilemap.getLayer().getAlpha();
        var origin = this.scene.getViewTranslation(tilemap);
        var size = this.scene.getViewport().getHalfSize();
        var zoom = this.scene.getViewScale();
        var bottomRight = origin.clone().add(size.scaled(2 * zoom));
        if (tilemap.visible) {
            var minColRow = tilemap.getColRowAt(origin);
            var maxColRow = tilemap.getColRowAt(bottomRight);
            for (var x = minColRow.x; x <= maxColRow.x; x++) {
                for (var y = minColRow.y; y <= maxColRow.y; y++) {
                    // Get the tile at this position
                    var tile = tilemap.getTileAtRowCol(new Vec2_1["default"](x, y));
                    // Extract the rot/flip parameters if there are any
                    var mask = (0xE << 28);
                    var rotFlip = ((mask & tile) >> 28) & 0xF;
                    tile = tile & ~mask;
                    // Find the tileset that owns this tile index and render
                    for (var _i = 0, _a = tilemap.getTilesets(); _i < _a.length; _i++) {
                        var tileset = _a[_i];
                        if (tileset.hasTile(tile)) {
                            this.renderTile(tileset, tile, x, y, origin, tilemap.scale, zoom, rotFlip);
                        }
                    }
                }
            }
        }
        this.ctx.globalAlpha = previousAlpha;
    };
    /**
     * Renders a tile
     * @param tileset The tileset this tile belongs to
     * @param tileIndex The index of the tile
     * @param tilemapRow The row of the tile in the tilemap
     * @param tilemapCol The column of the tile in the tilemap
     * @param origin The origin of the viewport
     * @param scale The scale of the tilemap
     * @param zoom The zoom level of the viewport
     */
    TilemapRenderer.prototype.renderTile = function (tileset, tileIndex, tilemapRow, tilemapCol, origin, scale, zoom, rotFlip) {
        var image = this.resourceManager.getImage(tileset.getImageKey());
        // Get the true index
        var index = tileIndex - tileset.getStartIndex();
        // Get the row and col of the tile in image space
        var row = Math.floor(index / tileset.getNumCols());
        var col = index % tileset.getNumCols();
        var width = tileset.getTileSize().x;
        var height = tileset.getTileSize().y;
        // Calculate the position to start a crop in the tileset image
        var left = col * width;
        var top = row * height;
        // Calculate the position in the world to render the tile
        var x = Math.floor(tilemapRow * width * scale.x);
        var y = Math.floor(tilemapCol * height * scale.y);
        var worldX = Math.floor((x - origin.x) * zoom);
        var worldY = Math.floor((y - origin.y) * zoom);
        var worldWidth = Math.ceil(width * scale.x * zoom);
        var worldHeight = Math.ceil(height * scale.y * zoom);
        if (rotFlip !== 0) {
            var scaleX = 1;
            var scaleY = 1;
            var shearX = 0;
            var shearY = 0;
            // Flip on the x-axis
            if (rotFlip & 8) {
                scaleX = -1;
            }
            // Flip on the y-axis
            if (rotFlip & 4) {
                scaleY = -1;
            }
            // Flip over the line y=x
            if (rotFlip & 2) {
                shearX = scaleY;
                shearY = scaleX;
                scaleX = 0;
                scaleY = 0;
            }
            this.ctx.setTransform(scaleX, shearX, shearY, scaleY, worldX + worldWidth / 2, worldY + worldHeight / 2);
            // Render the tile
            this.ctx.drawImage(image, left, top, width, height, -worldWidth / 2, -worldHeight / 2, worldWidth, worldHeight);
            if (rotFlip !== 0) {
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        else {
            // No rotations, don't do the calculations, just render the tile
            // Render the tile
            this.ctx.drawImage(image, left, top, width, height, worldX, worldY, worldWidth, worldHeight);
        }
    };
    return TilemapRenderer;
}());
exports["default"] = TilemapRenderer;
},{"../../DataTypes/Vec2":20,"../../ResourceManager/ResourceManager":79}],70:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../../DataTypes/Vec2");
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var MathUtils_1 = require("../../Utils/MathUtils");
/**
 * A utility class to help the @reference[CanvasRenderer] render @reference[UIElement]s
 */
var UIElementRenderer = /** @class */ (function () {
    function UIElementRenderer(ctx) {
        this.resourceManager = ResourceManager_1["default"].getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this UIElementRenderer
     * @param scene The current scene
     */
    UIElementRenderer.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    /**
     * Renders a label
     * @param label The label to render
     */
    UIElementRenderer.prototype.renderLabel = function (label) {
        // If the size is unassigned (by the user or automatically) assign it
        label.handleInitialSizing(this.ctx);
        // Grab the global alpha so we can adjust it for this render
        var previousAlpha = this.ctx.globalAlpha;
        // Get the font and text position in label
        this.ctx.font = label.getFontString();
        var offset = label.calculateTextOffset(this.ctx);
        // Stroke and fill a rounded rect and give it text
        this.ctx.globalAlpha = label.backgroundColor.a;
        this.ctx.fillStyle = label.calculateBackgroundColor().toStringRGBA();
        this.ctx.fillRoundedRect(-label.size.x / 2, -label.size.y / 2, label.size.x, label.size.y, label.borderRadius);
        this.ctx.strokeStyle = label.calculateBorderColor().toStringRGBA();
        this.ctx.globalAlpha = label.borderColor.a;
        this.ctx.lineWidth = label.borderWidth;
        this.ctx.strokeRoundedRect(-label.size.x / 2, -label.size.y / 2, label.size.x, label.size.y, label.borderRadius);
        this.ctx.fillStyle = label.calculateTextColor();
        this.ctx.globalAlpha = label.textColor.a;
        this.ctx.fillText(label.text, offset.x - label.size.x / 2, offset.y - label.size.y / 2);
        this.ctx.globalAlpha = previousAlpha;
    };
    /**
     * Renders a button
     * @param button The button to render
     */
    UIElementRenderer.prototype.renderButton = function (button) {
        this.renderLabel(button);
    };
    /**
     * Renders a slider
     * @param slider The slider to render
     */
    UIElementRenderer.prototype.renderSlider = function (slider) {
        // Grab the global alpha so we can adjust it for this render
        var previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = slider.getLayer().getAlpha();
        // Calcualate the slider size
        var sliderSize = new Vec2_1["default"](slider.size.x, 2);
        // Draw the slider
        this.ctx.fillStyle = slider.sliderColor.toString();
        this.ctx.fillRoundedRect(-sliderSize.x / 2, -sliderSize.y / 2, sliderSize.x, sliderSize.y, slider.borderRadius);
        // Calculate the nib size and position
        var x = MathUtils_1["default"].lerp(-slider.size.x / 2, slider.size.x / 2, slider.getValue());
        // Draw the nib
        this.ctx.fillStyle = slider.nibColor.toString();
        this.ctx.fillRoundedRect(x - slider.nibSize.x / 2, -slider.nibSize.y / 2, slider.nibSize.x, slider.nibSize.y, slider.borderRadius);
        // Reset the alpha
        this.ctx.globalAlpha = previousAlpha;
    };
    /**
     * Renders a textInput
     * @param textInput The textInput to render
     */
    UIElementRenderer.prototype.renderTextInput = function (textInput) {
        // Show a cursor sometimes
        if (textInput.focused && textInput.cursorCounter % 60 > 30) {
            textInput.text += "|";
        }
        this.renderLabel(textInput);
        if (textInput.focused) {
            if (textInput.cursorCounter % 60 > 30) {
                textInput.text = textInput.text.substring(0, textInput.text.length - 1);
            }
            textInput.cursorCounter += 1;
            if (textInput.cursorCounter >= 60) {
                textInput.cursorCounter = 0;
            }
        }
    };
    return UIElementRenderer;
}());
exports["default"] = UIElementRenderer;
},{"../../DataTypes/Vec2":20,"../../ResourceManager/ResourceManager":79,"../../Utils/MathUtils":97}],71:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
/**
 * An abstract framework to put all rendering in once place in the application
 */
var RenderingManager = /** @class */ (function () {
    function RenderingManager() {
        this.resourceManager = ResourceManager_1["default"].getInstance();
    }
    /**
     * Sets the scene currently being rendered
     * @param scene The current Scene
     */
    RenderingManager.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    return RenderingManager;
}());
exports["default"] = RenderingManager;
},{"../ResourceManager/ResourceManager":79}],72:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../DataTypes/Vec2");
var Graphic_1 = require("../Nodes/Graphic");
var Point_1 = require("../Nodes/Graphics/Point");
var Rect_1 = require("../Nodes/Graphics/Rect");
var AnimatedSprite_1 = require("../Nodes/Sprites/AnimatedSprite");
var Sprite_1 = require("../Nodes/Sprites/Sprite");
var UIElement_1 = require("../Nodes/UIElement");
var Label_1 = require("../Nodes/UIElements/Label");
var ShaderRegistry_1 = require("../Registry/Registries/ShaderRegistry");
var RegistryManager_1 = require("../Registry/RegistryManager");
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
var ParallaxLayer_1 = require("../Scene/Layers/ParallaxLayer");
var RenderingManager_1 = require("./RenderingManager");
var WebGLRenderer = /** @class */ (function (_super) {
    __extends(WebGLRenderer, _super);
    function WebGLRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLRenderer.prototype.initializeCanvas = function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.worldSize = Vec2_1["default"].ZERO;
        this.worldSize.x = width;
        this.worldSize.y = height;
        // Get the WebGL context
        this.gl = canvas.getContext("webgl");
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.CULL_FACE);
        // Tell the resource manager we're using WebGL
        ResourceManager_1["default"].getInstance().useWebGL(true, this.gl);
        // Show the text canvas and get its context
        var textCanvas = document.getElementById("text-canvas");
        textCanvas.hidden = false;
        this.textCtx = textCanvas.getContext("2d");
        // Size the text canvas to be the same as the game canvas
        textCanvas.height = height;
        textCanvas.width = width;
        return this.gl;
    };
    WebGLRenderer.prototype.render = function (visibleSet, tilemaps, uiLayers) {
        var _this = this;
        for (var _i = 0, visibleSet_1 = visibleSet; _i < visibleSet_1.length; _i++) {
            var node = visibleSet_1[_i];
            this.renderNode(node);
        }
        uiLayers.forEach(function (key) {
            if (!uiLayers.get(key).isHidden())
                uiLayers.get(key).getItems().forEach(function (node) { return _this.renderNode(node); });
        });
    };
    WebGLRenderer.prototype.clear = function (color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.textCtx.clearRect(0, 0, this.worldSize.x, this.worldSize.y);
    };
    WebGLRenderer.prototype.renderNode = function (node) {
        // Calculate the origin of the viewport according to this sprite
        this.origin = this.scene.getViewTranslation(node);
        // Get the zoom level of the scene
        this.zoom = this.scene.getViewScale();
        if (node.hasCustomShader) {
            // If the node has a custom shader, render using that
            this.renderCustom(node);
        }
        else if (node instanceof Graphic_1["default"]) {
            this.renderGraphic(node);
        }
        else if (node instanceof Sprite_1["default"]) {
            if (node instanceof AnimatedSprite_1["default"]) {
                this.renderAnimatedSprite(node);
            }
            else {
                this.renderSprite(node);
            }
        }
        else if (node instanceof UIElement_1["default"]) {
            this.renderUIElement(node);
        }
    };
    WebGLRenderer.prototype.renderSprite = function (sprite) {
        var shader = RegistryManager_1["default"].shaders.get(ShaderRegistry_1["default"].SPRITE_SHADER);
        var options = this.addOptions(shader.getOptions(sprite), sprite);
        shader.render(this.gl, options);
    };
    WebGLRenderer.prototype.renderAnimatedSprite = function (sprite) {
        var shader = RegistryManager_1["default"].shaders.get(ShaderRegistry_1["default"].SPRITE_SHADER);
        var options = this.addOptions(shader.getOptions(sprite), sprite);
        shader.render(this.gl, options);
    };
    WebGLRenderer.prototype.renderGraphic = function (graphic) {
        if (graphic instanceof Point_1["default"]) {
            var shader = RegistryManager_1["default"].shaders.get(ShaderRegistry_1["default"].POINT_SHADER);
            var options = this.addOptions(shader.getOptions(graphic), graphic);
            shader.render(this.gl, options);
        }
        else if (graphic instanceof Rect_1["default"]) {
            var shader = RegistryManager_1["default"].shaders.get(ShaderRegistry_1["default"].RECT_SHADER);
            var options = this.addOptions(shader.getOptions(graphic), graphic);
            shader.render(this.gl, options);
        }
    };
    WebGLRenderer.prototype.renderTilemap = function (tilemap) {
        throw new Error("Method not implemented.");
    };
    WebGLRenderer.prototype.renderUIElement = function (uiElement) {
        if (uiElement instanceof Label_1["default"]) {
            var shader = RegistryManager_1["default"].shaders.get(ShaderRegistry_1["default"].LABEL_SHADER);
            var options = this.addOptions(shader.getOptions(uiElement), uiElement);
            shader.render(this.gl, options);
            this.textCtx.setTransform(1, 0, 0, 1, (uiElement.position.x - this.origin.x) * this.zoom, (uiElement.position.y - this.origin.y) * this.zoom);
            this.textCtx.rotate(-uiElement.rotation);
            var globalAlpha = this.textCtx.globalAlpha;
            this.textCtx.globalAlpha = uiElement.alpha;
            // Render text
            this.textCtx.font = uiElement.getFontString();
            var offset = uiElement.calculateTextOffset(this.textCtx);
            this.textCtx.fillStyle = uiElement.calculateTextColor();
            this.textCtx.globalAlpha = uiElement.textColor.a;
            this.textCtx.fillText(uiElement.text, offset.x - uiElement.size.x / 2, offset.y - uiElement.size.y / 2);
            this.textCtx.globalAlpha = globalAlpha;
            this.textCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    };
    WebGLRenderer.prototype.renderCustom = function (node) {
        var shader = RegistryManager_1["default"].shaders.get(node.customShaderKey);
        var options = this.addOptions(shader.getOptions(node), node);
        shader.render(this.gl, options);
    };
    WebGLRenderer.prototype.addOptions = function (options, node) {
        // Give the shader access to the world size
        options.worldSize = this.worldSize;
        // Adjust the origin position to the parallax
        var layer = node.getLayer();
        var parallax = new Vec2_1["default"](1, 1);
        if (layer instanceof ParallaxLayer_1["default"]) {
            parallax = layer.parallax;
        }
        options.origin = this.origin.clone().mult(parallax);
        return options;
    };
    return WebGLRenderer;
}(RenderingManager_1["default"]));
exports["default"] = WebGLRenderer;
},{"../DataTypes/Vec2":20,"../Nodes/Graphic":37,"../Nodes/Graphics/Point":41,"../Nodes/Graphics/Rect":42,"../Nodes/Sprites/AnimatedSprite":43,"../Nodes/Sprites/Sprite":44,"../Nodes/UIElement":47,"../Nodes/UIElements/Label":49,"../Registry/Registries/ShaderRegistry":60,"../Registry/RegistryManager":61,"../ResourceManager/ResourceManager":79,"../Scene/Layers/ParallaxLayer":87,"./RenderingManager":71}],73:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
/**
 * A wrapper class for WebGL shaders.
 * This class is a singleton, and there is only one for each shader type.
 * All objects that use this shader type will refer to and modify this same type.
 */
var ShaderType = /** @class */ (function () {
    function ShaderType(programKey) {
        this.programKey = programKey;
        this.resourceManager = ResourceManager_1["default"].getInstance();
    }
    /**
     * Extracts the options from the CanvasNode and gives them to the render function
     * @param node The node to get options from
     * @returns An object containing the options that should be passed to the render function
     */
    ShaderType.prototype.getOptions = function (node) { return {}; };
    return ShaderType;
}());
exports["default"] = ShaderType;
},{"../../ResourceManager/ResourceManager":79}],74:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Mat4x4_1 = require("../../../DataTypes/Mat4x4");
var Vec2_1 = require("../../../DataTypes/Vec2");
var ResourceManager_1 = require("../../../ResourceManager/ResourceManager");
var QuadShaderType_1 = require("./QuadShaderType");
/** */
var LabelShaderType = /** @class */ (function (_super) {
    __extends(LabelShaderType, _super);
    function LabelShaderType(programKey) {
        var _this = _super.call(this, programKey) || this;
        _this.resourceManager = ResourceManager_1["default"].getInstance();
        return _this;
    }
    LabelShaderType.prototype.initBufferObject = function () {
        this.bufferObjectKey = "label";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    };
    LabelShaderType.prototype.render = function (gl, options) {
        var backgroundColor = options.backgroundColor.toWebGL();
        var borderColor = options.borderColor.toWebGL();
        var program = this.resourceManager.getShaderProgram(this.programKey);
        var buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        var vertexData = this.getVertices(options.size.x, options.size.y);
        var FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        var a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        var u_BackgroundColor = gl.getUniformLocation(program, "u_BackgroundColor");
        gl.uniform4fv(u_BackgroundColor, backgroundColor);
        var u_BorderColor = gl.getUniformLocation(program, "u_BorderColor");
        gl.uniform4fv(u_BorderColor, borderColor);
        var u_MaxSize = gl.getUniformLocation(program, "u_MaxSize");
        gl.uniform2f(u_MaxSize, -vertexData[0], vertexData[1]);
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        var maxDimension = Math.max(options.size.x, options.size.y);
        var u_BorderWidth = gl.getUniformLocation(program, "u_BorderWidth");
        gl.uniform1f(u_BorderWidth, options.borderWidth / maxDimension);
        var u_BorderRadius = gl.getUniformLocation(program, "u_BorderRadius");
        gl.uniform1f(u_BorderRadius, options.borderRadius / maxDimension);
        // The size of the rendering space will be a square with this maximum dimension
        var size = new Vec2_1["default"](maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        var translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        var translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        var transformation = Mat4x4_1["default"].MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        var u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    LabelShaderType.prototype.getVertices = function (w, h) {
        var x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        return new Float32Array([
            -x, y,
            -x, -y,
            x, y,
            x, -y
        ]);
    };
    LabelShaderType.prototype.getOptions = function (rect) {
        var options = {
            position: rect.position,
            backgroundColor: rect.calculateBackgroundColor(),
            borderColor: rect.calculateBorderColor(),
            borderWidth: rect.borderWidth,
            borderRadius: rect.borderRadius,
            size: rect.size,
            rotation: rect.rotation
        };
        return options;
    };
    return LabelShaderType;
}(QuadShaderType_1["default"]));
exports["default"] = LabelShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":20,"../../../ResourceManager/ResourceManager":79,"./QuadShaderType":76}],75:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var RenderingUtils_1 = require("../../../Utils/RenderingUtils");
var ShaderType_1 = require("../ShaderType");
var PointShaderType = /** @class */ (function (_super) {
    __extends(PointShaderType, _super);
    function PointShaderType(programKey) {
        return _super.call(this, programKey) || this;
    }
    PointShaderType.prototype.initBufferObject = function () {
        this.bufferObjectKey = "point";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    };
    PointShaderType.prototype.render = function (gl, options) {
        var position = RenderingUtils_1["default"].toWebGLCoords(options.position, options.origin, options.worldSize);
        var color = RenderingUtils_1["default"].toWebGLColor(options.color);
        var program = this.resourceManager.getShaderProgram(this.programKey);
        var buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        var vertexData = position;
        var FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        var a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        var u_Color = gl.getUniformLocation(program, "u_Color");
        gl.uniform4fv(u_Color, color);
        var u_PointSize = gl.getUniformLocation(program, "u_PointSize");
        gl.uniform1f(u_PointSize, options.pointSize);
        gl.drawArrays(gl.POINTS, 0, 1);
    };
    PointShaderType.prototype.getOptions = function (point) {
        var options = {
            position: point.position,
            color: point.color,
            pointSize: point.size
        };
        return options;
    };
    return PointShaderType;
}(ShaderType_1["default"]));
exports["default"] = PointShaderType;
},{"../../../Utils/RenderingUtils":98,"../ShaderType":73}],76:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Mat4x4_1 = require("../../../DataTypes/Mat4x4");
var ShaderType_1 = require("../ShaderType");
/** Represents any WebGL objects that have a quad mesh (i.e. a rectangular game object composed of only two triangles) */
var QuadShaderType = /** @class */ (function (_super) {
    __extends(QuadShaderType, _super);
    function QuadShaderType(programKey) {
        var _this = _super.call(this, programKey) || this;
        _this.scale = Mat4x4_1["default"].IDENTITY;
        _this.rotation = Mat4x4_1["default"].IDENTITY;
        _this.translation = Mat4x4_1["default"].IDENTITY;
        return _this;
    }
    return QuadShaderType;
}(ShaderType_1["default"]));
exports["default"] = QuadShaderType;
},{"../../../DataTypes/Mat4x4":9,"../ShaderType":73}],77:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Mat4x4_1 = require("../../../DataTypes/Mat4x4");
var Vec2_1 = require("../../../DataTypes/Vec2");
var ResourceManager_1 = require("../../../ResourceManager/ResourceManager");
var QuadShaderType_1 = require("./QuadShaderType");
/** */
var RectShaderType = /** @class */ (function (_super) {
    __extends(RectShaderType, _super);
    function RectShaderType(programKey) {
        var _this = _super.call(this, programKey) || this;
        _this.resourceManager = ResourceManager_1["default"].getInstance();
        return _this;
    }
    RectShaderType.prototype.initBufferObject = function () {
        this.bufferObjectKey = "rect";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    };
    RectShaderType.prototype.render = function (gl, options) {
        var color = options.color.toWebGL();
        var program = this.resourceManager.getShaderProgram(this.programKey);
        var buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        var vertexData = this.getVertices(options.size.x, options.size.y);
        var FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        var a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        var u_Color = gl.getUniformLocation(program, "u_Color");
        gl.uniform4fv(u_Color, color);
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        var maxDimension = Math.max(options.size.x, options.size.y);
        // The size of the rendering space will be a square with this maximum dimension
        var size = new Vec2_1["default"](maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        var translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        var translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        var transformation = Mat4x4_1["default"].MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        var u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    /*
        So as it turns out, WebGL has an issue with non-square quads.
        It doesn't like when you don't have a 1-1 scale, and rotations are entirely messed up if this is not the case.
        To solve this, I used the scale of the LARGEST dimension of the quad to make a square, then adjusted the vertex coordinates inside of that.
        A diagram of the solution follows.

        There is a bounding square for the quad with dimensions hxh (in this case, since height is the largest dimension).
        The offset in the vertical direction is therefore 0.5, as it is normally.
        However, the offset in the horizontal direction is not so straightforward, but isn't conceptually hard.
        All we really have to do is a range change from [0, height/2] to [0, 0.5], where our value is t = width/2, and 0 <= t <= height/2.

        So now we have our rect, in a space scaled with respect to the largest dimension.
        Rotations work as you would expect, even for long rectangles.

                    0.5
            __ __ __ __ __ __ __
            |	|88888888888|	|
            |	|88888888888|	|
            |	|88888888888|	|
        -0.5|_ _|88888888888|_ _|0.5
            |	|88888888888|	|
            |	|88888888888|	|
            |	|88888888888|	|
            |___|88888888888|___|
                    -0.5

        The getVertices function below does as described, and converts the range
    */
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    RectShaderType.prototype.getVertices = function (w, h) {
        var x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        return new Float32Array([
            -x, y,
            -x, -y,
            x, y,
            x, -y
        ]);
    };
    RectShaderType.prototype.getOptions = function (rect) {
        var options = {
            position: rect.position,
            color: rect.color,
            size: rect.size,
            rotation: rect.rotation
        };
        return options;
    };
    return RectShaderType;
}(QuadShaderType_1["default"]));
exports["default"] = RectShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":20,"../../../ResourceManager/ResourceManager":79,"./QuadShaderType":76}],78:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Mat4x4_1 = require("../../../DataTypes/Mat4x4");
var Vec2_1 = require("../../../DataTypes/Vec2");
var AnimatedSprite_1 = require("../../../Nodes/Sprites/AnimatedSprite");
var ResourceManager_1 = require("../../../ResourceManager/ResourceManager");
var QuadShaderType_1 = require("./QuadShaderType");
/** A shader for sprites and animated sprites */
var SpriteShaderType = /** @class */ (function (_super) {
    __extends(SpriteShaderType, _super);
    function SpriteShaderType(programKey) {
        var _this = _super.call(this, programKey) || this;
        _this.resourceManager = ResourceManager_1["default"].getInstance();
        return _this;
    }
    SpriteShaderType.prototype.initBufferObject = function () {
        this.bufferObjectKey = "sprite";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    };
    SpriteShaderType.prototype.render = function (gl, options) {
        var program = this.resourceManager.getShaderProgram(this.programKey);
        var buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        var texture = this.resourceManager.getTexture(options.imageKey);
        gl.useProgram(program);
        var vertexData = this.getVertices(options.size.x, options.size.y, options.scale);
        var FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        var a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        var a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(a_TexCoord);
        // Uniforms
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        var maxDimension = Math.max(options.size.x, options.size.y);
        // The size of the rendering space will be a square with this maximum dimension
        var size = new Vec2_1["default"](maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        var translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        var translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        var transformation = Mat4x4_1["default"].MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        var u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Set up our sampler with our assigned texture unit
        var u_Sampler = gl.getUniformLocation(program, "u_Sampler");
        gl.uniform1i(u_Sampler, texture);
        // Pass in texShift
        var u_texShift = gl.getUniformLocation(program, "u_texShift");
        gl.uniform2fv(u_texShift, options.texShift);
        // Pass in texScale
        var u_texScale = gl.getUniformLocation(program, "u_texScale");
        gl.uniform2fv(u_texScale, options.texScale);
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    SpriteShaderType.prototype.getVertices = function (w, h, scale) {
        var x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        // Scale the rendering space if needed
        x *= scale[0];
        y *= scale[1];
        return new Float32Array([
            -x, y, 0.0, 0.0,
            -x, -y, 0.0, 1.0,
            x, y, 1.0, 0.0,
            x, -y, 1.0, 1.0
        ]);
    };
    SpriteShaderType.prototype.getOptions = function (sprite) {
        var texShift;
        var texScale;
        if (sprite instanceof AnimatedSprite_1["default"]) {
            var animationIndex = sprite.animation.getIndexAndAdvanceAnimation();
            var offset = sprite.getAnimationOffset(animationIndex);
            texShift = new Float32Array([offset.x / (sprite.cols * sprite.size.x), offset.y / (sprite.rows * sprite.size.y)]);
            texScale = new Float32Array([1 / (sprite.cols), 1 / (sprite.rows)]);
        }
        else {
            texShift = new Float32Array([0, 0]);
            texScale = new Float32Array([1, 1]);
        }
        var options = {
            position: sprite.position,
            rotation: sprite.rotation,
            size: sprite.size,
            scale: sprite.scale.toArray(),
            imageKey: sprite.imageId,
            texShift: texShift,
            texScale: texScale
        };
        return options;
    };
    return SpriteShaderType;
}(QuadShaderType_1["default"]));
exports["default"] = SpriteShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":20,"../../../Nodes/Sprites/AnimatedSprite":43,"../../../ResourceManager/ResourceManager":79,"./QuadShaderType":76}],79:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("../DataTypes/Map");
var Queue_1 = require("../DataTypes/Queue");
var StringUtils_1 = require("../Utils/StringUtils");
var AudioManager_1 = require("../Sound/AudioManager");
var WebGLProgramType_1 = require("../DataTypes/Rendering/WebGLProgramType");
/**
 * The resource manager for the game engine.
 * The resource manager interfaces with the loadable assets of a game such as images, data files,
 * and sounds, which are all found in the dist folder.
 * This class controls loading and updates the @reference[Scene] with the loading progress, so that the scene does
 * not start before all necessary assets are loaded.
 */
var ResourceManager = /** @class */ (function () {
    function ResourceManager() {
        this.loading = false;
        this.justLoaded = false;
        this.loadonly_imagesLoaded = 0;
        this.loadonly_imagesToLoad = 0;
        this.loadonly_imageLoadingQueue = new Queue_1["default"]();
        this.images = new Map_1["default"]();
        this.loadonly_spritesheetsLoaded = 0;
        this.loadonly_spritesheetsToLoad = 0;
        this.loadonly_spritesheetLoadingQueue = new Queue_1["default"]();
        this.spritesheets = new Map_1["default"]();
        this.loadonly_tilemapsLoaded = 0;
        this.loadonly_tilemapsToLoad = 0;
        this.loadonly_tilemapLoadingQueue = new Queue_1["default"]();
        this.tilemaps = new Map_1["default"]();
        this.loadonly_audioLoaded = 0;
        this.loadonly_audioToLoad = 0;
        this.loadonly_audioLoadingQueue = new Queue_1["default"]();
        this.audioBuffers = new Map_1["default"]();
        this.loadonly_jsonLoaded = 0;
        this.loadonly_jsonToLoad = 0;
        this.loadonly_jsonLoadingQueue = new Queue_1["default"]();
        this.jsonObjects = new Map_1["default"]();
        this.loadonly_gl_ShaderProgramsLoaded = 0;
        this.loadonly_gl_ShaderProgramsToLoad = 0;
        this.loadonly_gl_ShaderLoadingQueue = new Queue_1["default"]();
        this.gl_ShaderPrograms = new Map_1["default"]();
        this.gl_Textures = new Map_1["default"]();
        this.gl_NextTextureID = 0;
        this.gl_Buffers = new Map_1["default"]();
        this.resourcesToUnload = new Array();
        this.resourcesToKeep = new Array();
    }
    ;
    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The resource manager
     */
    ResourceManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new ResourceManager();
        }
        return this.instance;
    };
    /* ######################################## PUBLIC FUNCTION ########################################*/
    /**
     * Activates or deactivates the use of WebGL
     * @param flag True if WebGL should be used, false otherwise
     * @param gl The instance of the graphics context, if applicable
     */
    ResourceManager.prototype.useWebGL = function (flag, gl) {
        this.gl_WebGLActive = flag;
        if (this.gl_WebGLActive) {
            this.gl = gl;
        }
    };
    /**
     * Loads an image from file
     * @param key The key to associate the loaded image with
     * @param path The path to the image to load
     */
    ResourceManager.prototype.image = function (key, path) {
        this.loadonly_imageLoadingQueue.enqueue({ key: key, path: path });
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepImage = function (key) {
        this.keepResource(key, ResourceType.IMAGE);
    };
    /**
     * Retrieves a loaded image
     * @param key The key of the loaded image
     * @returns The image element associated with this key
     */
    ResourceManager.prototype.getImage = function (key) {
        var image = this.images.get(key);
        if (image === undefined) {
            throw "There is no image associated with key \"".concat(key, "\"");
        }
        return image;
    };
    /**
     * Loads a spritesheet from file
     * @param key The key to associate the loaded spritesheet with
     * @param path The path to the spritesheet to load
     */
    ResourceManager.prototype.spritesheet = function (key, path) {
        this.loadonly_spritesheetLoadingQueue.enqueue({ key: key, path: path });
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepSpritesheet = function (key) {
        this.keepResource(key, ResourceType.SPRITESHEET);
    };
    /**
     * Retrieves a loaded spritesheet
     * @param key The key of the spritesheet to load
     * @returns The loaded Spritesheet
     */
    ResourceManager.prototype.getSpritesheet = function (key) {
        return this.spritesheets.get(key);
    };
    /**
     * Loads an audio file
     * @param key The key to associate with the loaded audio file
     * @param path The path to the audio file to load
     */
    ResourceManager.prototype.audio = function (key, path) {
        this.loadonly_audioLoadingQueue.enqueue({ key: key, path: path });
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepAudio = function (key) {
        this.keepResource(key, ResourceType.AUDIO);
    };
    /**
     * Retrieves a loaded audio file
     * @param key The key of the audio file to load
     * @returns The AudioBuffer created from the loaded audio fle
     */
    ResourceManager.prototype.getAudio = function (key) {
        return this.audioBuffers.get(key);
    };
    /**
     * Load a tilemap from a json file. Automatically loads related images
     * @param key The key to associate with the loaded tilemap
     * @param path The path to the tilemap to load
     */
    ResourceManager.prototype.tilemap = function (key, path) {
        this.loadonly_tilemapLoadingQueue.enqueue({ key: key, path: path });
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepTilemap = function (key) {
        this.keepResource(key, ResourceType.TILEMAP);
    };
    /**
     * Retreives a loaded tilemap
     * @param key The key of the loaded tilemap
     * @returns The tilemap data associated with the key
     */
    ResourceManager.prototype.getTilemap = function (key) {
        return this.tilemaps.get(key);
    };
    /**
     * Loads an object from a json file.
     * @param key The key to associate with the loaded object
     * @param path The path to the json file to load
     */
    ResourceManager.prototype.object = function (key, path) {
        this.loadonly_jsonLoadingQueue.enqueue({ key: key, path: path });
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepObject = function (key) {
        this.keepResource(key, ResourceType.JSON);
    };
    /**
     * Retreives a loaded object
     * @param key The key of the loaded object
     * @returns The object data associated with the key
     */
    ResourceManager.prototype.getObject = function (key) {
        return this.jsonObjects.get(key);
    };
    /* ######################################## LOAD FUNCTION ########################################*/
    /**
     * Loads all resources currently in the queue
     * @param callback The function to cal when the resources are finished loading
     */
    ResourceManager.prototype.loadResourcesFromQueue = function (callback) {
        var _this = this;
        this.loadonly_typesToLoad = 5;
        this.loading = true;
        // Load everything in the queues. Tilemaps have to come before images because they will add new images to the queue
        this.loadTilemapsFromQueue(function () {
            console.log("Loaded Tilemaps");
            _this.loadSpritesheetsFromQueue(function () {
                console.log("Loaded Spritesheets");
                _this.loadImagesFromQueue(function () {
                    console.log("Loaded Images");
                    _this.loadAudioFromQueue(function () {
                        console.log("Loaded Audio");
                        _this.loadObjectsFromQueue(function () {
                            console.log("Loaded Objects");
                            if (_this.gl_WebGLActive) {
                                _this.gl_LoadShadersFromQueue(function () {
                                    console.log("Loaded Shaders");
                                    _this.finishLoading(callback);
                                });
                            }
                            else {
                                _this.finishLoading(callback);
                            }
                        });
                    });
                });
            });
        });
    };
    ResourceManager.prototype.finishLoading = function (callback) {
        // Done loading
        this.loading = false;
        this.justLoaded = true;
        callback();
    };
    /* ######################################## UNLOAD FUNCTION ########################################*/
    ResourceManager.prototype.keepResource = function (key, type) {
        var _a;
        console.log("Keep resource...");
        for (var i = 0; i < this.resourcesToUnload.length; i++) {
            var resource = this.resourcesToUnload[i];
            if (resource.key === key && resource.resourceType === type) {
                console.log("Found resource " + key + " of type " + type + ". Keeping.");
                var resourceToMove = this.resourcesToUnload.splice(i, 1);
                (_a = this.resourcesToKeep).push.apply(_a, resourceToMove);
                return;
            }
        }
    };
    /**
     * Deletes references to all resources in the resource manager
     */
    ResourceManager.prototype.unloadAllResources = function () {
        this.loading = false;
        this.justLoaded = false;
        for (var _i = 0, _a = this.resourcesToUnload; _i < _a.length; _i++) {
            var resource = _a[_i];
            // Unload the resource
            this.unloadResource(resource);
        }
    };
    ResourceManager.prototype.unloadResource = function (resource) {
        // Delete the resource itself
        switch (resource.resourceType) {
            case ResourceType.IMAGE:
                this.images["delete"](resource.key);
                if (this.gl_WebGLActive) {
                    this.gl_Textures["delete"](resource.key);
                }
                break;
            case ResourceType.TILEMAP:
                this.tilemaps["delete"](resource.key);
                break;
            case ResourceType.SPRITESHEET:
                this.spritesheets["delete"](resource.key);
                break;
            case ResourceType.AUDIO:
                this.audioBuffers["delete"](resource.key);
                break;
            case ResourceType.JSON:
                this.jsonObjects["delete"](resource.key);
                break;
            /*case ResourceType.SHADER:
                this.gl_ShaderPrograms.get(resource.key).delete(this.gl);
                this.gl_ShaderPrograms.delete(resource.key);
                break;*/
        }
        // Delete any dependencies
        for (var _i = 0, _a = resource.dependencies; _i < _a.length; _i++) {
            var dependency = _a[_i];
            this.unloadResource(dependency);
        }
    };
    /* ######################################## WORK FUNCTIONS ########################################*/
    /**
     * Loads all tilemaps currently in the tilemap loading queue
     * @param onFinishLoading The function to call when loading is complete
     */
    ResourceManager.prototype.loadTilemapsFromQueue = function (onFinishLoading) {
        this.loadonly_tilemapsToLoad = this.loadonly_tilemapLoadingQueue.getSize();
        this.loadonly_tilemapsLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_tilemapsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_tilemapLoadingQueue.hasItems()) {
            var tilemap = this.loadonly_tilemapLoadingQueue.dequeue();
            this.loadTilemap(tilemap.key, tilemap.path, onFinishLoading);
        }
    };
    /**
     * Loads a singular tilemap
     * @param key The key of the tilemap
     * @param pathToTilemapJSON The path to the tilemap JSON file
     * @param callbackIfLast The function to call if this is the last tilemap to load
     */
    ResourceManager.prototype.loadTilemap = function (key, pathToTilemapJSON, callbackIfLast) {
        var _this = this;
        this.loadTextFile(pathToTilemapJSON, function (fileText) {
            var tilemapObject = JSON.parse(fileText);
            // We can parse the object later - it's much faster than loading
            _this.tilemaps.add(key, tilemapObject);
            var resource = new ResourceReference(key, ResourceType.TILEMAP);
            // Grab the tileset images we need to load and add them to the imageloading queue
            for (var _i = 0, _a = tilemapObject.tilesets; _i < _a.length; _i++) {
                var tileset = _a[_i];
                if (tileset.image) {
                    var key_1 = tileset.image;
                    var path = StringUtils_1["default"].getPathFromFilePath(pathToTilemapJSON) + key_1;
                    _this.loadonly_imageLoadingQueue.enqueue({ key: key_1, path: path, isDependency: true });
                    // Add this image as a dependency to the tilemap
                    resource.addDependency(new ResourceReference(key_1, ResourceType.IMAGE));
                }
                else if (tileset.tiles) {
                    for (var _b = 0, _c = tileset.tiles; _b < _c.length; _b++) {
                        var tile = _c[_b];
                        var key_2 = tile.image;
                        var path = StringUtils_1["default"].getPathFromFilePath(pathToTilemapJSON) + key_2;
                        _this.loadonly_imageLoadingQueue.enqueue({ key: key_2, path: path, isDependency: true });
                        // Add this image as a dependency to the tilemap
                        resource.addDependency(new ResourceReference(key_2, ResourceType.IMAGE));
                    }
                }
            }
            // Add the resource reference to the list of resource to unload
            _this.resourcesToUnload.push(resource);
            // Finish loading
            _this.finishLoadingTilemap(callbackIfLast);
        });
    };
    /**
     * Finish loading a tilemap. Calls the callback function if this is the last tilemap being loaded
     * @param callback The function to call if this is the last tilemap to load
     */
    ResourceManager.prototype.finishLoadingTilemap = function (callback) {
        this.loadonly_tilemapsLoaded += 1;
        if (this.loadonly_tilemapsLoaded === this.loadonly_tilemapsToLoad) {
            // We're done loading tilemaps
            callback();
        }
    };
    /**
     * Loads all spritesheets currently in the spritesheet loading queue
     * @param onFinishLoading The function to call when the spritesheets are done loading
     */
    ResourceManager.prototype.loadSpritesheetsFromQueue = function (onFinishLoading) {
        this.loadonly_spritesheetsToLoad = this.loadonly_spritesheetLoadingQueue.getSize();
        this.loadonly_spritesheetsLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_spritesheetsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_spritesheetLoadingQueue.hasItems()) {
            var spritesheet = this.loadonly_spritesheetLoadingQueue.dequeue();
            this.loadSpritesheet(spritesheet.key, spritesheet.path, onFinishLoading);
        }
    };
    /**
     * Loads a singular spritesheet
     * @param key The key of the spritesheet to load
     * @param pathToSpritesheetJSON The path to the spritesheet JSON file
     * @param callbackIfLast The function to call if this is the last spritesheet
     */
    ResourceManager.prototype.loadSpritesheet = function (key, pathToSpritesheetJSON, callbackIfLast) {
        var _this = this;
        this.loadTextFile(pathToSpritesheetJSON, function (fileText) {
            var spritesheet = JSON.parse(fileText);
            // We can parse the object later - it's much faster than loading
            _this.spritesheets.add(key, spritesheet);
            var resource = new ResourceReference(key, ResourceType.SPRITESHEET);
            // Grab the image we need to load and add it to the imageloading queue
            var path = StringUtils_1["default"].getPathFromFilePath(pathToSpritesheetJSON) + spritesheet.spriteSheetImage;
            _this.loadonly_imageLoadingQueue.enqueue({ key: spritesheet.name, path: path, isDependency: true });
            resource.addDependency(new ResourceReference(spritesheet.name, ResourceType.IMAGE));
            _this.resourcesToUnload.push(resource);
            // Finish loading
            _this.finishLoadingSpritesheet(callbackIfLast);
        });
    };
    /**
     * Finish loading a spritesheet. Calls the callback function if this is the last spritesheet being loaded
     * @param callback The function to call if this is the last spritesheet to load
     */
    ResourceManager.prototype.finishLoadingSpritesheet = function (callback) {
        this.loadonly_spritesheetsLoaded += 1;
        if (this.loadonly_spritesheetsLoaded === this.loadonly_spritesheetsToLoad) {
            // We're done loading spritesheets
            callback();
        }
    };
    /**
     * Loads all images currently in the image loading queue
     * @param onFinishLoading The function to call when there are no more images to load
     */
    ResourceManager.prototype.loadImagesFromQueue = function (onFinishLoading) {
        this.loadonly_imagesToLoad = this.loadonly_imageLoadingQueue.getSize();
        this.loadonly_imagesLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_imagesToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_imageLoadingQueue.hasItems()) {
            var image = this.loadonly_imageLoadingQueue.dequeue();
            this.loadImage(image.key, image.path, image.isDependency, onFinishLoading);
        }
    };
    /**
     * Loads a singular image
     * @param key The key of the image to load
     * @param path The path to the image to load
     * @param callbackIfLast The function to call if this is the last image
     */
    ResourceManager.prototype.loadImage = function (key, path, isDependency, callbackIfLast) {
        var _this = this;
        var image = new Image();
        image.onload = function () {
            // Add to loaded images
            _this.images.add(key, image);
            // If not a dependency, push it to the unload list. Otherwise it's managed by something else
            if (!isDependency) {
                _this.resourcesToUnload.push(new ResourceReference(key, ResourceType.IMAGE));
            }
            // If WebGL is active, create a texture
            if (_this.gl_WebGLActive) {
                _this.createWebGLTexture(key, image);
            }
            // Finish image load
            _this.finishLoadingImage(callbackIfLast);
        };
        image.src = path;
    };
    /**
     * Finish loading an image. If this is the last image, it calls the callback function
     * @param callback The function to call if this is the last image
     */
    ResourceManager.prototype.finishLoadingImage = function (callback) {
        this.loadonly_imagesLoaded += 1;
        if (this.loadonly_imagesLoaded === this.loadonly_imagesToLoad) {
            // We're done loading images
            callback();
        }
    };
    /**
     * Loads all audio currently in the tilemap loading queue
     * @param onFinishLoading The function to call when tilemaps are done loading
     */
    ResourceManager.prototype.loadAudioFromQueue = function (onFinishLoading) {
        this.loadonly_audioToLoad = this.loadonly_audioLoadingQueue.getSize();
        this.loadonly_audioLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_audioToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_audioLoadingQueue.hasItems()) {
            var audio = this.loadonly_audioLoadingQueue.dequeue();
            this.loadAudio(audio.key, audio.path, onFinishLoading);
        }
    };
    /**
     * Load a singular audio file
     * @param key The key to the audio file to load
     * @param path The path to the audio file to load
     * @param callbackIfLast The function to call if this is the last audio file to load
     */
    ResourceManager.prototype.loadAudio = function (key, path, callbackIfLast) {
        var _this = this;
        var audioCtx = AudioManager_1["default"].getInstance().getAudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            audioCtx.decodeAudioData(request.response, function (buffer) {
                // Add to list of audio buffers
                _this.audioBuffers.add(key, buffer);
                _this.resourcesToUnload.push(new ResourceReference(key, ResourceType.AUDIO));
                // Finish loading sound
                _this.finishLoadingAudio(callbackIfLast);
            }, function (error) {
                throw "Error loading sound";
            });
        };
        request.send();
    };
    /**
     * Finish loading an audio file. Calls the callback functon if this is the last audio sample being loaded.
     * @param callback The function to call if this is the last audio file to load
     */
    ResourceManager.prototype.finishLoadingAudio = function (callback) {
        this.loadonly_audioLoaded += 1;
        if (this.loadonly_audioLoaded === this.loadonly_audioToLoad) {
            // We're done loading audio
            callback();
        }
    };
    /**
     * Loads all objects currently in the object loading queue
     * @param onFinishLoading The function to call when there are no more objects to load
     */
    ResourceManager.prototype.loadObjectsFromQueue = function (onFinishLoading) {
        this.loadonly_jsonToLoad = this.loadonly_jsonLoadingQueue.getSize();
        this.loadonly_jsonLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_jsonToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_jsonLoadingQueue.hasItems()) {
            var obj = this.loadonly_jsonLoadingQueue.dequeue();
            this.loadObject(obj.key, obj.path, onFinishLoading);
        }
    };
    /**
     * Loads a singular object
     * @param key The key of the object to load
     * @param path The path to the object to load
     * @param callbackIfLast The function to call if this is the last object
     */
    ResourceManager.prototype.loadObject = function (key, path, callbackIfLast) {
        var _this = this;
        this.loadTextFile(path, function (fileText) {
            var obj = JSON.parse(fileText);
            _this.jsonObjects.add(key, obj);
            _this.resourcesToUnload.push(new ResourceReference(key, ResourceType.JSON));
            _this.finishLoadingObject(callbackIfLast);
        });
    };
    /**
     * Finish loading an object. If this is the last object, it calls the callback function
     * @param callback The function to call if this is the last object
     */
    ResourceManager.prototype.finishLoadingObject = function (callback) {
        this.loadonly_jsonLoaded += 1;
        if (this.loadonly_jsonLoaded === this.loadonly_jsonToLoad) {
            // We're done loading objects
            callback();
        }
    };
    /* ########## WEBGL SPECIFIC FUNCTIONS ########## */
    ResourceManager.prototype.getTexture = function (key) {
        return this.gl_Textures.get(key);
    };
    ResourceManager.prototype.getShaderProgram = function (key) {
        return this.gl_ShaderPrograms.get(key).program;
    };
    ResourceManager.prototype.getBuffer = function (key) {
        return this.gl_Buffers.get(key);
    };
    ResourceManager.prototype.createWebGLTexture = function (imageKey, image) {
        // Get the texture ID
        var textureID = this.getTextureID(this.gl_NextTextureID);
        // Create the texture
        var texture = this.gl.createTexture();
        // Set up the texture
        // Enable texture0
        this.gl.activeTexture(textureID);
        // Bind our texture to texture 0
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // Set the texture parameters
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        // Set the texture image
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        // Add the texture to our map with the same key as the image
        this.gl_Textures.add(imageKey, this.gl_NextTextureID);
        // Increment the key
        this.gl_NextTextureID += 1;
    };
    ResourceManager.prototype.getTextureID = function (id) {
        // Start with 9 cases - this can be expanded if needed, but for the best performance,
        // Textures should be stitched into an atlas
        switch (id) {
            case 0: return this.gl.TEXTURE0;
            case 1: return this.gl.TEXTURE1;
            case 2: return this.gl.TEXTURE2;
            case 3: return this.gl.TEXTURE3;
            case 4: return this.gl.TEXTURE4;
            case 5: return this.gl.TEXTURE5;
            case 6: return this.gl.TEXTURE6;
            case 7: return this.gl.TEXTURE7;
            case 8: return this.gl.TEXTURE8;
            default: return this.gl.TEXTURE9;
        }
    };
    ResourceManager.prototype.createBuffer = function (key) {
        if (this.gl_WebGLActive) {
            var buffer = this.gl.createBuffer();
            this.gl_Buffers.add(key, buffer);
        }
    };
    /**
     * Enqueues loading of a new shader program
     * @param key The key of the shader program
     * @param vShaderFilepath
     * @param fShaderFilepath
     */
    ResourceManager.prototype.shader = function (key, vShaderFilepath, fShaderFilepath) {
        var splitPath = vShaderFilepath.split(".");
        var end = splitPath[splitPath.length - 1];
        if (end !== "vshader") {
            throw "".concat(vShaderFilepath, " is not a valid vertex shader - must end in \".vshader");
        }
        splitPath = fShaderFilepath.split(".");
        end = splitPath[splitPath.length - 1];
        if (end !== "fshader") {
            throw "".concat(fShaderFilepath, " is not a valid vertex shader - must end in \".fshader");
        }
        var paths = new KeyPath_Shader();
        paths.key = key;
        paths.vpath = vShaderFilepath;
        paths.fpath = fShaderFilepath;
        this.loadonly_gl_ShaderLoadingQueue.enqueue(paths);
    };
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    ResourceManager.prototype.keepShader = function (key) {
        this.keepResource(key, ResourceType.IMAGE);
    };
    ResourceManager.prototype.gl_LoadShadersFromQueue = function (onFinishLoading) {
        this.loadonly_gl_ShaderProgramsToLoad = this.loadonly_gl_ShaderLoadingQueue.getSize();
        this.loadonly_gl_ShaderProgramsLoaded = 0;
        // If webGL isn'active or there are no items to load, we're finished
        if (!this.gl_WebGLActive || this.loadonly_gl_ShaderProgramsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_gl_ShaderLoadingQueue.hasItems()) {
            var shader = this.loadonly_gl_ShaderLoadingQueue.dequeue();
            this.gl_LoadShader(shader.key, shader.vpath, shader.fpath, onFinishLoading);
        }
    };
    ResourceManager.prototype.gl_LoadShader = function (key, vpath, fpath, callbackIfLast) {
        var _this = this;
        this.loadTextFile(vpath, function (vFileText) {
            var vShader = vFileText;
            _this.loadTextFile(fpath, function (fFileText) {
                var fShader = fFileText;
                // Extract the program and shaders
                var _a = _this.createShaderProgram(vShader, fShader), shaderProgram = _a[0], vertexShader = _a[1], fragmentShader = _a[2];
                // Create a wrapper type
                var programWrapper = new WebGLProgramType_1["default"]();
                programWrapper.program = shaderProgram;
                programWrapper.vertexShader = vertexShader;
                programWrapper.fragmentShader = fragmentShader;
                // Add to our map
                _this.gl_ShaderPrograms.add(key, programWrapper);
                _this.resourcesToUnload.push(new ResourceReference(key, ResourceType.SHADER));
                // Finish loading
                _this.gl_FinishLoadingShader(callbackIfLast);
            });
        });
    };
    ResourceManager.prototype.gl_FinishLoadingShader = function (callback) {
        this.loadonly_gl_ShaderProgramsLoaded += 1;
        if (this.loadonly_gl_ShaderProgramsLoaded === this.loadonly_gl_ShaderProgramsToLoad) {
            // We're done loading shaders
            callback();
        }
    };
    ResourceManager.prototype.createShaderProgram = function (vShaderSource, fShaderSource) {
        var vertexShader = this.loadVertexShader(vShaderSource);
        var fragmentShader = this.loadFragmentShader(fShaderSource);
        if (vertexShader === null || fragmentShader === null) {
            // We had a problem intializing - error
            return null;
        }
        // Create a shader program
        var program = this.gl.createProgram();
        if (!program) {
            // Error creating
            console.warn("Failed to create program");
            return null;
        }
        // Attach our vertex and fragment shader
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        // Link
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            // Error linking
            var error = this.gl.getProgramInfoLog(program);
            console.warn("Failed to link program: " + error);
            // Clean up
            this.gl.deleteProgram(program);
            this.gl.deleteShader(vertexShader);
            this.gl.deleteShader(fragmentShader);
            return null;
        }
        // We successfully create a program
        return [program, vertexShader, fragmentShader];
    };
    ResourceManager.prototype.loadVertexShader = function (shaderSource) {
        // Create a new vertex shader
        return this.loadShader(this.gl.VERTEX_SHADER, shaderSource);
    };
    ResourceManager.prototype.loadFragmentShader = function (shaderSource) {
        // Create a new fragment shader
        return this.loadShader(this.gl.FRAGMENT_SHADER, shaderSource);
    };
    ResourceManager.prototype.loadShader = function (type, shaderSource) {
        var shader = this.gl.createShader(type);
        // If we couldn't create the shader, error
        if (shader === null) {
            console.warn("Unable to create shader");
            return null;
        }
        // Add the source to the shader and compile
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        // Make sure there were no errors during this process
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            // Not compiled - error
            var error = this.gl.getShaderInfoLog(shader);
            console.warn("Failed to compile shader: " + error);
            // Clean up
            this.gl.deleteShader(shader);
            return null;
        }
        // Sucess, so return the shader
        return shader;
    };
    /* ########## GENERAL LOADING FUNCTIONS ########## */
    ResourceManager.prototype.loadTextFile = function (textFilePath, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', textFilePath, true);
        xobj.onreadystatechange = function () {
            if ((xobj.readyState == 4) && (xobj.status == 200)) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    };
    /* ########## LOADING BAR INFO ########## */
    ResourceManager.prototype.getLoadPercent = function () {
        return (this.loadonly_tilemapsLoaded / this.loadonly_tilemapsToLoad
            + this.loadonly_spritesheetsLoaded / this.loadonly_spritesheetsToLoad
            + this.loadonly_imagesLoaded / this.loadonly_imagesToLoad
            + this.loadonly_audioLoaded / this.loadonly_audioToLoad)
            / this.loadonly_typesToLoad;
    };
    ResourceManager.prototype.update = function (deltaT) {
        if (this.loading) {
            if (this.onLoadProgress) {
                this.onLoadProgress(this.getLoadPercent());
            }
        }
        else if (this.justLoaded) {
            this.justLoaded = false;
            if (this.onLoadComplete) {
                this.onLoadComplete();
            }
        }
    };
    return ResourceManager;
}());
exports["default"] = ResourceManager;
/**
 * A class representing a reference to a resource.
 * This is used for the exemption list to assure assets and their dependencies don't get
 * destroyed if they are still needed.
 */
var ResourceReference = /** @class */ (function () {
    function ResourceReference(key, resourceType) {
        this.key = key;
        this.resourceType = resourceType;
        this.dependencies = new Array();
    }
    ResourceReference.prototype.addDependency = function (resource) {
        this.dependencies.push(resource);
    };
    return ResourceReference;
}());
var ResourceType;
(function (ResourceType) {
    ResourceType["IMAGE"] = "IMAGE";
    ResourceType["TILEMAP"] = "TILEMAP";
    ResourceType["SPRITESHEET"] = "SPRITESHEET";
    ResourceType["AUDIO"] = "AUDIO";
    ResourceType["JSON"] = "JSON";
    ResourceType["SHADER"] = "SHADER";
})(ResourceType || (ResourceType = {}));
/**
 * A pair representing a key and the path of the resource to load
 */
var KeyPathPair = /** @class */ (function () {
    function KeyPathPair() {
        this.isDependency = false;
    }
    return KeyPathPair;
}());
var KeyPath_Shader = /** @class */ (function () {
    function KeyPath_Shader() {
    }
    return KeyPath_Shader;
}());
},{"../DataTypes/Map":8,"../DataTypes/Queue":12,"../DataTypes/Rendering/WebGLProgramType":13,"../Sound/AudioManager":92,"../Utils/StringUtils":99}],80:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../DataTypes/Vec2");
/**
 * An abstract interface of a SceneGraph.
 * Exposes methods for use by other code, but leaves the implementation up to the subclasses.
 * The SceneGraph manages the positions of all GameNodes, and can easily prune a visible set for rendering.
 */
var SceneGraph = /** @class */ (function () {
    /**
     * Creates a new SceneGraph
     * @param viewport The viewport
     * @param scene The Scene this SceneGraph belongs to
     */
    function SceneGraph(viewport, scene) {
        this.viewport = viewport;
        this.scene = scene;
        this.nodeMap = new Array();
        this.idCounter = 0;
    }
    /**
     * Add a node to the SceneGraph
     * @param node The CanvasNode to add to the SceneGraph
     * @returns The SceneGraph ID of this newly added CanvasNode
     */
    SceneGraph.prototype.addNode = function (node) {
        this.nodeMap[node.id] = node;
        this.addNodeSpecific(node, this.idCounter);
        this.idCounter += 1;
        return this.idCounter - 1;
    };
    ;
    /**
     * Removes a node from the SceneGraph
     * @param node The node to remove
     */
    SceneGraph.prototype.removeNode = function (node) {
        // Find and remove node in O(n)
        this.nodeMap[node.id] = undefined;
        this.removeNodeSpecific(node, node.id);
    };
    ;
    /**
     * Get a specific node using its id
     * @param id The id of the CanvasNode to retrieve
     * @returns The node with this ID
     */
    SceneGraph.prototype.getNode = function (id) {
        return this.nodeMap[id];
    };
    /**
     * Returns the nodes at specific coordinates
     * @param vecOrX The x-coordinate of the position, or the coordinates in a Vec2
     * @param y The y-coordinate of the position
     * @returns An array of nodes found at the position provided
     */
    SceneGraph.prototype.getNodesAt = function (vecOrX, y) {
        if (y === void 0) { y = null; }
        if (vecOrX instanceof Vec2_1["default"]) {
            return this.getNodesAtCoords(vecOrX.x, vecOrX.y);
        }
        else {
            return this.getNodesAtCoords(vecOrX, y);
        }
    };
    /**
     * Returns all nodes in the SceneGraph
     * @returns An Array containing all nodes in the SceneGraph
     */
    SceneGraph.prototype.getAllNodes = function () {
        var arr = new Array();
        for (var i = 0; i < this.nodeMap.length; i++) {
            if (this.nodeMap[i] !== undefined) {
                arr.push(this.nodeMap[i]);
            }
        }
        return arr;
    };
    return SceneGraph;
}());
exports["default"] = SceneGraph;
},{"../DataTypes/Vec2":20}],81:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var SceneGraph_1 = require("./SceneGraph");
var Stats_1 = require("../Debug/Stats");
/**
 * An implementation of a SceneGraph that simply stored CanvasNodes in an array.
 */
var SceneGraphArray = /** @class */ (function (_super) {
    __extends(SceneGraphArray, _super);
    /**
     * Creates a new SceneGraphArray
     * @param viewport The Viewport
     * @param scene The Scene this SceneGraph belongs to
     */
    function SceneGraphArray(viewport, scene) {
        var _this = _super.call(this, viewport, scene) || this;
        _this.nodeList = new Array();
        return _this;
    }
    // @override
    SceneGraphArray.prototype.addNodeSpecific = function (node, id) {
        this.nodeList.push(node);
    };
    // @override
    SceneGraphArray.prototype.removeNodeSpecific = function (node, id) {
        var index = this.nodeList.indexOf(node);
        if (index > -1) {
            this.nodeList.splice(index, 1);
        }
    };
    // @override
    SceneGraphArray.prototype.getNodesAtCoords = function (x, y) {
        var results = [];
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.contains(x, y)) {
                results.push(node);
            }
        }
        return results;
    };
    // @override
    SceneGraphArray.prototype.getNodesInRegion = function (boundary) {
        var t0 = performance.now();
        var results = [];
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var node = _a[_i];
            if (boundary.overlaps(node.boundary)) {
                results.push(node);
            }
        }
        var t1 = performance.now();
        Stats_1["default"].log("sgquery", (t1 - t0));
        return results;
    };
    SceneGraphArray.prototype.update = function (deltaT) {
        var t0 = performance.now();
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var node = _a[_i];
            if (!node.getLayer().isPaused()) {
                node.update(deltaT);
            }
        }
        var t1 = performance.now();
        Stats_1["default"].log("sgupdate", (t1 - t0));
    };
    SceneGraphArray.prototype.render = function (ctx) { };
    // @override
    SceneGraphArray.prototype.getVisibleSet = function () {
        var visibleSet = new Array();
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var node = _a[_i];
            if (!node.getLayer().isHidden() && node.visible && this.viewport.includes(node)) {
                visibleSet.push(node);
            }
        }
        return visibleSet;
    };
    return SceneGraphArray;
}(SceneGraph_1["default"]));
exports["default"] = SceneGraphArray;
},{"../Debug/Stats":22,"./SceneGraph":80}],82:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Vec2_1 = require("../DataTypes/Vec2");
var MathUtils_1 = require("../Utils/MathUtils");
var Queue_1 = require("../DataTypes/Queue");
var AABB_1 = require("../DataTypes/Shapes/AABB");
var Input_1 = require("../Input/Input");
var ParallaxLayer_1 = require("../Scene/Layers/ParallaxLayer");
var UILayer_1 = require("../Scene/Layers/UILayer");
/**
 * The viewport of the game. Corresponds to the visible window displayed in the browser.
 * The viewport keeps track of its position in the game world, and can act as a camera to follow objects.
 */
var Viewport = /** @class */ (function () {
    function Viewport(canvasSize, zoomLevel) {
        /** The amount that is zoomed in or out. */
        this.ZOOM_FACTOR = 1.2;
        this.view = new AABB_1["default"](Vec2_1["default"].ZERO, Vec2_1["default"].ZERO);
        this.boundary = new AABB_1["default"](Vec2_1["default"].ZERO, Vec2_1["default"].ZERO);
        this.lastPositions = new Queue_1["default"]();
        this.smoothingFactor = 10;
        this.scrollZoomEnabled = false;
        this.canvasSize = Vec2_1["default"].ZERO;
        this.focus = Vec2_1["default"].ZERO;
        // Set the size of the canvas
        this.setCanvasSize(canvasSize);
        // Set the size of the viewport
        this.setSize(canvasSize);
        this.setZoomLevel(zoomLevel);
        // Set the center (and make the viewport stay there)
        this.setCenter(this.view.halfSize.clone());
        this.setFocus(this.view.halfSize.clone());
    }
    /** Enables the viewport to zoom in and out */
    Viewport.prototype.enableZoom = function () {
        this.scrollZoomEnabled = true;
    };
    /**
     * Returns the position of the viewport
     * @returns The center of the viewport as a Vec2
     */
    Viewport.prototype.getCenter = function () {
        return this.view.center;
    };
    /**
     * Returns a new Vec2 with the origin of the viewport
     * @returns The top left cornder of the Vieport as a Vec2
     */
    Viewport.prototype.getOrigin = function () {
        return new Vec2_1["default"](this.view.left, this.view.top);
    };
    /**
     * Returns the region visible to this viewport
     * @returns The AABB containing the region visible to the viewport
     */
    Viewport.prototype.getView = function () {
        return this.view;
    };
    /**
     * Set the position of the viewport
     * @param vecOrX The new position or the x-coordinate of the new position
     * @param y The y-coordinate of the new position
     */
    Viewport.prototype.setCenter = function (vecOrX, y) {
        if (y === void 0) { y = null; }
        var pos;
        if (vecOrX instanceof Vec2_1["default"]) {
            pos = vecOrX;
        }
        else {
            pos = new Vec2_1["default"](vecOrX, y);
        }
        this.view.center = pos;
    };
    /**
     * Returns the size of the viewport as a Vec2
     * @returns The half-size of the viewport as a Vec2
     */
    Viewport.prototype.getHalfSize = function () {
        return this.view.getHalfSize();
    };
    /**
     * Sets the size of the viewport
     * @param vecOrX The new width of the viewport or the new size as a Vec2
     * @param y The new height of the viewport
     */
    Viewport.prototype.setSize = function (vecOrX, y) {
        if (y === void 0) { y = null; }
        if (vecOrX instanceof Vec2_1["default"]) {
            this.view.setHalfSize(vecOrX.scaled(1 / 2));
        }
        else {
            this.view.setHalfSize(new Vec2_1["default"](vecOrX / 2, y / 2));
        }
    };
    /**
     * Sets the half-size of the viewport
     * @param vecOrX The new half-width of the viewport or the new half-size as a Vec2
     * @param y The new height of the viewport
     */
    Viewport.prototype.setHalfSize = function (vecOrX, y) {
        if (y === void 0) { y = null; }
        if (vecOrX instanceof Vec2_1["default"]) {
            this.view.setHalfSize(vecOrX.clone());
        }
        else {
            this.view.setHalfSize(new Vec2_1["default"](vecOrX, y));
        }
    };
    /**
     * Updates the viewport with the size of the current Canvas
     * @param vecOrX The width of the canvas, or the canvas size as a Vec2
     * @param y The height of the canvas
     */
    Viewport.prototype.setCanvasSize = function (vecOrX, y) {
        if (y === void 0) { y = null; }
        if (vecOrX instanceof Vec2_1["default"]) {
            this.canvasSize = vecOrX.clone();
        }
        else {
            this.canvasSize = new Vec2_1["default"](vecOrX, y);
        }
    };
    /**
     * Sets the zoom level of the viewport
     * @param zoom The zoom level
     */
    Viewport.prototype.setZoomLevel = function (zoom) {
        this.view.halfSize.copy(this.canvasSize.scaled(1 / zoom / 2));
    };
    /**
     * Gets the zoom level of the viewport
     * @returns The zoom level
     */
    Viewport.prototype.getZoomLevel = function () {
        return this.canvasSize.x / this.view.hw / 2;
    };
    /**
     * Sets the smoothing factor for the viewport movement.
     * @param smoothingFactor The smoothing factor for the viewport
     */
    Viewport.prototype.setSmoothingFactor = function (smoothingFactor) {
        if (smoothingFactor < 1)
            smoothingFactor = 1;
        this.smoothingFactor = smoothingFactor;
    };
    /**
     * Tells the viewport to focus on a point. Overidden by "following".
     * @param focus The point the  viewport should focus on
     */
    Viewport.prototype.setFocus = function (focus) {
        this.focus.copy(focus);
    };
    /**
     * Returns true if the CanvasNode is inside of the viewport
     * @param node The node to check
     * @returns True if the node is currently visible in the viewport, false if not
     */
    Viewport.prototype.includes = function (node) {
        var parallax = node.getLayer() instanceof ParallaxLayer_1["default"] || node.getLayer() instanceof UILayer_1["default"] ? node.getLayer().parallax : new Vec2_1["default"](1, 1);
        var center = this.view.center.clone();
        this.view.center.mult(parallax);
        var overlaps = this.view.overlaps(node.boundary);
        this.view.center = center;
        return overlaps;
    };
    // TODO: Put some error handling on this for trying to make the bounds too small for the viewport
    // TODO: This should probably be done automatically, or should consider the aspect ratio or something
    /**
     * Sets the bounds of the viewport
     * @param lowerX The left edge of the viewport
     * @param lowerY The top edge of the viewport
     * @param upperX The right edge of the viewport
     * @param upperY The bottom edge of the viewport
     */
    Viewport.prototype.setBounds = function (lowerX, lowerY, upperX, upperY) {
        var hwidth = (upperX - lowerX) / 2;
        var hheight = (upperY - lowerY) / 2;
        var x = lowerX + hwidth;
        var y = lowerY + hheight;
        this.boundary.center.set(x, y);
        this.boundary.halfSize.set(hwidth, hheight);
    };
    /**
     * Make the viewport follow the specified GameNode
     * @param node The GameNode to follow
     */
    Viewport.prototype.follow = function (node) {
        this.following = node;
    };
    Viewport.prototype.updateView = function () {
        if (this.lastPositions.getSize() > this.smoothingFactor) {
            this.lastPositions.dequeue();
        }
        // Get the average of the last 10 positions
        var pos = Vec2_1["default"].ZERO;
        this.lastPositions.forEach(function (position) { return pos.add(position); });
        pos.scale(1 / this.lastPositions.getSize());
        // Set this position either to the object or to its bounds
        pos.x = MathUtils_1["default"].clamp(pos.x, this.boundary.left + this.view.hw, this.boundary.right - this.view.hw);
        pos.y = MathUtils_1["default"].clamp(pos.y, this.boundary.top + this.view.hh, this.boundary.bottom - this.view.hh);
        // Assure there are no lines in the tilemap
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        this.view.center.copy(pos);
    };
    Viewport.prototype.update = function (deltaT) {
        // If zoom is enabled
        if (this.scrollZoomEnabled) {
            if (Input_1["default"].didJustScroll()) {
                var currentSize = this.view.getHalfSize().clone();
                if (Input_1["default"].getScrollDirection() < 0) {
                    // Zoom in
                    currentSize.scale(1 / this.ZOOM_FACTOR);
                }
                else {
                    // Zoom out
                    currentSize.scale(this.ZOOM_FACTOR);
                }
                if (currentSize.x > this.boundary.hw) {
                    var factor = this.boundary.hw / currentSize.x;
                    currentSize.x = this.boundary.hw;
                    currentSize.y *= factor;
                }
                if (currentSize.y > this.boundary.hh) {
                    var factor = this.boundary.hh / currentSize.y;
                    currentSize.y = this.boundary.hh;
                    currentSize.x *= factor;
                }
                this.view.setHalfSize(currentSize);
            }
        }
        // If viewport is following an object
        if (this.following) {
            // Update our list of previous positions
            this.lastPositions.enqueue(this.following.position.clone());
        }
        else {
            this.lastPositions.enqueue(this.focus);
        }
        this.updateView();
    };
    return Viewport;
}());
exports["default"] = Viewport;
},{"../DataTypes/Queue":12,"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":20,"../Input/Input":28,"../Scene/Layers/ParallaxLayer":87,"../Scene/Layers/UILayer":88,"../Utils/MathUtils":97}],83:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Sprite_1 = require("../../Nodes/Sprites/Sprite");
var AnimatedSprite_1 = require("../../Nodes/Sprites/AnimatedSprite");
var GraphicTypes_1 = require("../../Nodes/Graphics/GraphicTypes");
var UIElementTypes_1 = require("../../Nodes/UIElements/UIElementTypes");
var Point_1 = require("../../Nodes/Graphics/Point");
var Vec2_1 = require("../../DataTypes/Vec2");
var Button_1 = require("../../Nodes/UIElements/Button");
var Label_1 = require("../../Nodes/UIElements/Label");
var Slider_1 = require("../../Nodes/UIElements/Slider");
var TextInput_1 = require("../../Nodes/UIElements/TextInput");
var Rect_1 = require("../../Nodes/Graphics/Rect");
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var Line_1 = require("../../Nodes/Graphics/Line");
var Particle_1 = require("../../Nodes/Graphics/Particle");
// @ignorePage
/**
 * A factory that abstracts adding @reference[CanvasNode]s to the @reference[Scene].
 * Access methods in this factory through Scene.add.[methodName]().
 */
var CanvasNodeFactory = /** @class */ (function () {
    function CanvasNodeFactory() {
        var _this = this;
        /**
         * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
         * @param type The type of UIElement to add
         * @param layerName The layer to add the UIElement to
         * @param options Any additional arguments to feed to the constructor
         * @returns A new UIElement
         */
        this.addUIElement = function (type, layerName, options) {
            // Get the layer
            var layer = _this.scene.getLayer(layerName);
            var instance;
            switch (type) {
                case UIElementTypes_1.UIElementType.BUTTON:
                    instance = _this.buildButton(options);
                    break;
                case UIElementTypes_1.UIElementType.LABEL:
                    instance = _this.buildLabel(options);
                    break;
                case UIElementTypes_1.UIElementType.SLIDER:
                    instance = _this.buildSlider(options);
                    break;
                case UIElementTypes_1.UIElementType.TEXT_INPUT:
                    instance = _this.buildTextInput(options);
                    break;
                default:
                    throw "UIElementType '".concat(type, "' does not exist, or is registered incorrectly.");
            }
            instance.setScene(_this.scene);
            instance.id = _this.scene.generateId();
            _this.scene.getSceneGraph().addNode(instance);
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds a sprite to the current scene
         * @param key The key of the image the sprite will represent
         * @param layerName The layer on which to add the sprite
         * @returns A new Sprite
         */
        this.addSprite = function (key, layerName) {
            var layer = _this.scene.getLayer(layerName);
            var instance = new Sprite_1["default"](key);
            // Add instance to scene
            instance.setScene(_this.scene);
            instance.id = _this.scene.generateId();
            if (!(_this.scene.isParallaxLayer(layerName) || _this.scene.isUILayer(layerName))) {
                _this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds an AnimatedSprite to the current scene
         * @param key The key of the image the sprite will represent
         * @param layerName The layer on which to add the sprite
         * @returns A new AnimatedSprite
         */
        this.addAnimatedSprite = function (key, layerName) {
            var layer = _this.scene.getLayer(layerName);
            var spritesheet = _this.resourceManager.getSpritesheet(key);
            var instance = new AnimatedSprite_1["default"](spritesheet);
            // Add instance fo scene
            instance.setScene(_this.scene);
            instance.id = _this.scene.generateId();
            if (!(_this.scene.isParallaxLayer(layerName) || _this.scene.isUILayer(layerName))) {
                _this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds a new graphic element to the current Scene
         * @param type The type of graphic to add
         * @param layerName The layer on which to add the graphic
         * @param options Any additional arguments to send to the graphic constructor
         * @returns A new Graphic
         */
        this.addGraphic = function (type, layerName, options) {
            // Get the layer
            var layer = _this.scene.getLayer(layerName);
            var instance;
            switch (type) {
                case GraphicTypes_1.GraphicType.POINT:
                    instance = _this.buildPoint(options);
                    break;
                case GraphicTypes_1.GraphicType.LINE:
                    instance = _this.buildLine(options);
                    break;
                case GraphicTypes_1.GraphicType.RECT:
                    instance = _this.buildRect(options);
                    break;
                case GraphicTypes_1.GraphicType.PARTICLE:
                    instance = _this.buildParticle(options);
                    break;
                default:
                    throw "GraphicType '".concat(type, "' does not exist, or is registered incorrectly.");
            }
            // Add instance to scene
            instance.setScene(_this.scene);
            instance.id = _this.scene.generateId();
            if (!(_this.scene.isParallaxLayer(layerName) || _this.scene.isUILayer(layerName))) {
                _this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
    }
    CanvasNodeFactory.prototype.init = function (scene) {
        this.scene = scene;
        this.resourceManager = ResourceManager_1["default"].getInstance();
    };
    /* ---------- BUILDERS ---------- */
    CanvasNodeFactory.prototype.buildButton = function (options) {
        this.checkIfPropExists("Button", options, "position", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Button", options, "text", "string");
        return new Button_1["default"](options.position, options.text);
    };
    CanvasNodeFactory.prototype.buildLabel = function (options) {
        this.checkIfPropExists("Label", options, "position", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Label", options, "text", "string");
        return new Label_1["default"](options.position, options.text);
    };
    CanvasNodeFactory.prototype.buildSlider = function (options) {
        this.checkIfPropExists("Slider", options, "position", Vec2_1["default"], "Vec2");
        var initValue = 0;
        if (options.value !== undefined) {
            initValue = options.value;
        }
        return new Slider_1["default"](options.position, initValue);
    };
    CanvasNodeFactory.prototype.buildTextInput = function (options) {
        this.checkIfPropExists("TextInput", options, "position", Vec2_1["default"], "Vec2");
        return new TextInput_1["default"](options.position);
    };
    CanvasNodeFactory.prototype.buildPoint = function (options) {
        this.checkIfPropExists("Point", options, "position", Vec2_1["default"], "Vec2");
        return new Point_1["default"](options.position);
    };
    CanvasNodeFactory.prototype.buildParticle = function (options) {
        this.checkIfPropExists("Particle", options, "position", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Particle", options, "size", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Particle", options, "mass", "number", "number");
        //Changed for testing
        return new Particle_1["default"](options.position, options.size, options.mass);
    };
    CanvasNodeFactory.prototype.buildLine = function (options) {
        this.checkIfPropExists("Line", options, "start", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Line", options, "end", Vec2_1["default"], "Vec2");
        return new Line_1["default"](options.start, options.end);
    };
    CanvasNodeFactory.prototype.buildRect = function (options) {
        this.checkIfPropExists("Rect", options, "position", Vec2_1["default"], "Vec2");
        this.checkIfPropExists("Rect", options, "size", Vec2_1["default"], "Vec2");
        return new Rect_1["default"](options.position, options.size);
    };
    /* ---------- ERROR HANDLING ---------- */
    CanvasNodeFactory.prototype.checkIfPropExists = function (objectName, options, prop, type, typeName) {
        if (!options || options[prop] === undefined) {
            // Check that the options object has the property
            throw "".concat(objectName, " object requires argument ").concat(prop, " of type ").concat(typeName, ", but none was provided.");
        }
        else {
            // Check that the property has the correct type
            if ((typeof type) === "string") {
                if (!(typeof options[prop] === type)) {
                    throw "".concat(objectName, " object requires argument ").concat(prop, " of type ").concat(type, ", but provided ").concat(prop, " was not of type ").concat(type, ".");
                }
            }
            else if (type instanceof Function) {
                // If type is a constructor, check against that
                if (!(options[prop] instanceof type)) {
                    throw "".concat(objectName, " object requires argument ").concat(prop, " of type ").concat(typeName, ", but provided ").concat(prop, " was not of type ").concat(typeName, ".");
                }
            }
            else {
                throw "".concat(objectName, " object requires argument ").concat(prop, " of type ").concat(typeName, ", but provided ").concat(prop, " was not of type ").concat(typeName, ".");
            }
        }
    };
    return CanvasNodeFactory;
}());
exports["default"] = CanvasNodeFactory;
},{"../../DataTypes/Vec2":20,"../../Nodes/Graphics/GraphicTypes":38,"../../Nodes/Graphics/Line":39,"../../Nodes/Graphics/Particle":40,"../../Nodes/Graphics/Point":41,"../../Nodes/Graphics/Rect":42,"../../Nodes/Sprites/AnimatedSprite":43,"../../Nodes/Sprites/Sprite":44,"../../Nodes/UIElements/Button":48,"../../Nodes/UIElements/Label":49,"../../Nodes/UIElements/Slider":50,"../../Nodes/UIElements/TextInput":51,"../../Nodes/UIElements/UIElementTypes":52,"../../ResourceManager/ResourceManager":79}],84:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var CanvasNodeFactory_1 = require("./CanvasNodeFactory");
var TilemapFactory_1 = require("./TilemapFactory");
/**
 * The manager of all factories used for adding @reference[GameNode]s to the @reference[Scene].
 */
var FactoryManager = /** @class */ (function () {
    function FactoryManager(scene, tilemaps) {
        // Constructors are called here to allow assignment of their functions to functions in this class
        this.canvasNodeFactory = new CanvasNodeFactory_1["default"]();
        this.tilemapFactory = new TilemapFactory_1["default"]();
        this.canvasNodeFactory.init(scene);
        this.tilemapFactory.init(scene, tilemaps);
    }
    // Expose all of the factories through the factory manager
    /**
     * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
     * @param type The type of UIElement to add
     * @param layerName The layer to add the UIElement to
     * @param options Any additional arguments to feed to the constructor
     * @returns A new UIElement
     */
    FactoryManager.prototype.uiElement = function (type, layerName, options) {
        return this.canvasNodeFactory.addUIElement(type, layerName, options);
    };
    /**
     * Adds a sprite to the current scene
     * @param key The key of the image the sprite will represent
     * @param layerName The layer on which to add the sprite
     * @returns A new Sprite
     */
    FactoryManager.prototype.sprite = function (key, layerName) {
        return this.canvasNodeFactory.addSprite(key, layerName);
    };
    /**
     * Adds an AnimatedSprite to the current scene
     * @param key The key of the image the sprite will represent
     * @param layerName The layer on which to add the sprite
     * @returns A new AnimatedSprite
     */
    FactoryManager.prototype.animatedSprite = function (key, layerName) {
        return this.canvasNodeFactory.addAnimatedSprite(key, layerName);
    };
    /**
     * Adds a new graphic element to the current Scene
     * @param type The type of graphic to add
     * @param layerName The layer on which to add the graphic
     * @param options Any additional arguments to send to the graphic constructor
     * @returns A new Graphic
     */
    FactoryManager.prototype.graphic = function (type, layerName, options) {
        return this.canvasNodeFactory.addGraphic(type, layerName, options);
    };
    /**
     * Adds a tilemap to the scene
     * @param key The key of the loaded tilemap to load
     * @param constr The constructor of the desired tilemap
     * @param args Additional arguments to send to the tilemap constructor
     * @returns An array of Layers, each of which contains a layer of the tilemap as its own Tilemap instance.
     */
    FactoryManager.prototype.tilemap = function (key, scale) {
        return this.tilemapFactory.add(key, scale);
    };
    return FactoryManager;
}());
exports["default"] = FactoryManager;
},{"./CanvasNodeFactory":83,"./TilemapFactory":85}],85:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../../ResourceManager/ResourceManager");
var OrthogonalTilemap_1 = require("../../Nodes/Tilemaps/OrthogonalTilemap");
var Tileset_1 = require("../../DataTypes/Tilesets/Tileset");
var Vec2_1 = require("../../DataTypes/Vec2");
var PositionGraph_1 = require("../../DataTypes/Graphs/PositionGraph");
var Navmesh_1 = require("../../Pathfinding/Navmesh");
// @ignorePage
/**
 * A factory that abstracts adding @reference[Tilemap]s to the @reference[Scene].
 * Access methods in this factory through Scene.add.[methodName]().
 */
var TilemapFactory = /** @class */ (function () {
    function TilemapFactory() {
        var _this = this;
        // TODO - This is specifically catered to Tiled tilemaps right now. In the future,
        // it would be good to have a "parseTilemap" function that would convert the tilemap
        // data into a standard format. This could allow for support from other programs
        // or the development of an internal level builder tool
        /**
         * Adds a tilemap to the scene
         * @param key The key of the loaded tilemap to load
         * @param constr The constructor of the desired tilemap
         * @param args Additional arguments to send to the tilemap constructor
         * @returns An array of Layers, each of which contains a layer of the tilemap as its own Tilemap instance.
         */
        this.add = function (key, scale) {
            if (scale === void 0) { scale = new Vec2_1["default"](1, 1); }
            // Get Tilemap Data
            var tilemapData = _this.resourceManager.getTilemap(key);
            // Set the constructor for this tilemap to either be orthographic or isometric
            var constr;
            if (tilemapData.orientation === "orthographic") {
                constr = OrthogonalTilemap_1["default"];
            }
            else {
                // No isometric tilemap support right now, so Orthographic tilemap
                constr = OrthogonalTilemap_1["default"];
            }
            // Initialize the return value array
            var sceneLayers = new Array();
            // Create all of the tilesets for this tilemap
            var tilesets = new Array();
            var collectionTiles = new Array();
            var _loop_1 = function (tileset) {
                if (tileset.image) {
                    // If this is a standard tileset and not a collection, create a tileset for it.
                    // TODO - We are ignoring collection tilesets for now. This is likely not a great idea in practice,
                    // as theoretically someone could want to use one for a standard tilemap. We are assuming for now
                    // that we only want to use them for object layers
                    tilesets.push(new Tileset_1["default"](tileset));
                }
                else {
                    tileset.tiles.forEach(function (tile) { return tile.id += tileset.firstgid; });
                    collectionTiles.push.apply(collectionTiles, tileset.tiles);
                }
            };
            for (var _i = 0, _a = tilemapData.tilesets; _i < _a.length; _i++) {
                var tileset = _a[_i];
                _loop_1(tileset);
            }
            // Loop over the layers of the tilemap and create tiledlayers or object layers
            for (var _b = 0, _c = tilemapData.layers; _b < _c.length; _b++) {
                var layer = _c[_b];
                var sceneLayer = void 0;
                var isParallaxLayer = false;
                var depth = 0;
                if (layer.properties) {
                    for (var _d = 0, _e = layer.properties; _d < _e.length; _d++) {
                        var prop = _e[_d];
                        if (prop.name === "Parallax") {
                            isParallaxLayer = prop.value;
                        }
                        else if (prop.name === "Depth") {
                            depth = prop.value;
                        }
                    }
                }
                if (isParallaxLayer) {
                    sceneLayer = _this.scene.addParallaxLayer(layer.name, new Vec2_1["default"](1, 1), depth);
                }
                else {
                    sceneLayer = _this.scene.addLayer(layer.name, depth);
                }
                if (layer.type === "tilelayer") {
                    // Create a new tilemap object for the layer
                    var tilemap = new constr(tilemapData, layer, tilesets, scale);
                    tilemap.id = _this.scene.generateId();
                    tilemap.setScene(_this.scene);
                    // Add tilemap to scene
                    _this.tilemaps.push(tilemap);
                    sceneLayer.addNode(tilemap);
                    // Register tilemap with physics if it's collidable
                    if (tilemap.isCollidable) {
                        tilemap.addPhysics();
                        if (layer.properties) {
                            for (var _f = 0, _g = layer.properties; _f < _g.length; _f++) {
                                var item = _g[_f];
                                if (item.name === "Group") {
                                    tilemap.setGroup(item.value);
                                }
                            }
                        }
                    }
                }
                else {
                    var isNavmeshPoints = false;
                    var navmeshName = void 0;
                    var edges = void 0;
                    if (layer.properties) {
                        for (var _h = 0, _j = layer.properties; _h < _j.length; _h++) {
                            var prop = _j[_h];
                            if (prop.name === "NavmeshPoints") {
                                isNavmeshPoints = true;
                            }
                            else if (prop.name === "name") {
                                navmeshName = prop.value;
                            }
                            else if (prop.name === "edges") {
                                edges = prop.value;
                            }
                        }
                    }
                    if (isNavmeshPoints) {
                        var g = new PositionGraph_1["default"]();
                        for (var _k = 0, _l = layer.objects; _k < _l.length; _k++) {
                            var obj = _l[_k];
                            g.addPositionedNode(new Vec2_1["default"](obj.x, obj.y));
                        }
                        for (var _m = 0, edges_1 = edges; _m < edges_1.length; _m++) {
                            var edge = edges_1[_m];
                            g.addEdge(edge.from, edge.to);
                        }
                        _this.scene.getNavigationManager().addNavigableEntity(navmeshName, new Navmesh_1["default"](g));
                        continue;
                    }
                    // Layer is an object layer, so add each object as a sprite to a new layer
                    for (var _o = 0, _p = layer.objects; _o < _p.length; _o++) {
                        var obj = _p[_o];
                        // Check if obj is collidable
                        var hasPhysics = false;
                        var isCollidable = false;
                        var isTrigger = false;
                        var onEnter = null;
                        var onExit = null;
                        var triggerGroup = null;
                        var group = "";
                        if (obj.properties) {
                            for (var _q = 0, _r = obj.properties; _q < _r.length; _q++) {
                                var prop = _r[_q];
                                if (prop.name === "HasPhysics") {
                                    hasPhysics = prop.value;
                                }
                                else if (prop.name === "Collidable") {
                                    isCollidable = prop.value;
                                }
                                else if (prop.name === "Group") {
                                    group = prop.value;
                                }
                                else if (prop.name === "IsTrigger") {
                                    isTrigger = prop.value;
                                }
                                else if (prop.name === "TriggerGroup") {
                                    triggerGroup = prop.value;
                                }
                                else if (prop.name === "TriggerOnEnter") {
                                    onEnter = prop.value;
                                }
                                else if (prop.name === "TriggerOnExit") {
                                    onExit = prop.value;
                                }
                            }
                        }
                        var sprite = void 0;
                        // Check if obj is a tile from a tileset
                        for (var _s = 0, tilesets_1 = tilesets; _s < tilesets_1.length; _s++) {
                            var tileset = tilesets_1[_s];
                            if (tileset.hasTile(obj.gid)) {
                                // The object is a tile from this set
                                var imageKey = tileset.getImageKey();
                                var offset = tileset.getImageOffsetForTile(obj.gid);
                                sprite = _this.scene.add.sprite(imageKey, layer.name);
                                var size = tileset.getTileSize().clone();
                                sprite.position.set((obj.x + size.x / 2) * scale.x, (obj.y - size.y / 2) * scale.y);
                                sprite.setImageOffset(offset);
                                sprite.size.copy(size);
                                sprite.scale.set(scale.x, scale.y);
                            }
                        }
                        // Not in a tileset, must correspond to a collection
                        if (!sprite) {
                            for (var _t = 0, collectionTiles_1 = collectionTiles; _t < collectionTiles_1.length; _t++) {
                                var tile = collectionTiles_1[_t];
                                if (obj.gid === tile.id) {
                                    var imageKey = tile.image;
                                    sprite = _this.scene.add.sprite(imageKey, layer.name);
                                    sprite.position.set((obj.x + tile.imagewidth / 2) * scale.x, (obj.y - tile.imageheight / 2) * scale.y);
                                    sprite.scale.set(scale.x, scale.y);
                                }
                            }
                        }
                        // Now we have sprite. Associate it with our physics object if there is one
                        if (hasPhysics) {
                            // Make the sprite a static physics object
                            sprite.addPhysics(sprite.boundary.clone(), Vec2_1["default"].ZERO, isCollidable, true);
                            sprite.setGroup(group);
                            if (isTrigger && triggerGroup !== null) {
                                sprite.setTrigger(triggerGroup, onEnter, onExit);
                            }
                        }
                    }
                }
                // Update the return value
                sceneLayers.push(sceneLayer);
            }
            return sceneLayers;
        };
    }
    TilemapFactory.prototype.init = function (scene, tilemaps) {
        this.scene = scene;
        this.tilemaps = tilemaps;
        this.resourceManager = ResourceManager_1["default"].getInstance();
    };
    return TilemapFactory;
}());
exports["default"] = TilemapFactory;
},{"../../DataTypes/Graphs/PositionGraph":6,"../../DataTypes/Tilesets/Tileset":19,"../../DataTypes/Vec2":20,"../../Nodes/Tilemaps/OrthogonalTilemap":46,"../../Pathfinding/Navmesh":55,"../../ResourceManager/ResourceManager":79}],86:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var MathUtils_1 = require("../Utils/MathUtils");
/**
 * A layer in the scene. Layers are used for sorting @reference[GameNode]s by depth.
 */
var Layer = /** @class */ (function () {
    /**
     * Creates a new layer. To do this in a game, use the addLayer() method in @refrence[Scene]
     * @param scene The scene to add the layer to
     * @param name The name of the layer
     */
    function Layer(scene, name) {
        this.scene = scene;
        this.name = name;
        this.paused = false;
        this.hidden = false;
        this.alpha = 1;
        this.items = new Array();
        this.ySort = false;
        this.depth = 0;
    }
    /**
     * Retreives the name of the layer
     * @returns The name of the layer
     */
    Layer.prototype.getName = function () {
        return this.name;
    };
    /**
     * Pauses/Unpauses the layer. Affects all elements in this layer
     * @param pauseValue True if the layer should be paused, false if not
     */
    Layer.prototype.setPaused = function (pauseValue) {
        this.paused = pauseValue;
    };
    /**
     * Returns whether or not the layer is paused
     */
    Layer.prototype.isPaused = function () {
        return this.paused;
    };
    /**
     * Sets the opacity of the layer
     * @param alpha The new opacity value in the range [0, 1]
     */
    Layer.prototype.setAlpha = function (alpha) {
        this.alpha = MathUtils_1["default"].clamp(alpha, 0, 1);
    };
    /**
     * Gets the opacity of the layer
     * @returns The opacity
     */
    Layer.prototype.getAlpha = function () {
        return this.alpha;
    };
    /**
     * Sets the layer's hidden value. If hidden, a layer will not be rendered, but will still update
     * @param hidden The hidden value of the layer
     */
    Layer.prototype.setHidden = function (hidden) {
        this.hidden = hidden;
    };
    /**
     * Returns the hideen value of the lyaer
     * @returns True if the scene is hidden, false otherwise
     */
    Layer.prototype.isHidden = function () {
        return this.hidden;
    };
    /** Pauses this scene and hides it */
    Layer.prototype.disable = function () {
        this.paused = true;
        this.hidden = true;
    };
    /** Unpauses this layer and makes it visible */
    Layer.prototype.enable = function () {
        this.paused = false;
        this.hidden = false;
    };
    /**
     * Sets whether or not the scene will ySort automatically.
     * ySorting means that CanvasNodes on this layer will have their depth sorted depending on their y-value.
     * This means that if an object is "higher" in the scene, it will sort behind objects that are "lower".
     * This is useful for 3/4 view games, or similar situations, where you sometimes want to be in front of objects,
     * and other times want to be behind the same objects.
     * @param ySort True if ySorting should be active, false if not
     */
    Layer.prototype.setYSort = function (ySort) {
        this.ySort = ySort;
    };
    /**
     * Gets the ySort status of the scene
     * @returns True if ySorting is occurring, false otherwise
     */
    Layer.prototype.getYSort = function () {
        return this.ySort;
    };
    /**
     * Sets the depth of the layer compared to other layers. A larger number means the layer will be closer to the screen.
     * @param depth The depth of the layer.
     */
    Layer.prototype.setDepth = function (depth) {
        this.depth = depth;
    };
    /**
     * Retrieves the depth of the layer.
     * @returns The depth
     */
    Layer.prototype.getDepth = function () {
        return this.depth;
    };
    /**
     * Adds a node to this layer
     * @param node The node to add to this layer.
     */
    Layer.prototype.addNode = function (node) {
        this.items.push(node);
        node.setLayer(this);
    };
    /**
     * Removes a node from this layer
     * @param node The node to remove
     * @returns true if the node was removed, false otherwise
     */
    Layer.prototype.removeNode = function (node) {
        // Find and remove the node
        var index = this.items.indexOf(node);
        if (index !== -1) {
            this.items.splice(index, 1);
            node.setLayer(undefined);
        }
    };
    /**
     * Retreives all GameNodes from this layer
     * @returns an Array that contains all of the GameNodes in this layer.
     */
    Layer.prototype.getItems = function () {
        return this.items;
    };
    return Layer;
}());
exports["default"] = Layer;
},{"../Utils/MathUtils":97}],87:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Layer_1 = require("../Layer");
/**
 * An extension of a Layer that has a parallax value.
 */
var ParallaxLayer = /** @class */ (function (_super) {
    __extends(ParallaxLayer, _super);
    /**
     * Creates a new ParallaxLayer.
     * Use addParallaxLayer() in @reference[Scene] to add a layer of this type to your game.
     * @param scene The Scene to add this ParallaxLayer to
     * @param name The name of the ParallaxLayer
     * @param parallax The parallax level
     */
    function ParallaxLayer(scene, name, parallax) {
        var _this = _super.call(this, scene, name) || this;
        _this.parallax = parallax;
        return _this;
    }
    return ParallaxLayer;
}(Layer_1["default"]));
exports["default"] = ParallaxLayer;
},{"../Layer":86}],88:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../DataTypes/Vec2");
var ParallaxLayer_1 = require("./ParallaxLayer");
/**
 * A Layer strictly to be used for managing UIElements.
 * This is intended to be a Layer that always stays in the same place,
 * and thus renders things like a HUD or an inventory without taking into consideration the \reference[Viewport] scroll.
 */
var UILayer = /** @class */ (function (_super) {
    __extends(UILayer, _super);
    /**
     * Creates a new UILayer.
     * Use addUILayer() in @reference[Scene] to add a layer of this type to your game.
     * @param scene The Scene to add this UILayer to
     * @param name The name of the UILayer
     */
    function UILayer(scene, name) {
        return _super.call(this, scene, name, Vec2_1["default"].ZERO) || this;
    }
    return UILayer;
}(ParallaxLayer_1["default"]));
exports["default"] = UILayer;
},{"../../DataTypes/Vec2":20,"./ParallaxLayer":87}],89:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Layer_1 = require("./Layer");
var Vec2_1 = require("../DataTypes/Vec2");
var BasicPhysicsManager_1 = require("../Physics/BasicPhysicsManager");
var SceneGraphArray_1 = require("../SceneGraph/SceneGraphArray");
var FactoryManager_1 = require("./Factories/FactoryManager");
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
var Receiver_1 = require("../Events/Receiver");
var Emitter_1 = require("../Events/Emitter");
var NavigationManager_1 = require("../Pathfinding/NavigationManager");
var AIManager_1 = require("../AI/AIManager");
var Map_1 = require("../DataTypes/Map");
var ParallaxLayer_1 = require("./Layers/ParallaxLayer");
var UILayer_1 = require("./Layers/UILayer");
var CanvasNode_1 = require("../Nodes/CanvasNode");
var SceneOptions_1 = require("./SceneOptions");
var Debug_1 = require("../Debug/Debug");
var TimerManager_1 = require("../Timing/TimerManager");
var TweenManager_1 = require("../Rendering/Animations/TweenManager");
var ParticleSystemManager_1 = require("../Rendering/Animations/ParticleSystemManager");
/**
 * Scenes are the main container in the game engine.
 * Your main scene is the current level or menu of the game, and will contain all of the GameNodes needed.
 * Scenes provide an easy way to load assets, add assets to the game world, and unload assets,
 * and have lifecycle methods exposed for these functions.
 */
var Scene = /** @class */ (function () {
    /**
     * Creates a new Scene. To add a new Scene in your game, use changeToScene() in @reference[SceneManager]
     * @param viewport The viewport of the game
     * @param sceneManager The SceneManager that owns this Scene
     * @param renderingManager The RenderingManager that will handle this Scene's rendering
     * @param game The instance of the Game
     * @param options The options for Scene initialization
     */
    function Scene(viewport, sceneManager, renderingManager, options) {
        this.sceneOptions = SceneOptions_1["default"].parse(options === undefined ? {} : options);
        this.worldSize = new Vec2_1["default"](500, 500);
        this.viewport = viewport;
        this.viewport.setBounds(0, 0, 2560, 1280);
        this.running = false;
        this.sceneManager = sceneManager;
        this.receiver = new Receiver_1["default"]();
        this.emitter = new Emitter_1["default"]();
        this.tilemaps = new Array();
        this.sceneGraph = new SceneGraphArray_1["default"](this.viewport, this);
        this.layers = new Map_1["default"]();
        this.uiLayers = new Map_1["default"]();
        this.parallaxLayers = new Map_1["default"]();
        this.physicsManager = new BasicPhysicsManager_1["default"](this.sceneOptions.physics);
        this.navManager = new NavigationManager_1["default"]();
        this.aiManager = new AIManager_1["default"]();
        this.renderingManager = renderingManager;
        this.add = new FactoryManager_1["default"](this, this.tilemaps);
        this.load = ResourceManager_1["default"].getInstance();
        this.resourceManager = this.load;
        // Get the timer manager and clear any existing timers
        TimerManager_1["default"].getInstance().clearTimers();
    }
    /** A lifecycle method that gets called immediately after a new scene is created, before anything else. */
    Scene.prototype.initScene = function (init) { };
    /** A lifecycle method that gets called when a new scene is created. Load all files you wish to access in the scene here. */
    Scene.prototype.loadScene = function () { };
    /** A lifecycle method called strictly after loadScene(). Create any game objects you wish to use in the scene here. */
    Scene.prototype.startScene = function () { };
    /**
     * A lifecycle method called every frame of the game. This is where you can dynamically do things like add in new enemies
     * @param delta The time this frame represents
     */
    Scene.prototype.updateScene = function (deltaT) { };
    /** A lifecycle method that gets called on scene destruction. Specify which files you no longer need for garbage collection. */
    Scene.prototype.unloadScene = function () { };
    Scene.prototype.update = function (deltaT) {
        this.updateScene(deltaT);
        // Do time updates
        TimerManager_1["default"].getInstance().update(deltaT);
        // Do all AI updates
        this.aiManager.update(deltaT);
        // Update all physics objects
        this.physicsManager.update(deltaT);
        // Update all canvas objects
        this.sceneGraph.update(deltaT);
        // Update all tilemaps
        this.tilemaps.forEach(function (tilemap) {
            if (!tilemap.getLayer().isPaused()) {
                tilemap.update(deltaT);
            }
        });
        // Update all tweens
        TweenManager_1["default"].getInstance().update(deltaT);
        // Update all particle systems
        ParticleSystemManager_1["default"].getInstance().update(deltaT);
        // Update viewport
        this.viewport.update(deltaT);
    };
    /**
     * Collects renderable sets and coordinates with the RenderingManager to draw the Scene
     */
    Scene.prototype.render = function () {
        var _this = this;
        // Get the visible set of nodes
        var visibleSet = this.sceneGraph.getVisibleSet();
        // Add parallax layer items to the visible set (we're rendering them all for now)
        this.parallaxLayers.forEach(function (key) {
            var pLayer = _this.parallaxLayers.get(key);
            for (var _i = 0, _a = pLayer.getItems(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node instanceof CanvasNode_1["default"]) {
                    visibleSet.push(node);
                }
            }
        });
        // Send the visible set, tilemaps, and uiLayers to the renderer
        this.renderingManager.render(visibleSet, this.tilemaps, this.uiLayers);
        var nodes = this.sceneGraph.getAllNodes();
        this.tilemaps.forEach(function (tilemap) { return tilemap.visible ? nodes.push(tilemap) : 0; });
        Debug_1["default"].setNodes(nodes);
    };
    /**
     * Sets the scene as running or not
     * @param running True if the Scene should be running, false if not
     */
    Scene.prototype.setRunning = function (running) {
        this.running = running;
    };
    /**
     * Returns whether or not the Scene is running
     * @returns True if the scene is running, false otherwise
     */
    Scene.prototype.isRunning = function () {
        return this.running;
    };
    /**
     * Removes a node from this Scene
     * @param node The node to remove
     */
    Scene.prototype.remove = function (node) {
        // Remove from the scene graph
        if (node instanceof CanvasNode_1["default"]) {
            this.sceneGraph.removeNode(node);
        }
    };
    /** Destroys this scene and all nodes in it */
    Scene.prototype.destroy = function () {
        for (var _i = 0, _a = this.sceneGraph.getAllNodes(); _i < _a.length; _i++) {
            var node = _a[_i];
            node.destroy();
        }
        for (var _b = 0, _c = this.tilemaps; _b < _c.length; _b++) {
            var tilemap = _c[_b];
            tilemap.destroy();
        }
        this.receiver.destroy();
        delete this.sceneGraph;
        delete this.physicsManager;
        delete this.navManager;
        delete this.aiManager;
        delete this.receiver;
    };
    /**
     * Adds a new layer to the scene and returns it
     * @param name The name of the new layer
     * @param depth The depth of the layer
     * @returns The newly created Layer
     */
    Scene.prototype.addLayer = function (name, depth) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw "Layer with name ".concat(name, " already exists");
        }
        var layer = new Layer_1["default"](this, name);
        this.layers.add(name, layer);
        if (depth) {
            layer.setDepth(depth);
        }
        return layer;
    };
    /**
     * Adds a new parallax layer to this scene and returns it
     * @param name The name of the parallax layer
     * @param parallax The parallax level
     * @param depth The depth of the layer
     * @returns The newly created ParallaxLayer
     */
    Scene.prototype.addParallaxLayer = function (name, parallax, depth) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw "Layer with name ".concat(name, " already exists");
        }
        var layer = new ParallaxLayer_1["default"](this, name, parallax);
        this.parallaxLayers.add(name, layer);
        if (depth) {
            layer.setDepth(depth);
        }
        return layer;
    };
    /**
     * Adds a new UILayer to the scene
     * @param name The name of the new UIlayer
     * @returns The newly created UILayer
     */
    Scene.prototype.addUILayer = function (name) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw "Layer with name ".concat(name, " already exists");
        }
        var layer = new UILayer_1["default"](this, name);
        this.uiLayers.add(name, layer);
        return layer;
    };
    /**
     * Gets a layer from the scene by name if it exists.
     * This can be a Layer or any of its subclasses
     * @param name The name of the layer
     * @returns The Layer found with that name
     */
    Scene.prototype.getLayer = function (name) {
        if (this.layers.has(name)) {
            return this.layers.get(name);
        }
        else if (this.parallaxLayers.has(name)) {
            return this.parallaxLayers.get(name);
        }
        else if (this.uiLayers.has(name)) {
            return this.uiLayers.get(name);
        }
        else {
            throw "Requested layer ".concat(name, " does not exist.");
        }
    };
    /**
     * Returns true if this layer is a ParallaxLayer
     * @param name The name of the layer
     * @returns True if this layer is a ParallaxLayer
     */
    Scene.prototype.isParallaxLayer = function (name) {
        return this.parallaxLayers.has(name);
    };
    /**
     * Returns true if this layer is a UILayer
     * @param name The name of the layer
     * @returns True if this layer is ParallaxLayer
     */
    Scene.prototype.isUILayer = function (name) {
        return this.uiLayers.has(name);
    };
    /**
     * Returns the translation of this node with respect to camera space (due to the viewport moving).
     * This value is affected by the parallax level of the @reference[Layer] the node is on.
     * @param node The node to check the viewport with respect to
     * @returns A Vec2 containing the translation of viewport with respect to this node.
     */
    Scene.prototype.getViewTranslation = function (node) {
        var layer = node.getLayer();
        if (layer instanceof ParallaxLayer_1["default"] || layer instanceof UILayer_1["default"]) {
            return this.viewport.getOrigin().mult(layer.parallax);
        }
        else {
            return this.viewport.getOrigin();
        }
    };
    /**
     * Returns the scale level of the view
     * @returns The zoom level of the viewport
    */
    Scene.prototype.getViewScale = function () {
        return this.viewport.getZoomLevel();
    };
    /**
     * Returns the Viewport associated with this scene
     * @returns The current Viewport
     */
    Scene.prototype.getViewport = function () {
        return this.viewport;
    };
    /**
     * Gets the world size of this Scene
     * @returns The world size in a Vec2
     */
    Scene.prototype.getWorldSize = function () {
        return this.worldSize;
    };
    /**
     * Gets the SceneGraph associated with this Scene
     * @returns The SceneGraph
     */
    Scene.prototype.getSceneGraph = function () {
        return this.sceneGraph;
    };
    /**
     * Gets the PhysicsManager associated with this Scene
     * @returns The PhysicsManager
     */
    Scene.prototype.getPhysicsManager = function () {
        return this.physicsManager;
    };
    /**
     * Gets the NavigationManager associated with this Scene
     * @returns The NavigationManager
     */
    Scene.prototype.getNavigationManager = function () {
        return this.navManager;
    };
    /**
     * Gets the AIManager associated with this Scene
     * @returns The AIManager
     */
    Scene.prototype.getAIManager = function () {
        return this.aiManager;
    };
    /**
     * Generates an ID for a GameNode
     * @returns The new ID
     */
    Scene.prototype.generateId = function () {
        return this.sceneManager.generateId();
    };
    /**
     * Retrieves a Tilemap in this Scene
     * @param name The name of the Tilemap
     * @returns The Tilemap, if one this name exists, otherwise null
     */
    Scene.prototype.getTilemap = function (name) {
        for (var _i = 0, _a = this.tilemaps; _i < _a.length; _i++) {
            var tilemap = _a[_i];
            if (tilemap.name === name) {
                return tilemap;
            }
        }
        return null;
    };
    return Scene;
}());
exports["default"] = Scene;
},{"../AI/AIManager":1,"../DataTypes/Map":8,"../DataTypes/Vec2":20,"../Debug/Debug":21,"../Events/Emitter":23,"../Events/Receiver":27,"../Nodes/CanvasNode":35,"../Pathfinding/NavigationManager":53,"../Physics/BasicPhysicsManager":56,"../Rendering/Animations/ParticleSystemManager":64,"../Rendering/Animations/TweenManager":66,"../ResourceManager/ResourceManager":79,"../SceneGraph/SceneGraphArray":81,"../Timing/TimerManager":93,"./Factories/FactoryManager":84,"./Layer":86,"./Layers/ParallaxLayer":87,"./Layers/UILayer":88,"./SceneOptions":91}],90:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
/**
 * The SceneManager acts as an interface to create Scenes, and handles the lifecycle methods of Scenes.
 * It gives Scenes access to information they need from the @reference[Game] class while keeping a layer of separation.
 */
var SceneManager = /** @class */ (function () {
    /**
     * Creates a new SceneManager
     * @param viewport The Viewport of the game
     * @param game The Game instance
     * @param renderingManager The RenderingManager of the game
     */
    function SceneManager(viewport, renderingManager) {
        this.resourceManager = ResourceManager_1["default"].getInstance();
        this.viewport = viewport;
        this.renderingManager = renderingManager;
        this.idCounter = 0;
        this.pendingScene = null;
    }
    /**
     * Add a scene as the main scene.
     * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
     * @param constr The constructor of the scene to add
     * @param init An object to pass to the init function of the new scene
     */
    SceneManager.prototype.changeToScene = function (constr, init, options) {
        console.log("Creating the new scene - change is pending until next update");
        this.pendingScene = new constr(this.viewport, this, this.renderingManager, options);
        this.pendingSceneInit = init;
    };
    SceneManager.prototype.doSceneChange = function () {
        var _this = this;
        console.log("Performing scene change");
        this.viewport.setCenter(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y);
        if (this.currentScene) {
            console.log("Unloading old scene");
            this.currentScene.unloadScene();
            console.log("Destroying old scene");
            this.currentScene.destroy();
        }
        console.log("Unloading old resources...");
        this.resourceManager.unloadAllResources();
        // Make the pending scene the current one
        this.currentScene = this.pendingScene;
        // Make the pending scene null
        this.pendingScene = null;
        // Init the scene
        this.currentScene.initScene(this.pendingSceneInit);
        // Enqueue all scene asset loads
        this.currentScene.loadScene();
        // Load all assets
        console.log("Starting Scene Load");
        this.resourceManager.loadResourcesFromQueue(function () {
            console.log("Starting Scene");
            _this.currentScene.startScene();
            _this.currentScene.setRunning(true);
        });
        this.renderingManager.setScene(this.currentScene);
    };
    /**
     * Generates a unique ID
     * @returns A new ID
     */
    SceneManager.prototype.generateId = function () {
        return this.idCounter++;
    };
    /**
     * Renders the current Scene
     */
    SceneManager.prototype.render = function () {
        if (this.currentScene) {
            this.currentScene.render();
        }
    };
    /**
     * Updates the current Scene
     * @param deltaT The timestep of the Scene
     */
    SceneManager.prototype.update = function (deltaT) {
        if (this.pendingScene !== null) {
            this.doSceneChange();
        }
        if (this.currentScene && this.currentScene.isRunning()) {
            this.currentScene.update(deltaT);
        }
    };
    return SceneManager;
}());
exports["default"] = SceneManager;
},{"../ResourceManager/ResourceManager":79}],91:[function(require,module,exports){
"use strict";
exports.__esModule = true;
// @ignorePage
/**
 * The options to give a @reference[Scene] for initialization
 */
var SceneOptions = /** @class */ (function () {
    function SceneOptions() {
    }
    SceneOptions.parse = function (options) {
        var sOpt = new SceneOptions();
        if (options.physics === undefined) {
            sOpt.physics = { groups: undefined, collisions: undefined };
        }
        else {
            sOpt.physics = options.physics;
        }
        return sOpt;
    };
    return SceneOptions;
}());
exports["default"] = SceneOptions;
},{}],92:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.MAX_AUDIO_CHANNELS = exports.AudioChannelType = void 0;
var Map_1 = require("../DataTypes/Map");
var Receiver_1 = require("../Events/Receiver");
var ResourceManager_1 = require("../ResourceManager/ResourceManager");
var GameEventType_1 = require("../Events/GameEventType");
/**
 * Manages any sounds or music needed for the game.
 * Through the EventQueue, exposes interface to play sounds so GameNodes can activate sounds without
 * needing direct references to the audio system
 */
var AudioManager = /** @class */ (function () {
    function AudioManager() {
        this.initAudio();
        this.receiver = new Receiver_1["default"]();
        this.receiver.subscribe([
            GameEventType_1.GameEventType.PLAY_SOUND,
            GameEventType_1.GameEventType.STOP_SOUND,
            GameEventType_1.GameEventType.PLAY_MUSIC,
            GameEventType_1.GameEventType.PLAY_SFX,
            GameEventType_1.GameEventType.MUTE_CHANNEL,
            GameEventType_1.GameEventType.UNMUTE_CHANNEL
        ]);
        this.currentSounds = new Map_1["default"]();
        this.gainNodes = new Array(exports.MAX_AUDIO_CHANNELS);
        this.initGainNodes();
    }
    /**
     * Get the instance of the AudioManager class or create a new one if none exists
     * @returns The AudioManager
     */
    AudioManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    };
    /**
     * Initializes the webAudio context
     */
    AudioManager.prototype.initAudio = function () {
        try {
            window.AudioContext = window.AudioContext; // || window.webkitAudioContext; 
            this.audioCtx = new AudioContext();
            console.log('Web Audio API successfully loaded');
        }
        catch (e) {
            console.warn('Web Audio API is not supported in this browser');
        }
    };
    AudioManager.prototype.initGainNodes = function () {
        for (var i = 0; i < exports.MAX_AUDIO_CHANNELS; i++) {
            this.gainNodes[i] = this.audioCtx.createGain();
        }
    };
    /**
     * Returns the current audio context
     * @returns The AudioContext
     */
    AudioManager.prototype.getAudioContext = function () {
        return this.audioCtx;
    };
    /*
        According to the MDN, create a new sound for every call:

        An AudioBufferSourceNode can only be played once; after each call to start(), you have to create a new node
        if you want to play the same sound again. Fortunately, these nodes are very inexpensive to create, and the
        actual AudioBuffers can be reused for multiple plays of the sound. Indeed, you can use these nodes in a
        "fire and forget" manner: create the node, call start() to begin playing the sound, and don't even bother to
        hold a reference to it. It will automatically be garbage-collected at an appropriate time, which won't be
        until sometime after the sound has finished playing.
    */
    /**
     * Creates a new sound from the key of a loaded audio file
     * @param key The key of the loaded audio file to create a new sound for
     * @returns The newly created AudioBuffer
     */
    AudioManager.prototype.createSound = function (key, holdReference, channel, options) {
        // Get audio buffer
        var buffer = ResourceManager_1["default"].getInstance().getAudio(key);
        // Create a sound source
        var source = this.audioCtx.createBufferSource();
        // Tell the source which sound to play
        source.buffer = buffer;
        // Add any additional nodes
        var nodes = [source];
        // Do any additional nodes here?
        // Of course, there aren't any supported yet...
        // Add the gain node for this channel
        nodes.push(this.gainNodes[channel]);
        // Connect any nodes along the path
        for (var i = 1; i < nodes.length; i++) {
            nodes[i - 1].connect(nodes[i]);
        }
        // Connect the source to the context's destination
        nodes[nodes.length - 1].connect(this.audioCtx.destination);
        return source;
    };
    /**
     * Play the sound specified by the key
     * @param key The key of the sound to play
     * @param loop A boolean for whether or not to loop the sound
     * @param holdReference A boolean for whether or not we want to hold on to a reference of the audio node. This is good for playing music on a loop that will eventually need to be stopped.
     */
    AudioManager.prototype.playSound = function (key, loop, holdReference, channel, options) {
        var sound = this.createSound(key, holdReference, channel, options);
        if (loop) {
            sound.loop = true;
        }
        // Add a reference of the new sound to a map. This will allow us to stop a looping or long sound at a later time
        if (holdReference) {
            this.currentSounds.add(key, sound);
        }
        sound.start();
    };
    /**
     * Stop the sound specified by the key
     */
    AudioManager.prototype.stopSound = function (key) {
        var sound = this.currentSounds.get(key);
        if (sound) {
            sound.stop();
            this.currentSounds["delete"](key);
        }
    };
    AudioManager.prototype.muteChannel = function (channel) {
        this.gainNodes[channel].gain.setValueAtTime(0, this.audioCtx.currentTime);
    };
    AudioManager.prototype.unmuteChannel = function (channel) {
        this.gainNodes[channel].gain.setValueAtTime(1, this.audioCtx.currentTime);
    };
    /**
     * Sets the volume of a channel using the GainNode for that channel. For more
     * information on GainNodes, see https://developer.mozilla.org/en-US/docs/Web/API/GainNode
     * @param channel The audio channel to set the volume for
     * @param volume The volume of the channel. 0 is muted. Values below zero will be set to zero.
     */
    AudioManager.setVolume = function (channel, volume) {
        if (volume < 0) {
            volume = 0;
        }
        var am = AudioManager.getInstance();
        am.gainNodes[channel].gain.setValueAtTime(volume, am.audioCtx.currentTime);
    };
    /**
     * Returns the GainNode for this channel.
     * Learn more about GainNodes here https://developer.mozilla.org/en-US/docs/Web/API/GainNode
     * DON'T USE THIS UNLESS YOU KNOW WHAT YOU'RE DOING
     * @param channel The channel
     * @returns The GainNode for the specified channel
     */
    AudioManager.prototype.getChannelGainNode = function (channel) {
        return this.gainNodes[channel];
    };
    AudioManager.prototype.update = function (deltaT) {
        // Play each audio clip requested
        // TODO - Add logic to merge sounds if there are multiple of the same key
        while (this.receiver.hasNextEvent()) {
            var event_1 = this.receiver.getNextEvent();
            if (event_1.type === GameEventType_1.GameEventType.PLAY_SOUND || event_1.type === GameEventType_1.GameEventType.PLAY_MUSIC || event_1.type === GameEventType_1.GameEventType.PLAY_SFX) {
                var soundKey = event_1.data.get("key");
                var loop = event_1.data.get("loop");
                var holdReference = event_1.data.get("holdReference");
                var channel = AudioChannelType.DEFAULT;
                if (event_1.type === GameEventType_1.GameEventType.PLAY_MUSIC) {
                    channel = AudioChannelType.MUSIC;
                }
                else if (GameEventType_1.GameEventType.PLAY_SFX) {
                    channel = AudioChannelType.SFX;
                }
                else if (event_1.data.has("channel")) {
                    channel = event_1.data.get("channel");
                }
                this.playSound(soundKey, loop, holdReference, channel, event_1.data);
            }
            if (event_1.type === GameEventType_1.GameEventType.STOP_SOUND) {
                var soundKey = event_1.data.get("key");
                this.stopSound(soundKey);
            }
            if (event_1.type === GameEventType_1.GameEventType.MUTE_CHANNEL) {
                this.muteChannel(event_1.data.get("channel"));
            }
            if (event_1.type === GameEventType_1.GameEventType.UNMUTE_CHANNEL) {
                this.unmuteChannel(event_1.data.get("channel"));
            }
        }
    };
    return AudioManager;
}());
exports["default"] = AudioManager;
var AudioChannelType;
(function (AudioChannelType) {
    AudioChannelType[AudioChannelType["DEFAULT"] = 0] = "DEFAULT";
    AudioChannelType[AudioChannelType["SFX"] = 1] = "SFX";
    AudioChannelType[AudioChannelType["MUSIC"] = 2] = "MUSIC";
    AudioChannelType[AudioChannelType["CUSTOM_1"] = 3] = "CUSTOM_1";
    AudioChannelType[AudioChannelType["CUSTOM_2"] = 4] = "CUSTOM_2";
    AudioChannelType[AudioChannelType["CUSTOM_3"] = 5] = "CUSTOM_3";
    AudioChannelType[AudioChannelType["CUSTOM_4"] = 6] = "CUSTOM_4";
    AudioChannelType[AudioChannelType["CUSTOM_5"] = 7] = "CUSTOM_5";
    AudioChannelType[AudioChannelType["CUSTOM_6"] = 8] = "CUSTOM_6";
    AudioChannelType[AudioChannelType["CUSTOM_7"] = 9] = "CUSTOM_7";
    AudioChannelType[AudioChannelType["CUSTOM_8"] = 10] = "CUSTOM_8";
    AudioChannelType[AudioChannelType["CUSTOM_9"] = 11] = "CUSTOM_9";
})(AudioChannelType = exports.AudioChannelType || (exports.AudioChannelType = {}));
exports.MAX_AUDIO_CHANNELS = 12;
},{"../DataTypes/Map":8,"../Events/GameEventType":26,"../Events/Receiver":27,"../ResourceManager/ResourceManager":79}],93:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TimerManager = /** @class */ (function () {
    function TimerManager() {
        this.timers = new Array();
    }
    TimerManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new TimerManager();
        }
        return this.instance;
    };
    TimerManager.prototype.addTimer = function (timer) {
        this.timers.push(timer);
    };
    TimerManager.prototype.clearTimers = function () {
        this.timers = new Array();
    };
    TimerManager.prototype.update = function (deltaT) {
        this.timers.forEach(function (timer) { return timer.update(deltaT); });
    };
    return TimerManager;
}());
exports["default"] = TimerManager;
},{}],94:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var MathUtils_1 = require("./MathUtils");
// TODO: This should be moved to the datatypes folder
/**
 * A Color util class that keeps track of colors like a vector, but can be converted into a string format
 */
var Color = /** @class */ (function () {
    /**
     * Creates a new color
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpha
     */
    function Color(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Object.defineProperty(Color, "TRANSPARENT", {
        /**
         * Transparent color
         * @returns rgba(0, 0, 0, 0)
         */
        get: function () {
            return new Color(0, 0, 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "RED", {
        /**
         * Red color
         * @returns rgb(255, 0, 0)
         */
        get: function () {
            return new Color(255, 0, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "GREEN", {
        /**
         * Green color
         * @returns rgb(0, 255, 0)
         */
        get: function () {
            return new Color(0, 255, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "BLUE", {
        /**
         * Blue color
         * @returns rgb(0, 0, 255)
         */
        get: function () {
            return new Color(0, 0, 255, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "YELLOW", {
        /**
         * Yellow color
         * @returns rgb(255, 255, 0)
         */
        get: function () {
            return new Color(255, 255, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "MAGENTA", {
        /**
         * Magenta color
         * @returns rgb(255, 0, 255)
         */
        get: function () {
            return new Color(255, 0, 255, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "CYAN", {
        /**
         * Cyan color
         * @returns rgb(0, 255, 255)
         */
        get: function () {
            return new Color(0, 255, 255, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "WHITE", {
        /**
         * White color
         * @returns rgb(255, 255, 255)
         */
        get: function () {
            return new Color(255, 255, 255, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "BLACK", {
        /**
         * Black color
         * @returns rgb(0, 0, 0)
         */
        get: function () {
            return new Color(0, 0, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color, "ORANGE", {
        /**
         * Orange color
         * @returns rgb(255, 100, 0)
         */
        get: function () {
            return new Color(255, 100, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the color to the values provided
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpha
     */
    Color.prototype.set = function (r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };
    /**
     * Returns a new color slightly lighter than the current color
     * @returns A new lighter Color
     */
    Color.prototype.lighten = function () {
        return new Color(MathUtils_1["default"].clamp(this.r + 40, 0, 255), MathUtils_1["default"].clamp(this.g + 40, 0, 255), MathUtils_1["default"].clamp(this.b + 40, 0, 255), MathUtils_1["default"].clamp(this.a + 10, 0, 255));
    };
    /**
     * Returns a new color slightly darker than the current color
     * @returns A new darker Color
     */
    Color.prototype.darken = function () {
        return new Color(MathUtils_1["default"].clamp(this.r - 40, 0, 255), MathUtils_1["default"].clamp(this.g - 40, 0, 255), MathUtils_1["default"].clamp(this.b - 40, 0, 255), MathUtils_1["default"].clamp(this.a + 10, 0, 255));
    };
    /**
     * Returns this color as an array
     * @returns [r, g, b, a]
     */
    Color.prototype.toArray = function () {
        return [this.r, this.g, this.b, this.a];
    };
    /**
     * Returns the color as a string of the form #RRGGBB
     * @returns #RRGGBB
     */
    Color.prototype.toString = function () {
        return "#" + MathUtils_1["default"].toHex(this.r, 2) + MathUtils_1["default"].toHex(this.g, 2) + MathUtils_1["default"].toHex(this.b, 2);
    };
    /**
     * Returns the color as a string of the form rgb(r, g, b)
     * @returns rgb(r, g, b)
     */
    Color.prototype.toStringRGB = function () {
        return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
    };
    /**
     * Returns the color as a string of the form rgba(r, g, b, a)
     * @returns rgba(r, g, b, a)
     */
    Color.prototype.toStringRGBA = function () {
        if (this.a === 0) {
            return this.toStringRGB();
        }
        return "rgba(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() + ")";
    };
    /**
     * Turns this color into a float32Array and changes color range to [0.0, 1.0]
     * @returns a Float32Array containing the color
     */
    Color.prototype.toWebGL = function () {
        return new Float32Array([
            this.r / 255,
            this.g / 255,
            this.b / 255,
            this.a
        ]);
    };
    Color.fromStringHex = function (str) {
        var i = 0;
        if (str.charAt(0) == "#")
            i += 1;
        var r = MathUtils_1["default"].fromHex(str.substring(i, i + 2));
        var g = MathUtils_1["default"].fromHex(str.substring(i + 2, i + 4));
        var b = MathUtils_1["default"].fromHex(str.substring(i + 4, i + 6));
        return new Color(r, g, b);
    };
    return Color;
}());
exports["default"] = Color;
},{"./MathUtils":97}],95:[function(require,module,exports){
"use strict";
// @ignorePage
exports.__esModule = true;
exports.EaseFunctionType = void 0;
var EaseFunctions = /** @class */ (function () {
    function EaseFunctions() {
    }
    EaseFunctions.easeInOutSine = function (x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    };
    EaseFunctions.easeOutInSine = function (x) {
        return x < 0.5 ? -Math.cos(Math.PI * (x + 0.5)) / 2 : -Math.cos(Math.PI * (x - 0.5)) / 2 + 1;
    };
    EaseFunctions.easeOutSine = function (x) {
        return Math.sin((x * Math.PI) / 2);
    };
    EaseFunctions.easeInSine = function (x) {
        return 1 - Math.cos((x * Math.PI) / 2);
    };
    EaseFunctions.easeInOutQuint = function (x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    };
    EaseFunctions.easeInOutQuad = function (x) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    };
    EaseFunctions.easeOutInQuad = function (x) {
        return x < 0.5 ? this.easeOutIn_OutPow(x, 2) : this.easeOutIn_InPow(x, 2);
    };
    EaseFunctions.easeOutIn_OutPow = function (x, pow) {
        return 0.5 - Math.pow(-2 * x + 1, pow) / 2;
    };
    EaseFunctions.easeOutIn_InPow = function (x, pow) {
        return 0.5 + Math.pow(2 * x - 1, pow) / 2;
    };
    return EaseFunctions;
}());
exports["default"] = EaseFunctions;
var EaseFunctionType;
(function (EaseFunctionType) {
    // SINE
    EaseFunctionType["IN_OUT_SINE"] = "easeInOutSine";
    EaseFunctionType["OUT_IN_SINE"] = "easeOutInSine";
    EaseFunctionType["IN_SINE"] = "easeInSine";
    EaseFunctionType["OUT_SINE"] = "easeOutSine";
    // QUAD
    EaseFunctionType["IN_OUT_QUAD"] = "easeInOutQuad";
    EaseFunctionType["OUT_IN_QUAD"] = "easeOutInQuad";
    // QUINT
    EaseFunctionType["IN_OUT_QUINT"] = "easeInOutQuint";
})(EaseFunctionType = exports.EaseFunctionType || (exports.EaseFunctionType = {}));
},{}],96:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/** A class to provides some utility functions for graphs */
var GraphUtils = /** @class */ (function () {
    function GraphUtils() {
    }
    /**
     * An implementation of Djikstra's shortest path algorithm based on the one described in The Algorithm Design Manual.
     * @param g The graph
     * @param start The number to start the shortest path from
     * @returns An array containing the parent of each node of the Graph in the shortest path.
     */
    GraphUtils.djikstra = function (g, start) {
        var i; // Counter
        var p; // Pointer to edgenode
        var inTree = new Array(g.numVertices);
        var distance = new Array(g.numVertices);
        var parent = new Array(g.numVertices);
        var v; // Current vertex to process
        var w; // Candidate for next vertex
        var weight; // Edge weight
        var dist; // Best current distance from start
        for (i = 0; i < g.numVertices; i++) {
            inTree[i] = false;
            distance[i] = Infinity;
            parent[i] = -1;
        }
        distance[start] = 0;
        v = start;
        while (!inTree[v]) {
            inTree[v] = true;
            p = g.edges[v];
            while (p !== null) {
                w = p.y;
                weight = p.weight;
                if (distance[w] > distance[v] + weight) {
                    distance[w] = distance[v] + weight;
                    parent[w] = v;
                }
                p = p.next;
            }
            v = 0;
            dist = Infinity;
            for (i = 0; i <= g.numVertices; i++) {
                if (!inTree[i] && dist > distance[i]) {
                    dist = distance;
                    v = i;
                }
            }
        }
        return parent;
    };
    return GraphUtils;
}());
exports["default"] = GraphUtils;
},{}],97:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/** A class containing some utility functions for math operations */
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    /**
     * Returns the sign of the value provided
     * @param x The value to extract the sign from
     * @returns -1 if the number is less than 0, 1 otherwise
     */
    MathUtils.sign = function (x) {
        return x < 0 ? -1 : 1;
    };
    /**
     * Returns whether or not x is between a and b
     * @param a The min bound
     * @param b The max bound
     * @param x The value to check
     * @param exclusive Whether or not a and b are exclusive bounds
     * @returns True if x is between a and b, false otherwise
     */
    MathUtils.between = function (a, b, x, exclusive) {
        if (exclusive) {
            return (a < x) && (x < b);
        }
        else {
            return (a <= x) && (x <= b);
        }
    };
    /**
     * Clamps the value x to the range [min, max], rounding up or down if needed
     * @param x The value to be clamped
     * @param min The min of the range
     * @param max The max of the range
     * @returns x, if it is between min and max, or min/max if it exceeds their bounds
     */
    MathUtils.clamp = function (x, min, max) {
        if (x < min)
            return min;
        if (x > max)
            return max;
        return x;
    };
    /**
     * Clamps the value x to the range between 0 and 1
     * @param x The value to be clamped
     * @returns x, if it is between 0 and 1, or 0/1 if it exceeds their bounds
     */
    MathUtils.clamp01 = function (x) {
        return MathUtils.clamp(x, 0, 1);
    };
    /**
     * Clamps the lower end of the value of x to the range to min
     * @param x The value to be clamped
     * @param min The minimum allowed value of x
     * @returns x, if it is greater than min, otherwise min
     */
    MathUtils.clampLow = function (x, min) {
        return x < min ? min : x;
    };
    /**
     * Clamps the lower end of the value of x to zero
     * @param x The value to be clamped
     * @returns x, if it is greater than 0, otherwise 0
     */
    MathUtils.clampLow0 = function (x) {
        return MathUtils.clampLow(x, 0);
    };
    MathUtils.clampMagnitude = function (v, m) {
        if (v.magSq() > m * m) {
            return v.scaleTo(m);
        }
        else {
            return v;
        }
    };
    MathUtils.changeRange = function (x, min, max, newMin, newMax) {
        return this.lerp(newMin, newMax, this.invLerp(min, max, x));
    };
    /**
     * Linear Interpolation
     * @param a The first value for the interpolation bound
     * @param b The second value for the interpolation bound
     * @param t The time we are interpolating to
     * @returns The value between a and b at time t
     */
    MathUtils.lerp = function (a, b, t) {
        return a + t * (b - a);
    };
    /**
     * Inverse Linear Interpolation. Finds the time at which a value between a and b would occur
     * @param a The first value for the interpolation bound
     * @param b The second value for the interpolation bound
     * @param value The current value
     * @returns The time at which the current value occurs between a and b
     */
    MathUtils.invLerp = function (a, b, value) {
        return (value - a) / (b - a);
    };
    /**
     * Cuts off decimal points of a number after a specified place
     * @param num The number to floor
     * @param place The last decimal place of the new number
     * @returns The floored number
     */
    MathUtils.floorToPlace = function (num, place) {
        if (place === 0) {
            return Math.floor(num);
        }
        var factor = 10;
        while (place > 1) {
            factor != 10;
            place--;
        }
        return Math.floor(num * factor) / factor;
    };
    /**
     * Returns a number from a hex string
     * @param str the string containing the hex number
     * @returns the number in decimal represented by the hex string
     */
    MathUtils.fromHex = function (str) {
        return parseInt(str, 16);
    };
    /**
     * Returns the number as a hexadecimal
     * @param num The number to convert to hex
     * @param minLength The length of the returned hex string (adds zero padding if needed)
     * @returns The hex representation of the number as a string
     */
    MathUtils.toHex = function (num, minLength) {
        if (minLength === void 0) { minLength = null; }
        var factor = 1;
        while (factor * 16 < num) {
            factor *= 16;
        }
        var hexStr = "";
        while (factor >= 1) {
            var digit = Math.floor(num / factor);
            hexStr += MathUtils.toHexDigit(digit);
            num -= digit * factor;
            factor /= 16;
        }
        if (minLength !== null) {
            while (hexStr.length < minLength) {
                hexStr = "0" + hexStr;
            }
        }
        return hexStr;
    };
    /**
     * Converts a digit to hexadecimal. In this case, a digit is between 0 and 15 inclusive
     * @param num The digit to convert to hexadecimal
     * @returns The hex representation of the digit as a string
     */
    MathUtils.toHexDigit = function (num) {
        if (num < 10) {
            return "" + num;
        }
        else {
            return String.fromCharCode(65 + num - 10);
        }
    };
    return MathUtils;
}());
exports["default"] = MathUtils;
},{}],98:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var MathUtils_1 = require("./MathUtils");
var RenderingUtils = /** @class */ (function () {
    function RenderingUtils() {
    }
    RenderingUtils.toWebGLCoords = function (point, origin, worldSize) {
        return new Float32Array([
            MathUtils_1["default"].changeRange(point.x, origin.x, origin.x + worldSize.x, -1, 1),
            MathUtils_1["default"].changeRange(point.y, origin.y, origin.y + worldSize.y, 1, -1)
        ]);
    };
    RenderingUtils.toWebGLScale = function (size, worldSize) {
        return new Float32Array([
            2 * size.x / worldSize.x,
            2 * size.y / worldSize.y,
        ]);
    };
    RenderingUtils.toWebGLColor = function (color) {
        return new Float32Array([
            MathUtils_1["default"].changeRange(color.r, 0, 255, 0, 1),
            MathUtils_1["default"].changeRange(color.g, 0, 255, 0, 1),
            MathUtils_1["default"].changeRange(color.b, 0, 255, 0, 1),
            color.a
        ]);
    };
    return RenderingUtils;
}());
exports["default"] = RenderingUtils;
},{"./MathUtils":97}],99:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/** Some utility functions for dealing with strings */
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    /**
     * Extracts the path from a filepath that includes the file
     * @param filePath the filepath to extract the path from
     * @returns The path portion of the filepath provided
     */
    StringUtils.getPathFromFilePath = function (filePath) {
        var splitPath = filePath.split("/");
        splitPath.pop();
        splitPath.push("");
        return splitPath.join("/");
    };
    return StringUtils;
}());
exports["default"] = StringUtils;
},{}],100:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var StateMachineAI_1 = require("../../Wolfie2D/AI/StateMachineAI");
var ElementController = /** @class */ (function (_super) {
    __extends(ElementController, _super);
    function ElementController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementController.prototype.initializeAI = function (owner, options) {
        this.owner = owner;
    };
    ElementController.prototype.update = function (deltaT) {
    };
    return ElementController;
}(StateMachineAI_1["default"]));
exports["default"] = ElementController;
},{"../../Wolfie2D/AI/StateMachineAI":2}],101:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var StateMachineAI_1 = require("../../Wolfie2D/AI/StateMachineAI");
var Vec2_1 = require("../../Wolfie2D/DataTypes/Vec2");
var Input_1 = require("../../Wolfie2D/Input/Input");
var Player_enums_1 = require("./Player_enums");
var CTCEvent_1 = require("../Scenes/CTCEvent");
var Earth_1 = require("../Scenes/Earth");
var PlayerController = /** @class */ (function (_super) {
    __extends(PlayerController, _super);
    function PlayerController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerController.prototype.initializeAI = function (owner, options) {
        this.owner = owner;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.selectedElement = 1;
        this.facing_direction = Player_enums_1.Player_enums.FACING_DOWN;
        this.hasPower = new Array(5).fill(true);
        this.receiver.subscribe([CTCEvent_1.CTCevent.PLAYER_MOVE]);
    };
    PlayerController.prototype.update = function (deltaT) {
        var next_position = this.nextposition();
        if (Input_1["default"].isJustPressed("up")) {
            if (this.facing_direction == Player_enums_1.Player_enums.FACING_UP) {
                this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": next_position });
            }
            this.facing_direction = Player_enums_1.Player_enums.FACING_UP;
            this.owner.animation.play("walking_up");
        }
        else if (Input_1["default"].isJustPressed("left")) {
            if (this.facing_direction == Player_enums_1.Player_enums.FACING_LEFT) {
                this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": next_position });
            }
            this.facing_direction = Player_enums_1.Player_enums.FACING_LEFT;
            this.owner.animation.play("walking_left");
        }
        else if (Input_1["default"].isJustPressed("down")) {
            if (this.facing_direction == Player_enums_1.Player_enums.FACING_DOWN) {
                this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": next_position });
            }
            this.facing_direction = Player_enums_1.Player_enums.FACING_DOWN;
            this.owner.animation.play("walking_down");
        }
        else if (Input_1["default"].isJustPressed("right")) {
            if (this.facing_direction == Player_enums_1.Player_enums.FACING_RIGHT) {
                this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": next_position });
            }
            this.facing_direction = Player_enums_1.Player_enums.FACING_RIGHT;
            this.owner.animation.play("walking_right");
        }
        else if (Input_1["default"].isJustPressed("interact")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.interact();
        }
        else if (Input_1["default"].isJustPressed("place")) {
            this.owner.animation.play("casting_" + this.facing_direction);
            this.placing_element();
        }
        else if (Input_1["default"].isJustPressed("el1") && this.hasPower[0]) {
            this.selectedElement = 1;
            this.emitter.fireEvent(CTCEvent_1.CTCevent.CHANGE_ELEMENT, { "el": this.selectedElement });
        }
        else if (Input_1["default"].isJustPressed("el2") && this.hasPower[1]) {
            this.selectedElement = 2;
            this.emitter.fireEvent(CTCEvent_1.CTCevent.CHANGE_ELEMENT, { "el": this.selectedElement });
        }
        else if (Input_1["default"].isJustPressed("el3") && this.hasPower[2]) {
            this.selectedElement = 3;
            this.emitter.fireEvent(CTCEvent_1.CTCevent.CHANGE_ELEMENT, { "el": this.selectedElement });
        }
        else if (Input_1["default"].isJustPressed("el4") && this.hasPower[3]) {
            this.selectedElement = 4;
            this.emitter.fireEvent(CTCEvent_1.CTCevent.CHANGE_ELEMENT, { "el": this.selectedElement });
        }
        else if (Input_1["default"].isJustPressed("el5") && this.hasPower[4]) {
            this.selectedElement = 5;
            this.emitter.fireEvent(CTCEvent_1.CTCevent.CHANGE_ELEMENT, { "el": this.selectedElement });
        }
        else if (Input_1["default"].isJustPressed("esc")) {
            console.log("paused");
            Earth_1["default"].paused = !Earth_1["default"].paused;
            //CTC todo: pause the game
        }
        // CTC TODO: if the level-end portal is a tile, use this.tilemap field here to fire the LEVEL_END event (should be similar to HW5 testing if switch is below player)
        while (this.receiver.hasNextEvent()) {
            var event_1 = this.receiver.getNextEvent();
            switch (event_1.type) {
                case CTCEvent_1.CTCevent.PLAYER_MOVE:
                    switch (this.facing_direction) {
                        case Player_enums_1.Player_enums.FACING_UP:
                            this.owner.move(new Vec2_1["default"](0, -16));
                            break;
                        case Player_enums_1.Player_enums.FACING_DOWN:
                            this.owner.move(new Vec2_1["default"](0, 16));
                            break;
                        case Player_enums_1.Player_enums.FACING_RIGHT:
                            this.owner.move(new Vec2_1["default"](16, 0));
                            break;
                        case Player_enums_1.Player_enums.FACING_LEFT:
                            this.owner.move(new Vec2_1["default"](-16, 0));
                            break;
                    }
            }
        }
    };
    PlayerController.prototype.nextposition = function () {
        var posX = this.owner.position.x;
        var posY = this.owner.position.y;
        switch (this.facing_direction) {
            case Player_enums_1.Player_enums.FACING_DOWN:
                posY += 16;
                break;
            case Player_enums_1.Player_enums.FACING_UP:
                posY -= 16;
                break;
            case Player_enums_1.Player_enums.FACING_LEFT:
                posX -= 16;
                break;
            case Player_enums_1.Player_enums.FACING_RIGHT:
                posX += 16;
                break;
        }
        posX = (posX - 8) / 16;
        posY = (posY - 8) / 16;
        // not absolute coordinant => Index of gameboard
        var next_position = new Vec2_1["default"](posX, posY);
        return next_position;
    };
    PlayerController.prototype.interact = function () {
        var next = this.nextposition();
        this.emitter.fireEvent(CTCEvent_1.CTCevent.INTERACT_ELEMENT, { "positionX": next.x, "positionY": next.y, "direction": this.facing_direction });
    };
    PlayerController.prototype.placing_element = function () {
        var next = this.nextposition();
        this.emitter.fireEvent(CTCEvent_1.CTCevent.PLACE_ELEMENT, { "positionX": next.x, "positionY": next.y, "type": this.selectedElement });
    };
    return PlayerController;
}(StateMachineAI_1["default"]));
exports["default"] = PlayerController;
},{"../../Wolfie2D/AI/StateMachineAI":2,"../../Wolfie2D/DataTypes/Vec2":20,"../../Wolfie2D/Input/Input":28,"../Scenes/CTCEvent":103,"../Scenes/Earth":104,"./Player_enums":102}],102:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Player_enums = void 0;
var Player_enums;
(function (Player_enums) {
    Player_enums["FACING_DOWN"] = "down";
    Player_enums["FACING_LEFT"] = "left";
    Player_enums["FACING_UP"] = "up";
    Player_enums["FACING_RIGHT"] = "right";
})(Player_enums = exports.Player_enums || (exports.Player_enums = {}));
},{}],103:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.CTCevent = void 0;
var CTCevent;
(function (CTCevent) {
    CTCevent["PLACE_ELEMENT"] = "place_element";
    CTCevent["INTERACT_ELEMENT"] = "interact_element";
    CTCevent["PLAYER_MOVE_REQUEST"] = "player_move_request";
    CTCevent["PLAYER_MOVE"] = "player_move";
    CTCevent["ELEMENT_BREAK"] = "element_destroy";
    CTCevent["END_LEVEL"] = "end_level";
    CTCevent["CHANGE_ELEMENT"] = "change_element";
})(CTCevent = exports.CTCevent || (exports.CTCevent = {}));
},{}],104:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../Wolfie2D/DataTypes/Vec2");
var UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
var Scene_1 = require("../../Wolfie2D/Scene/Scene");
var Color_1 = require("../../Wolfie2D/Utils/Color");
var AABB_1 = require("../../Wolfie2D/DataTypes/Shapes/AABB");
var PlayerController_1 = require("../Player/PlayerController");
var CTCEvent_1 = require("./CTCEvent");
var ElementController_1 = require("../Element/ElementController");
var Player_enums_1 = require("../Player/Player_enums");
var Earth = /** @class */ (function (_super) {
    __extends(Earth, _super);
    function Earth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Earth.prototype.loadScene = function () {
        this.load.image("rock_S", "game_assets/sprites/rock_S.png");
        this.load.image("rock_M", "game_assets/sprites/rock_M.png");
        this.load.image("rock_L", "game_assets/sprites/rock_L.png");
        this.load.image("rock_P", "game_assets/sprites/rock_P.png");
        this.load.spritesheet("god", "game_assets/spritesheets/god.json");
        this.load.spritesheet("element_equipped", "game_assets/spritesheets/element_equipped.json");
        this.load.tilemap("level", "game_assets/tilemaps/earth.json");
        this.load.object("board", "game_assets/data/earth_board.json");
        //unlock all powers for testing
        this.load.spritesheet("whirlwind", "game_assets/spritesheets/whirlwind.json");
        this.load.image("gust", "game_assets/sprites/gust.png");
        this.load.spritesheet("airstream", "game_assets/spritesheets/airstream.json");
        this.load.image("bubble", "game_assets/sprites/bubble.png");
        this.load.image("shallow_water", "game_assets/sprites/shallow_water.png");
        this.load.spritesheet("ember", "game_assets/spritesheets/ember.json");
        this.load.image("flames", "game_assets/sprites/flames.png");
        this.load.image("ignite", "game_assets/sprites/ignite.png");
        this.load.image("ice_cube", "game_assets/sprites/ice_cube.png");
        this.load.spritesheet("torch", "game_assets/spritesheets/torch.json");
        this.load.spritesheet("cursor", "game_assets/spritesheets/cursor.json");
    };
    Earth.prototype.startScene = function () {
        // Add in the tilemap
        var tilemapLayers = this.add.tilemap("level");
        // Get the wall layer 
        this.walls = tilemapLayers[1].getItems()[0];
        // Set the viewport bounds to the tilemap
        var tilemapSize = this.walls.size;
        this.gameboard = new Array(this.walls.getDimensions().y);
        for (var i = 0; i < this.walls.getDimensions().y; i++) {
            this.gameboard[i] = new Array(this.walls.getDimensions().x).fill(null);
        }
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.addLayer("primary", 10);
        this.elementGUI = this.add.animatedSprite("element_equipped", "primary");
        this.elementGUI.animation.play("none_equipped");
        this.elementGUI.position.set(3 * 16 + 4, 19 * 16);
        this.pauseGUI = this.addUILayer("pauseMenu");
        this.pauseGUI.setHidden(true);
        var pauseText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "pauseMenu", { position: new Vec2_1["default"](5 * 16, 16), text: "PAUSED (Work In Progress)" });
        pauseText.textColor = Color_1["default"].WHITE;
        this.initializeGameboard();
        this.initializePlayer();
        this.skillUsed = [false, false, false, false, false];
        // Zoom in to a reasonable level
        this.viewport.enableZoom();
        this.viewport.setZoomLevel(2.5);
        //this.viewport.follow(this.player);
        this.receiver.subscribe([
            CTCEvent_1.CTCevent.INTERACT_ELEMENT,
            CTCEvent_1.CTCevent.PLACE_ELEMENT,
            CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST,
            CTCEvent_1.CTCevent.CHANGE_ELEMENT
            // CTC TODO: subscribe to CTCevent.LEVEL_END event
        ]);
    };
    Earth.prototype.updateScene = function () {
        if (!Earth.paused) {
            this.pauseGUI.setHidden(true);
            while (this.receiver.hasNextEvent()) {
                var event_1 = this.receiver.getNextEvent();
                switch (event_1.type) {
                    // CTC TODO: interacting and placing (if placing then have to account for the walls so you cant place there)
                    case CTCEvent_1.CTCevent.INTERACT_ELEMENT:
                        console.log("interact happened");
                        console.log(event_1.data.get("positionX"));
                        console.log(event_1.data.get("positionY"));
                        var targetposX = event_1.data.get("positionX");
                        var targetposY = event_1.data.get("positionY");
                        var direction = event_1.data.get("direction");
                        var target = this.gameboard[targetposX][targetposY];
                        if (target != null) {
                            this.activateElement(target, targetposX, targetposY, direction);
                        }
                        break;
                    case CTCEvent_1.CTCevent.PLACE_ELEMENT:
                        var placeX = event_1.data.get("positionX");
                        var placeY = event_1.data.get("positionY");
                        if (!(placeX < 2 || placeX >= this.walls.getDimensions().y - 2 || placeY < 2 || placeY >= this.walls.getDimensions().x - 2)) {
                            if (this.gameboard[placeX][placeY] == null) {
                                switch (event_1.data.get("type")) {
                                    case 1:
                                        if (this.skillUsed[0])
                                            break;
                                        this.skillUsed[0] = true;
                                        var place_rock = this.add.sprite("rock_P", "primary");
                                        place_rock.position.set(placeX * 16 + 8, placeY * 16 + 8);
                                        place_rock.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
                                        place_rock.addAI(ElementController_1["default"], {});
                                        this.gameboard[placeX][placeY] = place_rock;
                                        break;
                                    case 2:
                                        if (this.skillUsed[1])
                                            break;
                                        this.skillUsed[1] = true;
                                        var place_wind = this.add.animatedSprite("whirlwind", "primary");
                                        place_wind.position.set(placeX * 16 + 8, placeY * 16 + 8);
                                        place_wind.animation.play("idle");
                                        place_wind.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
                                        place_wind.addAI(ElementController_1["default"], {});
                                        this.gameboard[placeX][placeY] = place_wind;
                                        break;
                                    case 3:
                                        if (this.skillUsed[2])
                                            break;
                                        this.skillUsed[2] = true;
                                        var place_water = this.add.sprite("bubble", "primary");
                                        place_water.position.set(placeX * 16 + 8, placeY * 16 + 8);
                                        place_water.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
                                        place_water.addAI(ElementController_1["default"], {});
                                        this.gameboard[placeX][placeY] = place_water;
                                        break;
                                    case 4:
                                        if (this.skillUsed[3])
                                            break;
                                        this.skillUsed[3] = true;
                                        var place_fire = this.add.animatedSprite("ember", "primary");
                                        place_fire.position.set(placeX * 16 + 8, placeY * 16 + 8);
                                        place_fire.animation.play("idle");
                                        place_fire.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
                                        place_fire.addAI(ElementController_1["default"], {});
                                        this.gameboard[placeX][placeY] = place_fire;
                                        break;
                                    case 5:
                                        if (this.skillUsed[4])
                                            break;
                                        this.skillUsed[4] = true;
                                        var place_ice = this.add.sprite("ice_cube", "primary");
                                        place_ice.position.set(placeX * 16 + 8, placeY * 16 + 8);
                                        place_ice.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
                                        place_ice.addAI(ElementController_1["default"], {});
                                        this.gameboard[placeX][placeY] = place_ice;
                                        break;
                                }
                            }
                            else {
                                switch (event_1.data.get("type")) {
                                    case 1:
                                        if (this.gameboard[placeX][placeY].imageId == "rock_P") {
                                            var sprite = this.gameboard[placeX][placeY];
                                            sprite.destroy();
                                            this.gameboard[placeX][placeY] = null;
                                            this.skillUsed[0] = false;
                                        }
                                        break;
                                    case 2:
                                        if (this.gameboard[placeX][placeY].imageId == "whirlwind") {
                                            var sprite = this.gameboard[placeX][placeY];
                                            sprite.destroy();
                                            this.gameboard[placeX][placeY] = null;
                                            this.skillUsed[1] = false;
                                        }
                                        break;
                                    case 3:
                                        if (this.gameboard[placeX][placeY].imageId == "bubble") {
                                            var sprite = this.gameboard[placeX][placeY];
                                            sprite.destroy();
                                            this.gameboard[placeX][placeY] = null;
                                            this.skillUsed[2] = false;
                                        }
                                        break;
                                    case 4:
                                        if (this.gameboard[placeX][placeY].imageId == "ember") {
                                            var sprite = this.gameboard[placeX][placeY];
                                            sprite.destroy();
                                            this.gameboard[placeX][placeY] = null;
                                            this.skillUsed[3] = false;
                                        }
                                        break;
                                    case 5:
                                        if (this.gameboard[placeX][placeY].imageId == "ice_cube") {
                                            var sprite = this.gameboard[placeX][placeY];
                                            sprite.destroy();
                                            this.gameboard[placeX][placeY] = null;
                                            this.skillUsed[4] = false;
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST:
                        var next = event_1.data.get("next");
                        if (this.gameboard[next.x][next.y] == null || this.endposition == next) {
                            this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE);
                            if (this.endposition == next) {
                                this.emitter.fireEvent(CTCEvent_1.CTCevent.END_LEVEL, { "nextlevel": "earth_boss" });
                            }
                        }
                        break;
                    case CTCEvent_1.CTCevent.CHANGE_ELEMENT:
                        switch (event_1.data.get("el")) {
                            case 1:
                                this.elementGUI.animation.play("earth_equipped");
                                break;
                            case 2:
                                this.elementGUI.animation.play("wind_equipped");
                                break;
                            case 3:
                                this.elementGUI.animation.play("water_equipped");
                                break;
                            case 4:
                                this.elementGUI.animation.play("fire_equipped");
                                break;
                            case 5:
                                this.elementGUI.animation.play("ice_equipped");
                                break;
                        }
                }
            }
        }
        else {
            this.pauseGUI.setHidden(false);
        }
    };
    ;
    Earth.prototype.activateElement = function (target, targetposX, targetposY, direction) {
        var Vel = new Vec2_1["default"](0, 0); // velocity of sprite (if we make moving rock soothly.)
        var dest = new Vec2_1["default"](targetposX, targetposY); //destination that rock will go. (Index)
        var dir;
        switch (direction) {
            case Player_enums_1.Player_enums.FACING_UP:
                dir = new Vec2_1["default"](0, -1);
                break;
            case Player_enums_1.Player_enums.FACING_DOWN:
                dir = new Vec2_1["default"](0, 1);
                break;
            case Player_enums_1.Player_enums.FACING_LEFT:
                dir = new Vec2_1["default"](-1, 0);
                break;
            case Player_enums_1.Player_enums.FACING_RIGHT:
                dir = new Vec2_1["default"](1, 0);
                break;
        }
        switch (target.imageId) {
            case "rock_P":
            case "rock_S":
                if (dest.x + dir.x < 2 || dest.y + dir.y < 2 || dest.x + dir.x > 17 || dest.y + dir.y > 17 || this.gameboard[dest.x + dir.x][dest.y + dir.y] != null)
                    break;
                dest.add(dir);
            case "rock_M":
                if (dest.x + dir.x < 2 || dest.y + dir.y < 2 || dest.x + dir.x > 17 || dest.y + dir.y > 17 || this.gameboard[dest.x + dir.x][dest.y + dir.y] != null)
                    break;
                dest.add(dir);
            case "rock_L":
                if (dest.x + dir.x < 2 || dest.y + dir.y < 2 || dest.x + dir.x > 17 || dest.y + dir.y > 17 || this.gameboard[dest.x + dir.x][dest.y + dir.y] != null)
                    break;
                dest.add(dir);
                target.position.set(dest.x * 16 + 8, dest.y * 16 + 8);
                this.gameboard[targetposX][targetposY] = null;
                this.gameboard[dest.x][dest.y] = target;
                break;
            case "whirlwind":
                /*
                this.player.tweens.add("fly", {
                    startDelay: 0,
                    duration: 500,
                    effects: [
                        {
                            property: this.player.position,
                            start: this.player.position,
                            end: dest,
                            ease: EaseFunctionType.IN_OUT_QUAD
                        }
                    ]
                });*/
                this.gameboard[targetposX][targetposY] = null;
                target.destroy();
                this.skillUsed[1] = false;
                if (dest.x + dir.scaled(3).x >= 2 && dest.y + dir.scaled(3).y >= 2 && dest.x + dir.scaled(3).x <= 17 && dest.y + dir.scaled(3).y <= 17) {
                    if (this.gameboard[dest.x + dir.scaled(3).x][dest.y + dir.scaled(3).y] == null) {
                        //dest.add(dir.scaled(3));
                        //this.player.tweens.play("fly");
                        for (var i = 0; i < 3; i++) {
                            dest.add(dir);
                            this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": dest });
                        }
                    }
                }
                else if (dest.x + dir.scaled(2).x >= 2 && dest.y + dir.scaled(2).y >= 2 && dest.x + dir.scaled(2).x <= 17 && dest.y + dir.scaled(2).y <= 17) {
                    if (this.gameboard[dest.x + dir.scaled(2).x][dest.y + dir.scaled(2).y] == null) {
                        //dest.add(dir.scaled(2));
                        //this.player.tweens.play("fly");
                        for (var i = 0; i < 2; i++) {
                            dest.add(dir);
                            this.emitter.fireEvent(CTCEvent_1.CTCevent.PLAYER_MOVE_REQUEST, { "next": dest });
                        }
                    }
                }
                break;
            case "bubble":
                break;
            case "ember":
                break;
            case "ice_cube":
                break;
        }
    };
    // CTC TODO: if level-end portal is a sprite, then right here you could make this.portal (a Sprite field) and test this.player.position === this.portal.position to fire LEVEL_END event. In this case you could refer to the following to initialize the portal (add this code in its own function or maybe right at the end of initializePlayer function?):
    /*
    this.portal = this.add.sprite("portal", "primary"); **HAVE TO LOAD PORTAL AS IMAGE IN LOADSCENE FUNCTION
    this.player.position.set(3*16 + 8, 3*16 + 8); **CHANGE THE 3s TO BE SOME OTHER TILE POSITION
    this.portal.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    this.portal.addAI(ElementController, {});

    if the sprite is animated then you're on your own tbh lol, this should work for a non-animated sprite i hope
    */
    Earth.prototype.initializePlayer = function () {
        this.player = this.add.animatedSprite("god", "primary");
        this.player.animation.play("idle");
        this.player.position.set(3 * 16 + 8, 3 * 16 + 8);
        // CTC TODO: remove this todo, just note that i did not include player sprite in the gameboard array because thats too much work to update it lol
        this.player.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
        this.player.addAI(PlayerController_1["default"], { tilemap: "Main" });
    };
    Earth.prototype.initializeGameboard = function () {
        var boardData = this.load.getObject("board");
        for (var i = 0; i < boardData.numElements; i++) {
            var element = boardData.elements[i];
            var sprite = this.add.sprite(element.type, "primary");
            sprite.position.set(element.position[0] * 16 + 8, element.position[1] * 16 + 8);
            sprite.addPhysics(new AABB_1["default"](Vec2_1["default"].ZERO, new Vec2_1["default"](8, 8)));
            sprite.addAI(ElementController_1["default"], {});
            this.gameboard[element.position[0]][element.position[1]] = sprite;
        }
        //set portal 
        //this.gameboard[this.endposition.x][this.endposition.y] = 
    };
    return Earth;
}(Scene_1["default"]));
exports["default"] = Earth;
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":20,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":52,"../../Wolfie2D/Scene/Scene":89,"../../Wolfie2D/Utils/Color":94,"../Element/ElementController":100,"../Player/PlayerController":101,"../Player/Player_enums":102,"./CTCEvent":103}],105:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../Wolfie2D/DataTypes/Vec2");
var UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
var Scene_1 = require("../../Wolfie2D/Scene/Scene");
var Color_1 = require("../../Wolfie2D/Utils/Color");
var MainMenu_1 = require("./MainMenu");
var Input_1 = require("../../Wolfie2D/Input/Input");
var Earth_1 = require("./Earth");
var LevelSelection = /** @class */ (function (_super) {
    __extends(LevelSelection, _super);
    function LevelSelection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LevelSelection.prototype.loadScene = function () { };
    LevelSelection.prototype.startScene = function () {
        var center = this.viewport.getCenter();
        // The main menu
        this.levels = this.addUILayer("levels");
        var levelsHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x, center.y - 250), text: "Level Select" });
        levelsHeader.fontSize = 50;
        /* EARTH ROW */
        var earthHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x - 225, center.y - 150), text: "EARTH" });
        ;
        var earth = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y - 150), text: "Puzzle Stage" });
        earth.size.set(200, 50);
        earth.borderWidth = 2;
        earth.borderColor = Color_1["default"].BLACK;
        earth.backgroundColor = new Color_1["default"](0, 255, 213);
        earth.textColor = Color_1["default"].BLACK;
        earth.onClickEventId = "play-earth";
        var earthB = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x + 250, center.y - 150), text: "Boss Stage" });
        earthB.clone(earth, "play-earth-boss");
        /* WIND ROW */
        var windHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x - 225, center.y - 75), text: "WIND" });
        ;
        var wind = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y - 75), text: "Puzzle Stage" });
        wind.clone(earth, "play-wind");
        var windB = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x + 250, center.y - 75), text: "Boss Stage" });
        windB.clone(earth, "play-wind-boss");
        /* WATER ROW */
        var waterHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x - 225, center.y), text: "WATER" });
        ;
        var water = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y), text: "Puzzle Stage" });
        water.clone(earth, "play-water");
        var waterB = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x + 250, center.y), text: "Boss Stage" });
        waterB.clone(earth, "play-water-boss");
        /* FIRE ROW */
        var fireHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x - 225, center.y + 75), text: "FIRE" });
        ;
        var fire = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y + 75), text: "Puzzle Stage" });
        fire.clone(earth, "play-fire");
        var fireB = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x + 250, center.y + 75), text: "Boss Stage" });
        fireB.clone(earth, "play-fire-boss");
        /* ICE ROW */
        var iceHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "levels", { position: new Vec2_1["default"](center.x - 225, center.y + 150), text: "ICE" });
        ;
        var ice = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y + 150), text: "Puzzle Stage" });
        ice.clone(earth, "play-ice");
        var iceB = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x + 250, center.y + 150), text: "Boss Stage" });
        iceB.clone(earth, "play-ice-boss");
        /* BACK BUTTON */
        var back = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "levels", { position: new Vec2_1["default"](center.x, center.y + 300), text: "Back" });
        back.clone(earth, "back");
        this.receiver.subscribe("play-earth");
        this.receiver.subscribe("back");
    };
    LevelSelection.prototype.updateScene = function () {
        // CTC TODO: ADD THE CHEATS
        if (Input_1["default"].isKeyJustPressed("y")) {
            console.log("CHEAT: UNLOCK ALL LEVELS");
        }
        if (Input_1["default"].isKeyJustPressed("u")) {
            console.log("CHEAT: UNLOCK ALL ELEMENTAL SKILS");
        }
        while (this.receiver.hasNextEvent()) {
            var event_1 = this.receiver.getNextEvent();
            console.log(event_1);
            if (event_1.type === "play-earth") {
                this.sceneManager.changeToScene(Earth_1["default"], {});
            }
            // CTC TODO: ADD THE OTHER LEVELS AND SUBSCRIBE TO THE EVENTS
            if (event_1.type === "back") {
                this.sceneManager.changeToScene(MainMenu_1["default"], {});
            }
        }
    };
    return LevelSelection;
}(Scene_1["default"]));
exports["default"] = LevelSelection;
},{"../../Wolfie2D/DataTypes/Vec2":20,"../../Wolfie2D/Input/Input":28,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":52,"../../Wolfie2D/Scene/Scene":89,"../../Wolfie2D/Utils/Color":94,"./Earth":104,"./MainMenu":106}],106:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../Wolfie2D/DataTypes/Vec2");
var UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
var Scene_1 = require("../../Wolfie2D/Scene/Scene");
var Color_1 = require("../../Wolfie2D/Utils/Color");
var LevelSelection_1 = require("./LevelSelection");
var Input_1 = require("../../Wolfie2D/Input/Input");
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainMenu.prototype.loadScene = function () { };
    MainMenu.prototype.startScene = function () {
        var center = this.viewport.getCenter();
        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        var mainMenuHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "mainMenu", { position: new Vec2_1["default"](center.x, center.y - 250), text: "Calm The Calamities" });
        mainMenuHeader.textColor = Color_1["default"].BLACK;
        mainMenuHeader.fontSize = 50;
        // Add play button, and give it an event to emit on press
        var play = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "mainMenu", { position: new Vec2_1["default"](center.x, center.y - 100), text: "Start" });
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color_1["default"].BLACK;
        play.backgroundColor = new Color_1["default"](0, 255, 213);
        play.textColor = Color_1["default"].BLACK;
        play.onClickEventId = "play";
        // Add about button
        var about = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "mainMenu", { position: new Vec2_1["default"](center.x, center.y + 100), text: "Help" });
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color_1["default"].BLACK;
        about.backgroundColor = new Color_1["default"](0, 255, 213);
        about.textColor = Color_1["default"].BLACK;
        about.onClickEventId = "about";
        // Add controls button
        var control = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "mainMenu", { position: new Vec2_1["default"](center.x, center.y), text: "Controls" });
        control.size.set(200, 50);
        control.borderWidth = 2;
        control.borderColor = Color_1["default"].BLACK;
        control.backgroundColor = new Color_1["default"](0, 255, 213);
        control.textColor = Color_1["default"].BLACK;
        control.onClickEventId = "control";
        var credits = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "mainMenu", { position: new Vec2_1["default"](center.x, center.y + 200), text: "Credits" });
        credits.size.set(200, 50);
        credits.borderWidth = 2;
        credits.borderColor = Color_1["default"].BLACK;
        credits.backgroundColor = new Color_1["default"](0, 255, 213);
        credits.textColor = Color_1["default"].BLACK;
        credits.onClickEventId = "credits";
        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);
        var aboutHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y - 250), text: "Help" });
        aboutHeader.textColor = Color_1["default"].BLACK;
        aboutHeader.fontSize = 50;
        var text1 = "You are a young god who just finished creating your first";
        var text2 = "world. You feel tired after making the world so you decided";
        var text3 = "to take a nap. The nap turns into a millennium long slumber.";
        var text4 = "While you were asleep, your powers leaked out from your";
        var text5 = "body into your world. They took the shape of violent spirits,";
        var text6 = "creating all kinds of natural disasters throughout your world.";
        var text7 = "CHEATS (Use on Main Menu/Level Select):";
        var text8 = "Y - Unlock All Levels";
        var text9 = "U - Unlock All Elemental Skills";
        var line1 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y - 150), text: text1 });
        var line2 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y - 100), text: text2 });
        var line3 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y - 50), text: text3 });
        var line4 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y), text: text4 });
        var line5 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y + 50), text: text5 });
        var line6 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x, center.y + 100), text: text6 });
        var line7 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x - 100, center.y + 150), text: text7 });
        var line8 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x + 150, center.y + 200), text: text8 });
        var line9 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "about", { position: new Vec2_1["default"](center.x + 200, center.y + 250), text: text9 });
        line1.textColor = Color_1["default"].BLACK;
        line2.textColor = Color_1["default"].BLACK;
        line3.textColor = Color_1["default"].BLACK;
        var aboutBack = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "about", { position: new Vec2_1["default"](center.x, center.y + 300), text: "Back" });
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color_1["default"].BLACK;
        aboutBack.backgroundColor = new Color_1["default"](0, 255, 213);
        aboutBack.textColor = Color_1["default"].BLACK;
        aboutBack.onClickEventId = "menu";
        /* ########## CONTROLS SCREEN ########## */
        this.control = this.addUILayer("control");
        this.control.setHidden(true);
        var controlHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y - 250), text: "Controls" });
        controlHeader.textColor = Color_1["default"].BLACK;
        controlHeader.fontSize = 50;
        var ctext1 = "W - Move Up";
        var ctext2 = "A - Move Left";
        var ctext3 = "S - Move Down";
        var ctext4 = "D - Move Right";
        var ctext5 = "1,2,3,4,5 - Switch to Element 1-5";
        var ctext6 = "J - Interact With Element";
        var ctext7 = "K - Place/Remove Element";
        var ctext8 = "ESCAPE - Pause";
        var cline1 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y - 150), text: ctext1 });
        var cline2 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y - 100), text: ctext2 });
        var cline3 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y - 50), text: ctext3 });
        var cline4 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y), text: ctext4 });
        var cline5 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y + 50), text: ctext5 });
        var cline6 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y + 100), text: ctext6 });
        var cline7 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y + 150), text: ctext7 });
        var cline8 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "control", { position: new Vec2_1["default"](center.x, center.y + 200), text: ctext8 });
        var controlBack = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "control", { position: new Vec2_1["default"](center.x, center.y + 300), text: "Back" });
        controlBack.size.set(200, 50);
        controlBack.borderWidth = 2;
        controlBack.borderColor = Color_1["default"].BLACK;
        controlBack.backgroundColor = new Color_1["default"](0, 255, 213);
        controlBack.textColor = Color_1["default"].BLACK;
        controlBack.onClickEventId = "menu";
        /* ########## CREDITS SCREEN ########## */
        this.credits = this.addUILayer("credits");
        this.credits.setHidden(true);
        var creditsHeader = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "credits", { position: new Vec2_1["default"](center.x, center.y - 250), text: "Credits" });
        creditsHeader.textColor = Color_1["default"].BLACK;
        creditsHeader.fontSize = 50;
        var crtext1 = "This game was made by:";
        var crtext2 = "David Silverman";
        var crtext3 = "Wei Hang Hong";
        var crtext4 = "Jiwon Jang";
        var crline1 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "credits", { position: new Vec2_1["default"](center.x, center.y - 100), text: crtext1 });
        var crline2 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "credits", { position: new Vec2_1["default"](center.x, center.y), text: crtext2 });
        var crline3 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "credits", { position: new Vec2_1["default"](center.x, center.y + 50), text: crtext3 });
        var crline4 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "credits", { position: new Vec2_1["default"](center.x, center.y + 100), text: crtext4 });
        crline1.textColor = Color_1["default"].BLACK;
        crline2.textColor = Color_1["default"].BLACK;
        crline3.textColor = Color_1["default"].BLACK;
        crline4.textColor = Color_1["default"].BLACK;
        var creditsBack = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, "credits", { position: new Vec2_1["default"](center.x, center.y + 300), text: "Back" });
        creditsBack.size.set(200, 50);
        creditsBack.borderWidth = 2;
        creditsBack.borderColor = Color_1["default"].BLACK;
        creditsBack.backgroundColor = new Color_1["default"](0, 255, 213);
        creditsBack.textColor = Color_1["default"].BLACK;
        creditsBack.onClickEventId = "menu";
        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");
        this.receiver.subscribe("credits");
    };
    MainMenu.prototype.updateScene = function () {
        // CTC TODO: ADD THE CHEATS
        if (Input_1["default"].isKeyJustPressed("y")) {
            console.log("CHEAT: UNLOCK ALL LEVELS");
        }
        if (Input_1["default"].isKeyJustPressed("u")) {
            console.log("CHEAT: UNLOCK ALL ELEMENTAL SKILS");
        }
        while (this.receiver.hasNextEvent()) {
            var event_1 = this.receiver.getNextEvent();
            console.log(event_1);
            if (event_1.type === "play") {
                this.sceneManager.changeToScene(LevelSelection_1["default"], {});
            }
            if (event_1.type === "about") {
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }
            if (event_1.type === "menu") {
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.credits.setHidden(true);
            }
            if (event_1.type === "control") {
                this.mainMenu.setHidden(true);
                this.control.setHidden(false);
            }
            if (event_1.type === "credits") {
                this.mainMenu.setHidden(true);
                this.credits.setHidden(false);
            }
        }
    };
    return MainMenu;
}(Scene_1["default"]));
exports["default"] = MainMenu;
},{"../../Wolfie2D/DataTypes/Vec2":20,"../../Wolfie2D/Input/Input":28,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":52,"../../Wolfie2D/Scene/Scene":89,"../../Wolfie2D/Utils/Color":94,"./LevelSelection":105}],107:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Vec2_1 = require("../../Wolfie2D/DataTypes/Vec2");
var UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
var Scene_1 = require("../../Wolfie2D/Scene/Scene");
var Color_1 = require("../../Wolfie2D/Utils/Color");
var MainMenu_1 = require("./MainMenu");
var GameNode_1 = require("../../Wolfie2D/Nodes/GameNode");
var EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
var Input_1 = require("../../Wolfie2D/Input/Input");
var SplashScreen = /** @class */ (function (_super) {
    __extends(SplashScreen, _super);
    function SplashScreen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SplashScreen.prototype.loadScene = function () {
        this.load.image("logo", "game_assets/sprites/logo.png");
    };
    SplashScreen.prototype.startScene = function () {
        var center = this.viewport.getCenter();
        this.splash = this.addUILayer("splash");
        /* Game logo */
        this.logo = this.add.sprite("logo", "splash");
        this.logo.scale.set(2, 2);
        this.logo.alpha = 0;
        this.logo.position = new Vec2_1["default"](center.x, center.y - 100);
        this.logo.tweens.add("fadeIn", {
            startDelay: 1000,
            duration: 1000,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctions_1.EaseFunctionType.OUT_SINE
                }
            ]
        });
        /* Click anywhere text */
        var clickText = "Click Anywhere To Continue";
        var clickLabel = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, "splash", { position: new Vec2_1["default"](center.x, center.y + 250), text: clickText });
        clickLabel.textColor = new Color_1["default"](0, 0, 0, 0);
        clickLabel.fontSize = 50;
        clickLabel.tweens.add("fadeIn", {
            startDelay: 2000,
            duration: 1000,
            effects: [
                {
                    property: "textAlpha",
                    start: 0,
                    end: 1,
                    ease: EaseFunctions_1.EaseFunctionType.OUT_SINE
                }
            ]
        });
        this.logo.tweens.play("fadeIn");
        clickLabel.tweens.play("fadeIn");
    };
    SplashScreen.prototype.updateScene = function () {
        if (Input_1["default"].isMouseJustPressed()) {
            this.sceneManager.changeToScene(MainMenu_1["default"], {});
        }
    };
    return SplashScreen;
}(Scene_1["default"]));
exports["default"] = SplashScreen;
},{"../../Wolfie2D/DataTypes/Vec2":20,"../../Wolfie2D/Input/Input":28,"../../Wolfie2D/Nodes/GameNode":36,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":52,"../../Wolfie2D/Scene/Scene":89,"../../Wolfie2D/Utils/Color":94,"../../Wolfie2D/Utils/EaseFunctions":95,"./MainMenu":106}],108:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Game_1 = require("./Wolfie2D/Loop/Game");
var SplashScreen_1 = require("./game/Scenes/SplashScreen");
// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main() {
    // Run any tests
    runTests();
    // Set up options for our game
    var options = {
        canvasSize: { x: 800, y: 800 },
        clearColor: { r: 214, g: 179, b: 179 },
        inputs: [
            { name: "up", keys: ["w"] },
            { name: "down", keys: ["s"] },
            { name: "left", keys: ["a"] },
            { name: "right", keys: ["d"] },
            { name: "interact", keys: ["j"] },
            { name: "place", keys: ["k"] },
            { name: "el1", keys: ["1"] },
            { name: "el2", keys: ["2"] },
            { name: "el3", keys: ["3"] },
            { name: "el4", keys: ["4"] },
            { name: "el5", keys: ["5"] },
            { name: "esc", keys: ["escape"] }
        ],
        useWebGL: false,
        showDebug: false
    };
    // Create a game with the options specified
    var game = new Game_1["default"](options);
    // Start our game
    game.start(SplashScreen_1["default"], {});
})();
function runTests() { }
;
},{"./Wolfie2D/Loop/Game":32,"./game/Scenes/SplashScreen":107}]},{},[108])