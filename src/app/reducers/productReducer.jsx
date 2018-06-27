export function productReducer (state={
	prepare: false,
	anotherSearch: false,
	nameList: [],
	basicData: false,
	cleared: false,
	constant: false,
	dataReceived: null,
	fullDataFirst: {
		id: 0,
		active: undefined,
		amount: undefined,
		condition: undefined,
		description: undefined,
		descriptionShort: undefined,
		discount: {
			new: false,
			old: false,
		},
		lastOrders: {
			list: {
				new: null,
				old: null
			},
			newest: {
				new: null,
				old: null
			}
		},
		manufacturer: undefined,
		metaDescription: undefined,
		metaTitle: undefined,
		name: undefined,
		price: undefined,
		priceReal: undefined,
		printings: {
			deliveryList: null,
			list: null,
			empty: null,
			emptyDelivery: null
		},
		productCategories: undefined,
		url: undefined,
	},
	isModified: false,
	modifiedList: null,
	ordersSearch: false,
	result: false,
	shortDataFirst: {
		id: 0,
		image: undefined,
		name: undefined,
		amount: undefined,
		price: undefined,
	},
	shortDataSecond: {
		id: 0,
		name: undefined,
		amount: undefined,
		price: undefined,
	},
	categoryList: [],
	manufacturerList: [],
	empty: false,
	error: false,
	history: {
		empty: false,
		id: false,
		list: [],
	},
	searched: false,
	warning: false,
}, action) {

	switch(action.type) {
		case "clear": {
			state = {...state, 
				cleared: false,
				prepare: false,
				result: false,
				searched: false,
				dataReceived: null,
				fullDataFirst: [],
				shortDataFirst: [],
				shortDataSecond: [],
				history: {
					empty: false,
					id: false,
					list: [],
				},
				warning: false,
			};
			break;
		}
		case "clear_inputs": {
			state = {...state, 
				cleared: action.payload,
			};
			break;
		}
		case "clear_basic": {
			state = {...state, 
				basicData: false,
				dataReceived: null
			};
			break;
		}
		case "set_basic": {
			state = {...state, 
				basicData: action.payload,
				history: {
					empty: false,
					id: false,
					list: [],
				},
				anotherSearch: false,
				//nameList: [],
				prepare: false,
				fullDataFirst: [],
				dataReceived: 'simple',
				searched: true,
				empty: false,
				warning: false,
			};
			break;
		}
		case "set_category": {
			state = {...state, 
				categoryList: action.payload,
			};
			break;
		}
		case "set_constant": {
			state = {...state, 
				constant: true,
				categoryList: action.payload.category,
				manufacturerList: action.payload.manufactorer,
			};
			break;
		}
		case "set_history": {
			state = {...state, 
				history: {
					id: action.payload.id,
					list: action.payload.list,
					empty: false,
				},
				searched: true,
			};
			break;
		}
		case "set_history_empty": {
			state = {...state, 
				history: {
					id: action.payload,
					list: [],
					empty: true,
				},
				searched: true,
			};
			break;
		}
		case "set_id_result": {
			if (action.payload.edition === 'full') {
				state = {...state,
					history: {
						empty: false,
						id: false,
						list: [],
					},
					anotherSearch: false,
					nameList: [],
					prepare: false,
					dataReceived: 'full',
					fullDataFirst: action.payload.first,
					shortDataFirst: [],
					shortDataSecond: [],
					searched: true,
					empty: false,
					warning: false,
				};
			} else if (action.payload.first.edition === 'simple') {
				state = {...state,
					history: {
						empty: false,
						id: false,
						list: [],
					},
					anotherSearch: false,
					nameList: [],
					prepare: false,
					fullDataFirst: [],
					dataReceived: 'simple',
					shortDataFirst: action.payload.first,
					shortDataSecond: action.payload.second,
					searched: true,
					empty: false,
					warning: false,
				};
			}
			break;
		}
		case "set_last_orders": {
			state = {...state,
				lastOrders: {
					list: action.payload.list,
					newest: action.payload.newest
				},
				ordersSearch: false,
			};
			break;
		}
		case "set_modified": {
			state = {...state,
				isModified: !action.payload.empty,
				modifiedList: action.payload.list,
			};	
			break;
		}
		case "set_name_result": {
			state = {...state,
				history: {
					empty: false,
					id: false,
					list: [],
				},
				anotherSearch: action.payload.anotherSearch,
				nameList: action.payload.list,
				prepare: false,
				dataReceived: null,
				fullDataFirst: [],
				fullDataSecond: [],
				shortDataFirst: [],
				shortDataSecond: [],
				searched: true,
				empty: false,
				warning: false,
			};
			break;
		}
		case "set_manufacturer": {
			state = {...state, 
				manufacturerList: action.payload,
			};
			break;
		}
		case "set_orders_search": {
			state = {...state,
				ordersSearch: action.payload,
			};
			break;
		}
		case "set_empty": {
			state = {...state, 
				empty: true, 
				history: {
					empty: false,
					id: false,
					list: [],
				},
				nameList: [],
				prepare: false,
				reason: action.payload,
				searched: true,
				dataReceived: null,
				fullDataFirst: [],
				fullDataSecond: [],
				shortDataFirst: [],
				shortDataSecond: [],
				warning: false,
			}; 
			break;
		}
		case "set_manufacturer_error": {
			state = {...state, error: action.payload}; 
			break;
		}
		case "set_prepare": {
			state = {...state,
				prepare: true,
				result: false,
			};
			break;
		}
		case "set_printings": {
			state = {...state,
				printings: action.payload
			};
			break;
		}
		case "set_save_result": {
			state = {...state, shortDataFirst: [], result: action.payload};
			break;
		}
		case "set_warning": {
			state = {...state,
				empty: false, 
				history: {
					empty: false,
					id: false,
					list: [],
				},
				nameList: [],
				prepare: false,
				reason: action.payload,
				searched: true,
				dataReceived: null,
				fullDataFirst: [],
				fullDataSecond: [],
				shortDataFirst: [],
				shortDataSecond: [],
				warning: action.payload,
			}; 
			break;
		}
	}
	return state;
}