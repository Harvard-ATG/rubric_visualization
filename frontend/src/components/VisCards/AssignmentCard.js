import React from 'react';

import { Flex } from '@instructure/ui-flex/lib/Flex';
import { View } from '@instructure/ui-view/lib/View';
import { Grid } from '@instructure/ui-grid/lib/Grid';

const AssignmentCard = (props) => {
  return (
    <div className="vis-card">
      <View
        as="section"
        padding="small"
        shadow="resting"
      >
        <div className="card-headline">
          <Flex justifyItems="space-between">
            <Flex.Item>
              <div className="rubric-title">
                { props.assignmentName }
              </div>
            </Flex.Item>
            <Flex.Item>Due { props.dueDate } Days ago</Flex.Item>
          </Flex>
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <p>vis</p>
            </Grid.Col>
            <Grid.Col>
              <p>Observations</p>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </View>
    </div>
  );
};

export default AssignmentCard;
