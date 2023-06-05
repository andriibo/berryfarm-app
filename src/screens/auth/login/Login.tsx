import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {HelperText, Button, TextInput} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React, {useCallback, useState} from 'react';
import {SignInRequest} from 'src/stores/requests/signIn.request';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {login} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {setUser, useUser} from 'src/stores/slices/auth.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {Toast} from 'src/components/toast';
import {useFarm} from 'src/stores/slices/farm.slice';

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const {firestorePrefix} = useFarm();
  const [errorMessage, setError] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<SignInRequest>({
    defaultValues: {...user},
    mode: 'onChange',
    resolver: yupResolver(validation.login),
  });

  const handleLogin = useCallback(
    async ({username}: FieldValues) => {
      setError('');
      try {
        const data = await login(username, firestorePrefix);

        dispatch(setUser(data));
      } catch (error: any) {
        console.log(error);
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        }
      }
    },
    [dispatch, firestorePrefix],
  );

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <FastImage
          resizeMode="contain"
          source={require('src/assets/images/logo.png')}
          style={styles.image}
        />
        <Controller
          control={control}
          name="username"
          render={({field: {onChange}}) => (
            <View style={styles.input}>
              <TextInput
                error={Boolean(errors.username)}
                label={strings.username}
                mode="outlined"
                onChangeText={onChange}
                style={{width: '100%'}}
                testID="loginUsername"
              />
              <HelperText type="error" visible={Boolean(errors.username)}>
                {errors.username?.message}
              </HelperText>
            </View>
          )}
        />
        <Button
          disabled={!isDirty || !isValid}
          mode="contained"
          onPress={handleSubmit(handleLogin)}
          style={[styles.btn]}>
          {strings.logIn}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {Login};
