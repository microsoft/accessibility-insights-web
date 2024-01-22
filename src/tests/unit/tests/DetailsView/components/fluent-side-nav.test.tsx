// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav } from '@fluentui/react';
import { render } from '@testing-library/react';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import { DetailsViewLeftNav } from 'DetailsView/components/left-nav/details-view-left-nav';
import { FluentSideNav, FluentSideNavProps } from 'DetailsView/components/left-nav/fluent-side-nav';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/left-nav/details-view-left-nav');
jest.mock('DetailsView/components/generic-panel');
describe(FluentSideNav, () => {
    mockReactComponents([DetailsViewLeftNav, GenericPanel]);

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

        const renderResult = render(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );
        expectMockedComponentPropsToMatchSnapshots([DetailsViewLeftNav]);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render side nav', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
            narrowModeStatus: {
                isHeaderAndNavCollapsed: true,
            },
        } as FluentSideNavProps;

        const renderResult = render(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );
        expectMockedComponentPropsToMatchSnapshots([DetailsViewLeftNav]);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render nav bar', () => {
        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
            narrowModeStatus: {
                isHeaderAndNavCollapsed: false,
            },
        } as FluentSideNavProps;

        const renderResult = render(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />,
        );
        expectMockedComponentPropsToMatchSnapshots([DetailsViewLeftNav]);
        expect(renderResult.asFragment()).toMatchSnapshot();
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
            narrowModeStatus: {
                isHeaderAndNavCollapsed: true,
            },
        } as FluentSideNavProps;

        render(<FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />);
        expectMockedComponentPropsToMatchSnapshots([DetailsViewLeftNav]);
        const genericPanel = getMockComponentClassPropsForCall(GenericPanel);
        genericPanel.onDismiss({} as React.SyntheticEvent<HTMLElement, Event>);
        setSideNavOpenMock.verifyAll();
    });

    test('componentDidUpdate', () => {
        const focusMock = Mock.ofInstance((forceIntoFirstElement?: boolean) => {
            return false;
        });
        const navStub: INav = {
            selectedKey: 'dummy-key',
            focus: focusMock.object,
        };
        focusMock.setup(fm => fm(true)).verifiable(Times.once());

        tabStoreData = {
            isClosed: false,
        } as TabStoreData;

        const prevProps: FluentSideNavProps = {
            tabStoreData,
            isSideNavOpen: true,
            setSideNavOpen: null,
            narrowModeStatus: {
                isHeaderAndNavCollapsed: true,
            },
        } as FluentSideNavProps;

        props = {
            tabStoreData,
            isSideNavOpen: false,
            setSideNavOpen: null,
            narrowModeStatus: {
                isHeaderAndNavCollapsed: false,
            },
        } as FluentSideNavProps;

        const { rerender } = render(
            <FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...prevProps} />,
        );
        expectMockedComponentPropsToMatchSnapshots([DetailsViewLeftNav]);
        const leftNav = getMockComponentClassPropsForCall(DetailsViewLeftNav);
        leftNav.setNavComponentRef(navStub);

        rerender(<FluentSideNav selectedPivot={DetailsViewPivotType.fastPass} {...props} />);

        focusMock.verifyAll();
    });
});
