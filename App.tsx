import React from 'react';
import Main from './src/main';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Main />
    </>
  );
};

export default App;
