FAIL = "F"
ERROR = "E"
PASS = "."

function fail(message) {
  message = (message !== undefined) ? message : "Assertion failed"
  throw new TestFailure(message)
}

function assertTrue(condition, message) {
  message = (message !== undefined) ? message : "condition was not true"
  if(!condition)
    fail(message)
}

function assertFalse(condition, message) {
  message = (message !== undefined) ? message : "condition was not false"
  if(condition)
    fail(message)
}

function assertEqual(obj1, obj2, message) {
  let default_message = "objects were not equal: " + obj1 + ", " + obj2
  message = (message !== undefined) ? message : default_message
  if(obj1 !== obj2)
    fail(message)
}

class TestFailure extends Error {
  constructor(message) {
    super(message)
    this.name = "TestFailure"
  }
}

class TestRunner {
  run = function(tests, set_up, tear_down) {
    let results = tests
      .map(func => { return this.run_test(func, set_up, tear_down) })
      .reduce((acc, next) => { return acc + next }, "")
    console.log(results)
    return !results.includes(ERROR) && !results.includes(FAIL)
  }

  run_test = function(test, set_up, tear_down) {
    set_up()
    let result = this.try_test(test)
    tear_down()
    return result
  }

  // returns . for pass, F for failed, E for error
  try_test = function(test_fun) {
    console.log(`Running Test: ${test_fun.name}`)
    try {
      test_fun.call()
      return PASS
    } catch(error) {
      console.warn(error.stack)
      return (error instanceof TestFailure) ? FAIL : ERROR
    }
  }
}

class TestClass {
  constructor() {
    this.runner = new TestRunner()
    this.initialized = false
  }

  run() {
    this._initialize_if_nessecary()
    this.runner.run(this._test_functions, this._setup, this._teardown)
  }

  _initialize_if_nessecary() {
    if(!this.initialized) {
      this._initialize()
      this._initialized = true
    }
  }

  _initialize() {
    this._test_functions = Object.getOwnPropertyNames(this)
      .filter(prop_name => { return prop_name.includes("test_") })
      .map(test_name => { return this[test_name].bind(this) })
    this._setup = (this.set_up !== undefined) ? this.set_up.bind(this) : _ => { }
    this._teardown = (this.tear_down !== undefined) ? this.tear_down.bind(this) : _ => { }
  }
}
