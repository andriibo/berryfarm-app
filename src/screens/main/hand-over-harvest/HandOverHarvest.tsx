import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ActivityIndicator, Badge, Button, HelperText, IconButton, Text, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'src/styles/colors';
import styles from 'src/screens/main/hand-over-harvest/styles';
import {strings} from 'src/locales/locales';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {FirestoreServiceError} from 'src/stores/errors';
import {CreateHarvestRequest} from 'src/stores/types/createHarvestRequest';
import {cleanHarvest, IHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {
  createHarvest,
  getLocations,
  getProductQualityPackagesByProductId,
  getProductQualityPackagesByProductIdAndProductQualityId,
  getProducts,
  getWorkerByUuid,
} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {v4 as uuid} from 'uuid';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {Loader} from 'src/components/loader';
import {addErrorNotification, addWarnNotification} from 'src/stores/slices/notifications.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {
  useActiveDeviceId,
  useConnectedDevices,
  useIsDeviceConnected,
  useWeight,
} from 'src/stores/slices/connect-device.slice';
import {Buffer} from 'buffer';
import DropDownPicker from 'react-native-dropdown-picker';
import {Stack} from 'react-native-spacing-system';
import {ProductQualityPackages} from 'src/stores/types/productQualityPackages.type';
import {TemplatesStackParamList} from 'src/navigation/templates.stack';
import NumericInput from 'react-native-numeric-input';

type HarvestRequest = Omit<CreateHarvestRequest, 'uuid'>;

