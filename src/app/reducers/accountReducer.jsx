export function accountReducer (state={
	amount: null,
	amounts: {},
	automatic: false,
	empty: undefined,
	list: null,
	loading: false,
	dateFrom: null,
	dateTo: null,
	error: false,
	maxAmount: null,
	message: false
}, action) {
	switch(action.type) {
		case "clear_data": {
			state = {...state, 
				amount: null,
				amounts: {},
				automatic: false,
				empty: undefined,
				error: false,
				dateFrom: null,
				dateTo: null,
				list: null,
				loading: false,
				maxAmount: null,
				message: false
			};
			break;
		}
		case "clear_error": {
			state = {...state,
				error: false,
				loading: false
			};
			break;
		}
		case "set_error": {
			state = {...state,
				error: true,
				loading: false
			};
			break;
		}
		case "set_list": {
			state = {...state, 
				amount: action.payload.amount,
				amounts: action.payload.amounts,
				automatic: action.payload.automatic,
				empty: action.payload.empty,
				error: false,
				dateFrom: action.payload.dateFrom,
				dateTo: action.payload.dateTo,
				list: action.payload.list,
				loading: false,
				maxAmount: action.payload.maxAmount,
				message: action.payload.message
			};
			break;
		}
		case "set_loading": {
			state = {...state,
				loading: true
			};
			break;
		}
	}
	return state;
}
