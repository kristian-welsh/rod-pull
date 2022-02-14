// requires ./src/test/test.js
// requires ./src/test/dummy_all.js
// requires ./lib/matter/build/matter.js

class BridgeTest extends TestClass {
  set_up = function() {
    const fakeMatter = {
      Engine: dummy_all(Matter.Engine),
      //Render: dummy_all(Matter.Render),
      //Runner: dummy_all(Matter.Runner),
      //Bodies: dummy_all(Matter.Bodies),
      //Body: dummy_all(Matter.Body),
      //Mouse: dummy_all(Matter.Mouse),
      //Vector: dummy_all(Matter.Vector),
      //MouseConstraint: dummy_all(Matter.MouseConstraint),
      //Composites: dummy_all(Matter.Composites),
      //Composite: dummy_all(Matter.Composite),
    }
    console.log(fakeMatter.Engine.create)
    //this.bridge = new BridgeAPI(100, 100, fakeMatter)
  }

  test_pass = function() {
    console.log("showtime")
    //console.log(this.bridge.framework.Engine.create)
    //console.log(this.bridge.framework.Engine.create())
    //this.bridge.start()
  }

  test_call_log = function() {
    let log = new CallLog()
    let obj = {}
    console.log(log.values_for(obj))
    assertEqual(0, log.values_for(obj).length)
    log.update_values_for(obj, [1, 2, 3])
    assertEqual(3, log.values_for(obj).length)

  }
}
