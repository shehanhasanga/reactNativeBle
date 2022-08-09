
class TimerService {
    private timer = setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2')
    constructor() {
        this.bleManager =

        this.device = null;
    }
}
const bluetoothLeManager = new TimerService();

export default bluetoothLeManager;
