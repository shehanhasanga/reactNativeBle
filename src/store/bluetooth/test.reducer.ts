import {BluetoothActionTypes, CommandAck, GET_ADAPTER_STATUS, SEND_COMMAND_ACK} from "./bluetooth.types";

export interface TestState {
    pauseCommandAcks:any
}

const  initialState : TestState = {
    pauseCommandAcks : ''
}

const testReducer = (state : TestState = initialState, action : BluetoothActionTypes): TestState => {
    switch (action.type) {
        case GET_ADAPTER_STATUS:
            return state;
        case SEND_COMMAND_ACK:
            if(action.payload.ackType == 'PAUSE'){
                console.log("acks recived for new test++++++++++")
                return {
                    ...state,
                    pauseCommandAcks: action.payload
                }
            } else {
                console.log("acks recived for new test++++++++++")
            }
        default :
            return state
    }
}

export default testReducer;
