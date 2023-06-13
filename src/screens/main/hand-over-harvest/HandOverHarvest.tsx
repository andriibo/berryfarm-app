import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'src/styles/colors';
import styles from 'src/screens/main/hand-over-harvest/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {FirestoreServiceError} from 'src/stores/errors';
import {CreateHarvestRequest} from 'src/stores/requests/createHarvest.request';
import {IHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {
  createHarvest,
  getWorkerByUuid,
} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/farm.slice';
import {Worker} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {v4 as uuid} from 'uuid';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {Loader} from 'src/components/loader';

const HandOverHarvest = () => {
  const [errorMessage, setError] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const harvest = useHarvest() as IHarvest;
  const {firestorePrefix} = useFarm();
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isDirty, isValid},
  } = useForm<CreateHarvestRequest>({
    defaultValues: {weight: ''},
    mode: 'onChange',
    resolver: yupResolver(validation.createHarvest),
  });

  useEffect(() => {
    getWorkerByUuid(harvest.workerUuid, firestorePrefix)
      .then(data => {
        if (data) {
          setWorker(data);
        } else {
          setError(strings.workerNotFound);
        }
      })
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      });
  }, [firestorePrefix, harvest.workerUuid]);

  const handleSave = useCallback(
    async ({weight}: FieldValues) => {
      setError('');
      try {
        const data = {
          uuid: uuid(),
          qty: harvest.qty,
          harvestPackageId: harvest.harvestPackage.id,
          locationId: harvest.location.id,
          productId: harvest.product.id,
          productQualityId: harvest.productQuality.id,
          workerUuid: harvest.workerUuid,
          weightTotal: weight,
        };

        await createHarvest(data, firestorePrefix);
        reset();
        navigation.navigate('SuccessPage', {
          scenario: ScenariosEnum.handOverHarvest,
        });
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [firestorePrefix, harvest, navigation, reset],
  );

  if (!worker) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      {errorMessage && <Toast error={errorMessage} />}
      <View style={styles.container}>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            {strings.worker}
          </Text>
          <Text variant="titleLarge">{getFullname(worker)}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            {strings.location}
          </Text>
          <Text variant="headlineSmall">{harvest.location.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            {strings.product}
          </Text>
          <Text variant="headlineSmall">{harvest.product.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            {strings.quality}
          </Text>
          <Text variant="headlineSmall">{harvest.productQuality.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            {strings.package}
          </Text>
          <Text variant="headlineSmall">
            {harvest.harvestPackage.title} / {harvest.qty} {strings.items}
          </Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold'}} variant="headlineSmall">
            Вес
          </Text>
          <Controller
            control={control}
            name="weight"
            render={({field}) => (
              <View>
                <TextInput
                  {...field}
                  error={Boolean(errors.weight)}
                  inputMode="decimal"
                  keyboardType="decimal-pad"
                  mode="flat"
                  onChangeText={text => {
                    field.onChange(text);
                  }}
                  style={{width: '100%'}}
                  testID="weight"
                />
                <HelperText type="error" visible={Boolean(errors.weight)}>
                  {errors.weight?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Button
            disabled={!isDirty || !isValid}
            mode="contained"
            onPress={handleSubmit(handleSave)}
            style={styles.btn}>
            Сохранить
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {HandOverHarvest};