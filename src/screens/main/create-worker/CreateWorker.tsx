import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {HelperText, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import styles from 'src/screens/main/create-worker/styles';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {AvoidSoftInputView} from 'react-native-avoid-softinput';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {PostCreateWorkerRequest} from 'src/stores/types/PostCreateWorkerRequest';
import {Toast} from 'src/components/toast';
import {BirthPicker} from 'src/components/birth-picker';

const CreateWorker = () => {
  const [errorMessage, setError] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<PostCreateWorkerRequest>({
    defaultValues: {
      firstname: '',
      lastname: '',
      surname: '',
      dob: '' as unknown as Date,
    },
    mode: 'onChange',
    resolver: yupResolver(validation.createWorker),
  });

  const handleCreateWorker = useCallback(
    async ({firstname, lastname, surname, dob}: FieldValues) => {
      try {
      } catch (error: any) {}
    },
    [],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <AvoidSoftInputView avoidOffset={50} style={styles.wrapper}>
          <View>
            <Text variant="bodyLarge">{strings.worker}</Text>
            <Controller
              control={control}
              name="firstname"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.firstname)}
                    label={strings.firstname}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerFirstname"
                  />
                  <HelperText type="error" visible={Boolean(errors.firstname)}>
                    {errors.firstname?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={control}
              name="lastname"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.lastname)}
                    label={strings.lastname}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerLastname"
                  />
                  <HelperText type="error" visible={Boolean(errors.lastname)}>
                    {errors.lastname?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={control}
              name="surname"
              render={({field: {onChange}}) => (
                <View>
                  <TextInput
                    error={Boolean(errors.surname)}
                    label={strings.surname}
                    mode="outlined"
                    onChangeText={onChange}
                    style={{width: '100%'}}
                    testID="createWorkerSurname"
                  />
                  <HelperText type="error" visible={Boolean(errors.surname)}>
                    {errors.surname?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>
          <View>
            <Text variant="bodyLarge">{strings.birthDate}</Text>
            <Controller
              control={control}
              name="dob"
              render={({field: {value, onChange}}) => (
                <BirthPicker onChange={onChange} value={value} />
              )}
            />
          </View>
        </AvoidSoftInputView>
      </View>
    </SafeAreaView>
  );
};

export {CreateWorker};
