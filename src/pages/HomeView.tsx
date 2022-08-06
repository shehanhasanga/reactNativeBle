import React, {FC, useEffect, useState} from 'react';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
    FlatList,
    ListRenderItemInfo,
    Modal,
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    ScrollView,
    RefreshControl, Pressable,
} from 'react-native';
import {BluetoothPeripheral} from '../models/BluetoothPeripheral';
import ConnectedDeviceList from '../components/ConnectedDeviceList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getAdapterStatus} from "../modules/Bluetooth/bluetooth.reducer";
import {getAdapterStatusnew} from "../modules/Bluetooth/actions/bleActions";
import {AdapterState} from "../modules/Bluetooth/BluetoothConstants";
import InfoModal from "../models/InfoModal";
import DeviceView from "./DeviceView";
type HomeViewProps = {
  devices: BluetoothPeripheral[];
  callback: (id: string) => void;
  navigation: any;
};
const HomeView: FC<HomeViewProps> = props => {
    const dispatch = useDispatch();

    const connectedDevices = useSelector(
        (state: RootState) => state.bluetooth.connectedDeviceList,
    );

    const devicesAdapterStatus = useSelector(
        (state: RootState) => state.bluetooth.adapterStatus,
    );

    useEffect(() => {
        // getBleStatus()

    },[])


    // useEffect(() => {
    //     if(devicesAdapterStatus == AdapterState.PoweredOff) {
    //
    //     }
    // },[devicesAdapterStatus])



    const openBluetoothSettings = () => {
        BluetoothStateManager.openSettings();
    }

    // const [isbleEnabled, setIsbleEnabled] = React.useState<boolean>(false);


    const Header = () => {
        return (
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    backgroundColor: '#353535',
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#FFFFFF',
                        }}>
                        Spryng
                    </Text>
                    <Text>Control the device</Text>
                </View>

                <View style={{
                    display : "flex",
                    flexDirection : "row"
                }}>
                    {devicesAdapterStatus == AdapterState.PoweredOn ? (
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('Scandevice')}
                            // onPress={() => getBleStatus()}
                            style={{
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                }}>
                                Connect
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => openBluetoothSettings()}
                            style={{
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                }}>
                                Enable Bluetooth
                            </Text>
                        </TouchableOpacity>
                    ) }

                </View>
            </View>
        )
    }


    const Body = () => {
        return (
            <View
                style={{
                    backgroundColor: '#5a5a5c',
                    height: '100%',
                    width: '100%',
                }}>
                <View
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        display:"flex",
                        flexDirection : "row",
                        justifyContent :"space-between"
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                        }}>
                        Connected Devices:
                    </Text>
                    <Text>{devicesAdapterStatus}</Text>
                </View>

                <ConnectedDeviceList
                    callback={id => {
                        console.log(id)
                        props.navigation.navigate('DeviceView', {deviceId: id})
                        // DeviceView
                    }}
                    devices={connectedDevices}
                />
            </View>
        )
    }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>
        {devicesAdapterStatus == AdapterState.PoweredOn ? (
            <View></View>
        ) : (

            <InfoModal message={"Please enable device bluetooth "} callback={() => {openBluetoothSettings()}}/>
        ) }
        <Header/>
        <Body />

    </SafeAreaView>
  );
};

export default HomeView;
