FAIL = "F"
ERROR = "E"
PASS = "."
FAIL_WORD = "Failed"
ERROR_WORD = "Errored"

function fail(message) {
  message = (message !== undefined) ? message : "Assertion failed"
  throw { type: FAIL, message: message }
}

function assertTrue(condition, message) {
  message = (message !== undefined) ? message : "condition was not true"
  if(!condition)
    fail(message)
}

function assertFalse(condition, message) {
  message = (message !== undefined) ? message : "condition was not false"
  assertTrue(!condition, message)
}

function assertEqual(obj1, obj2, message) {
  message = (message !== undefined) ? message : "objects were not equal"
  assertTrue(obj1 === obj2, message)
}

class Test {
  constructor() {
    this.tests = [
      this.test_pass,
      //this.test_fail,
      //this.test_error,
    ]
  }
  
  test_pass = function() {
    assertTrue(true)
  }

  test_fail = function() {
    assertFalse(true)
  }

  test_error = function() {
    let foo = 1/0
    foo.bar()
    assertFalse(false) // shouldnt reach this
  }


  set_up = function() {

  }

  tear_down = function() {

  }

  run = function() {
    let results = this.tests
      .map(func => { return this.run_test(func) })
      .reduce((acc, next) => { return acc + next }, "")

    console.log(results)
    return !results.includes("E") && !results.includes("F")
  }

  run_test = function(test) {
    this.set_up()
    let response = this.try_test(test)
    this.tear_down()
    return response.type
  }

  // all per test logging should be handled here
  try_test = function(test_fun) {
    console.log(`Running Test: ${test_fun.name}`)
    try {
      test_fun.bind(this).call()
      console.log(`Test Succeeded: ${test_fun.name}`)
      return { type: "." }
    } catch(error) {
      error.type = (error.type !== undefined) ? error.type : ERROR
      this.print_failure_error(error, test_fun.name)
      return { type: error.type, message: error.message }
    }
  }

  print_failure_error = function(error, test_name) {
    let type_str = (error.type === FAIL) ? FAIL_WORD : ERROR_WORD
    let stack_trace = (error.type === FAIL) ? "" : " \n" + error.stack

    let message_prefix = `Test ${type_str}: ${test_name} \n `
    console.log(message_prefix + ` ${error.message} \n ${stack_trace}`)
  }

}
