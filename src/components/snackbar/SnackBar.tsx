import React, {useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {
  INotification,
  NotificationDict,
  NotificationType,
  removeNotification,
  useNotificationsAll,
} from 'src/stores/slices/notifications.slice';
import {IconButton} from 'react-native-paper';
import styles from './styles';
import {colors} from 'src/styles/colors';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';

const NotificationColors: {[key in NotificationType]: string} = {
  warning: colors.warning,
  error: colors.error,
  success: colors.success,
  info: colors.info,
} as const;

const warningOfflineColor = colors.inverseSurface;

const icons: {[key in NotificationType]: string} = {
  warning: 'alert',
  error: 'alert-circle',
  success: 'check-circle',
  info: 'alpha-i-circle',
};

const TIMEOUT = 5000;

const Toast: React.FC<INotification> = ({type, message, id}) => {
  const dispatch = useAppDispatch();
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(
    () => (!isInternetConnected && type === NotificationDict.Warning ? warningOfflineColor : NotificationColors[type]),
    [isInternetConnected, type],
  );
  const animatedOpacity = useSharedValue(0);
  const animationStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animatedOpacity.value, {
      duration: 700,
      easing: Easing.linear,
    }),
  }));

  const dismissNotification = () => dispatch(removeNotification(id));

  useEffect(() => {
    animatedOpacity.value = 1;
  }, [animatedOpacity]);
  if (message) {
    return (
      <Animated.View style={[styles.toastWrapper, {backgroundColor}, animationStyle]} testID="snackBar">
        <IconButton icon={icons[type]} iconColor={colors.white} size={25} />
        <Text style={styles.message}>{message}</Text>
        <IconButton icon="close-thick" iconColor={colors.white} onPress={dismissNotification} size={25} testID="hide" />
      </Animated.View>
    );
  }

  console.warn('No notification shown because no `message` has been passed to the snackbar component.');

  return null;
};

const keyExtractor = (item: INotification) => item.id;

const SnackBar = () => {
  const {top} = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const allNotifications = useNotificationsAll();

  useEffect(() => {
    const interval = setInterval(() => {
      if (allNotifications.length) {
        dispatch(removeNotification(allNotifications[0].id));
      }
    }, TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [allNotifications, dispatch]);

  const wrapperStyle = useMemo(() => StyleSheet.flatten([styles.wrapper, {top: top + 2}]), [top]);

  return (
    <FlatList
      bounces
      data={allNotifications}
      keyExtractor={keyExtractor}
      renderItem={({item}) => <Toast {...item} />}
      style={wrapperStyle}
    />
  );
};

export {SnackBar};
