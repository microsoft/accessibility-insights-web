// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { FluentSideNav, FluentSideNavProps } from 'DetailsView/components/left-nav/fluent-side-nav';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(FluentSideNav, () => {
    let tabStoreData: TabStoreData;

    beforeEach(() => {});

    test('render null if tab is closed', () => {
        tabStoreData = {
            isClosed: true,
        } as TabStoreData;

        const props: FluentSideNavProps = {
            tabStoreData,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render side nav', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        const props: FluentSideNavProps = {
            tabStoreData,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
