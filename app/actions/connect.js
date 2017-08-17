import * as types from './actionsTypes';

export function connectRequest() {
	return {
		type: types.METEOR.REQUEST
	};
}

export function connectSuccess() {
	return {
		type: types.METEOR.SUCCESS
	};
}

export function connectFailure(err) {
	return {
		type: types.METEOR.FAILURE,
		err
	};
}

export function disconnect(err) {
	console.log('types.METEOR.DISCONNECT');
	return {
		type: types.METEOR.DISCONNECT,
		err
	};
}
