import React from 'react';

export const AppContext = React.createContext(null);

// export const initialState = {
//   payload: {
//     assignments: [], submissions: [], students: [], denormalized_data: [],
//   },
//   compareAssignments: {
//     heatMapData: [],
//     pivoted: false,
//     error: false,
//     message: '',
//     selectors: {
//       showingRubrics: { values: ['All assignments'], selected: 'All assignments' },
//       sortBy: { values: ['Due Date'], selected: 'Due Date' },
//       sections: { values: ['All Sections'], selected: 'All Sections' },
//       instructors: { values: ['All Instructors'], selected: 'All Instructors' },
//     },
//   },
//   loaded: false,
//   placeholder: 'Loading',
// };

// export const reducer = (state, action) => {
//   switch (action.type) {
//     case 'receivePayload':
//       return {
//         ...state,
//         loaded: true,
//         payload: action.value,
//       };
//     case 'receivePayloadError':
//       return {
//         ...state,
//         loaded: true,
//         placeholder: 'Something went wrong!',
//       };
//     case 'setHeatMapData':
//       return {
//         ...state,
//         compareAssignments: {
//           ...state.compareAssignments,
//           heatMapData: action.value,
//           pivoted: true,
//         },
//       };
//     case 'setAssignmentNames':
//       return {
//         ...state,
//         compareAssignments: {
//           ...state.compareAssignments,
//           selectors: {
//             ...state.compareAssignments.selectors,
//             showingRubrics: {
//               ...state.compareAssignments.selectors.showingRubrics,
//               values: ['All Rubrics', ...action.value],
//             },
//           },
//         },
//       };
//     case 'compareAssignments-showingRubrics-setValue':
//       return {
//         ...state,
//         compareAssignments: {
//           ...state.compareAssignments,
//           selectors: {
//             ...state.compareAssignments.selectors,
//             showingRubrics: {
//               ...state.compareAssignments.selectors.showingRubrics,
//               selected: action.value,
//             },
//           },
//         },
//       };
//     default:
//       return state;
//   }
// };

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

const updateSelectorValues = (selectorName, value, state) => {
  let returnState = { ...state };
  returnState.controls.selectors[selectorName]['values'] = value;
  return returnState;
};

const updateSelectorSelection = (selectorName, value, state) => {
  let returnState = { ...state };
  returnState.controls.selectors[selectorName]['selection'] = value;
  return returnState;
}

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
          errorMessage: action.value
        },
      };
    case 'heatMapDataPivoting':
      return {
        ...state,
        processing: {
          ...state.processing,
          pivotingHeatMap: true,
        }
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
        }
      };
    case 'heatMapDataPivotErrored':
      return {
        ...state,
        processing: {
          ...state.processing,
          error: true,
          errorMessage: action.value,
        }
      };
    case 'showingRubricsValuesUpdated':
      return updateSelectorValues('showingRubrics', action.value, state);
    case 'showingRubricsSelected':
      return updateSelectorSelection('showingRubrics', action.value, state);
    default:
      return state;
  }
};
