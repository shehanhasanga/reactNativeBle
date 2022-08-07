import React, {FC, useEffect, useState} from 'react';
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
  RefreshControl,
} from 'react-native';
import {BluetoothPeripheral} from '../models/BluetoothPeripheral';
import ConnectedDeviceList from '../components/ConnectedDeviceList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {getAdapterStatus} from '../store/bluetooth/bluetooth.reducer';
import {getAdapterStatusnew, getDeviceStatusData, sendCommand} from '../store/bluetooth/actions';
import {
  initiateConnection,
  scanForPeripherals,
  startHeartRateScan,
} from '../store/bluetooth/bluetooth.reducer';
import PauseCommand from "../models/Ble/commands/PauseCommand";
import GetdeviceStatusCommand from "../models/Ble/commands/GetdeviceStatus";
import {CommandType} from "../models/Ble/commands/Command";
// type DeviceViewProps = {
//   navigation: any;
//   deviceId: string;
// };
const DeviceView: FC = ({ route, navigation }) => {
    const { deviceId } = route.params;
  const dispatch = useDispatch();
  const getDeviceUpdateData = () => {
      let command = new GetdeviceStatusCommand(deviceId, CommandType.STOP)
      dispatch(getDeviceStatusData(command))
  }
  const sendPauseCommand = () => {
      let pauseCommand = new PauseCommand(deviceId)
      dispatch(sendCommand(pauseCommand))
  }
  const [selectedDevice, setSelectedDevice] = useState<BluetoothPeripheral>();

    const connectedDevices = useSelector(
        (state: RootState) => state.bluetooth.connectedDeviceList,
    );

    const deviceStatas = useSelector(
        (state: RootState) => state.bluetooth.deviceStatus,
    );
  useEffect(() => {
      let filteDevice:(BluetoothPeripheral | undefined) = connectedDevices.find((device : BluetoothPeripheral)  => device.id == deviceId)
      console.log(connectedDevices)
      console.log(deviceId)
      if(filteDevice){
          setSelectedDevice(filteDevice);
      }

  }, [connectedDevices])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>
      <View
        style={{
          backgroundColor: '#5a5a5c',
          height: '100%',
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
            <TouchableOpacity style={{
                backgroundColor: "#0000FF",
                paddingHorizontal:10,
                paddingVertical:5,
                borderRadius:5
            }}
          onPress={() => sendPauseCommand()}
            >
                <Text>Pause</Text>
                <Text>{deviceStatas}</Text>

            </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default DeviceView;
