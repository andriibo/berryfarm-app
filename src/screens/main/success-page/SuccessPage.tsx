import React, {useLayoutEffect} from 'react';
import {View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import styles from 'src/screens/main/success-page/styles';
import {colors} from 'src/styles/colors';

const SuccessPage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<DrawerStackParamList, 'SuccessPage'>>();

  console.log(scenario);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      title:
        scenario === 'CreateWorker' ? strings.registration : strings.giveQrCode,
    });
  }, [navigation, scenario]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.titleText}>{strings.entrySaved}</Text>
        <IconButton
          icon="check-circle-outline"
          iconColor={colors.black}
          size={50}
        />
      </View>
      <View style={{marginTop: '20%'}}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Home')}
          style={styles.btn}>
          {strings.toMain}
        </Button>
        {scenario === 'CreateWorker' && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateWorker')}
            style={styles.btn}>
            {strings.registerMore}
          </Button>
        )}
        {scenario === 'GiveQrCode' && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('GiveQrCode')}
            style={styles.btn}>
            {strings.giveAnotherQrCode}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export {SuccessPage};
