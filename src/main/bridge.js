// bodies in this 0 group use masking/filtering rules to collide
const COLLISION_GROUP_ZERO = 0
// bodies in the same non-zero group collide together
const COLLISION_GROUP_LEVEL = 1
// this int is used as a bitmask
const COLLISION_MASK_ZERO = 0x0000
// any constraint category using it will be pulled by the mouse
const COLLISION_MASK_MOUSE = 0x0001

// all objects will collinde with each other, drag will respond to mouse drag
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

let aprox_sqrt = function(num) {
  let true_root = Math.sqrt(num)
  return true_root - (true_root % 1)
}

class BridgeAPI {
  constructor(width, height, framework = Matter) {
    // requires script tag ./lib/matter/build/matter.js
    this.framework = framework

    this.engine = framework.Engine.create();
    this.render = framework.Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: width, height: height,
        wireframes: false,
        showConvexHulls: true,
      }
    });
    this.mouse = framework.Mouse.create(this.render.canvas)
    this.render.mouse = this.mouse
    this.runner = framework.Runner.create();
  }

  start = function() {
    let mouse_constraint = this.mouse_constraints(this.mouse, this.engine)
    this.framework.Composite.add(this.engine.world, mouse_constraint);

    this.framework.Render.run(this.render);
    this.framework.Runner.run(this.runner, this.engine);
  }

  mouse_constraints = function() {
    return this.framework.MouseConstraint.create(this.engine, {
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
    let vec_padding = this.framework.Vector.create(raw_padding.x, raw_padding.y);
    this.framework.Render.lookAt(this.render, bodies, vec_padding)
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
    this.framework.Composite.add(this.engine.world, bodies);
  }

  fluid = function(xx, yy, aprox_num_blobs, fluid_properties) {
    let size = aprox_sqrt(aprox_num_blobs)
    let fluid_group =
      this.framework.Composites.stack(xx, yy, size, size, 0, 0, (x, y) => {
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
    return this.disable_drag(this.framework.Bodies.rectangle(x, y, width, height, properties))
  }

  circle = function(x, y, size, properties) {
    return this.disable_drag(this.framework.Bodies.circle(x, y, size, properties))
  } 

  create_rects = function(rectangles) {
    let i = 1
    return rectangles.map(rect => {
      return this.rect(rect.x, rect.y, rect.width, rect.height, rect.props)
    })
  }
}

