/* eslint-disable no-bitwise */
import base64 from 'react-native-base64';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';

const HEART_RATE_UUID = 'f0000005-0451-4000-b000-000000000000';
const HEART_RATE_CHARACTERISTIC = 'f000beef-0451-4000-b000-000000000000';

class BluetoothLeManager {
  bleManager: BleManager;
  device: Device | null;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }



  scanForPeripherals = (
    onDeviceFound: (arg0: {
      type: string;
      payload: BleError | Device | null;
    }) => void,
  ) => {
    this.bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      onDeviceFound({type: 'SAMPLE', payload: scannedDevice ?? error});
      return;
    });
    return () => {
      this.bleManager.stopDeviceScan();
    };
  };

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  connectToPeripheral = async (identifier: string) => {
    this.device = await this.bleManager.connectToDevice(identifier);
  };

  onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (arg0: {payload: number | BleError}) => void,
  ) => {
    if (error) {
      emitter({payload: error});
    }



    const data = base64.decode(characteristic?.value ?? '');
    let a :string = characteristic?.value?.substring(0,1);
    a = "0x" + a;
    console.log(Number(a))
    console.log(a)
    console.log("value received ++++++++++++++++++")
    let heartRate: number = -1;

    const firstBitValue: number = (<any>data[0]) & 0x01;

    if (firstBitValue === 0) {
      heartRate = data[1].charCodeAt(0);
    } else {
      heartRate =
        Number(data[1].charCodeAt(0) << 8) + Number(data[2].charCodeAt(2));
    }

    emitter({payload: Number(a)});
  };

  startStreamingData = async (
    emitter: (arg0: {payload: number | BleError}) => void,
  ) => {
    await this.device?.discoverAllServicesAndCharacteristics();
    this.device?.monitorCharacteristicForService(
      HEART_RATE_UUID,
      HEART_RATE_CHARACTERISTIC,
      (error, characteristic) =>
        this.onHeartRateUpdate(error, characteristic, emitter),
    );
  };
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;
