import React from 'react';

import * as eventTypes from './eventTypes';

export const AppContext = React.createContext(null);

export const initialState = {
  businessData: {
    assignments: [], submissions: [], students: [], sections: [], denormalized_data: [],
  },
  visualizationData: {
    heatMapData: [],
  },
  processing: {
    loadingBusinessData: true,
    pivotingHeatMap: false,
    pivotedHeatMap: false,
    error: false,
    errorMessage: '',
  },
  controls: {
    selectors: {
      showingRubrics: { values: ['All assignments'], selected: 'All assignments' },
      showSections: { values: ['Aggregated', 'By Sections'], selected: 'By Sections' },
    },
    checkLists: {
      sections: { values: [], checked: [] },
    },
  },
  navigation: {
    activeTab: 'compareAssignments',
  },
};

// Helper to refactor the process of updating a selector's set of choices
const updateSelectorValues = (key, value, state) => {
  const returnState = { ...state };
  returnState.controls.selectors[key].values = value;
  return returnState;
};

// Helper to refactor the process of updating a selector's selection
const updateSelectorSelection = (key, value, state) => {
  const returnState = { ...state };
  returnState.controls.selectors[key].selected = value;
  return returnState;
};

// Helper to refactor the process of updating a selector's set of choices
const updateCheckListValues = (key, value, state) => {
  const returnState = { ...state };
  returnState.controls.checkLists[key].values = value;
  returnState.controls.checkLists[key].checked = value;
  return returnState;
};

// Helper to refactor the process of updating a checklist select-all
const updateCheckListSelectionAll = (key, state) => {
  const returnState = { ...state };
  const list = returnState.controls.checkLists[key];
  if (
    (list.checked.length > 0 && list.checked.length < list.values.length)
    || list.checked.length === list.values.length
  ) {
    // clear all
    returnState.controls.checkLists[key].checked = [];
    return returnState;
  }
  // check all
  returnState.controls.checkLists[key].checked = [...returnState.controls.checkLists[key].values];
  return returnState;
};

// Helper to refactor the process of updating a checklist single selection
const updateCheckListSelection = (key, value, state) => {
  const returnState = { ...state };
  if (returnState.controls.checkLists[key].checked.indexOf(value) !== -1) {
    returnState.controls.checkLists[key].checked = returnState.controls.checkLists[key].checked
      .filter((v) => v !== value);
  } else {
    returnState.controls.checkLists[key].checked.push(value);
  }
  return returnState;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case eventTypes.businessDataFetching:
      return {
        ...state,
        processing: {
          ...state.processing,
          loadingBusinessData: true,
        },
      };
    case eventTypes.businessDataFetched:
      return {
        ...state,
        businessData: action.value,
        processing: {
          ...state.processing,
          loadingBusinessData: false,
        },
      };
    case eventTypes.businessDataFetchErrored:
      return {
        ...state,
        processing: {
          ...state.processing,
          loadingBusinessData: false,
          error: true,
          errorMessage: action.value,
        },
      };
    case eventTypes.heatMapDataPivoting:
      return {
        ...state,
        processing: {
          ...state.processing,
          pivotingHeatMap: true,
        },
      };
    case eventTypes.heatMapDataPivoted:
      return {
        ...state,
        visualizationData: {
          ...state.visualizationData,
          heatMapData: action.value,
        },
        processing: {
          ...state.processing,
          pivotingHeatMap: false,
          pivotedHeatMap: true,
        },
      };
    case eventTypes.heatMapDataPivotErrored:
      return {
        ...state,
        processing: {
          ...state.processing,
          pivotingHeatMap: false,
          error: true,
          errorMessage: action.value,
        },
      };
    case eventTypes.selectorValuesUpdated:
      return updateSelectorValues(action.selectorKey, action.value, state);
    case eventTypes.selectorSelected:
      return updateSelectorSelection(action.selectorKey, action.value, state);
    case eventTypes.checkListValuesUpdated:
      return updateCheckListValues(action.checkListKey, action.value, state);
    case eventTypes.checkListCheckedAll:
      return updateCheckListSelectionAll(action.checkListKey, state);
    case eventTypes.checkBoxChecked:
      return updateCheckListSelection(action.checkListKey, action.value, state);
    default:
      return state;
  }
};
