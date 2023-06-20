import React, {useLayoutEffect, useMemo} from 'react';
import {View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import styles from 'src/screens/main/success-page/styles';
import {colors} from 'src/styles/colors';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {HeaderLeft} from 'src/components/header-left';

const SuccessPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<DrawerStackParamList, 'SuccessPage'>>();
  const title = useMemo(
    () =>
      scenario === ScenariosEnum.createWorker
        ? strings.registration
        : scenario === ScenariosEnum.giveQrCode
        ? strings.giveQrCode
        : strings.hangOverHarvest,
    [scenario],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (scenario === ScenariosEnum.handOverHarvest ? <HeaderLeft /> : null),
      title,
    });
  }, [navigation, scenario, title]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.titleText}>{strings.entrySaved}</Text>
        <IconButton icon="check-circle-outline" iconColor={colors.black} size={50} />
      </View>
      <View style={{marginTop: '20%'}}>
        {scenario === ScenariosEnum.handOverHarvest && (
          <Button mode="outlined" onPress={() => navigation.navigate('Templates')} style={styles.btn}>
            {strings.toTemplates}
          </Button>
        )}
        {scenario !== ScenariosEnum.handOverHarvest && (
          <Button mode="outlined" onPress={() => navigation.navigate('Home')} style={styles.btn}>
            {strings.toMain}
          </Button>
        )}
        {scenario === ScenariosEnum.createWorker && (
          <Button mode="contained" onPress={() => navigation.navigate('CreateWorker')} style={styles.btn}>
            {strings.registerMore}
          </Button>
        )}
        {scenario === ScenariosEnum.giveQrCode && (
          <Button mode="contained" onPress={() => navigation.navigate('ScanQrCode', {scenario})} style={styles.btn}>
            {strings.giveAnotherQrCode}
          </Button>
        )}
        {scenario === ScenariosEnum.handOverHarvest && (
          <Button mode="contained" onPress={() => navigation.navigate('HandOverHarvest')} style={styles.btn}>
            {strings.hangOverAnotherHarvest}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export {SuccessPage};
