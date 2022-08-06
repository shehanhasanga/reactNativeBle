/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren, useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity, TouchableOpacityComponent,
  View
} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import CTAButton from './components/CTAButton';
import DeviceModal from './components/DeviceConnectionModal';
import {BluetoothPeripheral} from './models/BluetoothPeripheral';
import {
  initiateConnection,
  scanForPeripherals,
  startHeartRateScan,
} from './modules/Bluetooth/bluetooth.reducer';
import {RootState, store} from './store/store';
import {FC} from 'react';
import Blemanage from "./modules/Bluetooth/Blemanage";
import ConnectedDeviceList from "./components/ConnectedDeviceList";
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationContainer} from "@react-navigation/native";
import ScanDevice from "./pages/ScanDevice";
import HomeView from "./pages/HomeView";
import TextModal from "./models/InfoModal";
import InfoModal from "./models/InfoModal";
import {getAdapterStatusnew} from "./modules/Bluetooth/actions/bleActions";
import DeviceView from "./pages/DeviceView";

// import {Device} from "react-native-ble-plx";

const App: FC = () => {

  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

const Home: FC = () => {
  useEffect( () => {
      getBleStatus()
  }, []);


    const getBleStatus = () => {
        dispatch(getAdapterStatusnew())
    }
  const dispatch = useDispatch();

  const devices = useSelector(
    (state: RootState) => state.bluetooth.availableDevices,
  );

  const connecteDevices : Array<BluetoothPeripheral> = useSelector(
      (state: RootState) => state.bluetooth.connectedDeviceList,
  );


  const Stack = createStackNavigator();
  function scanAndConnect() {
    blemanager?.scanAndConnect();
  }

  const [blemanager, setblemanager] = useState<Blemanage>();
  const [demodevices, setdemodevices] = useState<Array<BluetoothPeripheral>>( []);
  // const scandevice = () => {
  //   blemanager?.scanAndConnect();
  // };

  const heartRate = useSelector(
    (state: RootState) => state.bluetooth.heartRate,
  );


  const showAlert = (message :string, title:string) => {
    Alert.alert(
        title,
        message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );
  }

  // const permissionCheck = () => {
  //   PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(response => {
  //     if (response === true){
  //       //Open scanner
  //     }
  //     else if (response === false){
  //       showAlert("Please enable location permission in device settings", "Permisssion required")
  //     }
  //   })
  //   }
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location permission for bluetooth scanning',
            message: 'wahtever',
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

  const isConnected = useSelector(
    (state: RootState) => !!state.bluetooth.connectedDevice,
  );

  const scandevice = async () => {
    const permission = await requestLocationPermission();
    if(permission){
      dispatch(scanForPeripherals());
    } else {
      showAlert("Please enable location permission in device settings", "Permisssion required")
    }
  }

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => setIsModalVisible(false);

  const connectToPeripheral = (device: BluetoothPeripheral) =>
    dispatch(initiateConnection(device.id));
  const renderDeviceModalListItem = (item: ListRenderItemInfo<BluetoothPeripheral>) => {
    return (
        <Text>{item.item.name}</Text>
    )
  }

  return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={HomeView} name={"Main"} options={{headerShown : false}}/>
          <Stack.Screen component={DeviceView} name={"DeviceView"} options={{headerStyle:{
                  backgroundColor : '#353535'
              }, headerTintColor: '#fff'}  } />
          <Stack.Screen component={ScanDevice} name={'Scandevice'} options={{headerStyle:{
              backgroundColor : '#353535'
              }, headerTintColor: '#fff'}  }/>
        </Stack.Navigator>
      </NavigationContainer>

  );
};






const SecondView = ({}) =>{
  return (
      <SafeAreaView style={{
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor :"#FFFFFF"
      }}>
        <Text>Second View</Text>
      </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#337e89',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    display: 'flex',
    width: 100,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  back : {
   display: 'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal :10,
    paddingVertical : 10,
    height: 200,
    backgroundColor: '#ff0000',
    width : '100%'
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default App;
