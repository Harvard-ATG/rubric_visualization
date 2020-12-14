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
      sections: { values: ['All sections'], selected: 'All sections' },
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
          error: true,
          errorMessage: action.value,
        },
      };
    case eventTypes.selectorValuesUpdated:
      return updateSelectorValues(action.selectorKey, action.value, state);
    case eventTypes.selectorSelected:
      return updateSelectorSelection(action.selectorKey, action.value, state);
    default:
      return state;
  }
};
