import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BluetoothPeripheral} from '../../models/BluetoothPeripheral';

type BluetoothState = {
  availableDevices: Array<BluetoothPeripheral>;
  isConnectingToDevice: boolean;
  connectedDevice: string | null;
  connectedDeviceList : Array<BluetoothPeripheral>;
  heartRate: number;
  isRetrievingHeartRateUpdates: boolean;
  isScanning: boolean;
  adapterStatus : String;
  deviceStatus: String;
};

const initialState: BluetoothState = {
  availableDevices: [],
  isConnectingToDevice: false,
  connectedDevice: null,
  connectedDeviceList :[],
  heartRate: 0,
  isRetrievingHeartRateUpdates: false,
  isScanning: false,
  adapterStatus : '',
  deviceStatus : '',
};

const bluetoothReducer = createSlice({
  name: 'bluetooth',
  initialState: initialState,
  reducers: {
    scanForPeripherals: state => {
      state.isScanning = true;
    },
    stopScanForPeripherals: state => {
      state.isScanning = false;
    },
    initiateConnection: (state, _) => {
      state.isConnectingToDevice = true;
      state.availableDevices = Array<BluetoothPeripheral>();
    },
    connectPeripheral: (state, action: PayloadAction<BluetoothPeripheral>) => {
      state.isConnectingToDevice = false;
      state.connectedDevice = action.payload.id;
      state.connectedDeviceList.push(action.payload);
    },
    updateHeartRate: (state, action) => {
      state.heartRate = action.payload;
    },
    getAdapterStatusSuccess: (state, action: PayloadAction<string>) => {
      state.adapterStatus = action.payload;
    },
    startHeartRateScan: state => {
      state.isRetrievingHeartRateUpdates = true;
    },

    bluetoothPeripheralsFound: (
      state: BluetoothState,
      action: PayloadAction<BluetoothPeripheral>,
    ) => {
      // Ensure no duplicate devices are added
      const isDuplicate = state.availableDevices.some(
        device => device.id === action.payload.id,
      );
      const isCorsenseMonitor = action.payload?.name
        ?.toLowerCase()
        ?.includes('corsense');
      if (!isDuplicate ) {
        state.availableDevices = state.availableDevices.concat(action.payload);
      }
    },

    getDeviceStatusData: (state, action:PayloadAction<string>) => {
      state.deviceStatus = action.payload;
    },

  },
});

export const {
  bluetoothPeripheralsFound,
  scanForPeripherals,
  initiateConnection,
  startHeartRateScan,
  stopScanForPeripherals,
  getAdapterStatusSuccess,
} = bluetoothReducer.actions;

export const sagaActionConstants = {
  SCAN_FOR_PERIPHERALS: bluetoothReducer.actions.scanForPeripherals.type,
  STOP_SCAN: bluetoothReducer.actions.stopScanForPeripherals.type,
  ON_DEVICE_DISCOVERED: bluetoothReducer.actions.bluetoothPeripheralsFound.type,
  INITIATE_CONNECTION: bluetoothReducer.actions.initiateConnection.type,
  CONNECTION_SUCCESS: bluetoothReducer.actions.connectPeripheral.type,
  UPDATE_HEART_RATE: bluetoothReducer.actions.updateHeartRate.type,
  START_HEART_RATE_SCAN: bluetoothReducer.actions.startHeartRateScan.type,
  GET_ADAPTER_STATUS_SUCCESS: bluetoothReducer.actions.getAdapterStatusSuccess.type,
  GET_DEVICE_UPDATES : bluetoothReducer.actions.getDeviceStatusData.type,
};

export default bluetoothReducer;
