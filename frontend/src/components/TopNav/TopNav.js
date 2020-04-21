import React from 'react';
import { AppNav } from '@instructure/ui-navigation/lib/AppNav'
import { Tabs } from '@instructure/ui-tabs/lib/Tabs'

import CompareAssignmentsTab from '../CompareAssignmentsTab/CompareAssignmentsTab.js'

const TopNav = (props) => {
  return (
    <Tabs
      margin="large auto"
      padding="medium"
    >
      <Tabs.Panel id="tabA" renderTitle="By Student" padding="large" isSelected={false}></Tabs.Panel>
      <Tabs.Panel id="tabB" renderTitle="Compare Assignments" padding="large" isSelected={true}>
        <CompareAssignmentsTab />
      </Tabs.Panel>
      <Tabs.Panel id="tabC" renderTitle="Class Insights" padding="large" isSelected={false}></Tabs.Panel>
      <Tabs.Panel id="tabD" renderTitle="Needs Attention" padding="large" isSelected={false}></Tabs.Panel>
    </Tabs>
  );
};

export default TopNav;
