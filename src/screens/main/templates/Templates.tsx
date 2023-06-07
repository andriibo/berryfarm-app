import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/templates/styles';
import {getTemplates} from 'src/stores/services/firestore.service';
import {useFarm} from 'src/stores/slices/farm.slice';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {strings} from 'src/locales/locales';
import {colors} from 'src/styles/colors';
import {FirestoreServiceError} from 'src/stores/errors';
import {Toast} from 'src/components/toast';
import {Loader} from 'src/components/loader';

const Item = ({template}: {template: HarvestTemplate}) => (
  <TouchableOpacity onPress={() => {}} style={styles.container}>
    <View style={styles.titleWrapper}>
      <Text variant="headlineLarge">{template.product.title}</Text>
      <Text variant="headlineLarge">{template.location.title}</Text>
    </View>
    <View style={styles.titleWrapper}>
      <Text variant="titleLarge">{template.productQuality.title}</Text>
    </View>
    <View style={styles.titleWrapper}>
      <Text variant="titleLarge">{template.harvestPackage.title}</Text>
      <Text variant="titleLarge">
        {template.qty} {strings.items}
      </Text>
    </View>
  </TouchableOpacity>
);

const Templates = () => {
  const {firestorePrefix} = useFarm();
  const [templates, setTemplates] = useState<Array<HarvestTemplate>>([]);
  const [errorMessage, setError] = useState('');

  useEffect(() => {
    getTemplates(firestorePrefix)
      .then(data => {
        setTemplates(data);
      })
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      });
  }, [firestorePrefix]);

  if (!templates.length) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      {errorMessage && <Toast error={errorMessage} />}
      <FlatList
        data={templates}
        keyExtractor={item => `${item.id}`}
        renderItem={({item}) => <Item template={item} />}
      />
    </SafeAreaView>
  );
};

export {Templates};
