import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {HelperText, Button, TextInput} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React, {useCallback, useState} from 'react';
import {PostSignInRequest} from 'src/stores/types/PostSignInRequest';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {login} from 'src/stores/services/firestore.service';
import {AvoidSoftInputView} from 'react-native-avoid-softinput';
import {FirestoreServiceError} from 'src/stores/errors';
import {setUser, useFarm, useUser} from 'src/stores/slices/auth.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {Toast} from 'src/components/toast';

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const {firestorePrefix} = useFarm();
  const [errorMessage, setError] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<PostSignInRequest>({
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
        <AvoidSoftInputView avoidOffset={50} style={styles.wrapper}>
          <Controller
            control={control}
            name="username"
            render={({field: {onChange}}) => (
              <TextInput
                error={Boolean(errors.username)}
                label="Email or Username"
                mode="outlined"
                onChangeText={onChange}
                style={{width: '100%'}}
                testID="loginEmail"
              />
            )}
          />
          <HelperText
            style={styles.helperText}
            type="error"
            visible={Boolean(errors.username)}>
            {errors.username?.message}
          </HelperText>
        </AvoidSoftInputView>
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
