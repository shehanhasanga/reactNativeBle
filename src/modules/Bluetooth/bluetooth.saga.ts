import {Device} from 'react-native-ble-plx';
import {AnyAction} from 'redux';
import {END, eventChannel, TakeableChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {sagaActionConstants} from './bluetooth.reducer';
import bluetoothLeManager from './BluetoothLeManager';
import {BluetoothPeripheral} from "../../models/BluetoothPeripheral";
import {actionTypes} from "./actions/bleActions";

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
  yield takeEvery(actionTypes.ADAPTER_STATUS, getAdapterUpdates);
}
