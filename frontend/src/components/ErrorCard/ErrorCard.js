import React, { useContext } from 'react';

import { Text, View } from '@instructure/ui';

import { AppContext } from '../AppState';

const ErrorCard = () => {
  const { state } = useContext(AppContext);

  let message;

  switch (state.processing.errorMessage) {
    case 'Bad Request':
      message = 'There was an issue requesting data from the Canvas API.';
      break;
    case 'No Content':
      message = 'The data supplied from Canvas was either insufficient, or not in the correct format to support this tool.';
      break;
    default:
      message = 'There was an unexpected error fulfilling your request.';
  }

  return (
    <div>
      <View as="section" padding="large" shadow="above">
        <div className="section-title">
          <Text size="large" weight="light">
            Sorry, there was an error.
          </Text>
        </div>
        <br />
        <Text>
          { `${message} If the problem persists, please contact the administrator 
          at atg@fas.harvard.edu` }
        </Text>
      </View>
    </div>
  );
};

export default ErrorCard;
