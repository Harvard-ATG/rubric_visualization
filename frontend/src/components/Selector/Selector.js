import React, {useState}from 'react';
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect'
import { Flex } from '@instructure/ui-flex/lib/Flex'

const Selector = (props) => {
  const [selectorValue, setSelectorValue] = useState();
  
  const label = props.labelText !== "" ? (
    <label className="select-label" htmlFor="viewSelect">{ props.labelText }</label>
  ) : (
    ""
  );

  return (
    <Flex>
      <Flex.Item>
        { label }
      </Flex.Item>
      <Flex.Item>
      <SimpleSelect
        // renderLabel={props.labelText}
        id="viewSelect"
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
      </Flex.Item>
    </Flex>
  );
};

export default Selector;
