import Command from "../../models/Ble/commands/Command";
import {
    ActionCommand, CommandAck,
    GET_ADAPTER_STATUS,
    GET_DEVICESTATUS,
    GET_SERVICES_INFO,
    GetAdapterStatus,
    GetDeviceStatusData,
    GetServiceInfo,
    SEND_COMMAND, SEND_COMMAND_ACK, SendAckForCommand,
    SendCommand
} from "./bluetooth.types";

export const getAdapterStatus = ():GetAdapterStatus => {
    return {type : GET_ADAPTER_STATUS}
}

export const getServicesInfo = (deviceId : string): GetServiceInfo => {
    return {type : GET_SERVICES_INFO , payload : deviceId}
};

const convertCommandToActionCommand = (command: Command) : ActionCommand => {
    let actionCommand = {
        deviceId : command.deviceId,
        serviceUUID : command.serviceUUID,
        characteristicUUID : command.characteristicUUID,
        data : command.getCommandData(),
        commandType : command.type
    }
    return actionCommand;
}

export const sendCommand = (command: Command) : SendCommand => {
    let actionCommand : ActionCommand = convertCommandToActionCommand(command)
    return {
        type : SEND_COMMAND,
        payload :actionCommand
    }
};

export const getDeviceStatusData = (command: Command) : GetDeviceStatusData   => {
    let actionCommand :  ActionCommand = convertCommandToActionCommand(command)
    return {
        type: GET_DEVICESTATUS,
        payload :actionCommand
    }
}

export const getCurrentDeviceStatusData = (deviceId: string) : GetDeviceStatusData   => {
    let command:ActionCommand  =  {
        deviceId : deviceId,
        serviceUUID : "0000ae00-0000-1000-8000-00805f9b34fb",
        characteristicUUID : "0000ae02-0000-1000-8000-00805f9b34fb",
        data : "",
        commandType : "GET_DEVICESTATUS"

    }
    return {
        type: GET_DEVICESTATUS,
        payload :command
    }
}

export const sendAckForCommand = (command: CommandAck) : SendAckForCommand   => {
    return {
        type: SEND_COMMAND_ACK,
        payload :command
    }
}
