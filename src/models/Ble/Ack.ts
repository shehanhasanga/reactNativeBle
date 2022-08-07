

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
class Ack {
    private deviceId: string;
    private type : AckType;

    constructor(deviceId: string, type: AckType) {
        this.deviceId = deviceId;
        this.type = type;
    }


    getdeviceId(): string {
        return this.deviceId;
    }

    setdeviceId(value: string) {
        this.deviceId = value;
    }

    gettype(): AckType {
        return this.type;
    }

    settype(value: AckType) {
        this.type = value;
    }
}
export default Ack;
