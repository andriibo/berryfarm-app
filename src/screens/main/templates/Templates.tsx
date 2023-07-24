import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/templates/styles';
import {getTemplates} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/auth.slice';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {strings} from 'src/locales/locales';
import {colors} from 'src/styles/colors';
import {FirestoreServiceError} from 'src/stores/errors';
import {Loader} from 'src/components/loader';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setHarvest} from 'src/stores/slices/harvest.slice';
import {HandOverHarvestStackParamList} from 'src/navigation/handOverHarvest.stack';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';

const Item = ({template, scanQrCode}: {template: HarvestTemplate; scanQrCode: (template: HarvestTemplate) => void}) => (
  <TouchableOpacity onPress={() => scanQrCode(template)}>
    <Surface elevation={4} style={styles.surface}>
      <View style={styles.titleWrapper}>
        <Text variant="headlineLarge">{template.product.title}</Text>
        <Text variant="headlineLarge">{template.location?.title}</Text>
      </View>
      <View style={styles.titleWrapper}>
        <Text variant="titleLarge">{template.productQuality.title}</Text>
      </View>
      <View style={styles.titleWrapper}>
        <Text variant="titleLarge">{template.harvestPackage.title}</Text>
        {template.qty && (
          <Text variant="titleLarge">
            {template.qty} {strings.items}
          </Text>
        )}
      </View>
    </Surface>
  </TouchableOpacity>
);

const Templates = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const {firestorePrefix} = useFarm();
  const [templates, setTemplates] = useState<Array<HarvestTemplate>>([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    getTemplates(firestorePrefix)
      .then(setTemplates)
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      })
      .finally(() => setLoader(false));
  }, [dispatch, firestorePrefix]);

  const scanQrCode = useCallback(
    (template: HarvestTemplate) => {
      const harvest = {
        qty: template.qty,
        harvestPackage: template.harvestPackage,
        location: template.location,
        product: template.product,
        productQuality: template.productQuality,
      };

      dispatch(setHarvest(harvest));
      navigation.navigate('ScanQrCode', {
        scenario: ScenariosEnum.handOverHarvest,
      });
    },
    [dispatch, navigation],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background, marginTop: -10}}>
      <FlatList
        data={templates}
        keyExtractor={item => `${item.id}`}
        renderItem={({item}) => <Item scanQrCode={scanQrCode} template={item} />}
      />
    </SafeAreaView>
  );
};

export {Templates};
