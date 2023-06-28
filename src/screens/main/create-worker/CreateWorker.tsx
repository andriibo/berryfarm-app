import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import styles from 'src/screens/main/create-worker/styles';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {CreateWorkerRequest} from 'src/stores/types/createWorkerRequest';
import {Toast} from 'src/components/toast';
import {BirthPicker} from 'src/components/birth-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createWorker, getWorkerByParams} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {FirestoreServiceError} from 'src/stores/errors';
import {v4 as uuid} from 'uuid';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setWorker} from 'src/stores/slices/worker.slice';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {colors} from 'src/styles/colors';
import {CreateWorkerStackParamList} from 'src/navigation/createWorker.stack';
import {Loader} from 'src/components/loader';

type WorkerRequest = Omit<CreateWorkerRequest, 'uuid'>;

const CreateWorker = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<CreateWorkerStackParamList>>();
  const {firestorePrefix} = useFarm();
  const [errorMessage, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isDirty, isValid},
  } = useForm<WorkerRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '' as unknown as Date,
    },
    mode: 'onChange',
    resolver: yupResolver(validation.createWorker),
  });

  const createNewWorker = useCallback(
    (data: WorkerRequest) => {
      const worker = {...data, uuid: uuid()};

      createWorker(worker, firestorePrefix);
      dispatch(setWorker(worker));
      reset();
      navigation.navigate('ScanQrCode', {
        scenario: ScenariosEnum.createWorker,
      });
      setLoader(false);
    },
    [dispatch, firestorePrefix, navigation, reset],
  );

  const handleCreateWorker = useCallback(
    async (data: WorkerRequest) => {
      setError('');
      setLoader(true);
      try {
        getWorkerByParams(data.firstName, data.lastName, data.middleName, data.birthDate, firestorePrefix).then(
          worker => {
            if (!worker) {
              createNewWorker(data);

              return;
            }

            dispatch(setWorker(worker));
            reset();
            navigation.navigate('ScanQrCode', {
              scenario: ScenariosEnum.createWorker,
            });
            setLoader(false);
          },
        );
      } catch (error: any) {
        setLoader(false);
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [createNewWorker, dispatch, firestorePrefix, navigation, reset],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <View style={styles.wrapper}>
          <View>
            <Text variant="titleMedium">{strings.worker}</Text>
            <Controller
              control={control}
              name="firstName"
              render={({field: {value, onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.firstName)}
                    label={strings.firstName}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerFirstName"
                    value={value}
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
              render={({field: {value, onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.lastName)}
                    label={strings.lastName}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerLastName"
                    value={value}
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
              render={({field: {value, onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.middleName)}
                    label={strings.middleName}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerMiddleName"
                    value={value}
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
              render={({field: {value, onChange}}) => <BirthPicker onChange={onChange} value={value} />}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              disabled={!isDirty || !isValid}
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
