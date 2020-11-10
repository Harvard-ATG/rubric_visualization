import React, { useContext } from 'react';
import { Flex } from '@instructure/ui-flex/lib/Flex';
import { Spinner } from '@instructure/ui-spinner';

import AssignmentCard from '../VisCards/AssignmentCard';
import CsvDownloadLink from '../CsvDownload/CsvDownloadLink';
import Selector from '../Selector/Selector';


import { AppContext } from '../AppState';
import { pivotHeatMapData, pivotHeatMapDataWithSections } from '../utils';
import {
  heatMapDataPivoting, heatMapDataPivoted, heatMapDataWithSectionsPivoted, selectorValuesUpdated,
} from '../eventTypes';

const switchVizData = (selection, data) => {
  switch (selection) {
    case 'Aggregated':
      return data.heatMapData;
    case 'By Sections':
      return data.heatMapDataWithSections;
    default:
      return data.heatMapDataWithSections;
  }
};

const CompareAssignmentsTab = () => {
  const { state, dispatch } = useContext(AppContext);

  // TODO: these transformations and updates to state need to be re-evaluated
  if (state.processing.loadingBusinessData === false
    && state.processing.pivotedHeatMap === false
    && state.processing.pivotingHeatMap === false) {
    dispatch({ type: heatMapDataPivoting });
    const vizData = pivotHeatMapData(state.businessData);
    const vizDataWithSections = pivotHeatMapDataWithSections(state.businessData,
      state.businessData.sections.map((s) => s.sis_section_id));
    dispatch({ type: heatMapDataPivoted, value: vizData });
    dispatch({ type: heatMapDataWithSectionsPivoted, value: vizDataWithSections });
  }

  if (state.visualizationData.heatMapData.length > 0
    && state.controls.selectors.showingRubrics.values.length === 1) {
    dispatch({
      type: selectorValuesUpdated,
      selectorKey: 'showingRubrics',
      value: ['All assignments', ...state.visualizationData.heatMapData.map((r) => r.name)],
    });
  }

  if (state.visualizationData.heatMapData.length > 0
    && state.controls.selectors.sections.values.length === 1) {
    dispatch({
      type: selectorValuesUpdated,
      selectorKey: 'sections',
      value: ['All sections', ...state.businessData.sections.map((s) => s.sis_section_id)],
    });
  }


  const filterAssignment = state.controls.selectors.showingRubrics.selected;
  const filterSection = state.controls.selectors.sections.selected;
  const assignmentSet = switchVizData(
    state.controls.selectors.showSections.selected,
    state.visualizationData,
  );

  const filteredAssignmentSet = state.controls.selectors.showingRubrics.selected === 'All assignments'
    ? (
      assignmentSet
    ) : (
      assignmentSet.filter((rubric) => rubric.name === filterAssignment)
    );

  let filteredSectionSet = filteredAssignmentSet;
  if (state.controls.selectors.showSections.selected === 'By Sections') {
    filteredSectionSet = state.controls.selectors.sections.selected === 'All sections'
      ? (
        filteredAssignmentSet
      ) : (
        filteredAssignmentSet.filter((rubric) => rubric.sectionId === filterSection)
      );
  }

  const loaded = (!state.processing.loadingBusinessData
    && state.visualizationData.heatMapData.length !== 0);


  const card = loaded
    ? (
      filteredSectionSet.map((rubric) => (
        <AssignmentCard
          key={`assignmentCard-${rubric.assignmentId}-${rubric.sectionId ? rubric.sectionId : ''}`}
          assignmentName={rubric.name}
          dataPoints={rubric.dataPoints}
          assignmentId={rubric.assignmentId}
          sectionId={rubric.sectionId}
        />
      ))
    ) : <Spinner renderTitle="Loading" size="medium" margin="0 0 0 medium" />;

  const csvLink = loaded
    ? (
      <CsvDownloadLink data={state.businessData.denormalized_data} text=".CSV Download" />
    ) : '';

  const sectionsSelector = state.controls.selectors.showSections.selected === 'By Sections'
    ? (
      <Selector
        options={state.controls.selectors.sections.values}
        selectorKey="sections"
        labelText="Sections:"
        selectorValue={state.controls.selectors.sections.selected}
        dispatch={dispatch}
      />
    ) : '';

  return (
    <div>
      <Flex margin="medium 0 medium">
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
            options={state.controls.selectors.showSections.values}
            selectorKey="showSections"
            labelText="Show Sections:"
            selectorValue={state.controls.selectors.showSections.selected}
            dispatch={dispatch}
          />
        </Flex.Item>
        <Flex.Item>{sectionsSelector}</Flex.Item>
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
