import React, {FC, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity, Alert, PermissionsAndroid, ScrollView, RefreshControl, Platform,
} from 'react-native';
import {BluetoothPeripheral} from '../models/BluetoothPeripheral';
import ConnectedDeviceList from "../components/ConnectedDeviceList";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store";
import {initiateConnection, scanForPeripherals, stopScanForPeripherals} from "../store/bluetooth/bluetooth.reducer";
import Blemanage from "../modules/Bluetooth/Blemanage";
// import Arrow from '../assets/icons/arrow.svg';

type ScanDeviceProps = {
  devices: BluetoothPeripheral[];
  callback: (id: string) => void;
  navigation : any;
};
const ScanDevice: FC<ScanDeviceProps> = props => {
  const connectedDevices = useSelector(
      (state: RootState) => state.bluetooth.connectedDeviceList,
  );
  const [connectingDeviceId, setConnectingDeviceId] = React.useState<string>('');
  useEffect( () => {
      if(connectingDeviceId){
        if(connectingDeviceId != ''){
          const isDuplicate = connectedDevices.some(
              device => device.id === connectingDeviceId,
          );
          if(isDuplicate){
            goback()
          }
        }
      }
    // scandevice();
  }, [connectedDevices]);
  useEffect( () => {
    // scandevice();
  }, []);

  const goback = () => {
    props.navigation.goBack();
  }

  const dispatch = useDispatch();
  const devices = useSelector(
      (state: RootState) => state.bluetooth.availableDevices,
  );
  const isConnected = useSelector(
      (state: RootState) => !!state.bluetooth.connectedDevice,
  );
  const isScanning = useSelector(
      (state: RootState) => state.bluetooth.isScanning,
  );
  const connectToPeripheral = (id:string) => {
    setConnectingDeviceId(id)
    dispatch(initiateConnection(id));
  }

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScanningDevices, setScanning] = useState<boolean>(isScanning);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location permission for bluetooth scanning',
            message: 'Enable ocatio permissions',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const toggleScan = () => {
    if(isScanning){
      stopScan();
      setScanning(false);
      setRefreshing(false);
    } else {
      scandevice();
      setScanning(true);
      setRefreshing(true);
    }
  }
  const stopScan = async () => {
    dispatch(stopScanForPeripherals());
  }

  const scandevice = async () => {
    if(Platform.OS === 'ios') {
      dispatch(scanForPeripherals());
    } else {
      const permission = await requestLocationPermission();
      if(permission){
        dispatch(scanForPeripherals());
      } else {
        showAlert("Please enable location permission in device settings", "Permisssion required")
      }
    }
  }

  const showAlert = (message :string, title:string) => {
    Alert.alert(
        title,
        message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>

      <View style={{
        backgroundColor : "#5a5a5c",
        height : '100%',
        width  :'100%',
        display : 'flex',
        flexDirection : "column"
      }}
      >
        <ScrollView style={{
          flex : 1
        }}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
              />
            }
        >

        </ScrollView>
        <View style={{
          flex : 2,
          paddingVertical : 20,
          paddingHorizontal : 10,
          display : "flex",
          flexDirection : "row",
          alignItems : "center",
          justifyContent : "space-between"
        }}>
          <Text style={{
            fontWeight : "bold",
            fontSize : 15,
          }}>Scanned Devices : </Text>
          <TouchableOpacity
              onPress={() => toggleScan()}
          >
            <View style={{
              paddingHorizontal : 15,
              paddingVertical : 5,
              backgroundColor : '#337e89',
              borderRadius  : 10

            }}>
              {isScanning ? (
                  <Text>Stop Scan</Text>
              ) : (
                  <Text>Start Scan</Text>
              ) }

            </View>
          </TouchableOpacity>


        </View>
        <View style={{
          flex : 30
        }}>
          <ConnectedDeviceList callback={ (id) => {connectToPeripheral(id)}} devices={devices}/>
        </View>


      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionBarHost: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#353535',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
});

export default ScanDevice;
