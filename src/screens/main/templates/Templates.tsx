import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const Templates = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text variant="bodyLarge">Templates</Text>
      </View>
    </SafeAreaView>
  );
};

export {Templates};
