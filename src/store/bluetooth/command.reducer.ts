// import Ack from "../../models/Ble/Ack";
// import {createSlice} from "@reduxjs/toolkit";
// import {PayloadAction} from "@reduxjs/toolkit/dist/createAction";
// import {END} from "redux-saga";
// import {Device} from "react-native-ble-plx";
// import {CommandAck} from "./bluetooth.types";
//
//
//
// type CommandState = {
//   pauseCommandAcks: Array<CommandAck>
// };
//
// const initialState: CommandState = {
//   pauseCommandAcks: new Array()
// };
//
// const commandReducer = createSlice({
//   name: 'commandReducer',
//   initialState: initialState,
//   reducers: {
//     sendPauseCommandAck: (state,action:PayloadAction<CommandAck>) => {
//       console.log("pause command ack is received +++++++++++++")
//       let deviceId = action.payload.deviceId
//       const isDuplicate = state.pauseCommandAcks.some(
//           ack => ack.deviceId === deviceId
//       );
//       if(!isDuplicate){
//         state.pauseCommandAcks.push(action.payload);
//       } else {
//         let index = state.pauseCommandAcks.findIndex((ack:CommandAck) => ack.deviceId == deviceId)
//         state.pauseCommandAcks[index] = action.payload
//       }
//
//     }
//   },
// });
//
// export const {
//   sendPauseCommandAck,
// } = commandReducer.actions;
//
// export const sagaAckConstants = {
//   PAUSE_ACK: commandReducer.actions.sendPauseCommandAck.type,
// };
//
// export default commandReducer;
