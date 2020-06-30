/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import {BleManager} from 'react-native-ble-plx';

const Home = () => {
  const manager = new BleManager();

  const [scanning, setScanning] = useState(false);

  function handleStartScan() {
    setScanning(true);

    console.log('Start Scan...');
    manager.startDeviceScan(
      null,
      {allowDuplicates: true},
      (error, scannedDevice) => {
        if (error) {
          console.log('error');
          return;
        }
        console.log(scannedDevice);
      },
    );
  }

  function handleStopScan() {
    console.log('Scan is stopped');
    manager.stopDeviceScan();
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>{`BLE PLX - Scan State: ${
            scanning ? 'on' : 'off'
          }`}</Text>
          <TouchableOpacity style={styles.touchable} onPress={handleStartScan}>
            <Text style={styles.touchableText}>START SCAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={handleStopScan}>
            <Text style={styles.touchableText}>STOP SCAN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 15,
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
    marginVertical: 10,
  },
  touchableText: {
    fontSize: 18,
  },
});

export default Home;
