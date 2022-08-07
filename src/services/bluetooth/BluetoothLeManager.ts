/* eslint-disable no-bitwise */
import base64 from 'react-native-base64';
import {BleError, BleManager, Characteristic, Device, Service, State, Subscription,} from 'react-native-ble-plx';
import Command from "../../models/Ble/commands/Command";

const HEART_RATE_UUID = 'f0000005-0451-4000-b000-000000000000';
const HEART_RATE_CHARACTERISTIC = 'f000beef-0451-4000-b000-000000000000';

export interface BLECommand {
  deviceId : string,
  data : string,
  serviceUUID :string,
  characteristicUUID : string
}


class BluetoothLeManager {
  bleManager: BleManager;
  deviceList: Map<string, Device> = new Map<string, Device>();
  device: Device | null;
  adapterSubscription: any

  constructor() {
    this.bleManager = new BleManager();

    this.device = null;
  }


  getBLuetoothState = async (): string => {
    let state: State = await this.bleManager.state()
    return state.toString();
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
    this.deviceList.set(this.device.id, this.device);
    await this.device?.discoverAllServicesAndCharacteristics();
    return this.device;
  };

  onHeartRateUpdate = (
      error: BleError | null,
      characteristic: Characteristic | null,
      emitter: (arg0: { payload: number | BleError }) => void,
  ) => {
    if (error) {
      emitter({payload: error});
    }


    const data = base64.decode(characteristic?.value ?? '');
    let a: string = characteristic?.value?.substring(0, 1);
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
      emitter: (arg0: { payload: number | BleError }) => void,
  ) => {

    this.device?.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        (error, characteristic) =>
            this.onHeartRateUpdate(error, characteristic, emitter),
    );
  };

  startStreamingAdapterStateData = async (
      emitter: (arg0: { payload: string }) => void,
  ) => {
    console.log("got the command to get the streamming data ++++++++++++++++++++++")
    if (this.adapterSubscription) {
      this.adapterSubscription.remove();
    }
    this.adapterSubscription = this.bleManager.onStateChange((state) => {
      emitter({payload: state.toString()});
    }, true);

  };

  removeAdapterSubscription = () => {
    this.adapterSubscription.remove();
  }

  getServicesForDevice = async (deviceId: string) => {
    let servics: Array<Service> = await this.bleManager.servicesForDevice(deviceId);
    return servics;
  }

  getCharateristicsForDevice = async (deviceId: string, serviceUUID: string) => {
    let chars: Array<Characteristic> = await this.bleManager.characteristicsForDevice(deviceId, serviceUUID);
    return chars;
  }

  writeCharacteristicWithResponse = async (command: BLECommand) => {
    let char: Characteristic = await this.bleManager.writeCharacteristicWithResponseForDevice(command.deviceId, command.serviceUUID, command.characteristicUUID, command.data);
    return true;
  }

  readDataFromdDevice = async (deviceIdentifier: string, serviceUUID: string, characteristicUUID: string) => {
    let characteristic: Characteristic = await this.bleManager.readCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID)
    const data = base64.decode(characteristic?.value ?? '');

  }

  readNotificationData =  (command : BLECommand, emitter: (arg0: { payload:any }) => void) : Subscription=> {
    return  this.bleManager.monitorCharacteristicForDevice(command.deviceId, command.serviceUUID, command.characteristicUUID, (error, characteristic) => {
          emitter({
            payload: characteristic?.value
          })
        }
    )
  }

  startDeviceStatusStreamingdata =  (
      emitter: (arg0: { payload: number | BleError }) => void, command : BLECommand
  ) :Subscription => {
    console.log("getting device status ++++++++++++")
    return this.readNotificationData(command , emitter)
  };

}



const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;
