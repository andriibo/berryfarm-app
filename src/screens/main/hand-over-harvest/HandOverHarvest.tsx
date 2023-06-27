import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, ScrollView, View} from 'react-native';
import {Button, HelperText, IconButton, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'src/styles/colors';
import styles from 'src/screens/main/hand-over-harvest/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {FirestoreServiceError} from 'src/stores/errors';
import {CreateHarvestRequest} from 'src/stores/types/createHarvestRequest';
import {IHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {createHarvest, getWorkerByUuid} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Worker} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {v4 as uuid} from 'uuid';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {HandOverHarvestStackParamList} from 'src/navigation/handOverHarvest.stack';
import {connectToWiFiScales} from 'src/stores/services/scales-wifi.service';
import {Buffer} from 'buffer';
import {wifiScalesKg, wifiScalesLb} from 'src/constants/constants';
import {Loader} from 'src/components/loader';

type HarvestRequest = Omit<CreateHarvestRequest, 'uuid'>;

const HandOverHarvest = () => {
  const [errorMessage, setError] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const harvest = useHarvest() as IHarvest;
  const {firestorePrefix} = useFarm();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const [manualInput, setManualInput] = useState(false);
  const [weightFromScales, setWeightFromScales] = useState(false);
  const [loader, setLoader] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
      setError('');
      connectToWiFiScales()
        .then(scalesWiFi => {
          if (scalesWiFi) {
            scalesWiFi.on('data', function (data) {
              let weight = (data as Buffer).toString();

              if (weight.includes(wifiScalesLb)) {
                setError(strings.unitOfScaleMeasurementMustBeKg);

                return;
              }

              weight = weight.substring(weight.indexOf(',') + 4, weight.lastIndexOf(wifiScalesKg)).trim();
              const formattedWeight = Number(parseFloat(weight).toFixed(2));
              const options = formattedWeight > 0 ? {shouldDirty: true, shouldValidate: true} : {};

              setValue('weightTotal', formattedWeight, options);
              setWeightFromScales(true);
              scalesWiFi.destroy();
              setLoader(false);
            });

            scalesWiFi.on('error', function () {
              scalesWiFi.destroy();
              setLoader(false);
            });
          } else {
            setLoader(false);
          }
        })
        .catch(error => setError(error));
    }, [setValue]),
  );

  useEffect(() => {
    setError('');
    if (harvest.workerUuid) {
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
    }
  }, [firestorePrefix, harvest.workerUuid]);

  const handleSave = useCallback(
    async (data: HarvestRequest) => {
      setError('');
      try {
        if (harvest.workerUuid) {
          data = {...data, workerUuid: harvest.workerUuid};
        } else {
          data = {...data, qrCodeUuid: harvest.qrCodeUuid};
        }

        await createHarvest({...data, uuid: uuid()}, firestorePrefix);
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

  const {weightTotal} = getValues();

  if (!harvest.qrCodeUuid && !worker && loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: colors.background}}>
      {errorMessage && <Toast error={errorMessage} />}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.worker}
          </Text>
          <Text variant="titleLarge">
            {worker ? getFullname(worker) : strings.harvestTemporarilyFixedForWorkerQrCode}
          </Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.location}
          </Text>
          <Text variant="headlineSmall">{harvest.location.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.product}
          </Text>
          <Text variant="headlineSmall">{harvest.product.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.quality}
          </Text>
          <Text variant="headlineSmall">{harvest.productQuality.title}</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.package}
          </Text>
          <Text variant="headlineSmall">
            {harvest.harvestPackage.title} / {harvest.qty} {strings.items}
          </Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.outline}} variant="headlineSmall">
            {strings.weightKg}
          </Text>
          {!manualInput && !weightFromScales && (
            <View style={{alignItems: 'center'}}>
              <Text style={{alignItems: 'center'}} variant="headlineSmall">
                Не удалось получить данные с весов
              </Text>
              <IconButton icon="alert-circle-check-outline" size={50} />
              <TouchableOpacity onPress={() => setManualInput(true)}>
                <Text
                  style={{
                    alignItems: 'center',
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                  }}
                  variant="headlineSmall">
                  Ввести данные вручную
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Controller
            control={control}
            name="weightTotal"
            render={({field}) => (
              <View>
                <TextInput
                  {...field}
                  disabled={!manualInput}
                  error={Boolean(errors.weightTotal)}
                  inputMode="decimal"
                  keyboardType="decimal-pad"
                  mode="flat"
                  onChangeText={text => {
                    field.onChange(text);
                  }}
                  style={{width: '100%'}}
                  testID="weightTotal"
                  value={weightTotal ? `${weightTotal}` : ''}
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
