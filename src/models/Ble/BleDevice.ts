import {DeviceStatus} from './DeviceStatus';

export type BleDevice = {
  id: string;
  name?: string;
  status?: DeviceStatus;
  serviceUUIDs?: Array<string>;
  isSendingCommand?: boolean;
};
