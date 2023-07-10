import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Snackbar, Text, IconButton} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import {colors} from 'src/styles/colors';

const InternetNotConnected = () => {
  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        <FastImage resizeMode="contain" source={require('src/assets/images/logo.png')} style={styles.image} />
        <Text variant="titleLarge">{strings.noInternetConnection}</Text>
        <IconButton icon="alert-circle-outline" size={100} />
        <Snackbar onDismiss={() => {}} visible={true} wrapperStyle={{position: 'relative'}}>
          <Text style={styles.snackbar}>{strings.logInOnline}</Text>
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export {InternetNotConnected};
