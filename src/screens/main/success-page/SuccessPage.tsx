import React from 'react';
import {View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styles from 'src/screens/main/success-page/styles';
import {colors} from 'src/styles/colors';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {CreateWorkerStackParamList} from 'src/navigation/createWorker.stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';

const SuccessPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<CreateWorkerStackParamList, 'SuccessPage'>>();

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <View />
        <View style={styles.wrapper}>
          <Text style={styles.titleText}>{strings.entrySaved}</Text>
          <IconButton icon="check-circle-outline" iconColor={colors.black} size={50} />
        </View>
        <View style={styles.blockBtn}>
          {scenario === ScenariosEnum.templates && (
            <Button
              contentStyle={{height: 50}}
              labelStyle={{fontSize: 18}}
              mode="outlined"
              onPress={() => navigation.popToTop()}
              style={styles.btn}>
              {strings.toTemplates}
            </Button>
          )}
          {(scenario === ScenariosEnum.templates || scenario === ScenariosEnum.handOverHarvest) && (
            <Button
              contentStyle={{height: 50}}
              labelStyle={{fontSize: 18}}
              mode="contained"
              onPress={() => navigation.pop(2)}
              style={styles.btn}>
              {strings.hangOverAnotherHarvest}
            </Button>
          )}
          {scenario !== ScenariosEnum.templates && scenario !== ScenariosEnum.handOverHarvest && (
            <Button
              contentStyle={{height: 50}}
              labelStyle={{fontSize: 18}}
              mode="outlined"
              onPress={() => {
                navigation.popToTop();
                navigation.navigate('HomeStack');
              }}
              style={styles.btn}>
              {strings.toMain}
            </Button>
          )}
          {scenario === ScenariosEnum.createWorker && (
            <Button
              contentStyle={{height: 50}}
              labelStyle={{fontSize: 18}}
              mode="contained"
              onPress={() => navigation.popToTop()}
              style={styles.btn}>
              {strings.registerMore}
            </Button>
          )}
          {scenario === ScenariosEnum.assignQrCode && (
            <Button
              contentStyle={{height: 50}}
              labelStyle={{fontSize: 18}}
              mode="contained"
              onPress={navigation.goBack}
              style={styles.btn}>
              {strings.giveAnotherQrCode}
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export {SuccessPage};
