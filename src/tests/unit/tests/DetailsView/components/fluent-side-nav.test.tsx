// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import { FluentSideNav, FluentSideNavProps } from 'DetailsView/components/left-nav/fluent-side-nav';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe(FluentSideNav, () => {
    let tabStoreData: TabStoreData;
    let props: FluentSideNavProps;

    test('render null if tab is closed', () => {
        tabStoreData = {
            isClosed: true,
        } as TabStoreData;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render sidePanel', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
            isNarrowMode: true,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render nav bar', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
            isNarrowMode: false,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('dismiss side nav', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        const setSideNavOpenMock = Mock.ofInstance((isOpen: boolean) => {});
        setSideNavOpenMock.setup(sm => sm(false)).verifiable(Times.once());
        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: setSideNavOpenMock.object,
            isNarrowMode: true,
        } as FluentSideNavProps;

        const wrapper = shallow(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );

        wrapper
            .find(GenericPanel)
            .props()
            .onDismiss({} as React.SyntheticEvent<HTMLElement, Event>);

        setSideNavOpenMock.verifyAll();
    });
});
