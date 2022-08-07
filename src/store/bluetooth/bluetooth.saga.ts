import {Device, Subscription} from 'react-native-ble-plx';
import {AnyAction} from 'redux';
import {END, eventChannel, TakeableChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {sagaActionConstants} from './bluetooth.reducer';
import bluetoothLeManager, {BLECommand} from '../../services/bluetooth/BluetoothLeManager';
import {actionTypes, getCurrentDeviceStatusData, getDeviceStatusData, sendAckForCommand} from "./actions";
import Ack, {AckType} from "../../models/Ble/Ack";
import Command from "../../models/Ble/commands/Command";
import {sagaAckConstants} from "./command.reducer";
import {ActionCommand, CommandAck, GET_ADAPTER_STATUS, GET_DEVICESTATUS, SEND_COMMAND} from "./bluetooth.types";

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

      yield put({
        type: sagaActionConstants.ON_DEVICE_DISCOVERED,
        payload: {
          id: response.payload.id,
          name: response.payload.name,
          serviceUUIDs: response.payload.serviceUUIDs,
        },
      });
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
  console.log("+++++++++++++++++++++++++++++++++++++++")
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
  let device : Device = yield call(bluetoothLeManager.connectToPeripheral, peripheralId);

  yield put({
    type: sagaActionConstants.CONNECTION_SUCCESS,
    payload: {
      id: device.id,
      name: device.name,
      serviceUUIDs: device.serviceUUIDs,
    },
  });
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
      yield put({
        type: sagaActionConstants.GET_ADAPTER_STATUS_SUCCESS,
        payload: status.payload,
      });
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
  let actioncommand = action.payload
  let bleCommand : BLECommand = convertActionCommandToBleCommand(actioncommand);
  let success = yield call(bluetoothLeManager.writeCharacteristicWithResponse,bleCommand)
  let ack :CommandAck = {deviceId:actioncommand.deviceId, ackType:actioncommand.commandType}
  yield put(sendAckForCommand(ack));
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
      yield put({
        type: sagaActionConstants.GET_DEVICE_UPDATES,
        payload: response.payload,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

export function* bluetoothSaga() {
  yield takeEvery(
    sagaActionConstants.SCAN_FOR_PERIPHERALS,
    watchForPeripherals,
  );
  yield takeEvery(sagaActionConstants.INITIATE_CONNECTION, connectToPeripheral);
  yield takeEvery(sagaActionConstants.STOP_SCAN, stopScanning);
  yield takeEvery(
    sagaActionConstants.START_HEART_RATE_SCAN,
    getHeartRateUpdates,
  );
  yield takeEvery(GET_ADAPTER_STATUS, getAdapterUpdates);
  yield takeEvery(SEND_COMMAND, sendCommand);
  yield takeEvery(GET_DEVICESTATUS, getDeviceStatusUpdates);
}
