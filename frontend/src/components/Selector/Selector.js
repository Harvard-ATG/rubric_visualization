import React, {useState} from 'react';
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect'

const Selector = (props) => {
  const [selectorValue, setSelectorValue] = useState();

  return (
      <SimpleSelect
        renderLabel={props.labelText}
        assistiveText="Use arrow keys to navigate options."
        value={selectorValue}
        onChange={event => setSelectorValue(event.target.value)}
      >
        {props.options.map((option, index) => (
          <SimpleSelect.Option
            key={index}
            id={`option-${index}`}
            value={option}
          >
            { option }
          </SimpleSelect.Option>
        ))}
      </SimpleSelect>
  );
};

export default Selector;
