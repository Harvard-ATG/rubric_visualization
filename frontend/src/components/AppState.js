import React from 'react';

export const AppContext = React.createContext(null);

export const initialState = {
  businessData: {
    assignments: [], submissions: [], students: [], denormalized_data: [],
  },
  visualizationData: {
    heatMapData: [],
  },
  processing: {
    loadingBusinessData: true,
    pivotingHeatMap: false,
    error: false,
    errorMessage: '',
  },
  controls: {
    selectors: {
      showingRubrics: { values: ['All assignments'], selected: 'All assignments' },
      sortBy: { values: ['Due Date'], selected: 'Due Date' },
      sections: { values: ['All Sections'], selected: 'All Sections' },
      instructors: { values: ['All Instructors'], selected: 'All Instructors' },
    },
  },
  navigation: {
    activeTab: 'compareAssignments',
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'businessDataFetching':
      return {
        ...state,
        processing: {
          ...state.processing,
          loadingBusinessData: true,
        },
      };
    case 'businessDataFetched':
      return {
        ...state,
        businessData: action.value,
        processing: {
          ...state.processing,
          loadingBusinessData: false,
        },
      };
    case 'businessDataFetchErrored':
      return {
        ...state,
        processing: {
          ...state.processing,
          loadingBusinessData: false,
          error: true,
          errorMessage: action.value,
        },
      };
    case 'heatMapDataPivoting':
      return {
        ...state,
        processing: {
          ...state.processing,
          pivotingHeatMap: true,
        },
      };
    case 'heatMapDataPivoted':
      return {
        ...state,
        visualizationData: {
          ...state.visualizationData,
          heatMapData: action.value,
        },
        processing: {
          ...state.processing,
          pivotingHeatMap: false,
        },
      };
    case 'heatMapDataPivotErrored':
      return {
        ...state,
        processing: {
          ...state.processing,
          error: true,
          errorMessage: action.value,
        },
      };
    case 'showingRubricsValuesUpdated':
      return updateSelectorValues('showingRubrics', action.value, state);
    case 'showingRubricsSelected':
      return updateSelectorSelection('showingRubrics', action.value, state);
    default:
      return state;
  }
};


// Helper to refactor the process of updating a selector's set of choices
const updateSelectorValues = (selectorName, value, state) => {
  const returnState = { ...state };
  returnState.controls.selectors[selectorName].values = value;
  return returnState;
};

// Helper to refactor the process of updating a selector's selection
const updateSelectorSelection = (selectorName, value, state) => {
  const returnState = { ...state };
  returnState.controls.selectors[selectorName].selected = value;
  return returnState;
};
