
export enum CommandType {
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

class Command {

    private _deviceId: string;
    private _type : CommandType;
    constructor(deviceId:string, type :CommandType) {
        this._deviceId = deviceId;
        this._type = type
    }
    getCommandData(): string{

    }

    get deviceId(): string {
        return this._deviceId;
    }

    get type(): CommandType {
        return this._type;
    }
    get serviceUUID(): string {
        return '';
    }

    set serviceUUID(value: string) {

    }

    get characteristicUUID(): string {
        return '';
    }

    set characteristicUUID(value: string) {

    }
}
export default Command;
