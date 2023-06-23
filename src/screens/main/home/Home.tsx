import React, {Fragment} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Snackbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useNavigation} from '@react-navigation/native';
import styles from 'src/screens/main/home/styles';
import {colors} from 'src/styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';

const buttons = [
  {title: strings.registration, destination: 'CreateWorkerStack'},
  {title: strings.giveQrCode, destination: 'GiveQrCodeStack'},
  {title: strings.templates, destination: 'HandOverHarvestStack'},
  // {title: strings.qrCodeInformation, destination: ''},
];

const HomeButton = ({title, destination}: {title: string; destination: string}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(destination as never)} style={styles.wrapper}>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Home = () => {
  const netState = useNetInfo();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        {buttons.map(({title, destination}) => {
          return (
            <Fragment key={title}>
              <HomeButton destination={destination} title={title} />
            </Fragment>
          );
        })}
      </View>
      <Snackbar onDismiss={() => {}} visible={!netState.isConnected}>
        <Text style={styles.snackbar}>{strings.appWorksOffline}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

export {Home};
