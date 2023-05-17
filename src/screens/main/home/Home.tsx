import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text variant="bodyLarge">Home Page</Text>
      </View>
    </SafeAreaView>
  );
};

export {Home};
