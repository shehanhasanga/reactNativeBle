import {Device, Subscription} from 'react-native-ble-plx';
import {AnyAction} from 'redux';
import {END, eventChannel, TakeableChannel} from 'redux-saga';
import {call, put, take, takeEvery,cancelled, takeLatest,fork } from 'redux-saga/effects';
import {sagaActionConstants} from './bluetooth.reducer';
import bluetoothLeManager, {BLECommand} from '../../services/bluetooth/BluetoothLeManager';
import {
  actionTypes,
  deviceFoundAction,
  getCurrentDeviceStatusData,
  sendAckForCommand, sendAdapterStatusAction, sendConnectSuccessAction, sendDeviceStatusAction, sendTimeValues
} from "./actions";
import {
  ActionCommand,
  CommandAck,
  GET_ADAPTER_STATUS,
  GET_DEVICESTATUS, INITIATE_CONNECTION,
  SEND_COMMAND,
  START_SCAN_DEVICES, START_TIMER, StartTimerAction, STOP_SCAN_DEVICES
} from "./bluetooth.types";
import {BleDevice} from "../../models/Ble/BleDevice";
import {enable} from "react-native-bluetooth-state-manager";
import {RootState, store} from '../store';

type TakeableDevice = {
  payload: {id: string; name: string; serviceUUIDs: string};
  take: (cb: (message: any | END) => void) => Device;
};

type TakeableHeartRate = {
  payload: {};
  take: (cb: (message: any | END) => void) => string;
};

function* watchForPeripherals(): Generator<AnyAction, void, TakeableDevice> {
  const onDiscoveredPeripheral = () =>
    eventChannel(emitter => {
      return bluetoothLeManager.scanForPeripherals(emitter);
    });

  const channel: TakeableChannel<Device> = yield call(onDiscoveredPeripheral);

  try {
    while (true) {
      const response = yield take(channel);
      let bleDevice: BleDevice = {
        id : response.payload.id,
        name : response.payload.name
      }
      yield put(deviceFoundAction(bleDevice));
    }
  } catch (e) {
    console.log(e);
  }
}

function* stopScanning(action: {
  type: typeof sagaActionConstants.STOP_SCAN;
  payload: string;
}) {
  yield call(bluetoothLeManager.stopScanningForPeripherals);
}

function* getAdapterStatus(action: {
  type: typeof actionTypes.ADAPTER_STATUS;
  payload: string;
}) {
  let status:string = yield call(bluetoothLeManager.getBLuetoothState);
  yield put({
    type: sagaActionConstants.GET_ADAPTER_STATUS_SUCCESS,
    payload: status,
  });
}


function* connectToPeripheral(action: {
  type: typeof sagaActionConstants.INITIATE_CONNECTION;
  payload: string;
}) {
  const peripheralId = action.payload;
  let device: Device = yield call(bluetoothLeManager.connectToPeripheral, peripheralId);
  let bleDevice: BleDevice = {
    id: device.id,
    name: device.name ? device.name : '',
  }
  yield put(sendConnectSuccessAction(bleDevice))
  yield call(bluetoothLeManager.stopScanningForPeripherals);
  yield put(getCurrentDeviceStatusData(device.id));
}

function* getAdapterUpdates() {
  const onAdapterSatteUpdate = () =>
      eventChannel(emitter => {
        bluetoothLeManager.startStreamingAdapterStateData(emitter);
        return () => {
          bluetoothLeManager.removeAdapterSubscription();
        };
      });

  const channel: TakeableChannel<string> = yield call(onAdapterSatteUpdate);
  try {
    while (true) {
      const status = yield take(channel);
      yield put(sendAdapterStatusAction(status.payload));
    }
  } catch (e) {
    console.log(e);
  }
}

 const convertActionCommandToBleCommand = (actionCommand: ActionCommand) : BLECommand => {
 let bleCommand : BLECommand = {
   deviceId : actionCommand.deviceId,
   serviceUUID : actionCommand.serviceUUID,
   characteristicUUID : actionCommand.characteristicUUID,
   data : actionCommand.data
 }
 return bleCommand;
}

