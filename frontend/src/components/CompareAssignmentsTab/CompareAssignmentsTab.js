import React from 'react';
import { Flex } from '@instructure/ui-flex/lib/Flex';

import Selector from '../Selector/Selector';
import AssignmentCard from '../VisCards/AssignmentCard';

const CompareAssignmentsTab = () => (
  <div>
    <Flex justifyItems="space-between" margin="0 0 medium">
      <Flex.Item>
        <Selector options={['Rubic Name', 'that', 'the other']} labelText="Show Rubric:" />
      </Flex.Item>
      <Flex.Item>
        <Selector options={['Due Date', 'another', 'and another']} labelText="Sort:" />
      </Flex.Item>
    </Flex>
    <div className="filter-bar">
      <Flex>
        <Flex.Item>
          <Selector
            options={['All Sections', 'section1', 'the other']}
            labelText="Sections:"
          />
        </Flex.Item>
        <Flex.Item>
          <Selector
            options={['All Instuctors', 'Bill', 'Joan']}
            labelText="Instructors:"
          />
        </Flex.Item>
      </Flex>
    </div>
    <AssignmentCard
      assignmentName="Roanoke Colony Writeup"
      dueDate={2}
      observations={['90% completion rate', '20% improvement in "Sources" over prior assignment', 'Section 4 respresents 80% of the "Does not meet" for "Mechanics"']}
    />
    <AssignmentCard
      assignmentName="Hamilton Analysis"
      dueDate={7}
      observations={['88% completion rate', '20% improvement in "Sources" over prior assignment', 'Section 3 has significantly increased performance in "Mechanics" and "Thesis" since prior assignment']}
    />
  </div>
);

export default CompareAssignmentsTab;
