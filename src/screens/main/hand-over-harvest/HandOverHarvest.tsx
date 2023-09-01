import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
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
import {setHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {
  createHarvest,
  getProductQualityPackagesByProductId,
  getProducts,
  getWorkerByUuid,
} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {v4 as uuid} from 'uuid';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {Stack} from 'react-native-spacing-system';
import {ProductQualityPackages} from 'src/stores/types/productQualityPackages.type';
import {TemplatesStackParamList} from 'src/navigation/templates.stack';
import NumericInput from 'react-native-numeric-input';
import {sortItemsByLabel} from 'src/helpers/sort.helper';
import {Product} from 'src/stores/types/product.type';

type HarvestRequest = Omit<CreateHarvestRequest, 'uuid'>;
const iconArrowDown = (style: StyleProp<ViewStyle>) => <IconButton icon="chevron-down" style={style} />;
const iconIndicator = (style: StyleProp<ViewStyle>) => <ActivityIndicator style={style} />;

const HandOverHarvest = () => {
  const dispatch = useAppDispatch();
  const [worker, setWorker] = useState<Worker | null>(null);
  const harvest = useHarvest();
  const {firestorePrefix} = useFarm();
  const isDeviceConnected = useIsDeviceConnected();
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<TemplatesStackParamList, 'HandOverHarvest'>>();
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
  const [qty, setQty] = useState(0);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [productQualityId, setProductQualityId] = useState<number | null>(null);
  const [harvestPackageId, setHarvestPackageId] = useState<number | null>(null);
  const [productModels, setProductModels] = useState<Array<Product>>([]);
  const [products, setProducts] = useState<Array<ItemType<number>>>([]);
  const [locations, setLocations] = useState<Array<ItemType<number>>>([]);
  const [productQualities, setProductQualities] = useState<Array<ItemType<number>>>([]);
  const [productQualitiesLoader, setProductQualitiesLoader] = useState(false);
  const [harvestPackages, setHarvestPackages] = useState<Array<ItemType<number>>>([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      promises.push(
        getProducts(firestorePrefix).then(data => {
          setProductModels(data);
          const items: any[] = [];

          data.forEach(product => {
            items.push({label: product.title, value: product.id});
          });

          const sortedProducts = sortItemsByLabel(items);

          setProducts(sortedProducts);
        }),
      );

      if (harvest.product) {
        getLocationsByProductId(harvest.product.id);
        promises.push(
          getProductQualityPackagesByProductId(harvest.product.id, firestorePrefix).then(data => {
            setProductQualityPackages(data);
            const qualities: any[] = [];

            data.forEach(item => {
              qualities.push({
                label: item.productQuality.title,
                value: item.productQuality.id,
              });
            });

            const sortedProductQualities = sortItemsByLabel([
              ...new Map(qualities.map(item => [item.value, item])).values(),
            ]);

            setProductQualities(sortedProductQualities);
          }),
        );
      }

      if (harvest.harvestPackage) {
        setHarvestPackageWeight(harvest.harvestPackage.weight);
      }

      Promise.all(promises)
        .then(() => {
          setTemplateListValues();
          setTemplateFormValues();
        })
        .catch(error => {
          if (error instanceof FirestoreServiceError) {
            dispatch(addErrorNotification(error.message));
          } else {
            console.error(error);
          }
        })
        .finally(() => {
          setLoader(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, firestorePrefix, harvest.harvestPackage, harvest.product, harvest.workerUuid]),
  );

  useFocusEffect(
    useCallback(() => {
      if (isDeviceConnected) {
        getWeightFromScales();
      } else {
        dispatch(addWarnNotification(strings.couldNotGetDataFromScales));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]),
  );

  const setTemplateFormValues = useCallback(() => {
    setProductId(harvest.product?.id ?? null);
    setLocationId(harvest.location?.id ?? null);
    setProductQualityId(harvest.productQuality?.id ?? null);
    setHarvestPackageId(harvest.harvestPackage?.id ?? null);
    setQty(harvest.qty ?? 0);
  }, [harvest]);

  const setTemplateListValues = () => {
    if (harvest.product && !products.length) {
      setProducts([{label: harvest.product.title, value: harvest.product.id}]);
    }

    if (harvest.location && !locations.length) {
      setLocations([{label: harvest.location.title, value: harvest.location.id}]);
    }

    if (harvest.productQuality && !productQualities.length) {
      setProductQualities([{label: harvest.productQuality.title, value: harvest.productQuality.id}]);
    }

    if (harvest.harvestPackage && !harvestPackages.length) {
      setHarvestPackages([{label: harvest.harvestPackage.title, value: harvest.harvestPackage.id}]);
    }
  };

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

  const getLocationsByProductId = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (productId: number) => {
      let items: any[] = [];
      const productModel = productModels.find(item => item.id === productId);

      if (productModel) {
        productModel.locations.forEach(location => {
          items.push({label: location.title, value: location.id});
        });

        items = sortItemsByLabel(items);
      }

      setLocations(items);
      if (!items.some(element => element.value === locationId)) {
        setLocationId(null);
      }
    },
    [locationId, productModels],
  );

  const onChangeProductId = useCallback(
    async (value: number) => {
      setProductId(value);
      setValue('productId', value, {shouldDirty: true, shouldValidate: true});
      getLocationsByProductId(value);
      setProductQualitiesLoader(true);
      getProductQualityPackagesByProductId(value, firestorePrefix)
        .then(data => {
          setProductQualityPackages(data);
          const qualities: any[] = [];

          data.forEach(item => {
            qualities.push({
              label: item.productQuality.title,
              value: item.productQuality.id,
            });
          });

          const sortedProductQualities = sortItemsByLabel([
            ...new Map(qualities.map(item => [item.value, item])).values(),
          ]);

          setProductQualities(sortedProductQualities);
        })
        .finally(() => setProductQualitiesLoader(false));
    },
    [firestorePrefix, getLocationsByProductId, setValue],
  );

  const onChangeProductQualityId = useCallback(
    (value: number) => {
      if (!productQualities.some(element => element.value === productQualityId)) {
        setProductQualityId(null);
      } else {
        setProductQualityId(value);
      }

      setValue('productQualityId', value, {shouldDirty: true, shouldValidate: true});

      const packages: any[] = [];

      productQualityPackages.forEach(items => {
        if (value === items.productQuality.id) {
          packages.push({
            label: items.harvestPackage.title,
            value: items.harvestPackage.id,
          });
        }
      });

      const sortedPackages = sortItemsByLabel([...new Map(packages.map(item => [item.value, item])).values()]);

      setHarvestPackages(sortedPackages);
    },
    [productQualities, productQualityId, productQualityPackages, setValue],
  );

  const onChangeHarvestPackageId = useCallback(
    (value: number) => {
      if (!harvestPackages.some(element => element.value === harvestPackageId)) {
        setHarvestPackageId(null);
      } else {
        setHarvestPackageId(value);
      }

      setValue('harvestPackageId', value, {shouldDirty: true, shouldValidate: true});
      productQualityPackages.forEach(item => {
        if (productQualityId === item.productQuality.id && harvestPackageId === item.harvestPackage.id) {
          setHarvestPackageWeight(item.harvestPackage.weight);
        }
      });
    },
    [harvestPackageId, harvestPackages, productQualityId, productQualityPackages, setValue],
  );

  const modifyHarvestTemplate = useCallback(
    (data: HarvestRequest) => {
      const harvestPackage = harvestPackages.find(
        element => element.value === data.harvestPackageId,
      ) as ItemType<number>;
      const location = locations.find(element => element.value === data.locationId) as ItemType<number>;
      const product = products.find(element => element.value === data.productId) as ItemType<number>;
      const productQuality = productQualities.find(
        element => element.value === data.productQualityId,
      ) as ItemType<number>;

      return {
        qty: data.qty,
        harvestPackage: {
          id: harvestPackage.value as number,
          title: harvestPackage.label as string,
          weight: harvestPackageWeight,
        },
        location: {id: location.value as number, title: location.label as string},
        product: {id: product.value as number, title: product.label as string},
        productQuality: {id: productQuality.value as number, title: productQuality.label as string},
      };
    },
    [harvestPackageWeight, harvestPackages, locations, productQualities, products],
  );

  const handleSave = useCallback(
    async (data: HarvestRequest) => {
      if (data.weightTotal * data.qty <= harvestPackageWeight) {
        dispatch(addErrorNotification(strings.harvestWeightLessThenPackageWeight));

        return;
      }

      try {
        data = harvest.workerUuid
          ? {...data, workerUuid: harvest.workerUuid}
          : {...data, qrCodeUuid: harvest.qrCodeUuid};

        createHarvest({...data, uuid: uuid()}, firestorePrefix);
        const harvestTemplate = modifyHarvestTemplate(data);

        dispatch(setHarvest(harvestTemplate));
        reset();
        navigation.navigate('SuccessPage', {scenario});
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, modifyHarvestTemplate, firestorePrefix, harvest, navigation, harvestPackageWeight],
  );

  const {weightTotal} = getValues();

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.area}>
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
          <Controller
            control={control}
            name="productId"
            render={() => (
              <View>
                <DropDownPicker
                  ArrowDownIconComponent={({style}) => iconArrowDown(style)}
                  items={products}
                  language="RU"
                  listItemContainerStyle={styles.listItemContainerStyle}
                  listItemLabelStyle={styles.listItemLabelStyle}
                  listMode="MODAL"
                  multiple={false}
                  onChangeValue={value => onChangeProductId(value as number)}
                  open={openDropdownProducts}
                  searchContainerStyle={styles.searchContainerStyle}
                  searchTextInputStyle={styles.searchTextInputStyle}
                  searchable={true}
                  setItems={setProducts}
                  setOpen={setOpenDropdownProducts}
                  setValue={setProductId}
                  style={styles.dropDownPickerStyle}
                  textStyle={styles.dropDownPickerTextStyle}
                  value={productId}
                />
                <HelperText type="error" visible={Boolean(errors.productId)}>
                  {errors.productId?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        <View>
          <Text style={[styles.label, !productId && styles.labelDisabled]} variant="headlineSmall">
            {strings.location}
          </Text>
          <Controller
            control={control}
            name="locationId"
            render={() => (
              <View>
                <DropDownPicker
                  ArrowDownIconComponent={({style}) => iconArrowDown(style)}
                  disabled={!productId}
                  disabledStyle={{borderColor: colors.surfaceVariant}}
                  items={locations}
                  language="RU"
                  listItemContainerStyle={styles.listItemContainerStyle}
                  listItemLabelStyle={styles.listItemLabelStyle}
                  listMode="MODAL"
                  multiple={false}
                  onChangeValue={value =>
                    setValue('locationId', value as number, {shouldDirty: true, shouldValidate: true})
                  }
                  open={openDropdownLocations}
                  searchContainerStyle={styles.searchContainerStyle}
                  searchTextInputStyle={styles.searchTextInputStyle}
                  searchable={true}
                  setItems={setLocations}
                  setOpen={setOpenDropdownLocations}
                  setValue={setLocationId}
                  style={styles.dropDownPickerStyle}
                  textStyle={styles.dropDownPickerTextStyle}
                  value={locationId}
                />
                <HelperText type="error" visible={Boolean(errors.locationId)}>
                  {errors.locationId?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        <View style={{zIndex: 1001}}>
          <Text
            style={[styles.label, (!productId || productQualitiesLoader) && styles.labelDisabled]}
            variant="headlineSmall">
            {strings.quality}
          </Text>
          <Controller
            control={control}
            name="productQualityId"
            render={() => (
              <View>
                <DropDownPicker
                  ArrowDownIconComponent={({style}) =>
                    productQualitiesLoader ? iconIndicator(style) : iconArrowDown(style)
                  }
                  containerStyle={{backgroundColor: colors.background, zIndex: 1001}}
                  disabled={!productId || productQualitiesLoader}
                  disabledStyle={{borderColor: colors.surfaceVariant}}
                  dropDownContainerStyle={{backgroundColor: colors.background}}
                  dropDownDirection="BOTTOM"
                  itemSeparator={true}
                  itemSeparatorStyle={styles.itemSeparatorStyle}
                  items={productQualities}
                  language="RU"
                  listMode="SCROLLVIEW"
                  multiple={false}
                  onChangeValue={value => onChangeProductQualityId(value as number)}
                  open={openDropdownProductQualities}
                  setItems={setProductQualities}
                  setOpen={setOpenDropdownProductQualities}
                  setValue={setProductQualityId}
                  style={styles.dropDownPickerStyle}
                  textStyle={styles.dropDownPickerTextStyle}
                  value={productQualityId}
                />
                <HelperText type="error" visible={Boolean(errors.productQualityId)}>
                  {errors.productQualityId?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        <View style={{zIndex: 1000}}>
          <Text
            style={[styles.label, (!productId || !productQualityId) && styles.labelDisabled]}
            variant="headlineSmall">
            {strings.package}
          </Text>
          <Controller
            control={control}
            name="harvestPackageId"
            render={() => (
              <View>
                <DropDownPicker
                  ArrowDownIconComponent={({style}) => iconArrowDown(style)}
                  disabled={!productId || !productQualityId}
                  disabledStyle={{borderColor: colors.surfaceVariant}}
                  items={harvestPackages}
                  language="RU"
                  listItemContainerStyle={styles.listItemContainerStyle}
                  listItemLabelStyle={styles.listItemLabelStyle}
                  listMode="MODAL"
                  multiple={false}
                  onChangeValue={value => onChangeHarvestPackageId(value as number)}
                  open={openDropdownHarvestPackages}
                  searchContainerStyle={styles.searchContainerStyle}
                  searchTextInputStyle={styles.searchTextInputStyle}
                  searchable={true}
                  setItems={setHarvestPackages}
                  setOpen={setOpenDropdownHarvestPackages}
                  setValue={setHarvestPackageId}
                  style={styles.dropDownPickerStyle}
                  textStyle={styles.dropDownPickerTextStyle}
                  value={harvestPackageId}
                />
                <HelperText type="error" visible={Boolean(errors.harvestPackageId)}>
                  {errors.harvestPackageId?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.label} variant="headlineSmall">
            {strings.numberOfBoxes}
          </Text>
          <Controller
            control={control}
            name="qty"
            render={({field}) => (
              <View>
                <NumericInput
                  leftButtonBackgroundColor={colors.primary}
                  minValue={1}
                  onChange={value => {
                    field.onChange(value);
                    setQty(value);
                  }}
                  rightButtonBackgroundColor={colors.primary}
                  rounded
                  step={1}
                  totalHeight={55}
                  value={qty}
                />
                <HelperText type="error" visible={Boolean(errors.qty)}>
                  {errors.qty?.message}
                </HelperText>
              </View>
            )}
          />
        </View>
        {!loaderWeight ? (
          <View style={{marginTop: -10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.label, isWeightFromScales && styles.labelDisabled]} variant="headlineSmall">
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
                      onChangeText={event => {
                        const sanitizedText = event.replace(/,/g, '.');

                        field.onChange(sanitizedText);
                      }}
                      outlineColor={isWeightFromScales ? colors.outlineVariant : colors.outline}
                      style={{width: '100%', fontSize: 22}}
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
            contentStyle={{height: 50}}
            disabled={!isDirty || !isValid || !weightTotal || loaderWeight}
            labelStyle={{fontSize: 18}}
            mode="contained"
            onPress={handleSubmit(handleSave)}
            style={styles.btn}>
            {strings.save}
          </Button>
          <Stack size={20} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export {HandOverHarvest};
