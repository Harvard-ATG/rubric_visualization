import React from 'react';
import { AppNav } from '@instructure/ui-navigation/lib/AppNav'
import { Tabs } from '@instructure/ui-tabs/lib/Tabs'
import { Flex } from '@instructure/ui-flex/lib/Flex'
import { View } from '@instructure/ui-view/lib/View'
import { Grid } from '@instructure/ui-grid/lib/Grid'

import Selector from '../Selector/Selector.js'
import AssignmentCard from '../VisCards/AssignmentCard.js'

const TopNav = (props) => {
  return (
    <Tabs
      margin="large auto"
      padding="medium"
    >
      <Tabs.Panel id="tabA" renderTitle="By Student" padding="large" isSelected={false}></Tabs.Panel>
      <Tabs.Panel id="tabB" renderTitle="Compare Assignments" padding="large" isSelected={true}>
        <Flex justifyItems="space-between" margin="0 0 medium">
          <Flex.Item >
            <Selector options= { ['Rubic Name','that','the other'] } labelText="Show Rubric:" />
          </Flex.Item>
          <Flex.Item>
            <Selector options= { ['Due Date','another','and another'] } labelText="Sort:" />
          </Flex.Item>
        </Flex>
        <div className="filter-bar">
        <Flex>
          <Flex.Item >
            <Selector options= { ['All Sections','section1','the other'] } labelText="Filter:" />
          </Flex.Item>
          <Flex.Item>
            <Selector options= { ['All Instuctors','Bill','Joan'] } labelText="" />
          </Flex.Item>
        </Flex>
        </div>
        <AssignmentCard assignmentName="Roanoke Colony Writeup" dueDate={2} />
        <AssignmentCard assignmentName="Hamilton Analysis" dueDate={7} />
      </Tabs.Panel>
      <Tabs.Panel id="tabC" renderTitle="Class Insights" padding="large" isSelected={false}></Tabs.Panel>
      <Tabs.Panel id="tabD" renderTitle="Needs Attention" padding="large" isSelected={false}></Tabs.Panel>
    </Tabs>
  );
};

export default TopNav;
