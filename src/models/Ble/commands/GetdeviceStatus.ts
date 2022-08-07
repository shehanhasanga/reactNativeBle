import Command, {CommandType} from "./Command";

class GetdeviceStatusCommand extends Command {
    private _serviceUUID: string;
    private _characteristicUUID: string
    private _data :string
    constructor(deviceId:string) {
        super(deviceId, CommandType.PAUSE);
        this._serviceUUID = "f0000005-0451-4000-b000-000000000000";
        this._characteristicUUID = "f000beef-0451-4000-b000-000000000000"
    }

    getCommandData(){
        return "AQEB"
    }

    get serviceUUID(): string {
        return this._serviceUUID;
    }

    set serviceUUID(value: string) {
        this._serviceUUID = value;
    }

    get characteristicUUID(): string {
        return this._characteristicUUID;
    }

    set characteristicUUID(value: string) {
        this._characteristicUUID = value;
    }
}

export default GetdeviceStatusCommand;
