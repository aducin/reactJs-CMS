export function postalReducer (state={
	amount: undefined,
	error: false,
	list: null,
	loading: false,
	updateSuccess: false
}, action) {
	switch(action.type) {
		case "clearError": {
			state = {...state,
				error: false
			};
			break;
		}
		case "error": {
			state = {...state,
				amount: undefined,
				error: true,
				list: null,
				loading: false,
				updateSuccess: false
			};
			break;
		}
		case "setData": {
			state = {...state, 
				amount: action.payload[0].current,
				error: false,
				list: action.payload,
				loading: false,
				updateSuccess: false
			};
			break;
		}
		case "setLoading": {
			state = {...state,
				loading: true
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