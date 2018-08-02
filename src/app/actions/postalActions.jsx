import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { mapTo, mergeMap } from 'rxjs/operators';

export function getDataRequested() {
	return {
		type: 'GET_DATA_REQUESTED'
	};
}

export function clearError(data) {
	return {
		type: 'clearError',
		payload: null
	}
}

export function getAmount(data) {
	return {
		type: 'setData',
		payload: data
	}
}

export function setAction(name, data) {
	return { type: name, payload: data };
}

export function setData(data) {
	return {
		type: 'setData',
		payload: data
	}
}

export function setError(message) {
	return {
		type: 'error',
		payload: null
	}
}

export function setLoading() {
	return {
		type: 'setLoading',
		payload: null
	}
}

export function setUpdate(data) {
	return {
		type: 'update',
		payload: data
	}
}
