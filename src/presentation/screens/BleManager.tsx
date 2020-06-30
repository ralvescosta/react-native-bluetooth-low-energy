/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Platform,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  Text,
} from 'react-native';

import BleManager from 'react-native-ble-manager';

import {toHexString} from '../../utils/toHexString';

const Home = () => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const [peripherals, _setPeripherals] = useState<
    {
      mac: string;
      rssi: number;
      adv: string;
    }[]
  >([]);
  const peripheralsRef = useRef(peripherals);

  const [timer, setTimer] = useState(0);

  const [scanning, setScanning] = useState(false);

  const setPeripherals = (val: any) => {
    peripheralsRef.current = val;
    _setPeripherals(val);
  };

  function checkPermissionsAndroid() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then((result) => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then((result) => {
            console.log(result);
          });
        }
      });
    }
  }

  /**
   * Function called when press Start Scan Button
   */
  async function startScan() {
    await BleManager.enableBluetooth(); // Turn on Bluetooth

    if (!scanning) {
      BleManager.scan([], 20, false).then(() => {
        console.log('Scanning...');
        setScanning(true);
      });
    }
  }

  /**
   * Callback called when received BLE notification
   */
  function handleDiscoverPeripheral(peripheral: any) {
    const manufacturerData = peripheral.advertising.manufacturerData.bytes;
    setPeripherals([
      ...peripheralsRef.current,
      {
        mac: peripheral.id,
        rssi: peripheral.rssi,
        adv: toHexString(manufacturerData),
      },
    ]);
  }

  /**
   * Callback called when scan stopped
   */
  function handleStopScan() {
    console.log('Scan is stopped');
    setScanning(false);
  }

  useEffect(() => {
    checkPermissionsAndroid();

    BleManager.start({showAlert: false});

    const handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    const handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );

    return () => {
      handlerDiscover.remove();
      handlerStop.remove();
    };
  }, []);

  useEffect(() => {
    if (scanning) {
      const timerInstance = setInterval(() => {
        setTimer((time) => time + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setTimer(0);
      }, 20000);
      return () => clearInterval(timerInstance);
    }
    return () => {};
  }, [scanning]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>BLE MANAGER</Text>
            <Text style={styles.title}>
              {`Scan State: ${scanning ? 'on' : 'off'}`}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>Timer</Text>
            <Text style={styles.title}>{`Scan State: ${timer}`}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.touchable} onPress={startScan}>
          <Text style={styles.touchableText}>START SCAN</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        style={styles.scrollView}>
        {peripherals.length
          ? peripherals.map((device: any, index: number) => (
              <View key={index.toString()} style={styles.device}>
                <Text>
                  MAC: {device.mac} RSSI: {device.rssi}
                </Text>
                <Text> ADV: {device.adv}</Text>
              </View>
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  row: {
    width: '100%',
    marginVertical: 10,

    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  touchable: {
    width: '80%',
    padding: 20,
    borderRadius: 6,
    elevation: 5,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  device: {
    elevation: 3,
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 6,
    marginVertical: 5,
    padding: 5,
  },
});

export default Home;
