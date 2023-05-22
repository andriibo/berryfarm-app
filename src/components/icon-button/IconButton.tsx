import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
  Props as FontAwesomeIconProps,
} from '@fortawesome/react-native-fontawesome';
import React, {ReactElement} from 'react';
import {
  GestureResponderEvent,
  Insets,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import styles from './styles';

interface IconButtonProps extends FontAwesomeIconProps {
  disabled?: boolean;
  hitSlop?: Insets;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  children?: ReactElement;
  iconStyle?: FontAwesomeIconStyle;
  testID?: string;
  textStyle?: object;
  title?: string;
  viewContainerStyles?: StyleProp<ViewStyle>;
}

const IconButton = ({
  disabled,
  hitSlop,
  onPress,
  size,
  iconStyle,
  testID,
  children,
  textStyle,
  title,
  viewContainerStyles,
  ...rest
}: IconButtonProps) => (
  <TouchableOpacity
    activeOpacity={0.6}
    disabled={disabled}
    hitSlop={hitSlop}
    onPress={onPress}
    style={viewContainerStyles || styles.viewContainerStyle}
    testID={testID}>
    <FontAwesomeIcon
      size={size || 28}
      style={iconStyle || styles.iconStyle}
      {...rest}
    />
    {title && <Text style={textStyle || styles.textStyle}>{title}</Text>}
    {children}
  </TouchableOpacity>
);

export {IconButton};
