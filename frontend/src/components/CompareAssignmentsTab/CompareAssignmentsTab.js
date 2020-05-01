import React, { useContext } from 'react';
import { Flex } from '@instructure/ui-flex/lib/Flex';

import Selector from '../Selector/Selector';
import AssignmentCard from '../VisCards/AssignmentCard';

import { AppContext } from '../AppState';
import { pivotHeatMapData } from '../utils';

const CompareAssignmentsTab = () => {
  const { state, dispatch } = useContext(AppContext);

  // TODO: these transformations and updates to state need to be re-evaluated
  if (state.loaded
    && state.compareAssignments.heatMapData.length === 0
    && state.compareAssignments.pivoted === false) {
    dispatch({ type: 'setHeatMapData', value: pivotHeatMapData(state.payload) });
  }

  if (state.compareAssignments.heatMapData.length > 0
    && state.compareAssignments.selectors.showingRubrics.values.length === 1) {
    dispatch({
      type: 'setAssignmentNames',
      value: state.compareAssignments.heatMapData.map((rubric) => rubric.name),
    });
  }

  const card = state.loaded && state.compareAssignments.heatMapData.length !== 0
    ? (
      state.compareAssignments.heatMapData.map((rubric) => (
        <AssignmentCard
          key={`assignmentCard-${rubric.assignmentId}`}
          assignmentName={rubric.name}
          dueDate={rubric.dueDate}
          observations={['90% completion rate', '20% improvement in "Sources" over prior assignment', 'Section 4 respresents 80% of the "Does not meet" for "Mechanics"']}
          dataPoints={rubric.dataPoints}
          assignmentId={rubric.assignmentId}
        />
      ))
    ) : <p>{state.placeholder}</p>;

  return (
    <div>
      <Flex justifyItems="space-between" margin="0 0 medium">
        <Flex.Item>
          <Selector
            options={state.compareAssignments.selectors.showingRubrics.values}
            selectorIdentifier="compareAssignments-showingRubrics"
            labelText="Show Rubric:"
            selectorValue={state.compareAssignments.selectors.showingRubrics.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
        <Flex.Item>
          <Selector
            selectorIdentifier="compareAssignments-sortBy"
            options={state.compareAssignments.selectors.sortBy.values}
            labelText="Sort:"
            selectorValue={state.compareAssignments.selectors.sortBy.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
      </Flex>
      <div className="filter-bar">
        <Flex>
          <Flex.Item>
            <Selector
              selectorIdentifier="compareAssignments-sections"
              options={state.compareAssignments.selectors.sections.values}
              labelText="Sections:"
              selectorValue={state.compareAssignments.selectors.sections.selected}
              dispatch={dispatch}
            />
          </Flex.Item>
          <Flex.Item>
            <Selector
              selectorIdentifier="compareAssignments-instructors"
              options={state.compareAssignments.selectors.instructors.values}
              labelText="Instructors:"
              selectorValue={state.compareAssignments.selectors.instructors.selected}
              dispatch={dispatch}
            />
          </Flex.Item>
        </Flex>
      </div>
      { card }
    </div>
  );
};

export default CompareAssignmentsTab;
