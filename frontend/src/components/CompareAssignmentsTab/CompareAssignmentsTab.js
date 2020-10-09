import React, { useContext } from 'react';
import { Flex } from '@instructure/ui-flex/lib/Flex';
import { Spinner } from '@instructure/ui-spinner';

import AssignmentCard from '../VisCards/AssignmentCard';
import CsvDownloadLink from '../CsvDownload/CsvDownloadLink';
import Selector from '../Selector/Selector';


import { AppContext } from '../AppState';
import { pivotHeatMapData } from '../utils';
import { heatMapDataPivoting, heatMapDataPivoted, selectorValuesUpdated } from '../eventTypes';

const CompareAssignmentsTab = () => {
  const { state, dispatch } = useContext(AppContext);

  // TODO: these transformations and updates to state need to be re-evaluated
  if (state.processing.loadingBusinessData === false
    && state.processing.pivotedHeatMap === false
    && state.processing.pivotingHeatMap === false) {
    // TODO : make this async
    dispatch({ type: heatMapDataPivoting });
    const vizData = pivotHeatMapData(state.businessData);
    dispatch({ type: heatMapDataPivoted, value: vizData });
  }

  if (state.visualizationData.heatMapData.length > 0
    && state.controls.selectors.showingRubrics.values.length === 1) {
    dispatch({
      type: selectorValuesUpdated,
      selectorKey: 'showingRubrics',
      value: ['All assignments', ...state.visualizationData.heatMapData.map((r) => r.name)],
    });
  }

  const filterAssignment = state.controls.selectors.showingRubrics.selected;
  const assignmentSet = state.controls.selectors.showingRubrics.selected === 'All assignments'
    ? (
      state.visualizationData.heatMapData
    ) : (
      state.visualizationData.heatMapData.filter((rubric) => rubric.name === filterAssignment)
    );

  const loaded = (!state.processing.loadingBusinessData
    && state.visualizationData.heatMapData.length !== 0);

  const card = loaded
    ? (
      assignmentSet.map((rubric) => (
        <AssignmentCard
          key={`assignmentCard-${rubric.assignmentId}`}
          assignmentName={rubric.name}
          dataPoints={rubric.dataPoints}
          assignmentId={rubric.assignmentId}
        />
      ))
    ) : <Spinner renderTitle="Loading" size="medium" margin="0 0 0 medium" />;

  const csvLink = loaded
    ? (
      <CsvDownloadLink data={state.businessData.denormalized_data} text=".CSV Download" />
    ) : '';

  return (
    <div>
      <Flex justifyItems="space-between" margin="medium 0 medium">
        <Flex.Item>
          <Selector
            options={state.controls.selectors.showingRubrics.values}
            selectorKey="showingRubrics"
            labelText="Show Rubric:"
            selectorValue={state.controls.selectors.showingRubrics.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
      </Flex>
      <Flex direction="row-reverse" margin="medium 0 medium">
        <Flex.Item>
          { csvLink }
        </Flex.Item>
      </Flex>
      <Flex justifyItems="center">
        <Flex.Item>
          { card }
        </Flex.Item>
      </Flex>
    </div>
  );
};

export default CompareAssignmentsTab;
