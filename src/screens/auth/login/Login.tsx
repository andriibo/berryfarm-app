import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, TextInput} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React from 'react';

const Login = () => {
  const [text, setText] = React.useState('');

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <View style={styles.container}>
        <FastImage
          resizeMode="contain"
          source={require('src/assets/images/logo.png')}
          style={styles.image}
        />
        <TextInput
          label="Email or Username"
          mode="outlined"
          onChangeText={setText}
          style={{width: '90%'}}
          testID="loginEmail"
          value={text}
        />
        <Button disabled={!text} mode="contained" style={[styles.btn]}>
          {strings.logIn}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {Login};
