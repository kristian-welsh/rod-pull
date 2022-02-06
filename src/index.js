var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Composite = Matter.Composite;

let randint = function(range) {
  let max = range / 2
  let min = -(range / 2)
  let float_r = Math.random() * (max - min + 1) + min
  let int_r = float_r - (float_r % 1)
  return int_r
}


class Game {
  start = function() {
    let engine = Engine.create();
    let render = Render.create({
      element: document.body,
      engine: engine,
    });
    let runner = Runner.create();

    let level_static_geom = {
      top_w: Bodies.rectangle(450, 50, 400, 20, { isStatic: true }),
      bottom_w: Bodies.rectangle(450, 450, 400, 20, { isStatic: true }),
      left_top: Bodies.rectangle(240, 140, 20, 200, { isStatic: true }),
      left_bottom: Bodies.rectangle(240, 360, 20, 200, { isStatic: true }), 
      right_top: Bodies.rectangle(660, 140, 20, 200, { isStatic: true }),
      right_bottom: Bodies.rectangle(660, 360, 20, 200, { isStatic: true }), 
      seperator:Bodies.rectangle(450, 150, 20, 180, { isStatic: true }), 
      cap: Bodies.rectangle(450, 270, 40, 20, { isStatic: true }), 

      left_rod: Bodies.rectangle(330, 250, 240, 20, { isStatic: true }),
      right_rod: Bodies.rectangle(570, 250, 240, 20, { isStatic: true }),
    }
    let water_blob = this.spawn_fluid(350, 150, 70)

    let level_geom = [...water_blob, ...Object.values(level_static_geom)]

    Composite.add(engine.world, level_geom);
    //Composite.add(engine.world, water_blob);
    Render.run(render);
    Runner.run(runner, engine);
  }

  spawn_fluid = function(x, y, num_blobs) {
    let fluid_spawn_set = []
    for(var i = 0; i < num_blobs; i++) {
      let particle = Bodies.circle(x + randint(num_blobs), y + randint(num_blobs), 10)
      fluid_spawn_set.push(particle)
    }
    return fluid_spawn_set
  }
}
new Game().start()
