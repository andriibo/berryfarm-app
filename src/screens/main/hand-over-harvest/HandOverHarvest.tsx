import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'src/styles/colors';

const HandOverHarvest = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View>
        <Text>Hand Over Harvest</Text>
      </View>
    </SafeAreaView>
  );
};

export {HandOverHarvest};
