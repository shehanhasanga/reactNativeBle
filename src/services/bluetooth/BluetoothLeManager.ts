
import base64 from 'react-native-base64';
import {BleError, BleManager, Characteristic, Device, Service, State, Subscription,} from 'react-native-ble-plx';
import {DeviceStatus} from "../../models/Ble/DeviceStatus";
import {BleDevice} from "../../models/Ble/BleDevice";
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
    const firstBitValue: number = (<any>data[0]) & 0x01;
    let a: string = characteristic?.value?.substring(0, 1);
    a = "0x" + a;
    console.log(Number(a))
    console.log(a)
    console.log("value received ++++++++++++++++++")
    let heartRate: number = -1;



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

   base64ToBytesArr = (str) => {
     const abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]; // base64 alphabet
     let result = [];

     for (let i = 0; i < str.length / 4; i++) {
       let chunk = [...str.slice(4 * i, 4 * i + 4)]
       let bin = chunk.map(x => abc.indexOf(x).toString(2).padStart(6, 0)).join('');
       let bytes = bin.match(/.{1,8}/g).map(x => +('0b' + x));
       result.push(...bytes.slice(0, 3 - (str[4 * i + 2] == "=") - (str[4 * i + 3] == "=")));
     }
     return result;
   }

  readNotificationData = (command : BLECommand, emitter: (arg0: { payload:any }) => void) : Subscription=> {
    return  this.bleManager.monitorCharacteristicForDevice(command.deviceId, command.serviceUUID, command.characteristicUUID, (error, characteristic) => {
      const data = base64.decode(characteristic?.value ?? '');
      let udata  = this.base64ToBytesArr(characteristic?.value)
      let stringArray = ""
      let deviceStatus : DeviceStatus = {
        pressureTop : udata[0] * 256  + udata[1],
        batteryVal : udata[2],
        pressureMid : udata[3] * 256 + udata[4],
        unidentified_1 : udata[5],
        pressureLow : udata[6] * 256 + udata[7],
        pwmTop : udata[8],
        pwmMid : udata[9],
        pwmLow : udata[10],
        keepWorkTime : udata[11] * 256 + udata[12],
        apWorkMode : udata[13],
        intensityFlag : udata[14] - 1,
        modeStep : udata[15],
        stepTime : udata[16],
        pauseFlag : udata[17],
        }
        let bleDevice : BleDevice = {
          id : command.deviceId,
          status : deviceStatus
        }
          emitter({
            payload: bleDevice
          })
        }
    )
  }

  startDeviceStatusStreamingdata =  (
      emitter: (arg0: { payload: number | BleError }) => void, command : BLECommand
  ) :Subscription => {
    return this.readNotificationData(command , emitter)
  };

}



const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;
