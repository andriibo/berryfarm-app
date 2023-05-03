import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {Colors} from '../../styles';

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator color={'#565656'} size="large" />
  </View>
);

export {Loader};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
