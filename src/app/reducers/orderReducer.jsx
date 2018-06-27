export function orderReducer (state={
	additionalFinish: false,
	additionalTask: false,
	additionalData: false,
	currentDb: undefined,
	currentId: undefined,
	error: false,
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
				orderData: null,
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
				orderData: action.payload,
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
				orderData: action.payload,
			}; 
			break;
		}
		case "orderError": {
			state = {...state,
				additionalFinish: false,
				additionalTask: false, 
				error: action.payload,
				orderData: null,
			}; 
			break;
		}
	}
	return state;
}