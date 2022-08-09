import React, {FC, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {sendCommand, startTimerAction} from '../store/bluetooth/actions';
import Command, {CommandType} from "../models/Ble/commands/Command";
import {BleDevice} from "../models/Ble/BleDevice";
import {DeviceStatus} from "../models/Ble/DeviceStatus";
import Algo from '../util/algo';


const DeviceView: FC = ({ route, navigation }) => {
// const DeviceView: FC = () => {
    const { deviceId } = route.params;
  const dispatch = useDispatch();

  const [selectedDevice, setSelectedDevice] = useState<BleDevice>();
  const [deviceState, setDeviceState] = useState<DeviceStatus>();
    const [sensorTop, setSensorTop] = useState<string>('')
    const [sensorMid, setSensorMid] = useState<string>('')
    const [sensorLow, setSensorLow] = useState<string>('')

    const [batteryText, setBatteryTextView] = useState<string>('')

    const [currentMode, setCurrentMode] = useState<number>(0)
    const [intensityFlag, setIntensityFlag] = useState<number>(0)
    const [pauseDeviceFlag, setpauseDeviceFlag] = useState<number>(0)

    const [sensorColorTop, setSensorColorTop] = useState<number>(0)
    const [sensorColorMid, setSensorColorMid] = useState<number>(0)
    const [sensorColorLow, setSensorColorLow] = useState<number>(0)

    const connectedDevices = useSelector(
        (state: RootState) => state.bluetooth.connectedDeviceList,
    );

    const devicesStatus = useSelector(
        (state: RootState) => state.bluetooth.devicesStatus,
    );

    const timerValue = useSelector(
        (state: RootState) => state.bluetooth.timerValue,
    );

    const sendPauseCommand = () => {
        dispatch(sendCommand(new Command(deviceId,CommandType.PAUSE)))
    }

    const sendPowerOffCommand = () => {
        dispatch(sendCommand(new Command(deviceId,CommandType.POWER_OFF)))
    }

    const sendStartCommand = () => {
        dispatch(sendCommand(new Command(deviceId,CommandType.START)))
    }

    const sendSetIntencityLvevelCommand = (level : number) => {
        let command = new Command(deviceId, CommandType.CHANGE_INTENSITY_1)
        if(level == 0){

        } else if(level == 1) {
            command = new Command(deviceId, CommandType.CHANGE_INTENSITY_2)
        }else if (level == 2) {
            command = new Command(deviceId, CommandType.CHANGE_INTENSITY_3)
        }
        dispatch(sendCommand(command));
    }

    const sendPatternChangeCommand = (pattern : number) => {
        if(pattern == 0) {
            dispatch(sendCommand(new Command(deviceId,CommandType.CHANGE_MODE_1)))
        } else  if(pattern == 1){
            dispatch(sendCommand(new Command(deviceId,CommandType.CHANGE_MODE_2)))
        }

    }

    const startTimer = () => {
        dispatch(startTimerAction(20, true))

    }
    const stopTimer = () => {
        dispatch(startTimerAction(20, false))
    }

    const sendStartStopCommand = (pauseFlag : number) => {
        if(pauseFlag == 1){
            sendPauseCommand()
        } else {
            sendStartCommand()
        }
    }


  useEffect(() => {
      let filteDevice:(BleDevice | undefined) = connectedDevices.find((device : BleDevice)  => device.id == deviceId)
      console.log(connectedDevices)
      if(filteDevice){
          setSelectedDevice(filteDevice);
      }

  }, [connectedDevices])

    useEffect(() => {
        let filteredDevice:(BleDevice | undefined) = devicesStatus.find((device : BleDevice)  => device.id == deviceId)
        if(filteredDevice){
            if(filteredDevice.status){
                setDeviceState(filteredDevice.status)
                processData()
            }

        }
    }, [devicesStatus])



    const enum CircularBtnSize  {
        LARGE = 'LARGE',
        NORMAL = 'NORMAL'
    }


    const getRgbString = (r:number, g: number, b : number, alpha: number) => {
        return 'rgba('+r+','+g+','+b+','+alpha+')'
    }
    const processData = () => {
        let pressureLow: number = deviceState?.pressureLow;
        let pressureMid: number = Math.min(deviceState?.pressureMid, pressureLow - Algo.randomDouble(0, 1.5)).toFixed(2);
        let pressureTop = Math.min(deviceState?.pressureTop, pressureMid - Algo.randomDouble(0, 1.5));
        setpauseDeviceFlag(deviceState?.pauseFlag)
        if(deviceState?.pauseFlag == 0){
            setSensorTop(pressureTop.toFixed(2))
            setSensorColorTop(Algo.getAlpha(pressureTop))
            setSensorMid(pressureMid + "")
            setSensorLow(pressureLow + "")
            setSensorColorMid(Algo.getAlpha(pressureMid))
            setSensorColorLow(Algo.getAlpha(pressureLow))
        }
        setBatteryTextView(deviceState?.batteryVal + "")
        let currentModeVal = deviceState?.apWorkMode
        setCurrentMode(currentModeVal)
        setIntensityFlag(deviceState?.intensityFlag)

    }

    const CircularIconButton = (props: {title:string, size :CircularBtnSize, callback: () => void}) => {

        return (
            <View style={{
                alignItems :"center"
            }}>
                <TouchableOpacity
                    activeOpacity={0.6}

                    onPress={()=> {props.callback()}}
                    style={{
                        height : props.size == CircularBtnSize.LARGE ? 80 : 60,
                        width : props.size == CircularBtnSize.LARGE ? 80 : 60,
                        borderRadius : props.size == CircularBtnSize.LARGE ? 40 : 30,
                    }}
                >
                    <View  style={{
                        height : props.size == CircularBtnSize.LARGE ? 80 : 60,
                        width : props.size == CircularBtnSize.LARGE ? 80 : 60,
                        borderRadius : props.size == CircularBtnSize.LARGE ? 40 : 30,
                        backgroundColor : 'white',
                        alignItems:'center',
                        justifyContent : 'center',
                        ...styles.shadow
                    }}>
                        <Text  style={{ ...styles.largeTextBold,color : '#6e6e6e', fontSize : props.size == CircularBtnSize.LARGE ? 35 : 25

                        }}>{props.title.charAt(0)}</Text>
                    </View>
                </TouchableOpacity>

                <Text style={{
                    marginVertical: 10,
                    fontWeight : "bold",
                    fontSize : props.size == CircularBtnSize.LARGE ? 20 : 14
                }}>{props.title}</Text>
            </View>

        )
    }


    const CircularTextButton = (props: {title:string, callback: () => void, active :boolean}) => {

        return (
            <View style={{
                alignItems :"center"
            }}>
                <TouchableOpacity
                    activeOpacity={0.6}

                    onPress={()=> {props.callback()}}
                    style={{
                        height : 60,
                        width : 60,
                        borderRadius : 30,
                    }}
                >
                    <View  style={{
                        height : 60,
                        width : 60,
                        borderRadius : 30,
                        backgroundColor : props.active ? '#343434' : '#6e6e6e',
                        alignItems:'center',
                        justifyContent : 'center',
                        ...styles.shadow
                    }}>
                        <Text  style={{ ...styles.largeTextBold,

                        }}>{props.title.charAt(0)}</Text>
                    </View>
                </TouchableOpacity>

                <Text style={{
                    marginVertical: 10
                }}>{props.title}</Text>
            </View>

        )
    }
    const Zone = (props: {title:string, value:string}) => {
        return(
            <View style={{
                flex:1,
                alignItems : "center",
                justifyContent:"center"
            }} >
                <View style={{
                    display:"flex",
                    flexDirection:"row",
                    alignItems:"flex-end"
                }}>
                    <Text style={{...styles.largeTextBold, color:"white"}}>{props.value}</Text>
                    <Text>mmHg</Text>
                </View>
                <Text>{props.title}</Text>
            </View>
        )
    }

    const SensorValueCard = (props:{color:string}) => {
        return(
            <View style={{
                flex:1,
                backgroundColor : props.color
            }} ></View>
        )
    }

    const SeekBarPoint = (prop:{active: boolean,id : number, callback : (id: number) => void}) => {
        return(
            <TouchableOpacity
                onPress={() => {prop.callback(prop.id)}}
            >
                <View style={{
                    height : 40,
                    width : 40,
                    borderRadius : 20,
                    backgroundColor : prop.active ? '#0000FF' :'',
                    alignItems : "center",
                    justifyContent : 'center'
                }}>
                    <View style={{
                        height : 10,
                        width : 10,
                        borderRadius : 5,
                        backgroundColor: "black"
                    }}>

                    </View>
                </View>
            </TouchableOpacity>

        )
    }
    const seekPabrSetted = (id : number) => {
        setIntensityFlag(id)
        sendSetIntencityLvevelCommand(id)
    }
    const SeekBarProgress = () => {
        return(
            <View style={{
                top: -2,
                paddingHorizontal:10,
                width:intensityFlag == 1 ? '50%' : '100%',
                borderWidth : 1,
                borderColor : "#0000FF"
            }}></View>
        )
    }
  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>
        <View style={{
            height : "100%",
            width : "100%",
            display :"flex"
        }}>
            <View
                style={{
                    backgroundColor: '#5a5a5c',
                    flex : 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <View
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                        }}>
                        Connected Device: {selectedDevice?.name}
                    </Text>
                </View>

                <View style={{
                    paddingHorizontal: 10,

                }}>
                    <Text style={{...styles.mediumTextBold
                    }}>Patterns</Text>
                    <View style={{
                        display :"flex",
                        marginTop :20,
                        flexDirection : "row",
                        alignItems : "center",
                        justifyContent : "space-around"
                    }}>
                        <CircularTextButton title={"Pulsated"} callback={() => {sendPatternChangeCommand(0)}} active={true}/>
                        <CircularTextButton title={"Graduated"} callback={() => {sendPatternChangeCommand(1)}} active={true}/>

                    </View>
                </View>

            </View>

            <View style={{
                flex:2,
                backgroundColor : "#353535",

            }}>
                <View style={{
                    padding : 10
                }}>
                    <Text style={{...styles.mediumTextBold
                    }}>Pressure Values</Text>
                </View>

                <View style={{
                    display:"flex",

                    padding : 10,
                    flexDirection : "row",
                    height : "50%",
                    justifyContent : "space-around"
                }}
                >
                    <View style={{
                        flex: 1,
                        height :"100%",
                        display : "flex",
                        paddingRight :20,
                        paddingLeft : 10,
                        paddingVertical :10
                    }}>
                        <SensorValueCard color={getRgbString(68,57,51,sensorColorTop)}/>
                        <SensorValueCard color={getRgbString(79,61,49,sensorColorMid)}/>
                        <SensorValueCard color={getRgbString(95,66,48,sensorColorLow)}/>
                    </View>
                    <View style={{
                        flex: 4,
                        height :"100%",
                    }}>
                        <Zone title={"Top Zone"} value={sensorTop}/>
                        <Zone title={"Middle Zone"} value={sensorMid}/>
                        <Zone title={"Bottom Zone"} value={sensorLow}/>
                    </View>
                    <View style={{
                        flex: 5,
                        height :"100%",
                        alignItems : "center"
                    }}>
                        <CircularIconButton callback={() => {sendPowerOffCommand()}} title={"Power Off"} size={CircularBtnSize.NORMAL}/>
                        <CircularIconButton callback={() => {sendStartStopCommand(pauseDeviceFlag)}} title={pauseDeviceFlag == 1 ? "Start" : "Pause"} size={CircularBtnSize.LARGE}/>
                        <Text>{timerValue}</Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor:'#515151',
                    padding : 10
                }}>
                    <Text style={{...styles.mediumTextBold
                    }}>Intensity</Text>
                    <View style={{
                        paddingVertical : 20,

                    }}>
                        <View style={{
                            marginHorizontal:15,
                            borderWidth : 1,
                            borderColor : "black"
                        }}></View>
                        {(intensityFlag != 0) ?  (
                            <View style={{
                                marginHorizontal : 15
                            }}>
                                <SeekBarProgress/>
                            </View>
                        ) : (<View></View>)}


                        <View style={{
                            top: -22,
                            display : "flex",
                            flexDirection : "row",
                            alignItems : "center",
                            justifyContent : "space-between",
                        }}>
                          <SeekBarPoint active={intensityFlag == 0} callback={seekPabrSetted} id={0} />
                          <SeekBarPoint active={intensityFlag == 1} callback={seekPabrSetted} id={1} />
                          <SeekBarPoint active={intensityFlag == 2} callback={seekPabrSetted} id={2} />
                        </View>


                    </View>

                </View>
            </View>
        </View>

    </SafeAreaView>
  );



};
const styles = StyleSheet.create({
    extraLargeTextBold : {
        fontSize : 30,
        fontWeight : 'bold',

    },
    largeTextBold : {
        fontSize : 25,
        fontWeight : 'bold',

    },
    mediumTextBold : {
        fontSize: 16,
        color : 'white',
        fontWeight : "bold"
    },
    shadow : {
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 29,
        elevation: 10
    }
})
export default DeviceView;
