import {Device} from 'react-native-ble-plx';
import {AnyAction} from 'redux';
import {END, eventChannel, TakeableChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {sagaActionConstants} from './bluetooth.reducer';
import bluetoothLeManager from './BluetoothLeManager';

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

function* connectToPeripheral(action: {
  type: typeof sagaActionConstants.INITIATE_CONNECTION;
  payload: string;
}) {
  const peripheralId = action.payload;
  yield call(bluetoothLeManager.connectToPeripheral, peripheralId);
  yield put({
    type: sagaActionConstants.CONNECTION_SUCCESS,
    payload: peripheralId,
  });
  yield call(bluetoothLeManager.stopScanningForPeripherals);
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
  yield takeEvery(
    sagaActionConstants.START_HEART_RATE_SCAN,
    getHeartRateUpdates,
  );
}
