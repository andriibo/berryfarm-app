import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from 'src/screens/main/blocks/styles';
import {cleanHarvestTemplate} from 'src/stores/slices/harvest-template.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {getZones} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Zone} from 'src/stores/types/zone.type';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TemplatesStackParamList} from 'src/navigation/templates.stack';
import {Loader} from 'src/components/loader';
import {strings} from 'src/locales/locales';
import {cleanZone, setZone} from 'src/stores/slices/zone.slice';
import {colors} from 'src/styles/colors';

const iconSize = Dimensions.get('window').width / 8;

const BlockButton = ({block}: {block: Zone}) => {
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const dispatch = useAppDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setZone(block));
        navigation.navigate('Templates');
      }}>
      <Surface elevation={4} style={styles.surface}>
        <View style={styles.titleWrapper}>
          <IconButton icon={'map-marker-circle'} iconColor={colors.primary} size={iconSize} style={{marginTop: 26}} />
        </View>
        <Text style={styles.titleText}>{block.title}</Text>
      </Surface>
    </TouchableOpacity>
  );
};

const Blocks = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const dispatch = useAppDispatch();
  const {firestorePrefix} = useFarm();
  const [zones, setZones] = useState<Array<Zone>>([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    getZones(firestorePrefix)
      .then(setZones)
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      })
      .finally(() => setLoader(false));
  }, [dispatch, firestorePrefix]);

  useFocusEffect(
    useCallback(() => {
      dispatch(cleanHarvestTemplate());
    }, [dispatch]),
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        {zones.map(block => {
          return (
            <Fragment key={block.id}>
              <BlockButton block={block} />
            </Fragment>
          );
        })}
        <TouchableOpacity
          onPress={() => {
            dispatch(cleanZone());
            navigation.navigate('Templates');
          }}>
          <Surface elevation={4} style={[styles.surface]}>
            <View style={styles.titleWrapper}>
              <IconButton
                icon={'text-box-outline'}
                iconColor={colors.primary}
                size={iconSize}
                style={{marginTop: 30}}
              />
            </View>
            <Text style={styles.titleText}>{strings.allTemplates}</Text>
          </Surface>
        </TouchableOpacity>
        {zones.length % 2 === 0 && <View style={styles.surfaceBlank} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export {Blocks};
