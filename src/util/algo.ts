class Algo {
    private static sensorDF: number = 0
    private static distanceDF: number = 0
    private static sdf: Date = new Date()

    private static randomGenerator: number = 0.0
    // private randomGenerator: number = Math.random()
    private static GRADUATED_MODE : number = 0;
    private static PULSATED_MODE : number = 1;

    private static m:number[][][] = [[[1.62, 1.775, 1.758], [1.62, 1.775, 1.758]],
                                    [[1.62, 1.775, 1.758], [1.62, 1.775, 1.758]] ,
                                [[1.62, 1.775, 1.758], [1.62, 1.775, 1.758]]]


    private static c:number[][][] = [
        [[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0]]
    ]
    private static max_val :number = 110.0;


    private static max_mmhg:number[][][] = [
        [[30, 40 , 50],[40, 50, 70 ]],
        [[60, 70 , 80],[50, 70, 90]],
        [[90, 100, 110],[70, 90, 110]]
    ]


    private static min_val :number = 20;

    private static min_mmhg:number[][][] = [
        [[20, 20, 20],[20, 20, 19]],
        [[20, 20, 20],[20, 20, 20]],
        [[20, 20, 20],[20, 20, 19]]
    ]
    private static max_x:number[][][] = [
        [[0, 0, 0],[0, 0, 0]],  [[0, 0, 0],[0, 0, 0]] ,
        [[0, 0, 0],[0, 0, 0]],  [[0, 0, 0],[0, 0, 0]] ,
        [[0, 0, 0],[0, 0, 0]] , [[0, 0, 0],[0, 0, 0]]
    ]
    private static min_x:number[][][] = [
        [[65536, 65536, 65536],[65536, 65536, 65536]],  [[65536, 65536, 65536],[65536, 65536, 65536]] ,
        [[65536, 65536, 65536],[65536, 65536, 65536]],  [[65536, 65536, 65536],[65536, 65536, 65536]] ,
        [[65536, 65536, 65536],[65536, 65536, 65536]] , [[65536, 65536, 65536],[65536, 65536, 65536]]
    ]

    public static sensor2mmhg = (intensity: number, mode: number, sensorIndex:number, pressure:number): number => {
        if (pressure < 0) {
            return 60.0;
        }
        if (pressure < Algo.min_x[intensity][mode][sensorIndex]) {
            Algo.min_x[intensity][mode][sensorIndex] = pressure;
        }  else if (pressure > Algo.max_x[intensity][mode][sensorIndex]) {
            Algo.max_x[intensity][mode][sensorIndex] = pressure;
        } else {
            return pressure * Algo.m[intensity][mode][sensorIndex] + Algo.c[intensity][mode][sensorIndex] + Algo.randomDouble(-1, 1);
        }

         const denominator :number = Algo.min_x[intensity][mode][sensorIndex] - Algo.max_x[intensity][mode][sensorIndex];
        if (denominator == 0) {
            return 60.0;
        }
        Algo.m[intensity][mode][sensorIndex] = (Algo.min_mmhg[intensity][mode][sensorIndex] - Algo.max_mmhg[intensity][mode][sensorIndex]) / denominator;
        Algo.c[intensity][mode][sensorIndex] = Algo.min_mmhg[intensity][mode][sensorIndex] - Algo.m[intensity][mode][sensorIndex] * Algo.min_x[intensity][mode][sensorIndex];
        return Algo.sensor2mmhg(intensity, mode, sensorIndex, pressure);

    }

    private static step_max:number[][] = [
        [45, 45, 20, 67, 101, 25],
        [48, 48, 14, 66, 99, 28],
        [48, 48, 17, 67, 100, 28]
    ]

    private static step_cum_grad:number[] = [0, 47, 93, 111, 178, 278, 305]
    private static step_cum_pulse:number[] = [0, 46, 107, 204, 297, 325, 340, 359, 382]
    private static mid_mmhg:number[] = [30, 40, 50]
    private static mode_map:number[] = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]
    private static t_:number = 0
    private static st_:number = 0

    public static sensor2mmhgIdeal2 = (intensity: number, mode: number, sensorIndex:number, pressure:number,modeStep: number, stepTime: number): number => {
        const min_val:number = Algo.min_mmhg[intensity][mode][sensorIndex] + Algo.randomDouble(-1, 1);
        const max_val:number = Algo.max_mmhg[intensity][mode][sensorIndex] + Algo.randomDouble(-1, 1);
        if (mode == Algo.GRADUATED_MODE) {
            const t:number = Algo.step_cum_grad[modeStep] + stepTime;
            if (modeStep == 0) {
                return Algo.linear(max_val, min_val, t, 61);
            }
            if (sensorIndex == 0) {
                if (t <= 159) {
                    return min_val;
                } else if (t > 268) {
                    return max_val;
                } else {
                    return Algo.linear(min_val, max_val, t-159, 268-159);
                }
            }else if (sensorIndex == 1) {
                if (t <= 110) {
                    return min_val;
                } else  if (t > 220){
                    return max_val;
                } else {
                    return Algo.linear(min_val, max_val, t-110, 220-110);
                }
            } else if (sensorIndex == 2) {
                if (t <= 61) {
                    return min_val;
                } else if (t > 183) {
                    return max_val;
                } else {
                    return Algo.linear(min_val, max_val, t-61, 183-61);
                }
            }
        } else if (mode == Algo.PULSATED_MODE) {
            modeStep = Algo.mode_map[modeStep];
            if (Algo.st_ != modeStep) {
                if (modeStep == 0) {
                    Algo.step_cum_pulse[8] = Algo.step_cum_pulse[7] + Algo.t_;
                } else {
                    Algo.step_cum_pulse[modeStep] = Algo.step_cum_pulse[modeStep - 1] + Algo.t_;
                }
                Algo.t_ = 0;
            }
            Algo.st_ = modeStep;
            if (stepTime > Algo.t_) {
                Algo.t_ = stepTime;
            }
            const t:number = Algo.step_cum_pulse[modeStep] + stepTime;
            const mid_val:number = (sensorIndex == 0
                ? Algo.mid_mmhg[intensity] + Algo.randomDouble(-1, 1)
                : Algo.max_mmhg[intensity][mode][sensorIndex-1])
                + Algo.randomDouble(-1, 1);
            if (modeStep == 0) {
                return Algo.linear(Algo.max_mmhg[intensity][mode][0], min_val, t, Algo.step_cum_pulse[1]);
            }
            if (sensorIndex == 0) {
                if (modeStep <= 2) {
                    return min_val;
                } else if (modeStep == 3) {
                    return Algo.linear(min_val, max_val, t-Algo.step_cum_pulse[3], Algo.step_cum_pulse[4]-Algo.step_cum_pulse[3]);
                } else if (modeStep == 4) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[4], Algo.step_cum_pulse[5]-Algo.step_cum_pulse[4]);
                } else if (modeStep == 5) {
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[5], Algo.step_cum_pulse[6]-Algo.step_cum_pulse[5]);
                } else if (modeStep == 6) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[6], Algo.step_cum_pulse[7]-Algo.step_cum_pulse[6]);
                } else {  // if (t <= 610)
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[7], Algo.step_cum_pulse[8]-Algo.step_cum_pulse[7]);
                }
            } else if (sensorIndex == 1) {
                if (modeStep == 1) {
                    return min_val;
                } else if (modeStep == 2) {
                    return Algo.linear(min_val, max_val, t-Algo.step_cum_pulse[2], Algo.step_cum_pulse[3]-Algo.step_cum_pulse[2]);
                } else if (modeStep == 3) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[3], Algo.step_cum_pulse[4]-Algo.step_cum_pulse[3]);
                } else if (modeStep == 4) {
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[4], Algo.step_cum_pulse[5]-Algo.step_cum_pulse[4]);
                } else if (modeStep == 5) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[5], Algo.step_cum_pulse[6]-Algo.step_cum_pulse[5]);
                } else if (modeStep == 6) {
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[6], Algo.step_cum_pulse[7]-Algo.step_cum_pulse[6]);
                } else {  // if (t <= 610)
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[7], Algo.step_cum_pulse[8]-Algo.step_cum_pulse[7]);
                }
            } else if (sensorIndex == 2) {
                if (modeStep == 1) {
                    return Algo.linear(min_val, max_val, t-Algo.step_cum_pulse[1], Algo.step_cum_pulse[2]-Algo.step_cum_pulse[1]);
                } else if (modeStep == 2) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[2], Algo.step_cum_pulse[3]-Algo.step_cum_pulse[2]);
                } else if (modeStep == 3) {
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[3], Algo.step_cum_pulse[4]-Algo.step_cum_pulse[3]);
                } else if (modeStep == 4) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[4], Algo.step_cum_pulse[5]-Algo.step_cum_pulse[4]);
                } else if (modeStep == 5) {
                    return Algo.linear(mid_val, max_val, t-Algo.step_cum_pulse[5], Algo.step_cum_pulse[6]-Algo.step_cum_pulse[5]);
                } else if (modeStep == 6) {
                    return Algo.linear(max_val, mid_val, t-Algo.step_cum_pulse[6], Algo.step_cum_pulse[7]-Algo.step_cum_pulse[6]);
                } else {  // if (t <= 610)
                    return Algo.linear(mid_val, Algo.max_mmhg[intensity][mode][1], t-Algo.step_cum_pulse[7], Algo.step_cum_pulse[8]-Algo.step_cum_pulse[7]);
                }
            }
        }
        return 60.0;
    }

    public static linear = (min_val: number, max_val: number,  t :number,  max_t :number) : number=> {
        const val:number = (max_val - min_val) * t / max_t + min_val;
        if (max_val < min_val) {
            if (val > min_val) {
                return min_val;
            }
            if (val < max_val) {
                return max_val;
            }
            return val;
        }
        if (val < min_val) {
            return min_val;
        }
        if (val > max_val) {
            return max_val;
        }
        return val;
    }
    public static randomDouble = (min_val : number,  max_val : number) => {
        const rand:number = Math.random()
        return rand * (max_val - min_val) + min_val;
    }

    public static getAlpha = ( mmhg : number) => {
        const alpha:number = (mmhg - Algo.min_val) / (Algo.max_val - Algo.min_val) * 0.9 + 0.1;
        if (alpha < 0.1) {
            return 0.1;
        }
        if (alpha > 1.0) {
            return 1.0;
        }
        return  alpha;
    }

    private static pre_battery : number = -1;
    private static battery_i : number = 0;
    private static battery_arr : number[]  = new Array<number>(60);

    public static filterBatteryValue = (battery:number) => {
        if (battery <= 1) {
            Algo.battery_i = 0;
            Algo.pre_battery = -1;
            return -1;
        }
        if (Algo.pre_battery == -1) {
            Algo.battery_arr.fill(battery)
            Algo.pre_battery = battery;
            return battery;
        }
        Algo.battery_arr[Algo.battery_i] = battery;
        Algo.battery_i = (Algo.battery_i + 1) % Algo.battery_arr.length;
        const bat_val : number = Math.round(Algo.findAvg(Algo.battery_arr));
        if (bat_val > Algo.pre_battery && bat_val < Algo.pre_battery + 5) {
            return Algo.pre_battery;
        }
        Algo.pre_battery = bat_val;
        return bat_val;
    }
    public static findAvg = (arr: number[]) : number=> {
        let sum = 0;
        for (let i of arr) {
            sum += i;
        }
        return 1.0  * sum/arr.length;
    }

    public static formatPressure = (pressure: number) : string=> {
        return pressure + ".0";
    }

    public static formatTime = (seconds: number) : string=> {
        let m = seconds / 60;
        let s = seconds % 60;
        return m + ":" + s
    }

    public static formatDistance = (distance: number, twoDecimals : boolean) : string=> {
        let df = ''
        if (twoDecimals){
            df = distance + ".00"
        } else {
            df = distance + ".0"
        }
        return df;
    }

    public static formatUsage = (seconds: number) : string=> {
        return  Math.round(seconds/60.0).toString()
    }

    public static calculateDistance = (steps: number) : number=> {
          return steps*78.0/100000.0
    }

}

export default Algo;
