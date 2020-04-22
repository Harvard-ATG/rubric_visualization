import React from 'react';
import PropTypes from 'prop-types';

import { Flex } from '@instructure/ui-flex/lib/Flex';
import { View } from '@instructure/ui-view/lib/View';
import { Grid } from '@instructure/ui-grid/lib/Grid';
import { Text } from '@instructure/ui-text/lib/Text';
import { List } from '@instructure/ui-list/lib/List';

const AssignmentCard = (props) => {
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
                { props.assignmentName }
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text weight="light">
                Due { props.dueDate } Days ago
              </Text>
            </Flex.Item>
          </Flex>
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <p>This is where the vis goes</p>
            </Grid.Col>
            <Grid.Col>
              <div className="contained-area">
                <div className="section-title">
                  <Text>
                    Observations
                  </Text>
                </div>
                <List itemSpacing="medium">
                  {props.observations.map((observation, index) => (
                      <List.Item key={`observation-${props.assignmentName}-${index}`}>
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
  dueDate: PropTypes.number.isRequired,
  observations: PropTypes.array.isRequired
}

export default AssignmentCard;
