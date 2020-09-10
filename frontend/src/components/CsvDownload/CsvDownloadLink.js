import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '@instructure/ui-text/lib/Text';

import { CSVLink } from 'react-csv';

const CsvDownloadLink = (props) => {
  const { text, data, headers } = props;

  return (
    <CSVLink data={data} headers={headers}>
      <Text>{ text }</Text>
    </CSVLink>
  );
};

CsvDownloadLink.defaultProps = {
  headers: null,
};

CsvDownloadLink.propTypes = {
  text: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headers: PropTypes.arrayOf(PropTypes.object),
};

export default CsvDownloadLink;