const HandOverHarvest = () => {
  const dispatch = useAppDispatch();
  const [worker, setWorker] = useState<Worker | null>(null);
  const harvest = useHarvest() as IHarvest;
  const {firestorePrefix} = useFarm();
  const isDeviceConnected = useIsDeviceConnected();
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const [loader, setLoader] = useState(false);
  const [loaderWeight, setLoaderWeight] = useState(false);
  const connectedDevices = useConnectedDevices();
  const activeDeviceId = useActiveDeviceId();
  const weightFromScales = useWeight();
  const [isWeightFromScales, setIsWeightFromScales] = useState(false);
  const [openDropdownProducts, setOpenDropdownProducts] = useState(false);
  const [openDropdownLocations, setOpenDropdownLocations] = useState(false);
  const [openDropdownProductQualities, setOpenDropdownProductQualities] = useState(false);
  const [openDropdownHarvestPackages, setOpenDropdownHarvestPackages] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [productQualityId, setProductQualityId] = useState<number | null>(null);
  const [harvestPackageId, setHarvestPackageId] = useState<number | null>(null);
  const [products, setProducts] = useState<Array<any>>([]);
  const [locations, setLocations] = useState<Array<any>>([]);
  const [productQualities, setProductQualities] = useState<Array<any>>([]);
  const [harvestPackages, setHarvestPackages] = useState<Array<any>>([]);
  const [productQualityPackages, setProductQualityPackages] = useState<Array<ProductQualityPackages>>([]);
  const [harvestPackageWeight, setHarvestPackageWeight] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: {errors, isDirty, isValid},
  } = useForm<HarvestRequest>({
    defaultValues: {
      qty: harvest.qty ?? undefined,
      harvestPackageId: harvest.harvestPackage?.id,
      locationId: harvest.location?.id,
      productId: harvest.product?.id,
      productQualityId: harvest.productQuality?.id,
      weightTotal: 0,
    },
    mode: 'onChange',
    resolver: yupResolver(validation.createHarvest),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        isDeviceConnected ? <IconButton icon="weight-kilogram" iconColor={colors.white} size={30} /> : null,
    });
  }, []);

  useEffect(() => {
    if (weightFromScales !== null) {
      setValue('weightTotal', weightFromScales, {shouldDirty: true, shouldValidate: true});
      setIsWeightFromScales(true);
    }
  }, [setValue, weightFromScales]);

  useFocusEffect(
    useCallback(() => {
      setLoader(true);
      const promises = [];

      if (harvest.workerUuid) {
        promises.push(
          getWorkerByUuid(harvest.workerUuid, firestorePrefix).then(data => {
            if (data) {
              setWorker(data);
            } else {
              dispatch(addErrorNotification(strings.workerNotFound));
            }
          }),
        );
      }

      if (!harvest.product) {
        promises.push(
          getProducts(firestorePrefix).then(data => {
            const items: any[] = [];

            data.forEach(product => {
              items.push({label: product.title, value: product.id});
            });

            setProducts(items);
          }),
        );
      }

      if (!harvest.location) {
        promises.push(
          getLocations(firestorePrefix).then(data => {
            const items: any[] = [];

            data.forEach(location => {
              items.push({label: location.title, value: location.id});
            });

            setLocations(items);
          }),
        );
      }

      if (harvest.product && (!harvest.productQuality || !harvest.harvestPackage)) {
        promises.push(onChangeProductId(harvest.product.id));
      }

      if (harvest.harvestPackage) {
        setHarvestPackageWeight(harvest.harvestPackage.weight);
      }

      Promise.all(promises)
        .catch(error => {
          if (error instanceof FirestoreServiceError) {
            dispatch(addErrorNotification(error.message));
          } else {
            console.error(error);
          }
        })
        .finally(() => setLoader(false));
    }, [dispatch, firestorePrefix, harvest.workerUuid]),
  );

  useFocusEffect(
    useCallback(() => {
      if (isDeviceConnected) {
        getWeightFromScales();
      } else {
        dispatch(addWarnNotification(strings.couldNotGetDataFromScales));
      }
    }, [dispatch]),
  );

  const getWeightFromScales = useCallback(() => {
    try {
      connectedDevices.forEach(connectedDevice => {
        if (connectedDevice.id === activeDeviceId) {
          connectedDevice.discoverAllServicesAndCharacteristics().then(device => {
            device.services().then(services => {
              if (services.length) {
                services[services.length - 1].characteristics().then(async characteristics => {
                  characteristics.forEach(characteristic => {
                    if (characteristic.isWritableWithResponse) {
                      const encodedString = Buffer.from('G::W\r\n').toString('base64');

                      characteristic.writeWithResponse(encodedString).then(() => setLoaderWeight(false));
                    }
                  });
                });
              }
            });
          });
        }
      });
    } catch (error) {
      setLoaderWeight(false);
      console.error(error);
    }
  }, [activeDeviceId, connectedDevices]);

  const onChangeProductId = useCallback(
    async (value: number) => {
      setProductId(value);
      setValue('productId', value, {shouldDirty: true, shouldValidate: true});
      setProductQualityId(null);
      setHarvestPackageId(null);
      getProductQualityPackagesByProductId(value, firestorePrefix).then(data => {
        setProductQualityPackages(data);
        const qualities: any[] = [];

        data.forEach(item => {
          qualities.push({
            label: item.productQuality.title,
            value: item.productQuality.id,
          });
        });

        setProductQualities([...new Map(qualities.map(item => [item.value, item])).values()]);
      });
    },
    [firestorePrefix, setValue],
  );

  const onChangeProductQualityId = useCallback(
    async (value: number) => {
      setProductQualityId(value);
      setValue('productQualityId', value, {shouldDirty: true, shouldValidate: true});
      if (!productQualityPackages.length && productQualityId) {
        const data = await getProductQualityPackagesByProductIdAndProductQualityId(
          productQualityId,
          value,
          firestorePrefix,
        );

        setProductQualityPackages(data);
      }

      const packages: any[] = [];

      productQualityPackages.forEach(items => {
        if (value === items.productQuality.id) {
          packages.push({
            label: items.harvestPackage.title,
            value: items.harvestPackage.id,
          });
        }
      });

      setHarvestPackages(packages);
    },
    [firestorePrefix, productQualityId, productQualityPackages, setValue],
  );

  const onChangeHarvestPackageId = useCallback(
    async (value: number) => {
      setHarvestPackageId(value);
      setValue('harvestPackageId', value, {shouldDirty: true, shouldValidate: true});
      productQualityPackages.forEach(item => {
        if (productQualityId === item.productQuality.id && harvestPackageId === item.harvestPackage.id) {
          setHarvestPackageWeight(item.harvestPackage.weight);
        }
      });
    },
    [harvestPackageId, productQualityId, productQualityPackages, setValue],
  );

  const handleSave = useCallback(
    async (data: HarvestRequest) => {
      if (data.weightTotal * data.qty <= harvestPackageWeight) {
        dispatch(addErrorNotification(strings.harvestWeightLessThenPackageWeight));

        return;
      }

      try {
        if (harvest.workerUuid) {
          data = {...data, workerUuid: harvest.workerUuid};
        } else {
          data = {...data, qrCodeUuid: harvest.qrCodeUuid};
        }

        createHarvest({...data, uuid: uuid()}, firestorePrefix);
        reset();
        dispatch(cleanHarvest());
        navigation.navigate('SuccessPage', {
          scenario: ScenariosEnum.templates,
        });
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      }
    },
    [dispatch, firestorePrefix, harvest, navigation, harvestPackageWeight],
  );

  const {weightTotal} = getValues();

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.worker}
          </Text>
          <Text variant="headlineSmall">
            {worker ? getFullname(worker) : strings.harvestTemporarilyFixedForWorkerQrCode}
            {worker && worker?.status !== WorkerStatus.active && (
              <>
                {' '}
                <Badge size={30}>{strings.notActive}</Badge>
              </>
            )}
          </Text>
          <Stack size={20} />
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.product}
          </Text>
          {harvest.product ? (
            <>
              <Text variant="headlineSmall">{harvest.product.title}</Text>
              <Stack size={20} />
            </>
          ) : (
            <Controller
              control={control}
              name="productId"
              render={() => (
                <View>
                  <DropDownPicker
                    items={products}
                    language="RU"
                    listMode="MODAL"
                    multiple={false}
                    onChangeValue={value => onChangeProductId(value as number)}
                    open={openDropdownProducts}
                    searchable={true}
                    setItems={setProducts}
                    setOpen={setOpenDropdownProducts}
                    setValue={setProductId}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 4,
                      borderColor: colors.outline,
                    }}
                    textStyle={{fontSize: 18}}
                    value={productId}
                  />
                  <HelperText type="error" visible={Boolean(errors.productId)}>
                    {errors.productId?.message}
                  </HelperText>
                </View>
              )}
            />
          )}
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.location}
          </Text>
          {harvest.location ? (
            <>
              <Text variant="headlineSmall">{harvest.location.title}</Text>
              <Stack size={20} />
            </>
          ) : (
            <Controller
              control={control}
              name="locationId"
              render={() => (
                <View>
                  <DropDownPicker
                    items={locations}
                    language="RU"
                    listMode="MODAL"
                    multiple={false}
                    onChangeValue={value =>
                      setValue('locationId', value as number, {shouldDirty: true, shouldValidate: true})
                    }
                    open={openDropdownLocations}
                    searchable={true}
                    setItems={setLocations}
                    setOpen={setOpenDropdownLocations}
                    setValue={setLocationId}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 4,
                      borderColor: colors.outline,
                    }}
                    textStyle={{fontSize: 18}}
                    value={locationId}
                  />
                  <HelperText type="error" visible={Boolean(errors.locationId)}>
                    {errors.locationId?.message}
                  </HelperText>
                </View>
              )}
            />
          )}
        </View>
        <View style={{zIndex: 1001}}>
          <Text style={styles.label} variant="headlineSmall">
            {strings.quality}
          </Text>
          {harvest.productQuality ? (
            <>
              <Text variant="headlineSmall">{harvest.productQuality.title}</Text>
              <Stack size={20} />
            </>
          ) : (
            <Controller
              control={control}
              name="productQualityId"
              render={() => (
                <View>
                  <DropDownPicker
                    containerStyle={{backgroundColor: colors.background, zIndex: 1001}}
                    disabled={!productId}
                    dropDownContainerStyle={{backgroundColor: colors.background}}
                    dropDownDirection="BOTTOM"
                    items={productQualities}
                    language="RU"
                    listMode="SCROLLVIEW"
                    multiple={false}
                    onChangeValue={value => onChangeProductQualityId(value as number)}
                    open={openDropdownProductQualities}
                    setItems={setProductQualities}
                    setOpen={setOpenDropdownProductQualities}
                    setValue={setProductQualityId}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 4,
                      borderColor: colors.outline,
                    }}
                    textStyle={{fontSize: 18}}
                    value={productQualityId}
                  />
                  <HelperText type="error" visible={Boolean(errors.productQualityId)}>
                    {errors.productQualityId?.message}
                  </HelperText>
                </View>
              )}
            />
          )}
        </View>
        <View style={{zIndex: 1000}}>
          <Text style={styles.label} variant="headlineSmall">
            {strings.package}
          </Text>
          {harvest.harvestPackage ? (
            <>
              <Text variant="headlineSmall">{harvest.harvestPackage.title}</Text>
              <Stack size={20} />
            </>
          ) : (
            <Controller
              control={control}
              name="harvestPackageId"
              render={() => (
                <View>
                  <DropDownPicker
                    containerStyle={{backgroundColor: colors.background, zIndex: 1001}}
                    disabled={!productQualityId}
                    disabledStyle={{borderColor: colors.surfaceVariant}}
                    dropDownContainerStyle={{backgroundColor: colors.background}}
                    dropDownDirection="BOTTOM"
                    items={harvestPackages}
                    language="RU"
                    listMode="SCROLLVIEW"
                    multiple={false}
                    onChangeValue={value => onChangeHarvestPackageId(value as number)}
                    open={openDropdownHarvestPackages}
                    setItems={setHarvestPackages}
                    setOpen={setOpenDropdownHarvestPackages}
                    setValue={setHarvestPackageId}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 4,
                      borderColor: colors.outline,
                    }}
                    textStyle={{fontSize: 18}}
                    value={harvestPackageId}
                  />
                  <HelperText type="error" visible={Boolean(errors.harvestPackageId)}>
                    {errors.harvestPackageId?.message}
                  </HelperText>
                </View>
              )}
            />
          )}
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.numberOfBoxes}
          </Text>
          {harvest.qty !== null ? (
            <>
              <Text variant="headlineSmall">{harvest.qty}</Text>
              <Stack size={20} />
            </>
          ) : (
            <Controller
              control={control}
              name="qty"
              render={({field}) => (
                <View>
                  <NumericInput
                    leftButtonBackgroundColor={colors.primary}
                    minValue={1}
                    onChange={field.onChange}
                    rightButtonBackgroundColor={colors.primary}
                    rounded
                  />
                  <HelperText type="error" visible={Boolean(errors.qty)}>
                    {errors.qty?.message}
                  </HelperText>
                </View>
              )}
            />
          )}
        </View>
        {!loaderWeight ? (
          <View style={{marginTop: -10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.label} variant="headlineSmall">
                {strings.weightKg}
              </Text>
              {isDeviceConnected && (
                <IconButton
                  icon="reload"
                  onPress={() => {
                    setLoaderWeight(true);
                    setTimeout(() => getWeightFromScales(), 1000);
                  }}
                  size={30}
                />
              )}
            </View>
            {!loaderWeight && (
              <Controller
                control={control}
                name="weightTotal"
                render={({field}) => (
                  <View>
                    <TextInput
                      disabled={isWeightFromScales}
                      error={Boolean(errors.weightTotal)}
                      inputMode="decimal"
                      keyboardType="decimal-pad"
                      mode="outlined"
                      // @ts-ignore
                      onChangeText={field.onChange}
                      style={{width: '100%'}}
                      testID="weightTotal"
                      value={!isWeightFromScales && field.value === 0 ? '' : `${field.value}`}
                    />
                    <HelperText type="error" visible={Boolean(errors.weightTotal)}>
                      {errors.weightTotal?.message}
                    </HelperText>
                  </View>
                )}
              />
            )}
            <Stack size={20} />
          </View>
        ) : (
          <>
            <ActivityIndicator color={colors.primary} size="small" />
            <Stack size={20} />
          </>
        )}
        <View style={{alignItems: 'center'}}>
          <Button
            disabled={!isDirty || !isValid || !weightTotal}
            mode="contained"
            onPress={handleSubmit(handleSave)}
            style={styles.btn}>
            Сохранить
          </Button>
          <Stack size={20} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export {HandOverHarvest};
