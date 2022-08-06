import {actionTypes} from "../actions/bleActions";

const blereducer = (state = {}, action) => {

    switch(action.type){
        case actionTypes.ADAPTER_STATUS:
            return {
                ...state,
                user: action.payload,
                loggedIn: true
            }
        default:
            return state
    }
}

export default blereducer;
