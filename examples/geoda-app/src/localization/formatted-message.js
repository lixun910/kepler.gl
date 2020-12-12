import React from 'react';
import {FormattedMessage} from 'react-intl';

const ExhancedFormattedMessage = props => (
  <FormattedMessage
    id={props.id}
    // Us id as default Message to prevent error being thrown
    defaultMessage={props.defaultMessage || props.id}
    {...props}
  />
);

export default ExhancedFormattedMessage;
