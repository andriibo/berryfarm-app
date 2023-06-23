import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {HelperText, Button, TextInput, Snackbar, Text} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React, {useCallback, useState} from 'react';
import {SignInRequest} from 'src/stores/types/signInRequest';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {getUserByUsername, initData} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {setUser, useUser, useFarm, setLoadedData, useIsLoadedData} from 'src/stores/slices/auth.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {Toast} from 'src/components/toast';
import {useNetInfo} from '@react-native-community/netinfo';
import {Loader} from 'src/components/loader';
import {colors} from 'src/styles/colors';

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const {firestorePrefix} = useFarm();
  const isLoadedData = useIsLoadedData();
  const netState = useNetInfo();
  const [isLoad, setIsLoadActive] = useState(false);
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
      setIsLoadActive(true);
      try {
        const data = await getUserByUsername(username, firestorePrefix);

        if (!data) {
          setError(strings.incorrectUsername);

          return;
        }

        if (!isLoadedData) {
          await initData(firestorePrefix);
          dispatch(setLoadedData(true));
        }

        dispatch(setUser(data));
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      } finally {
        setIsLoadActive(false);
      }
    },
    [dispatch, firestorePrefix, isLoadedData],
  );

  if (isLoad) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <FastImage resizeMode="contain" source={require('src/assets/images/logo.png')} style={styles.image} />
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
        <Snackbar onDismiss={() => {}} visible={!netState.isConnected} wrapperStyle={{position: 'relative'}}>
          <Text style={styles.snackbar}>{strings.couldNotConnectToServer}</Text>
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export {Login};
