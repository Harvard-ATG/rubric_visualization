import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect';
import { selectorSelected } from '../eventTypes';

const Selector = (props) => {
  const {
    labelText, options, selectorKey, selectorValue, dispatch,
  } = props;

  return (
    <SimpleSelect
      renderLabel={labelText}
      assistiveText="Use arrow keys to navigate options."
      value={selectorValue}
      onChange={(event) => dispatch(
        { type: selectorSelected, selectorKey, value: event.target.innerText },
      )}
    >
      {options.map((option, index) => (
        <SimpleSelect.Option
          key={uuidv4()}
          id={`${selectorKey}-${index}`}
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
  selectorKey: PropTypes.string.isRequired,
  selectorValue: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Selector;
