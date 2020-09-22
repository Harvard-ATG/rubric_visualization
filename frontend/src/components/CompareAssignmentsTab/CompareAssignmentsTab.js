import React, { useContext } from 'react';
import { Flex } from '@instructure/ui-flex/lib/Flex';

import AssignmentCard from '../VisCards/AssignmentCard';
import CsvDownloadLink from '../CsvDownload/CsvDownloadLink';
import Selector from '../Selector/Selector';


import { AppContext } from '../AppState';
import { pivotHeatMapData } from '../utils';

const CompareAssignmentsTab = () => {
  const { state, dispatch } = useContext(AppContext);

  // TODO: these transformations and updates to state need to be re-evaluated
  // if (state.loaded
  //   && state.compareAssignments.heatMapData.length === 0
  //   && state.compareAssignments.pivoted === false) {
  //   dispatch({ type: 'setHeatMapData', value: pivotHeatMapData(state.payload) });
  // }
  if (state.processing.loading === false 
    && state.visualizationData.heatMapData.length === 0) {
    // TODO : make this async
    dispatch({ type: 'heatMapDataPivoting' });
    const vizData = pivotHeatMapData(state.businessData);
    dispatch({ type: 'heatMapDataPivoted', value: vizData })    
  }

  if (state.visualizationData.heatMapData.length > 0
    && state.controls.selectors.showingRubrics.values.length === 1) {
    dispatch({
      type: 'showingRubricsValuesUpdated',
      value: ['All assignments', ...state.visualizationData.heatMapData.map((r) => r.name)]
    });  
  }
  // if (state.compareAssignments.heatMapData.length > 0
  //   && state.compareAssignments.selectors.showingRubrics.values.length === 1) {
  //   dispatch({
  //     type: 'setAssignmentNames',
  //     value: state.compareAssignments.heatMapData.map((rubric) => rubric.name),
  //   });
  // }

  // const loading = state.loaded && state.compareAssignments.heatMapData.length !== 0;
  const loaded = !state.processing.loading && state.visualizationData.heatMapData.length !== 0;

  const card = loaded
    ? (
      state.visualizationData.heatMapData.map((rubric) => (
        <AssignmentCard
          key={`assignmentCard-${rubric.assignmentId}`}
          assignmentName={rubric.name}
          dueDate={rubric.dueDate}
          observations={['90% completion rate', '20% improvement in "Sources" over prior assignment', 'Section 4 respresents 80% of the "Does not meet" for "Mechanics"']}
          dataPoints={rubric.dataPoints}
          assignmentId={rubric.assignmentId}
        />
      ))
    ) : <p>Replace me with a spinner component</p>;

  const csvLink = loaded
    ? (
      <CsvDownloadLink data={state.businessData.denormalized_data} text=".CSV Download" />
    ) : '';

  return (
    <div>
      <Flex justifyItems="space-between" margin="0 0 medium">
        <Flex.Item>
          <Selector
            options={state.controls.selectors.showingRubrics.values}
            selectorKey="showingRubrics"
            labelText="Show Rubric:"
            selectorValue={state.controls.selectors.showingRubrics.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
        <Flex.Item>
          <Selector
            selectorKey="sortBy"
            options={state.controls.selectors.sortBy.values}
            labelText="Sort:"
            selectorValue={state.controls.selectors.sortBy.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
      </Flex>
      <div className="filter-bar">
        <Flex>
          <Flex.Item>
            <Selector
              selectorKey="sections"
              options={state.controls.selectors.sections.values}
              labelText="Sections:"
              selectorValue={state.controls.selectors.sections.selected}
              dispatch={dispatch}
            />
          </Flex.Item>
          <Flex.Item>
            <Selector
              selectorKey="instructors"
              options={state.controls.selectors.instructors.values}
              labelText="Instructors:"
              selectorValue={state.controls.selectors.instructors.selected}
              dispatch={dispatch}
            />
          </Flex.Item>
        </Flex>
      </div>
      <Flex direction="row-reverse" margin="medium 0 medium">
        <Flex.Item>
          { csvLink }
        </Flex.Item>
      </Flex>
      { card }
    </div>
  );
};

export default CompareAssignmentsTab;
