import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import styles from 'src/screens/main/create-worker/styles';
import {Controller, useForm} from 'react-hook-form';
import {AvoidSoftInputView} from 'react-native-avoid-softinput';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {CreateWorkerRequest} from 'src/stores/types/CreateWorkerRequest';
import {Toast} from 'src/components/toast';
import {BirthPicker} from 'src/components/birth-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {createWorker, findWorker} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {FirestoreServiceError} from 'src/stores/errors';

const CreateWorker = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {firestorePrefix} = useFarm();
  const [errorMessage, setError] = useState('');
  const [workerExist, setWorkerExist] = useState(false);
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

  const handleCreateWorker = useCallback(
    async (data: CreateWorkerRequest) => {
      setError('');
      try {
        const result = await findWorker(data, firestorePrefix);

        setWorkerExist(!!result);
        if (!result) {
          await createWorker(data, firestorePrefix);
        }
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        }
      }
    },
    [firestorePrefix],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <AvoidSoftInputView avoidOffset={50} style={styles.wrapper}>
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
                    onChangeText={onChange}
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
                    onChangeText={onChange}
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
                    onChangeText={onChange}
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
                <BirthPicker onChange={onChange} value={value} />
              )}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            {workerExist && (
              <Text style={{marginBottom: 15}} variant="titleMedium">
                {strings.workerRegistered}
              </Text>
            )}
            {workerExist && (
              <Text
                onPress={() => navigation.navigate('GiveQrCode')}
                style={styles.link}
                variant="titleMedium">
                {strings.goToGiveQrCode}
              </Text>
            )}
            <Button
              disabled={!isDirty || !isValid}
              icon="qrcode"
              mode="contained"
              onPress={handleSubmit(handleCreateWorker)}
              style={[styles.btn]}>
              {strings.scanCode}
            </Button>
          </View>
        </AvoidSoftInputView>
      </View>
    </SafeAreaView>
  );
};

export {CreateWorker};
