export function orderReducer (state={
	additionalFinish: false,
	additionalTask: false,
	additionalData: false,
	currentDb: undefined,
	currentId: undefined,
	customerId: null,
	error: false,
	loading: false,
	orderData: null,
}, action) {

	switch(action.type) {
		case "clear": {
			state = {...state, 
				additionalTask: false,
				additionalData: false,
				additionalFinish: false,
				currentDb: undefined,
				currentId: undefined,
				error: false,
				loading: false,
				orderData: null,
			};
			break;
		}
		case "additionalFinish": {
			state = {...state,
				additionalFinish: action.payload,
			};
			break; 	
		}
		case "additionalTask": {
			state = {...state, 
				additionalFinish: false,
				additionalTask: action.payload.action,
				additionalData: action.payload.data,
				currentDb: action.payload.db,
				currentId: action.payload.id,
				error: false,
				loading: false,
				orderData: null
			};
			break; 
		}
		case "clearError": {
			state = {...state,
				error: false
			};
			break;
		}
		case "customerId": {
			state = {...state,
				customerId: action.payload
			};
			break;
		}
		case "deleteCustomerId": {
			state = {...state,
				customerId: null
			};
			break;
		}
		case "orderIdNew": {
			state = {...state, 
				additionalFinish: false,
				additionalTask: false,
				currentDb: 'new',
				currentId: action.payload.id,
				error: false,
				loading: false,
				orderData: action.payload
			}; 
			break;
		}
		case "orderIdOld": {
			state = {...state,
				additionalFinish: false,
				additionalTask: false, 
				currentDb: 'old',
				currentId: action.payload.id,
				error: false,
				loading: false,
				orderData: action.payload
			}; 
			break;
		}
		case "orderError": {
			state = {...state,
				additionalFinish: false,
				additionalTask: false, 
				error: action.payload,
				loading: false,
				orderData: null
			}; 
			break;
		}
		case "orderLoading": {
			state = {...state,
				loading: true
			};
			break;
		}
	}
	return state;
}