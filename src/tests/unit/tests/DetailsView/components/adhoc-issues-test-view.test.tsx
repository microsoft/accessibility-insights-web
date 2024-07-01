// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC } from 'common/react/named-fc';
import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AdhocIssuesTestView,
    AdhocIssuesTestViewProps,
} from 'DetailsView/components/adhoc-issues-test-view';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { DetailsListIssuesView } from 'DetailsView/components/details-list-issues-view';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { TargetPageChangedView } from 'DetailsView/components/target-page-changed-view';
import { WarningConfiguration } from 'DetailsView/components/warning-configuration';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';

import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, MockBehavior } from 'typemoq';

jest.mock('DetailsView/components/details-list-issues-view');
jest.mock('DetailsView/components/banner-warnings');
jest.mock('DetailsView/components/target-page-changed-view');

describe('AdhocIssuesTestView', () => {
    mockReactComponents([DetailsListIssuesView, BannerWarnings, TargetPageChangedView]);
    const visualizationStoreDataStub = {
        tests: {},
        scanning: 'test-scanning',
    } as VisualizationStoreData;

    const getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData> = Mock.ofInstance(
        () => null,
        MockBehavior.Strict,
    );

    const displayableDataStub = {
        title: 'test title',
    } as DisplayableVisualizationTypeData;

    const configuration = {
        getStoreData: getStoreDataMock.object,
        displayableData: displayableDataStub,
    } as VisualizationConfiguration;

    const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
    const selectedTest: VisualizationType = -1 as VisualizationType;

    let props = {
        configuration: configuration,
        clickHandlerFactory: clickHandlerFactoryMock.object,
        visualizationStoreData: visualizationStoreDataStub,
        selectedTest: selectedTest,
        scanIncompleteWarnings: [],
        instancesSection: NamedFC<CommonInstancesSectionProps>('test', _ => null),
        deps: {},
    } as AdhocIssuesTestViewProps;

    const scanDataStub: ScanData = {
        enabled: true,
    };

    const clickHandlerStub = () => {};

    let switcherNavConfigurationStub: DetailsViewSwitcherNavConfiguration;
    let warningConfigurationStub: WarningConfiguration;

    beforeEach(() => {
        warningConfigurationStub = {} as WarningConfiguration;
        switcherNavConfigurationStub = {
            warningConfiguration: warningConfigurationStub,
        } as DetailsViewSwitcherNavConfiguration;

        props = { ...props, switcherNavConfiguration: switcherNavConfigurationStub };
        getStoreDataMock.reset();
        clickHandlerFactoryMock.reset();
    });

    it('should return target page changed view as tab is changed', () => {
        props.tabStoreData = {
            isChanged: true,
        } as TabStoreData;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();

        const actual = render(<AdhocIssuesTestView {...props} />);
        expectMockedComponentPropsToMatchSnapshots([TargetPageChangedView]);
        expect(actual.asFragment()).toMatchSnapshot();
        verifyAll();
    });

    it('should return DetailsListIssuesView', () => {
        props.tabStoreData = {
            isChanged: false,
        } as TabStoreData;

        const actual = render(<AdhocIssuesTestView {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
