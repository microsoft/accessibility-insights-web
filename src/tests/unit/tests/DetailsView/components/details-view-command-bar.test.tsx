// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import {
    ScanMetadata,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { ScanData, VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewSwitcherNavConfiguration,
    LeftNavProps,
} from 'DetailsView/components/details-view-switcher-nav';
import { ReportExportDialogFactoryProps } from 'DetailsView/components/report-export-dialog-factory';
import { shallow } from 'enzyme';
import { isNil } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import {
    DetailsViewCommandBar,
    DetailsViewCommandBarProps,
    ReportExportDialogFactory,
} from '../../../../../DetailsView/components/details-view-command-bar';

describe('DetailsViewCommandBar', () => {
    const thePageTitle = 'command-bar-test-tab-title';
    const thePageUrl = 'command-bar-test-url';
    const reportExportDialogStub = <div>Export dialog</div>;
    const selectedTest = -1;
    const scanDataStub = {} as ScanData;
    const visualizationStoreDataStub = { tests: {} } as VisualizationStoreData;
    const unifiedScanResultStoreDataStub = {} as UnifiedScanResultStoreData;

    let tabStoreData: TabStoreData;
    let startOverComponent: JSX.Element;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let isCommandBarCollapsed: boolean;
    let reportExportDialogFactory: IMock<ReportExportDialogFactory>;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationConfigurationMock: IMock<VisualizationConfiguration>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            MockBehavior.Loose,
        );
        reportExportDialogFactory = Mock.ofType<ReportExportDialogFactory>();
        tabStoreData = {
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        startOverComponent = null;
        isCommandBarCollapsed = false;
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(selectedTest))
            .returns(() => visualizationConfigurationMock.object);
    });

    function getProps(): DetailsViewCommandBarProps {
        const CommandBarStub: ReactFCWithDisplayName<DetailsViewCommandBarProps> = NamedFC<
            DetailsViewCommandBarProps
        >('test', _ => null);
        const LeftNavStub: ReactFCWithDisplayName<LeftNavProps> = NamedFC<LeftNavProps>(
            'test',
            _ => null,
        );
        const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
            CommandBar: CommandBarStub,
            ReportExportDialogFactory: reportExportDialogFactory.object,
            StartOverComponentFactory: p => startOverComponent,
            LeftNav: LeftNavStub,
        } as DetailsViewSwitcherNavConfiguration;
        const scanMetadata = {
            targetAppInfo: {
                name: thePageTitle,
                url: thePageUrl,
            },
        } as ScanMetadata;

        return {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            tabStoreData,
            switcherNavConfiguration: switcherNavConfiguration,
            scanMetadata: scanMetadata,
            narrowModeStatus: {
                isCommandBarCollapsed,
            },
            visualizationStoreData: visualizationStoreDataStub,
            unifiedScanResultStoreData: unifiedScanResultStoreDataStub,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
            selectedTest: selectedTest,
        } as DetailsViewCommandBarProps;
    }

    test.each`
        startOver | enabled  | shouldShow
        ${true}   | ${true}  | ${true}
        ${true}   | ${true}  | ${false}
        ${true}   | ${false} | ${true}
        ${true}   | ${false} | ${false}
        ${false}  | ${true}  | ${true}
        ${false}  | ${true}  | ${false}
        ${false}  | ${false} | ${true}
        ${false}  | ${false} | ${false}
    `(
        'renders with start over = $startOver, enabled = $enabled, shouldShowExportReport = $shouldShow',
        ({ startOver, enabled, shouldShow }) => {
            setupVisualizationConfigurationMock(enabled, shouldShow);
            testOnPivot(startOver);
        },
    );

    test('renders null when tab closed', () => {
        tabStoreData.isClosed = true;

        expect(render()).toBeNull();
    });

    test('renders with buttons collapsed into a menu', () => {
        isCommandBarCollapsed = true;
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    test('renders with report export dialog open', () => {
        const props = getProps();
        setupReportExportDialogFactory({ isOpen: true });

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isReportExportDialogOpen: true });

        expect(rendered.getElement()).toMatchSnapshot();
    });

    function testOnPivot(renderStartOver: boolean): void {
        if (renderStartOver) {
            startOverComponent = <ActionButton>Start Over Component</ActionButton>;
        }

        setupReportExportDialogFactory({ isOpen: false });
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps());
    }

    function setupReportExportDialogFactory(
        expectedProps?: Partial<ReportExportDialogFactoryProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        reportExportDialogFactory.setup(r => r(argMatcher)).returns(() => reportExportDialogStub);
    }

    function setupVisualizationConfigurationMock(enabled: boolean, shouldShow: boolean): void {
        visualizationConfigurationMock
            .setup(m => m.getStoreData(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub);
        visualizationConfigurationMock
            .setup(m => m.getTestStatus(scanDataStub))
            .returns(() => enabled);
        visualizationConfigurationMock
            .setup(m => m.shouldShowExportReport(unifiedScanResultStoreDataStub))
            .returns(() => shouldShow);
    }
});
