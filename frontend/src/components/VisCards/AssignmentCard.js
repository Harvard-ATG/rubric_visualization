import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, View } from '@instructure/ui';
import { drawHeatMap, drawFlatHeatMap } from '../HeatMap/HeatMap';
import { flatData, truncateString } from '../utils';

const AssignmentCard = (props) => {
  const {
    assignmentName, dataPoints, assignmentId, sectionId, sectionName,
  } = props;

  const identifier = `heatMap-${assignmentId}-${sectionId || ''}`;

  useEffect(() => {
    if (flatData(dataPoints) === true) {
      drawFlatHeatMap(`#${identifier}`, dataPoints);
    } else {
      drawHeatMap(`#${identifier}`, dataPoints);
    }
  }, [dataPoints]);

  return (
    <div className="vis-card">
      <View as="section" padding="small" shadow="resting">
        <div className="section-title">
          <Flex justifyItems="space-between">
            <Flex.Item>
              <Text size="large" weight="light">
                {truncateString(assignmentName, 28)}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text size="large" weight="light">
                {sectionName}
              </Text>
            </Flex.Item>
          </Flex>
        </div>
        <div id={identifier} />
      </View>
    </div>
  );
};

AssignmentCard.defaultProps = {
  sectionId: null,
};

AssignmentCard.propTypes = {
  assignmentName: PropTypes.string.isRequired,
  dataPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  assignmentId: PropTypes.number.isRequired,
  sectionId: PropTypes.string,
  sectionName: PropTypes.string,
};

export default AssignmentCard;
