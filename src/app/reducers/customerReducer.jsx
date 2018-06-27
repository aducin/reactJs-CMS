const defaultState = {
  address: {
    new: null,
    old: null
  },
  customer: {
    new: false,
    old: false
  },
  empty: true,
  id: {
    new: null,
    old: null
  },
  orders: {
    new: null,
    old: null
  }
};

export function customerReducer (state={
  address: {
    new: null,
    old: null
  },
  customer: {
    new: false,
    old: false
  },
  empty: true,
  id: {
    new: null,
    old: null
  },
  orders: {
    new: null,
    old: null
  }
}, action) {
  switch(action.type) {
    case "clear_data": {
      state = defaultState;
      break;
    }
    case "set_data": {
      state = {...state,
        address: action.payload.address,
        customer: action.payload.customer,
        empty: action.payload.empty,
        id: action.payload.id,
        orders: action.payload.orders
      };
      break;
    }
  }
  return state;
}