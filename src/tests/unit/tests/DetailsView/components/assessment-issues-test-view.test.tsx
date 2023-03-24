// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
    AssessmentIssuesTestView,
    AssessmentIssuesTestViewProps,
} from 'DetailsView/components/assessment-issues-test-view';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { WarningConfiguration } from 'DetailsView/components/warning-configuration';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('AssessmentIssuesTestView', () => {
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
    const selectedTest: VisualizationType = -1;
    const warningConfigurationStub: WarningConfiguration = {} as WarningConfiguration;
    const switcherNavConfigurationStub: DetailsViewSwitcherNavConfiguration = {
        warningConfiguration: warningConfigurationStub,
    } as DetailsViewSwitcherNavConfiguration;

    const props = {
        configuration: configuration,
        clickHandlerFactory: clickHandlerFactoryMock.object,
        visualizationStoreData: visualizationStoreDataStub,
        selectedTest: selectedTest,
        scanIncompleteWarnings: [],
        instancesSection: NamedFC<CommonInstancesSectionProps>('test', _ => null),
        switcherNavConfiguration: switcherNavConfigurationStub,
        deps: {},
    } as AssessmentIssuesTestViewProps;

    it('should return DetailsListIssuesView', () => {
        props.tabStoreData = {
            isChanged: false,
        } as TabStoreData;

        const actual = shallow(<AssessmentIssuesTestView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
