import { initialState, reducer } from './AppState';
import * as eventTypes from './eventTypes';

describe('Reducer behavior', () => {
  it('tests businessDataFetching', async () => {
    const reduced = reducer(initialState, { type: eventTypes.businessDataFetching });
    expect(reduced.processing.loadingBusinessData).toBe(true);
  });

  it('tests businessDataFetched', async () => {
    const reduced = reducer(initialState, { type: eventTypes.businessDataFetched });
    expect(reduced.processing.loadingBusinessData).toBe(false);
  });

  it('tests businessDataFetchErrored', async () => {
    const dispatchObject = {
      type: eventTypes.businessDataFetchErrored,
      value: 'Theres an error!',
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.processing.loadingBusinessData).toBe(false);
    expect(reduced.processing.error).toBe(true);
    expect(reduced.processing.errorMessage).toBe('Theres an error!');
  });

  it('tests heatMapDataPivoting', async () => {
    const reduced = reducer(initialState, { type: eventTypes.heatMapDataPivoting });
    expect(reduced.processing.pivotingHeatMap).toBe(true);
  });

  it('tests heatMapDataPivoted', async () => {
    const dispatchObject = {
      type: eventTypes.heatMapDataPivoted,
      value: [1, 2, 3, 4],
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.processing.pivotingHeatMap).toBe(false);
    expect(reduced.processing.pivotedHeatMap).toBe(true);
    expect(reduced.visualizationData.heatMapData).toStrictEqual([1, 2, 3, 4]);
  });

  it('tests heatMapDataPivotErrored', async () => {
    const dispatchObject = {
      type: eventTypes.heatMapDataPivotErrored,
      value: 'Heatmap data error!',
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.processing.pivotingHeatMap).toBe(false);
    expect(reduced.processing.pivotedHeatMap).toBe(false);
    expect(reduced.processing.error).toBe(true);
    expect(reduced.processing.errorMessage).toBe('Heatmap data error!');
  });

  it('tests selectorValuesUpdated', async () => {
    const dispatchObject = {
      type: eventTypes.selectorValuesUpdated,
      selectorKey: 'showingRubrics',
      value: [1, 2, 3, 4],
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.controls.selectors.showingRubrics.values).toStrictEqual([1, 2, 3, 4]);
  });

  it('tests selectorSelected', async () => {
    const dispatchObject = {
      type: eventTypes.selectorSelected,
      selectorKey: 'showingRubrics',
      value: 'test assignment 1',
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.controls.selectors.showingRubrics.selected).toBe('test assignment 1');
  });

  it('tests checkListValuesUpdated', async () => {
    const dispatchObject = {
      type: eventTypes.checkListValuesUpdated,
      checkListKey: 'sections',
      value: [1, 2, 3, 4],
    };
    const reduced = reducer(initialState, dispatchObject);
    expect(reduced.controls.checkLists.sections.values).toStrictEqual([1, 2, 3, 4]);
    expect(reduced.controls.checkLists.sections.checked).toStrictEqual([1, 2, 3, 4]);
  });

  it('tests checkListCheckedAll', async () => {
    const dispatchObject = {
      type: eventTypes.checkListCheckedAll,
      checkListKey: 'sections',
    };
    const modifiedState1 = { // all are checked
      ...initialState,
      controls: {
        ...initialState.controls,
        checkLists: {
          ...initialState.controls.checkLists,
          sections: { values: [1, 2, 3, 4], checked: [1, 2, 3, 4] },
        },
      },
    };
    const reduced1 = reducer(modifiedState1, dispatchObject);
    expect(reduced1.controls.checkLists.sections.checked).toStrictEqual([]);

    const modifiedState2 = { // indeterminate checklist state
      ...initialState,
      controls: {
        ...initialState.controls,
        checkLists: {
          ...initialState.controls.checkLists,
          sections: { values: [1, 2, 3, 4], checked: [1, 4] },
        },
      },
    };
    const reduced2 = reducer(modifiedState2, dispatchObject);
    expect(reduced2.controls.checkLists.sections.checked).toStrictEqual([]);

    const modifiedState3 = { // no boxes are checked, so it should check them all
      ...initialState,
      controls: {
        ...initialState.controls,
        checkLists: {
          ...initialState.controls.checkLists,
          sections: { values: [1, 2, 3, 4], checked: [] },
        },
      },
    };
    const reduced3 = reducer(modifiedState3, dispatchObject);
    expect(reduced3.controls.checkLists.sections.checked).toStrictEqual([1, 2, 3, 4]);
  });

  it('tests checkListCheckedAll', async () => {
    const dispatchObject = {
      type: eventTypes.checkBoxChecked,
      checkListKey: 'sections',
      value: 2,
    };
    const modifiedState1 = { // remove the check
      ...initialState,
      controls: {
        ...initialState.controls,
        checkLists: {
          ...initialState.controls.checkLists,
          sections: { values: [1, 2, 3, 4], checked: [1, 2, 3, 4] },
        },
      },
    };
    const reduced1 = reducer(modifiedState1, dispatchObject);
    expect(reduced1.controls.checkLists.sections.checked).toStrictEqual([1, 3, 4]);

    const modifiedState2 = { // add the check
      ...initialState,
      controls: {
        ...initialState.controls,
        checkLists: {
          ...initialState.controls.checkLists,
          sections: { values: [1, 2, 3, 4], checked: [1, 4] },
        },
      },
    };
    const reduced2 = reducer(modifiedState2, dispatchObject);
    expect(reduced2.controls.checkLists.sections.checked).toStrictEqual([1, 4, 2]);
  });
});
