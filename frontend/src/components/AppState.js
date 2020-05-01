import React from 'react';

export const AppContext = React.createContext(null);

export const initialState = {
  payload: {
    assignments: [], submissions: [], students: [], denormalized_data: [],
  },
  compareAssignments: {
    heatMapData: [],
    pivoted: false,
    error: false,
    message: '',
    selectors: {
      showingRubrics: { values: ['All assignments'], selected: 'All assignments' },
      sortBy: { values: ['Due Date'], selected: 'Due Date' },
      sections: { values: ['All Sections'], selected: 'All Sections' },
      instructors: { values: ['All Instructors'], selected: 'All Instructors' },
    },
  },
  loaded: false,
  placeholder: 'Loading',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'receivePayload':
      return {
        ...state,
        loaded: true,
        payload: action.value,
      };
    case 'receivePayloadError':
      return {
        ...state,
        loaded: true,
        placeholder: 'Something went wrong!',
      };
    case 'setHeatMapData':
      return {
        ...state,
        compareAssignments: {
          ...state.compareAssignments,
          heatMapData: action.value,
          pivoted: true,
        },
      };
    case 'setAssignmentNames':
      return {
        ...state,
        compareAssignments: {
          ...state.compareAssignments,
          selectors: {
            ...state.compareAssignments.selectors,
            showingRubrics: {
              ...state.compareAssignments.selectors.showingRubrics,
              values: ['All Rubrics', ...action.value],
            },
          },
        },
      };
    case 'compareAssignments-showingRubrics-setValue':
      return {
        ...state,
        compareAssignments: {
          ...state.compareAssignments,
          selectors: {
            ...state.compareAssignments.selectors,
            showingRubrics: {
              ...state.compareAssignments.selectors.showingRubrics,
              selected: action.value,
            },
          },
        },
      };
    default:
      return state;
  }
};