function* sendCommand(action: {
  type: typeof SEND_COMMAND;
  payload: ActionCommand;
}) {
  console.log("store state from the saga ++++++++++")
  console.log(store.getState().bluetooth)
  console.log("got the command request ++++++++++++++++++++++++++++++++" + action.payload.commandType)
  let actioncommand = action.payload
  let bleCommand : BLECommand = convertActionCommandToBleCommand(actioncommand);
  let success = yield fork(bluetoothLeManager.writeCharacteristicWithResponse,bleCommand)
  // let ack :CommandAck = {deviceId:actioncommand.deviceId, ackType:actioncommand.commandType}
  // yield put(sendAckForCommand(ack));
}


function* getHeartRateUpdates(): Generator<AnyAction, void, TakeableHeartRate> {
  const onHeartrateUpdate = () =>
    eventChannel(emitter => {
      bluetoothLeManager.startStreamingData(emitter);

      return () => {
        bluetoothLeManager.stopScanningForPeripherals();
      };
    });

  const channel: TakeableChannel<string> = yield call(onHeartrateUpdate);

  try {
    while (true) {
      const response = yield take(channel);
      yield put({
        type: sagaActionConstants.UPDATE_HEART_RATE,
        payload: response.payload,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getDeviceStatusUpdates(action: {
  type: typeof GET_DEVICESTATUS;
  payload: ActionCommand;
}) {
  let bleCommand = convertActionCommandToBleCommand(action.payload)
  const onStatusUpdate = () =>
      eventChannel(emitter => {
        let subscription :Subscription = bluetoothLeManager.startDeviceStatusStreamingdata(emitter, bleCommand);

        return () => {
          subscription.remove();
        };
      });

  const channel: TakeableChannel<string> = yield call(onStatusUpdate);

  try {
    while (true) {
      const response = yield take(channel);
      yield put(sendDeviceStatusAction(response.payload));
      // yield put({
      //   type: sagaActionConstants.GET_DEVICE_UPDATES,
      //   payload: response.payload,
      // });
    }
  } catch (e) {
    console.log(e);
  }
}

function countdown(secs) {
  return eventChannel(emitter => {
        const iv = setInterval(() => {
          secs -= 1
          if (secs > 0) {
            emitter(secs)
          } else {
            // this causes the channel to close
            emitter(END)
          }
        }, 1000);
        // The subscriber must return an unsubscribe function
        return () => {
          clearInterval(iv)
        }
      }
  )
}

export function* timerSaga(action: {
  type: typeof START_TIMER;
  payload: {timeout: number , enable : boolean};
}) {
  console.log("timer started")
  console.log(action.payload)
  if(action.payload.enable){
    const chan:any = yield call(countdown, action.payload.timeout)
    try {
      while (true) {
        // take(END) will cause the saga to terminate by jumping to the finally block
        let seconds = yield take(chan)
        yield put(sendTimeValues(seconds))

      }
    } finally {
      if (yield cancelled()) {
        chan.close()
        console.log('countdown cancelled')
      }
    }
  }

}


export function* bluetoothSaga() {
  yield takeEvery(
      START_SCAN_DEVICES,
    watchForPeripherals,
  );
  yield takeEvery(INITIATE_CONNECTION, connectToPeripheral);
  yield takeEvery(STOP_SCAN_DEVICES, stopScanning);
  yield takeEvery(
    sagaActionConstants.START_HEART_RATE_SCAN,
    getHeartRateUpdates,
  );
  yield takeEvery(GET_ADAPTER_STATUS, getAdapterUpdates);
  yield takeEvery(SEND_COMMAND, sendCommand);
  yield takeEvery(GET_DEVICESTATUS, getDeviceStatusUpdates);

  yield takeLatest(START_TIMER, timerSaga);
}
