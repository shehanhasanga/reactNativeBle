import {BleManager} from 'react-native-ble-plx';

class Blemanage {
  private bleManager: BleManager;
  private static _instance: Blemanage;
  constructor() {
    this.bleManager = new BleManager();
  }
    static getInstance() : Blemanage {
        return this._instance || (this._instance = new this());
    }
  scanAndConnect() {
    this.bleManager.startDeviceScan(null, null, (error, device) => {
      console.log('Scanning...');
      console.log(device);
      if (error) {
        console.log(error.message);
        return;
      }
      console.log(device?.name);
      if (
        device?.name === 'SensorTag' ||
        device?.name === 'TI BLE Sensor Tag'
      ) {
        console.log(device);
      }
    });
  }
}

export default Blemanage;
