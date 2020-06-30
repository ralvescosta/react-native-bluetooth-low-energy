import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import BleManager from '../presentation/screens/BleManager';
import BlePlx from '../presentation/screens/BlePlx';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: '#0be881',
          activeTintColor: '#1a1a1a',
          inactiveBackgroundColor: '#ccc',
          inactiveTintColor: '#1a1a1a',
          tabStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}>
        <Tab.Screen name="BLE MANAGER" component={BleManager} />
        <Tab.Screen name="BLE PLX" component={BlePlx} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
