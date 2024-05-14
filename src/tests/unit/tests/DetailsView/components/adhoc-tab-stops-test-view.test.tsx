// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Toggle } from '@fluentui/react';
import { render } from '@testing-library/react';
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { FocusComponent } from 'common/components/focus-component';
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AdhocTabStopsTestView,
    AdhocTabStopsTestViewDeps,
    AdhocTabStopsTestViewProps,
} from 'DetailsView/components/adhoc-tab-stops-test-view';
import { AutoDetectedFailuresDialog } from 'DetailsView/components/auto-detected-failures-dialog';
import { TabStopsFailedInstancePanel } from 'DetailsView/components/tab-stops/tab-stops-failed-instance-panel';
import { TabStopsRequirementsTable } from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { TabStopsFailedInstanceSection } from 'DetailsView/components/tab-stops-failed-instance-section';
import { TargetPageChangedView } from 'DetailsView/components/target-page-changed-view';

import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';

import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { ContentReference } from 'views/content/content-page';

jest.mock('DetailsView/components/tab-stops/tab-stops-failed-instance-panel');
jest.mock('@fluentui/react');
jest.mock('common/components/heading-with-content-link');
jest.mock('common/components/collapsible-component');
jest.mock('common/components/theme-family-customizer');
jest.mock('DetailsView/components/tab-stops/tab-stops-requirements-table');
jest.mock('DetailsView/components/tab-stops-failed-instance-section');
jest.mock('common/components/focus-component');
jest.mock('DetailsView/components/auto-detected-failures-dialog');
jest.mock('DetailsView/components/target-page-changed-view');

describe('AdhocTabStopsTestView', () => {
    mockReactComponents([
        TabStopsFailedInstancePanel,
        HeadingWithContentLink,
        Toggle,
        CollapsibleComponent,
        ThemeFamilyCustomizer,
        TabStopsRequirementsTable,
        TabStopsFailedInstanceSection,
        FocusComponent,
        AutoDetectedFailuresDialog,
        TargetPageChangedView,
    ]);
    let props: AdhocTabStopsTestViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let displayableDataStub: DisplayableVisualizationTypeData;
    let scanDataStub: ScanData;
    let clickHandlerStub: (event: any) => void;
    let visualizationStoreDataStub: VisualizationStoreData;
    let selectedTest: VisualizationType;

    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let userConfigurationStoreDataStub: UserConfigurationStoreData;
    let visualizationScanResultData: VisualizationScanResultData;
    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        clickHandlerFactoryMock = Mock.ofType(
            DetailsViewToggleClickHandlerFactory,
            MockBehavior.Strict,
        );
        displayableDataStub = {
            title: 'test title',
            adHoc: {
                toggleLabel: 'test toggle label',
            },
        } as DisplayableVisualizationTypeData;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
        } as VisualizationStoreData;
        clickHandlerStub = () => {};
        selectedTest = -1 as VisualizationType;
        featureFlagStoreDataStub = {};
        userConfigurationStoreDataStub = 'stub-user-configuration-store-data' as any;
        visualizationScanResultData = { tabStops: {} } as VisualizationScanResultData;
        props = {
            deps: Mock.ofType<AdhocTabStopsTestViewDeps>().object,
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
            } as VisualizationConfiguration,
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest,
            featureFlagStoreData: featureFlagStoreDataStub,
            visualizationScanResultData,
            tabStoreData: null,
            tabStopsViewStoreData: {
                failureInstanceState: {
                    actionType: CapturedInstanceActionType.CREATE,
                },
            } as TabStopsViewStoreData,
            userConfigurationStoreData: userConfigurationStoreDataStub,
        };

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    describe('render', () => {
        const stubGuidance = 'stub-guidance' as ContentReference;

        const scenarios = [
            ['guidance', stubGuidance],
            ['no guidance', null],
        ];

        it('should return target page changed view as tab is changed', () => {
            props.tabStoreData = {
                isChanged: true,
            };

            const wrapper = render(<AdhocTabStopsTestView {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it.each(scenarios)('handles %s', (_, guidance) => {
            props.deps = 'stub-deps' as unknown as AdhocTabStopsTestViewDeps;

            props.tabStoreData = {
                isChanged: false,
            };

            if (guidance) {
                props.guidance = guidance;
            }

            const wrapper = render(<AdhocTabStopsTestView {...props} />);
            expectMockedComponentPropsToMatchSnapshots([CollapsibleComponent]);
            expect(wrapper.asFragment()).toMatchSnapshot();
            verifyAll();
        });
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
