// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
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

    let tabStoreData: TabStoreData;
    let startOverComponent: JSX.Element;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let isCommandBarCollapsed: boolean;
    let showReportExportButton: boolean;
    let reportExportDialogFactory: IMock<ReportExportDialogFactory>;

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
        showReportExportButton = true;
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
            shouldShowReportExportButton: p => showReportExportButton,
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
        } as DetailsViewCommandBarProps;
    }

    test('renders with export button, with start over', () => {
        testOnPivot(true, true);
    });

    test('renders without export button, without start over', () => {
        testOnPivot(false, false);
    });

    test('renders with export button, without start over', () => {
        testOnPivot(true, false);
    });

    test('renders without export button, with start over', () => {
        testOnPivot(false, true);
    });

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

        expect(rendered.debug()).toMatchSnapshot();
    });

    function testOnPivot(renderExportResults: boolean, renderStartOver: boolean): void {
        showReportExportButton = renderExportResults;

        if (renderStartOver) {
            startOverComponent = <ActionButton>Start Over Component</ActionButton>;
        }

        setupReportExportDialogFactory({ isOpen: false });
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();
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
});
