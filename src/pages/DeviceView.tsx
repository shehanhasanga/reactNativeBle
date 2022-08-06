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
import {getAdapterStatus} from '../modules/Bluetooth/bluetooth.reducer';
import {getAdapterStatusnew} from '../modules/Bluetooth/actions/bleActions';
import {
  initiateConnection,
  scanForPeripherals,
  startHeartRateScan,
} from '../modules/Bluetooth/bluetooth.reducer';
// type DeviceViewProps = {
//   navigation: any;
//   deviceId: string;
// };
const DeviceView: FC = ({ route, navigation }) => {
    const { deviceId } = route.params;
  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<BluetoothPeripheral>();

    const connectedDevices = useSelector(
        (state: RootState) => state.bluetooth.connectedDeviceList,
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
        </View>

      </View>
    </SafeAreaView>
  );
};

export default DeviceView;
