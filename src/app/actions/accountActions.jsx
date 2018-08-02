export function clearData(data) {
	return {
		type: 'clear_data',
		payload: null,
	}
}

export function clearError(data) {
	return {
		type: 'clear_error',
		payload: null
	}
}

export function setAction(name, data) {
	return { type: name, payload: data };
}

export function setError(data) {
	return {
		type: 'set_error',
		payload: null
	}
}

export function setList(data) {
	return {
		type: 'set_list',
		payload: data
	}
}

export function setLoading() {
	return {
		type: 'set_loading',
		payload: null
	}
}


