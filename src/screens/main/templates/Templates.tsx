import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/templates/styles';
import {getTemplatesByLocationIds} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {strings} from 'src/locales/locales';
import {FirestoreServiceError} from 'src/stores/errors';
import {Loader} from 'src/components/loader';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setHarvestTemplate} from 'src/stores/slices/harvest-template.slice';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';
import {TemplatesStackParamList} from 'src/navigation/templates.stack';
import {colors} from 'src/styles/colors';
import {useZone} from 'src/stores/slices/zone.slice';
import {getTitle} from 'src/helpers/screen-options.helper';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';
import {sortTemplatesByLocation} from 'src/helpers/sort.helper';

const Item = ({template, scanQrCode}: {template: HarvestTemplate; scanQrCode: (template: HarvestTemplate) => void}) => {
  const zone = useZone();
  const locationColor = zone.locations.some(location => location.id === template.location?.id)
    ? colors.primary
    : colors.onSurfaceVariant;

  return (
    <TouchableOpacity onPress={() => scanQrCode(template)}>
      <Surface elevation={2} style={styles.surface}>
        <View style={styles.titleWrapper}>
          <Text variant="headlineMedium">{template.product?.title}</Text>
          <Text style={{color: locationColor}} variant="headlineMedium">
            {template.location?.title}
          </Text>
        </View>
        <View style={styles.titleWrapper}>
          <Text variant="titleLarge">{template.productQuality?.title}</Text>
        </View>
        <View style={styles.titleWrapper}>
          <Text variant="titleLarge">{template.harvestPackage?.title}</Text>
          {template.qty && (
            <Text variant="titleLarge">
              {template.qty} {strings.items}
            </Text>
          )}
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const Templates = () => {
  const dispatch = useAppDispatch();
  const isInternetConnected = useIsInternetConnected();
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const {firestorePrefix} = useFarm();
  const [templates, setTemplates] = useState<Array<HarvestTemplate>>([]);
  const [loader, setLoader] = useState(false);
  const zone = useZone();

  useEffect(() => {
    const title = getTitle(
      zone.id !== 0 ? `${strings.templates} - ${zone.title}` : strings.templates,
      isInternetConnected,
    );

    navigation.setOptions({
      title,
    });
  }, [isInternetConnected, navigation, zone]);

  useEffect(() => {
    setLoader(true);
    const locationIds = zone.locations.map(location => location.id);

    getTemplatesByLocationIds(firestorePrefix, locationIds)
      .then(data => {
        const sortedItems = sortTemplatesByLocation(data);

        setTemplates(sortedItems);
      })
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      })
      .finally(() => setLoader(false));
  }, [dispatch, firestorePrefix, zone]);

  const scanQrCode = useCallback(
    (template: HarvestTemplate) => {
      const harvestTemplate = {
        qty: template.qty,
        harvestPackage: template.harvestPackage,
        location: template.location,
        product: template.product,
        productQuality: template.productQuality,
      };

      dispatch(setHarvestTemplate(harvestTemplate));
      navigation.navigate('ScanQrCode', {
        scenario: ScenariosEnum.templates,
      });
    },
    [dispatch, navigation],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={{flex: 1, paddingVertical: '2%'}}>
        <FlatList
          data={templates}
          keyExtractor={item => `${item.id}`}
          renderItem={({item}) => <Item scanQrCode={scanQrCode} template={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export {Templates};
