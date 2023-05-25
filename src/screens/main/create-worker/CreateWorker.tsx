import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import styles from 'src/screens/main/create-worker/styles';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {CreateWorkerRequest} from 'src/stores/requests/create-worker.request';
import {Toast} from 'src/components/toast';
import {BirthPicker} from 'src/components/birth-picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {createWorker, findWorker} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {FirestoreServiceError} from 'src/stores/errors';
import {Worker} from 'src/stores/types/worker.type';

const CreateWorker = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {firestorePrefix} = useFarm();
  const [errorMessage, setError] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<CreateWorkerRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '' as unknown as Date,
    },
    mode: 'onChange',
    resolver: yupResolver(validation.createWorker),
  });

  useFocusEffect(
    useCallback(() => {
      setWorker(null);
    }, []),
  );

  const handleChange = useCallback(() => {
    setWorker(null);
  }, []);

  const handleCreateWorker = useCallback(
    async (data: CreateWorkerRequest) => {
      setError('');
      try {
        let result = await findWorker(data, firestorePrefix);

        setWorker(result);
        if (!result) {
          result = await createWorker(data, firestorePrefix);

          setWorker(result);
          navigation.navigate('ScanQrCode');
        }
      } catch (error: any) {
        console.log(error);
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        }
      }
    },
    [firestorePrefix, navigation],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <View style={styles.wrapper}>
          <View>
            <Text variant="titleMedium">{strings.worker}</Text>
            <Controller
              control={control}
              name="firstName"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.firstName)}
                    label={strings.firstName}
                    mode="outlined"
                    onChangeText={(text: string) => {
                      onChange(text);
                      handleChange();
                    }}
                    style={{width: '100%'}}
                    testID="createWorkerFirstName"
                  />
                  <HelperText type="error" visible={Boolean(errors.firstName)}>
                    {errors.firstName?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.lastName)}
                    label={strings.lastName}
                    mode="outlined"
                    onChangeText={(text: string) => {
                      onChange(text);
                      handleChange();
                    }}
                    style={{width: '100%'}}
                    testID="createWorkerLastName"
                  />
                  <HelperText type="error" visible={Boolean(errors.lastName)}>
                    {errors.lastName?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={control}
              name="middleName"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.middleName)}
                    label={strings.middleName}
                    mode="outlined"
                    onChangeText={(text: string) => {
                      onChange(text);
                      handleChange();
                    }}
                    style={{width: '100%'}}
                    testID="createWorkerMiddleName"
                  />
                  <HelperText type="error" visible={Boolean(errors.middleName)}>
                    {errors.middleName?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>
          <View>
            <Text variant="titleMedium">{strings.birthDate}</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({field: {value, onChange}}) => (
                <BirthPicker
                  onChange={(date: string) => {
                    onChange(date);
                    handleChange();
                  }}
                  value={value}
                />
              )}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            {worker && (
              <Text style={{marginBottom: 15}} variant="titleMedium">
                {strings.workerRegistered}
              </Text>
            )}
            {worker && (
              <Text
                onPress={() => navigation.navigate('GiveQrCode')}
                style={styles.link}
                variant="titleMedium">
                {strings.goToGiveQrCode}
              </Text>
            )}
            <Button
              disabled={!isDirty || !isValid || !!worker}
              icon="qrcode"
              mode="contained"
              onPress={handleSubmit(handleCreateWorker)}
              style={[styles.btn]}>
              {strings.scanQrCode}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {CreateWorker};
