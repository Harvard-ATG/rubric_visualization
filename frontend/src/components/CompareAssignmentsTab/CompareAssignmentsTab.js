import React, { useContext, useEffect } from 'react';
import { Flex, Spinner } from '@instructure/ui';

import AssignmentCard from '../VisCards/AssignmentCard';
import CsvDownloadLink from '../CsvDownload/CsvDownloadLink';
import Selector from '../Selector/Selector';
import CheckList from '../CheckBox/CheckList';

import { AppContext } from '../AppState';
import { pivotHeatMapData, pivotHeatMapDataNoSections } from '../utils';

import {
  heatMapDataPivoting,
  heatMapDataPivoted,
  heatMapDataNoSectionsPivoted,
  selectorValuesUpdated,
  checkListValuesUpdated,
} from '../eventTypes';

const switchVizData = (selection, data) => {
  switch (selection) {
    case 'Aggregated': {
      return data.heatMapDataNoSections;
    }
    case 'By Sections':
      return data.heatMapData;
    default:
      return data.heatMapData;
  }
};

const CompareAssignmentsTab = () => {
  const { state, dispatch } = useContext(AppContext);

  // any dispatch or update to state should be inside a useEffect hook to make sure that
  // we are not updating state in the middle of a render
  useEffect(() => {
    // TODO: these transformations and updates to state need to be re-evaluated
    if (
      state.processing.loadingBusinessData === false
      && state.processing.pivotedHeatMap === false
      && state.processing.pivotingHeatMap === false
    ) {
      dispatch({ type: heatMapDataPivoting });
      const vizData = pivotHeatMapData(state.businessData);
      dispatch({
        type: heatMapDataPivoted,
        value: vizData,
      });
    }

    if (
      state.visualizationData.heatMapData.length > 0
      && state.controls.selectors.showingRubrics.values.length === 1
    ) {
      dispatch({
        type: selectorValuesUpdated,
        selectorKey: 'showingRubrics',
        value: [
          'All assignments',
          ...state.visualizationData.heatMapData.map((r) => r.name),
        ],
      });
    }

    if (
      state.visualizationData.heatMapData.length > 0
      && state.controls.checkLists.sections.values.length === 0
    ) {
      dispatch({
        type: checkListValuesUpdated,
        checkListKey: 'sections',
        value: [...Object.values(state.businessData.sections).map((s) => s.short_name)],
      });
    }

    if (
      state.controls.selectors.showSections.selected === 'Aggregated'
      && state.visualizationData.heatMapDataNoSections.length === 0
    ) {
      dispatch({ type: heatMapDataPivoting });
      const vizDataNoSections = pivotHeatMapDataNoSections(state.businessData);
      dispatch({
        type: heatMapDataNoSectionsPivoted,
        value: vizDataNoSections,
      });
    }
  });

  const filterAssignment = state.controls.selectors.showingRubrics.selected;
  const filterSection = state.controls.checkLists.sections.checked;
  const assignmentSet = switchVizData(
    state.controls.selectors.showSections.selected,
    state.visualizationData,
  );

  const filteredAssignmentSet = state.controls.selectors.showingRubrics.selected === 'All assignments'
    ? assignmentSet
    : assignmentSet.filter((rubric) => rubric.name === filterAssignment);
  let filteredSectionSet = filteredAssignmentSet;
  if (state.controls.selectors.showSections.selected === 'By Sections') {
    filteredSectionSet = filterSection.length === state.controls.checkLists.sections.values.length
      ? filteredAssignmentSet
      : filteredAssignmentSet.filter((rubric) => filterSection.indexOf(rubric.sectionName) !== -1);
  }

  const loaded = !state.processing.loadingBusinessData
    && state.visualizationData.heatMapData.length !== 0;

  const card = loaded ? (
    filteredSectionSet.map((rubric) => (
      <AssignmentCard
        key={`assignmentCard-${rubric.assignmentId}-${rubric.sectionId || ''}`}
        assignmentName={rubric.name}
        dataPoints={rubric.dataPoints}
        assignmentId={rubric.assignmentId}
        sectionId={rubric.sectionId}
        sectionName={rubric.sectionName}
      />
    ))
  ) : (
    <Spinner renderTitle="Loading" size="medium" margin="0 0 0 medium" />
  );

  const csvLink = loaded ? (
    <CsvDownloadLink
      data={state.businessData.denormalized_data}
      text=".CSV Download"
    />
  ) : (
    ''
  );

  const sectionsCheckList = state.controls.selectors.showSections.selected === 'By Sections' ? (
    <CheckList
      list={state.controls.checkLists.sections.values}
      checkListKey="sections"
      listType="sections"
      checkListChecked={state.controls.checkLists.sections.checked}
      dispatch={dispatch}
    />
  ) : (
    ''
  );

  const body = loaded ? (
    <Flex>
      <Flex.Item align="start" size="25%">{sectionsCheckList}</Flex.Item>
      <Flex.Item>{card}</Flex.Item>
    </Flex>
  ) : (
    <Flex justifyItems="center">
      <Flex.Item>
        <Spinner renderTitle="Loading" size="medium" margin="0 0 0 medium" />
      </Flex.Item>
    </Flex>
  );

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
      </Flex>
      <Flex direction="row-reverse" margin="medium 0 medium">
        <Flex.Item>{csvLink}</Flex.Item>
      </Flex>

      {body}

    </div>
  );
};

export default CompareAssignmentsTab;
