import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect';

const Selector = (props) => {
  const { labelText, options } = props;
  const [selectorValue, setSelectorValue] = useState();

  return (
    <SimpleSelect
      renderLabel={labelText}
      assistiveText="Use arrow keys to navigate options."
      value={selectorValue}
      onChange={(event) => setSelectorValue(event.target.value)}
    >
      {options.map((option, index) => (
        <SimpleSelect.Option
          key={uuidv4()}
          id={`option-${labelText}-${index}`}
          value={option}
        >
          { option }
        </SimpleSelect.Option>
      ))}
    </SimpleSelect>
  );
};

Selector.propTypes = {
  labelText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Selector;
