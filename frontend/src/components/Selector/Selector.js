import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect';

const Selector = (props) => {
  const {
    labelText, options, selectorIdentifier, selectorValue, dispatch,
  } = props;

  return (
    <SimpleSelect
      renderLabel={labelText}
      assistiveText="Use arrow keys to navigate options."
      value={selectorValue}
      onChange={(event) => dispatch({ type: `${props.selectorIdentifier}-setValue`, value: event.target.innerText })}
    >
      {options.map((option, index) => (
        <SimpleSelect.Option
          key={uuidv4()}
          id={`${selectorIdentifier}-${index}`}
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
  selectorIdentifier: PropTypes.string.isRequired,
  selectorValue: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Selector;
