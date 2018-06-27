export function clearData() {
	return {
		type: 'clear',
		payload: null,
	}
}

export function setAdditional(data) {
	return {
		type: 'additionalTask',
		payload: data,
	}
}

export function setAdditionalFinish(message) {
	return {
		type: 'additionalFinish',
		payload: message,
	}
}

export function setError(message) {
	return {
		type: 'orderError',
		payload: message,
	}
}

export function setOrderId(data, db) {
	var action = db === 'new' ? 'orderIdNew' : 'orderIdOld';
	return {
		type: action,
		payload: data,
	}
}