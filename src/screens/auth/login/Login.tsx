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
import {useNetInfo} from '@react-native-community/netinfo';
import {Loader} from 'src/components/loader';
import {colors} from 'src/styles/colors';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';
import {useHeaderHeight} from '@react-navigation/elements';

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const {firestorePrefix} = useFarm();
  const isLoadedData = useIsLoadedData();
  const netState = useNetInfo();
  const [loader, setLoader] = useState(false);
  const headerHeight = useHeaderHeight();

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
      setLoader(true);
      try {
        const data = await getUserByUsername(username, firestorePrefix);

        if (!data) {
          dispatch(addErrorNotification(strings.incorrectUsername));
          setLoader(false);

          return;
        }

        if (!isLoadedData) {
          await initData(firestorePrefix);
          dispatch(setLoadedData(true));
        }

        dispatch(setUser(data));
      } catch (error: any) {
        setLoader(false);
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      }
    },
    [dispatch, firestorePrefix, isLoadedData],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={[styles.area, {marginTop: -headerHeight}]}>
      <View style={styles.container}>
        <FastImage resizeMode="contain" source={require('src/assets/images/logo.png')} style={styles.image} />
        <View style={styles.wrapper}>
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
            contentStyle={{height: 50}}
            disabled={!isDirty || !isValid}
            mode="contained"
            onPress={handleSubmit(handleLogin)}
            style={styles.btn}>
            {strings.logIn}
          </Button>
          <Snackbar
            onDismiss={() => {}}
            style={{backgroundColor: colors.warning}}
            visible={!netState.isConnected}
            wrapperStyle={{position: 'relative'}}>
            <Text style={styles.snackbar}>{strings.couldNotConnectToServer}</Text>
          </Snackbar>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {Login};
