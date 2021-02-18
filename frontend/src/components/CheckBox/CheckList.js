import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormFieldGroup } from '@instructure/ui';
import { ScreenReaderContent } from '@instructure/ui-a11y-content';
import { v4 as uuidv4 } from 'uuid';
import { checkListCheckedAll, checkBoxChecked } from '../eventTypes';

const CheckList = (props) => {
  const {
    list, listType, checkListKey, checkListChecked, dispatch,
  } = props;

  return (
    <FormFieldGroup
      description={(
        <ScreenReaderContent>
          <span id="groupLabel">Course sections to display</span>
        </ScreenReaderContent>
      )}
      rowSpacing="small"
    >
      <Checkbox
        aria-labelledby="groupLabel"
        label={`All ${listType}`}
        value="all"
        onChange={() => dispatch({
          type: checkListCheckedAll,
          checkListKey,
        })}
        checked={checkListChecked.length === list.length}
        indeterminate={checkListChecked.length > 0 && checkListChecked.length < list.length}
      />
      {list.map((option) => (
        <Checkbox
          key={uuidv4()}
          aria-labelledby={`groupLabel ${option}Label`}
          label={option}
          value={option}
          onChange={() => dispatch({
            type: checkBoxChecked,
            checkListKey,
            value: option,
          })}
          checked={checkListChecked.indexOf(option) !== -1}
        />
      ))}

    </FormFieldGroup>
  );
};

CheckList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  listType: PropTypes.string.isRequired,
  checkListKey: PropTypes.string.isRequired,
  checkListChecked: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default CheckList;
