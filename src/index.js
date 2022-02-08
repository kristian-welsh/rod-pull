// requires script tag ./src/bridge.js
const bridgeAPI = new BridgeAPI(600, 600)

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
  render: {
    fillStyle: "#fc8"
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
