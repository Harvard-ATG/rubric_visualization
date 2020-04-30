import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Flex } from '@instructure/ui-flex/lib/Flex';
import { View } from '@instructure/ui-view/lib/View';
import { Grid } from '@instructure/ui-grid/lib/Grid';
import { Text } from '@instructure/ui-text/lib/Text';
import { List } from '@instructure/ui-list/lib/List';
import { drawHeatMap } from '../HeatMap/HeatMap.js';

const AssignmentCard = (props) => {
  const { assignmentName, dueDate, observations, dataPoints, assignmentId } = props;
  
  useEffect(() => {
    drawHeatMap(`#heatMap-${assignmentId}`, dataPoints);
  }, []);

  return (
    <div className="vis-card">
      <View
        as="section"
        padding="small"
        shadow="resting"
      >
        <div className="section-title">
          <Flex justifyItems="space-between">
            <Flex.Item>
              <Text size="large" weight="light">
                { assignmentName }
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text weight="light">
                Due
                {' '}
                { dueDate }
                {' '}
                Days ago
              </Text>
            </Flex.Item>
          </Flex>
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <div id={`heatMap-${assignmentId}`}></div>
            </Grid.Col>
            <Grid.Col>
              <div className="contained-area">
                <div className="section-title">
                  <Text>
                    Observations
                  </Text>
                </div>
                <List itemSpacing="medium">
                  {observations.map((observation) => (
                    <List.Item key={uuidv4()}>
                      { observation }
                    </List.Item>
                  ))}
                </List>
              </div>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </View>
    </div>
  );
};

AssignmentCard.propTypes = {
  assignmentName: PropTypes.string.isRequired,
  dueDate: PropTypes.number,
  observations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AssignmentCard;
