export function postalReducer (state={
	amount: undefined,
	error: false,
	list: null,
	updateSuccess: false
}, action) {
	switch(action.type) {
		case "error": {
			state = {...state,
				amount: undefined,
				error: true,
				list: null,
				updateSuccess: false
			};
			break;
		}

		case "setData": {
			state = {...state, 
				amount: action.payload[0].current,
				error: false,
				list: action.payload,
				updateSuccess: false
			};
			break;
		}
		case "update": {
			state = {...state, 
				amount: action.payload.amount,
				updateSuccess: action.payload.reason,
			};
			break;
		}
	}
	return state;
}