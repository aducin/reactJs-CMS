export function userReducer (state={
      userData: {
	id: 0,
	age: undefined,
	name: undefined,
	surname: undefined,
	occupation: undefined,
      },
      error: false,
      listLength: 0,
      tasks: [],
      verified: false,
    }, action) {
    switch(action.type) {
      case "set_user_data": {
	state = {...state, 
	  userData: action.payload,
	 };
	break;
      }
      case "set_name": {
	state = {...state, 
	  userData: {...state.userData, name: action.payload},
	};
	break;
      }
      case "set_length": {
	state = {...state, listLength: action.payload};
	break;
      }
      case "set_occupation": {
	state = {...state, 
	  userData: {...state.userData, occupation: action.payload},
	};
	break;
      }
      case "set_surname": {
	state = {...state, 
	  userData: {...state.userData, surname: action.payload},
	};
	break;
      }
      case "set_age": {
	state = {...state, 
	  userData: {...state.userData, age: action.payload},
	};
	break;
      }
      case "set_verified": {
	state = {...state, verified: action.payload};
	break;
      }
      case "set_task": {
	var newTasks = [];
	if (state.tasks.length > 0) {
	   state.tasks.forEach(function(el) {
	      newTasks.push(el);
	   });
	}
	newTasks.push(action.payload.task);
	state = {...state, tasks: newTasks};
	break;
      }
      case "set_user_error": {
	state = {...state, error: action.payload}; 
	break;
      }
    }
    return state;
}