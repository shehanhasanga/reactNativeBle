import Command, {CommandType} from "./Command";

class PauseCommand extends Command {
    private _serviceUUID: string;
    private _characteristicUUID: string
    private _data :string
    constructor(deviceId:string) {
        super(deviceId, CommandType.PAUSE);
        this._serviceUUID = "f0003001-0451-4000-b000-000000000000";
        this._characteristicUUID = "f0003001-0451-4000-b000-000000000000"
    }

    getCommandData(){
        return "AQE="
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

export default PauseCommand;
