import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { mapTo, mergeMap } from 'rxjs/operators';

export function getDataRequested() {
	return {
		type: 'GET_DATA_REQUESTED'
	};
}

export function getAmount(data) {
	return {
		type: 'setData',
		payload: data,
	}
}

export function setData(data) {
	return {
		type: 'setData',
		payload: data,
	}
}

export function setError(message) {
	return {
		type: 'error',
		payload: message,
	}
}

export function setUpdate(data) {
	return {
		type: 'update',
		payload: data,
	}
}