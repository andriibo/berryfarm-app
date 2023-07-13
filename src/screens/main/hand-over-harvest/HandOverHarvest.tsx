import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Badge, Button, HelperText, IconButton, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'src/styles/colors';
import styles from 'src/screens/main/hand-over-harvest/styles';
import {strings} from 'src/locales/locales';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {FirestoreServiceError} from 'src/stores/errors';
import {CreateHarvestRequest} from 'src/stores/types/createHarvestRequest';
import {IHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {createHarvest, getWorkerByUuid} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {v4 as uuid} from 'uuid';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {Loader} from 'src/components/loader';
import {HandOverHarvestStackParamList} from 'src/navigation/handOverHarvest.stack';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {useIsDeviceConnected} from 'src/stores/slices/connect-device.slice';

type HarvestRequest = Omit<CreateHarvestRequest, 'uuid'>;

const HandOverHarvest = () => {
  const dispatch = useAppDispatch();
  const [worker, setWorker] = useState<Worker | null>(null);
  const harvest = useHarvest() as IHarvest;
  const {firestorePrefix} = useFarm();
  const isDeviceConnected = useIsDeviceConnected();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const [loader, setLoader] = useState(false);
  const workerName = useMemo(() => {
    if (worker) {
      return (
        <>
          {getFullname(worker)} {worker?.status !== WorkerStatus.active && <Badge size={30}>{strings.notActive}</Badge>}
        </>
      );
    }

    return strings.harvestTemporarilyFixedForWorkerQrCode;
  }, [worker]);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isDirty, isValid},
  } = useForm<HarvestRequest>({
    defaultValues: {
      qty: harvest.qty,
      harvestPackageId: harvest.harvestPackage.id,
      locationId: harvest.location.id,
      productId: harvest.product.id,
      productQualityId: harvest.productQuality.id,
      weightTotal: 0,
    },
    mode: 'onChange',
    resolver: yupResolver(validation.createHarvest),
  });

  useFocusEffect(
    useCallback(() => {
      if (harvest.workerUuid) {
        setLoader(true);
        getWorkerByUuid(harvest.workerUuid, firestorePrefix)
          .then(data => {
            if (data) {
              setWorker(data);
            } else {
              dispatch(addErrorNotification(strings.workerNotFound));
            }
          })
          .catch(error => {
            if (error instanceof FirestoreServiceError) {
              dispatch(addErrorNotification(error.message));
            } else {
              console.error(error);
            }
          })
          .finally(() => setLoader(false));
      }
    }, [dispatch, firestorePrefix, harvest]),
  );

  const handleSave = useCallback(
    async (data: HarvestRequest) => {
      try {
        if (harvest.workerUuid) {
          data = {...data, workerUuid: harvest.workerUuid};
        } else {
          data = {...data, qrCodeUuid: harvest.qrCodeUuid};
        }

        createHarvest({...data, uuid: uuid()}, firestorePrefix);
        reset();
        navigation.navigate('SuccessPage', {
          scenario: ScenariosEnum.handOverHarvest,
        });
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      }
    },
    [dispatch, firestorePrefix, harvest, navigation, reset],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.weightIcon}>
          <IconButton icon="weight-kilogram" iconColor={isDeviceConnected ? colors.primary : colors.error} size={30} />
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.worker}
          </Text>
          <Text variant="titleLarge">{workerName}</Text>
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.location}
          </Text>
          <Text variant="headlineSmall">{harvest.location.title}</Text>
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.product}
          </Text>
          <Text variant="headlineSmall">{harvest.product.title}</Text>
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.quality}
          </Text>
          <Text variant="headlineSmall">{harvest.productQuality.title}</Text>
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.package}
          </Text>
          <Text variant="headlineSmall">
            {harvest.harvestPackage.title} / {harvest.qty} {strings.items}
          </Text>
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.weightKg}
          </Text>
          <Controller
            control={control}
            name="weightTotal"
            render={({field}) => (
              <View>
                <TextInput
                  {...field}
                  error={Boolean(errors.weightTotal)}
                  inputMode="decimal"
                  keyboardType="decimal-pad"
                  mode="flat"
                  onChangeText={text => {
                    field.onChange(text);
                  }}
                  style={{width: '100%'}}
                  testID="weightTotal"
                  value={field.value ? `${field.value}` : ''}
                />
                <HelperText type="error" visible={Boolean(errors.weightTotal)}>
                  {errors.weightTotal?.message}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export {HandOverHarvest};
