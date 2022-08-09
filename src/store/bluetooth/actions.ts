import Command from '../../models/Ble/commands/Command';
import {
  ActionCommand,
  CommandAck,
  DEVICE_FOUND,
  DeviceFoundAction,
  GET_ADAPTER_STATUS,
  GET_DEVICESTATUS,
  GET_SERVICES_INFO,
  GetAdapterStatus,
  GetDeviceStatusData,
  GetServiceInfo,
  INITIATE_CONNECTION,
  InitiateConnectionAction,
  SEND_ADAPTER_STATUS,
  SEND_COMMAND,
  SEND_COMMAND_ACK,
  SEND_CONNECTION_SUCCESS,
  SEND_DEVICE_STATUS,
  SEND_TIME_VALUE,
  SendAckForCommand,
  SendAdapterStatusAction,
  SendCommand,
  SendConnectSuccessAction,
  SendDeviceStatusAction,
  SendTimerValues,
  START_SCAN_DEVICES,
  START_TIMER,
  StartScanDevicesAction,
  StartTimerAction,
  STOP_SCAN_DEVICES,
  StopScanAction,
} from './bluetooth.types';
import {BleDevice} from '../../models/Ble/BleDevice';

export const getAdapterStatus = (): GetAdapterStatus => {
  return {type: GET_ADAPTER_STATUS};
};

export const getServicesInfo = (deviceId: string): GetServiceInfo => {
  return {type: GET_SERVICES_INFO, payload: deviceId};
};

const convertCommandToActionCommand = (command: Command): ActionCommand => {
  let actionCommand = {
    deviceId: command.deviceId,
    serviceUUID: command.serviceUUID,
    characteristicUUID: command.characteristicUUID,
    data: command.getCommandData(),
    commandType: command.type,
  };
  return actionCommand;
};

export const sendCommand = (command: Command): SendCommand => {
  let actionCommand: ActionCommand = convertCommandToActionCommand(command);
  return {
    type: SEND_COMMAND,
    payload: actionCommand,
  };
};

export const getDeviceStatusData = (command: Command): GetDeviceStatusData => {
  let actionCommand: ActionCommand = convertCommandToActionCommand(command);
  return {
    type: GET_DEVICESTATUS,
    payload: actionCommand,
  };
};

export const getCurrentDeviceStatusData = (
  deviceId: string,
): GetDeviceStatusData => {
  let command: ActionCommand = {
    deviceId: deviceId,
    serviceUUID: '0000ae00-0000-1000-8000-00805f9b34fb',
    characteristicUUID: '0000ae02-0000-1000-8000-00805f9b34fb',
    data: '',
    commandType: 'GET_DEVICESTATUS',
  };
  return {
    type: GET_DEVICESTATUS,
    payload: command,
  };
};

export const sendAckForCommand = (command: CommandAck): SendAckForCommand => {
  return {
    type: SEND_COMMAND_ACK,
    payload: command,
  };
};

// adapter actions
export const startScanDevicesAction = (): StartScanDevicesAction => {
  return {
    type: START_SCAN_DEVICES,
  };
};

export const stopScanAction = (): StopScanAction => {
  return {
    type: STOP_SCAN_DEVICES,
  };
};



export const initiateConnectionAction = (
  deviceId: string,
): InitiateConnectionAction => {
  return {
    type: INITIATE_CONNECTION,
    payload: deviceId,
  };
};


// saga initiated actions
export const sendConnectSuccessAction = (
  device: BleDevice,
): SendConnectSuccessAction => {
  return {
    type: SEND_CONNECTION_SUCCESS,
    payload: device,
  };
};

export const deviceFoundAction = (device: BleDevice): DeviceFoundAction => {
    return {
        type: DEVICE_FOUND,
        payload: device,
    };
};

export const sendDeviceStatusAction = (
  device: BleDevice,
): SendDeviceStatusAction => {
  return {
    type: SEND_DEVICE_STATUS,
    payload: device,
  };
};

export const sendAdapterStatusAction = (
    status: string,
): SendAdapterStatusAction => {
  return {
    type: SEND_ADAPTER_STATUS,
    payload: status,
  };
};

export const startTimerAction = (
    timeout: number, enable : boolean
): StartTimerAction => {
  return {
    type: START_TIMER,
    payload: {timeout,enable },
  };
};

export const sendTimeValues = (
    time: number,
): SendTimerValues => {
  return {
    type: SEND_TIME_VALUE,
    payload: time,
  };
};
