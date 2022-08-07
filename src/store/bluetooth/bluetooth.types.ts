export const GET_ADAPTER_STATUS = 'ADAPTER_STATUS';
export const GET_SERVICES_INFO = 'GET_SERVICES_INFO';
export const SEND_COMMAND = 'SEND_COMMAND';
export const GET_DEVICESTATUS = 'GET_DEVICESTATUS';
export const SEND_COMMAND_ACK = 'SEND_COMMAND_ACK'
export enum AckType {
    STOP = 'STOP',
    START = 'START',
    PAUSE = 'PAUSE',
    POWER_OFF = 'POWER_OFF',
    CHANGE_MODE_1 = 'CHANGE_MODE_1',
    CHANGE_MODE_2 = 'CHANGE_MODE_2',
    CHANGE_INTENSITY_1 = 'CHANGE_INTENSITY_1',
    CHANGE_INTENSITY_2 = 'CHANGE_INTENSITY_2',
    CHANGE_INTENSITY_3 = 'CHANGE_INTENSITY_3'
}


export interface ActionCommand {
    deviceId : string,
    data : string,
    serviceUUID :string,
    characteristicUUID : string,
    commandType: string
}

export interface CommandAck {
    deviceId : string,
    ackType: string
}

export interface GetAdapterStatus {
    type: typeof GET_ADAPTER_STATUS;
}

export interface GetServiceInfo {
    type: typeof GET_SERVICES_INFO;
    payload : string
}

export interface SendCommand {
    type: typeof SEND_COMMAND;
    payload : ActionCommand
}

export interface GetDeviceStatusData {
    type: typeof GET_DEVICESTATUS;
    payload : ActionCommand
}

export type BluetoothActionTypes =
    | GetAdapterStatus
    | GetServiceInfo
    | SendCommand
    | GetDeviceStatusData
    | SendAckForCommand

export interface SendAckForCommand {
    type: typeof SEND_COMMAND_ACK;
    payload : CommandAck
}
