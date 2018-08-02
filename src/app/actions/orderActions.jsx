export function clearData() {
	return {
		type: 'clear',
		payload: null
	}
}

export function clearError() {
	return {
		type: 'clearError',
		payload: null
	}
}

export function deleteCustomerId(id) {
	return {
		type: 'deleteCustomerId',
		payload: null
	}
}

export function setAction(name, data) {
	return { type: name, payload: data };
}

export function setAdditional(data) {
	return {
		type: 'additionalTask',
		payload: data
	}
}

export function setAdditionalFinish(message) {
	return {
		type: 'additionalFinish',
		payload: message
	}
}

export function setCustomerId(id) {
	return {
		type: 'customerId',
		payload: id
	}
}

export function setError(message) {
	return {
		type: 'orderError',
		payload: true
	}
}

export function setLoading() {
	return {
		type: 'orderLoading',
		payload: null
	}
}

export function setOrderId(data, db) {
	var action = db === 'new' ? 'orderIdNew' : 'orderIdOld';
	return {
		type: action,
		payload: data
	}
}