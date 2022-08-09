export enum CommandType {
  STOP = 'STOP',
  START = 'START',
  PAUSE = 'PAUSE',
  POWER_OFF = 'POWER_OFF',
  CHANGE_MODE_1 = 'CHANGE_MODE_1',
  CHANGE_MODE_2 = 'CHANGE_MODE_2',
  CHANGE_INTENSITY_1 = 'CHANGE_INTENSITY_1',
  CHANGE_INTENSITY_2 = 'CHANGE_INTENSITY_2',
  CHANGE_INTENSITY_3 = 'CHANGE_INTENSITY_3',
}

const CommandContent = (commandType: CommandType): string => {
    switch (commandType) {
      case CommandType.STOP:

      case CommandType.START:
        return "QVQjU1Q"
      case CommandType.POWER_OFF:
        return "QVQjT0Y"
      case CommandType.PAUSE:
        return "QVQjUFM"
      case CommandType.CHANGE_MODE_2:
        return "QVQjTTI"
      case CommandType.CHANGE_MODE_1:
        return "QVQjTTE"
      case CommandType.CHANGE_INTENSITY_3:
        return "QVQjSTM"
      case CommandType.CHANGE_INTENSITY_2:
        return "QVQjSTI"
      case CommandType.CHANGE_INTENSITY_1:
        return "QVQjSTE"
    }
}

class Command {
  private _deviceId: string;
  private _type: CommandType;
  constructor(deviceId: string, type: CommandType) {
    this._deviceId = deviceId;
    this._type = type;
  }
  getCommandData(): string {
    return CommandContent(this.type);
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get type(): CommandType {
    return this._type;
  }
  get serviceUUID(): string {
    return '0000ae00-0000-1000-8000-00805f9b34fb';
  }

  set serviceUUID(value: string) {}

  get characteristicUUID(): string {
    return '0000ae01-0000-1000-8000-00805f9b34fb';
  }

  set characteristicUUID(value: string) {}
}
export default Command;
