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
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
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
import BluetoothLeManager from './modules/Bluetooth/BluetoothLeManager';
import Blemanage from "./modules/Bluetooth/Blemanage";

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
    // setblemanager(Blemanage.getInstance());
  }, []);
  const dispatch = useDispatch();
  const devices = useSelector(
    (state: RootState) => state.bluetooth.availableDevices,
  );

  function scanAndConnect() {
    blemanager?.scanAndConnect();
  }

  // const scan = () => {
  //   bleManager.startDeviceScan(
  //      null,
  //       null,
  //        (error: ?Error, scannedDevice: ?Device) => {
  //
  //   }
  // )
  // }
  const [blemanager, setblemanager] = useState<Blemanage>();
  const scandevice = () => {
    blemanager?.scanAndConnect();
  };

  const heartRate = useSelector(
    (state: RootState) => state.bluetooth.heartRate,
  );




  const isConnected = useSelector(
    (state: RootState) => !!state.bluetooth.connectedDevice,
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => setIsModalVisible(false);

  const connectToPeripheral = (device: BluetoothPeripheral) =>
    dispatch(initiateConnection(device.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {isConnected ? (
          <>
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <CTAButton
        title="Connect"
        onPress={() => {
          dispatch(scanForPeripherals());
          setIsModalVisible(true);
          // scanAndConnect();
        }}
      />
      {isConnected && (
        <CTAButton
          title="Get Heart Rate"
          onPress={() => {
            dispatch(startHeartRateScan());
          }}
        />
      )}
      <DeviceModal
        devices={devices}
        visible={isModalVisible}
        closeModal={closeModal}
        connectToPeripheral={connectToPeripheral}
      />
    </SafeAreaView>
  );
};

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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
});

export default App;
