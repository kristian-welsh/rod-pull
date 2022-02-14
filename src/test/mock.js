class Dummy_Singleton {
  toString = function() {
    return "Dummy Value"
  }
}
const Dummy = new Dummy_Singleton()

function dummy_all(object) {
  return stub_all(object, Dummy)
}
 
class CallLog {
  constructor() {
    this.calls = {}
    console.log(this.calls)
  }

  update_values_for = function(obj, values) {
    this.calls[obj] = values
  }

  values_for = function(obj, callNum) {
    let calls = (this.calls[obj] !== undefined) ? this.calls[obj] : []
    return [callNum]
  }

}

function spy_for(func, obj) {
  return function(...func_args) {
    call_logging.log(obj, func, func_args)
    return values_for(this, callNum)
  }
}


function when(mock_callback) {
  //check_mock_callback_occured()
  //let log = get_log_of_last_mock_callback()
  return {
    thenDo: (callback) => {
      //log.obj.register_callback(callback, log.fun)
    },
    thenReturnSequence: (values) => {
      update_values_for(log.obj, values)
    }
  }
}

/*
usage:
const spy = spy_for(dependancy, dependancy.function)
when(spy.function()).thenReturnSequence(["foo", "bar", "baz"])
*/

/* stubs all functions on an object */
function stub_all(object, stub_value) {
  return _replace_all_functions(object, (..._) => { return stub_value })
}

function _replace_all_functions(object, new_function) {
  const property_is_function = _function_checker_for(object)
  const register_function = _registers_func_on_obj(new_function)

  return Object.getOwnPropertyNames(object)
    .filter(property_is_function)
    .reduce(register_function, { })
}

/* curried function that will check property of object is function */
function _function_checker_for(object) {
  return function(property) {
    return typeof object[property] === "function"
  }
}

/* curried function that will place new_function on object */
function _registers_func_on_obj(new_function) {
  return function(object, old_function_name) {
    object[old_function_name] = new_function
    return object
  }
}

