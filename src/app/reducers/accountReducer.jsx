export function accountReducer (state={
	amount: null,
	automatic: false,
	empty: undefined,
	list: null,
	dateFrom: null,
	dateTo: null,
	error: false,
	maxAmount: null,
	message: false,
}, action) {
	switch(action.type) {
		case "clear_data": {
			state = {...state, 
				amount: null,
				automatic: false,
				empty: undefined,
				error: false,
				dateFrom: null,
				dateTo: null,
				list: null,
				maxAmount: null,
				message: false,
			};
			break;
		}
		case "set_error": {
			state = {...state, 
				amount: null,
				automatic: false,
				empty: undefined,
				error: action.payload,
				dateFrom: null,
				dateTo: null,
				list: null,
				maxAmount: null,
				message: false,
			};
			break;
		}
		case "set_list": {
			state = {...state, 
				amount: action.payload.amount,
				automatic: action.payload.automatic,
				empty: action.payload.empty,
				error: false,
				dateFrom: action.payload.dateFrom,
				dateTo: action.payload.dateTo,
				list: action.payload.list,
				maxAmount: action.payload.maxAmount,
				message: action.payload.message,
			};
			break;
		}
	}
	return state;
}
