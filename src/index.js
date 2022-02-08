var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Body = Matter.Body,
Mouse = Matter.Mouse,
Vector = Matter.Vector,
MouseConstraint = Matter.MouseConstraint,
Composites = Matter.Composites,
Composite = Matter.Composite;

// bodies in this 0 group use masking/filtering rules to collide
const COLLISION_GROUP_ZERO = 0
// bodies in the same non-zero group collide together
const COLLISION_GROUP_LEVEL = 1

// this int is used as a bitmask
const COLLISION_MASK_ZERO = 0x0000
// any constraint category using it will be pulled by the mouse
const COLLISION_MASK_MOUSE = 0x0001

const WALL = {
  density: 1,
  isStatic: true,
  friction: 1,
  staticFriction: 0.8,
  render: {
    fillStyle: "#666"
  }
}
const ROD = {
  density: 1,
  friction: 0.8,
  staticFriction: 0.8,
  isSleeping: false,
  render: {
    fillStyle: "#fe8"
  }
}

const WATER = {
  density: 0.3,
  friction: 0.2,
}

const WATER_COLOUR_1 = {
  render: {
    fillStyle: "#3a7"
  },
};
const WATER_COLOUR_2 = {
  render: {
    fillStyle: "#37a"
  },
};

const COLLISION_FILTERS = {
  drag: {
    group: COLLISION_GROUP_LEVEL,
    category: COLLISION_MASK_MOUSE,
    mask: COLLISION_MASK_MOUSE,
  },
  no_drag: {
    group: COLLISION_GROUP_LEVEL,
    category: COLLISION_MASK_ZERO,
    mask: COLLISION_MASK_ZERO,
  },
}

let randint = function(range) {
  let max = range / 2
  let min = -(range / 2)
  let float_r = Math.random() * (max - min + 1) + min
  let int_r = float_r - (float_r % 1)
  return int_r
}

let aprox_sqrt = function(num) {
  let true_root = Math.sqrt(num)
  return true_root - (true_root % 1)
}

class BridgeAPI {
  constructor(width, height) {
    this.engine = Engine.create();
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: width, height: height,
        wireframes: false,
        showConvexHulls: true,
      }
    });
    this.mouse = Mouse.create(this.render.canvas)
    this.render.mouse = this.mouse
    this.runner = Runner.create();
  }

  start = function() {
    let mouse_constraint = this.mouse_constraints(this.mouse, this.engine)
    Composite.add(this.engine.world, mouse_constraint);

    Render.run(this.render);
    Runner.run(this.runner, this.engine);
  }

  mouse_constraints = function() {
    return MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        angularStiffness: 0.8,
        collisionFilter: {
          group: COLLISION_GROUP_ZERO,
          category: COLLISION_MASK_MOUSE,
          mask: COLLISION_MASK_MOUSE,
        }
      }
    })
  }

  position_camera = function(bodies, raw_padding) {
    raw_padding = (raw_padding !== undefined) ? raw_padding :
      { x: 100, y: 100 }
    let vec_padding = Vector.create(raw_padding.x, raw_padding.y);
    Render.lookAt(this.render, bodies, vec_padding)
  }

  /* sets collision filter to match the mouse constraint
   * body or array of boddies accepted
   */
  enable_drag = function(...bodies) {
    bodies.forEach( body => { 
      body.collisionFilter = COLLISION_FILTERS.drag
    })
    return bodies[0]
  }

  /* sets collision filter to not match the mouse constraint
   * body or array of boddies accepted
   */
  disable_drag = function(...bodies) {
    bodies.forEach( body => { 
      body.collisionFilter = COLLISION_FILTERS.no_drag
    })
    return bodies[0]
  }

  add_geom = function(bodies) {
    Composite.add(this.engine.world, bodies);
  }

  fluid = function(xx, yy, aprox_num_blobs, fluid_properties) {
    let size = aprox_sqrt(aprox_num_blobs)
    let fluid_group =
      Composites.stack(xx, yy, size, size, 0, 0, (x, y) => {
        return this.circle(x, y, 10, fluid_properties)
      });
    let hull = this.draw_hull(fluid_group);
    return fluid_group
  }

  draw_hull = function() {
    // todo: hull algorithm for water bounds
    //
    // 1. find left-most point
    //
    // 2. sort by ...
    //
    // 20. decide how to generalize this to circle boundaries instead of points
    //     probably do as normal then re-trace once boundary centers are found
    //     but with some circumfrence points
    return []
  }

  rect = function(x, y, width, height, properties) {
    return this.disable_drag(Bodies.rectangle(x, y, width, height, properties))
  }

  circle = function(x, y, size, properties) {
    return this.disable_drag(Bodies.circle(x, y, size, properties))
  } 

  create_rects = function(rectangles) {
    let i = 1
    return rectangles.map(rect => {
      return this.rect(rect.x, rect.y, rect.width, rect.height, rect.props)
    })
  }
}

bridgeAPI = new BridgeAPI(600, 600)

class Game {
  start = function() {
    let geom = {
      walls: this.create_walls(),
      rods: this.create_rods(),
      water: this.create_water(),
    }
    let level = Object.values(geom).flat()

    bridgeAPI.add_geom(level)
    bridgeAPI.enable_drag(...geom.rods)
    bridgeAPI.position_camera(level)
    bridgeAPI.start(level);
  }

  create_water = function() {
    return [
      bridgeAPI.fluid(300, 100, 50, { ...WATER, ...WATER_COLOUR_1 }),// left water
      bridgeAPI.fluid(500, 100, 50, { ...WATER, ...WATER_COLOUR_2 }),// right water
    ]
  }

  create_walls = function() {
    return bridgeAPI.create_rects([
      { x: 450, y:  50, width: 400, height:  20, props: WALL },// top wall
      { x: 240, y: 140, width:  20, height: 200, props: WALL },// left wall top
      { x: 240, y: 360, width:  20, height: 200, props: WALL },// left wall bottom
      { x: 660, y: 140, width:  20, height: 200, props: WALL },// right wall top
      { x: 660, y: 360, width:  20, height: 200, props: WALL },// right wall bottom
      { x: 450, y: 450, width: 400, height:  20, props: WALL },// bottom wall
      { x: 450, y: 150, width:  20, height: 180, props: WALL },// chamber seperator
      { x: 450, y: 270, width:  40, height:  20, props: WALL },// rod cap
    ])
  }

  create_rods = function() {
    return bridgeAPI.create_rects([
      { x: 330, y: 250, width: 240, height: 20, props: ROD},// left rod
      { x: 570, y: 250, width: 240, height: 20, props: ROD},// right rod
    ])
  }
}
new Game().start()
