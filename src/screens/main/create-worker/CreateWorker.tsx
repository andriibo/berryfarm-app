import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const CreateWorker = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text variant="bodyLarge">Create Worker</Text>
      </View>
    </SafeAreaView>
  );
};

export {CreateWorker};
