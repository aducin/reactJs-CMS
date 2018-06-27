export function setUserData(object) {
    return {
      type: 'set_user_data',
      payload: {
	id: object.id,
	age: object.age,
	name: object.name,
	surname: object.surname,
	occupation: object.occupation,
      }
    }
}

export function setUserError(error) {
    return {
	type: 'set_user_error',
	payload: error
    }
}

export function veryfyUser() {
    return {
      type: 'set_verified',
      payload: true,
    }
}

export function setSingleTask(task) {
    return {
      type: 'set_task',
      payload: {
	task: task,
      }
    }
}

export function updateName(name) {
    return {
      type: 'set_name',
      payload: name,
    }
}

export function updateLength(number) {
    return {
      type: 'set_length',
      payload: number,
    }
}

export function updateOccupation(name) {
    return {
      type: 'set_occupation',
      payload: name,
    }
}