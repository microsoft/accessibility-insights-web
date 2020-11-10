// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { EnumHelper } from 'common/enum-helper';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ContentPageInfo } from 'electron/types/content-page-info';
import {
    commandButtonRefreshId,
    ReflowCommandBar,
    ReflowCommandBarDeps,
    ReflowCommandBarProps,
} from 'electron/views/automated-checks/components/reflow-command-bar';
import { mount, shallow } from 'enzyme';
import { IButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('ReflowCommandBar', () => {
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let cardsViewDataStub: CardsViewModel;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let scanMetadataStub: ScanMetadata;
    let scanDateStub: Date;
    let narrowModeStatusStub: NarrowModeStatus;
    let props: ReflowCommandBarProps;
    let scanPortStub: number;

    beforeEach(() => {
        featureFlagStoreDataStub = {
            somefeatureflag: true,
        };
        cardsViewDataStub = {} as CardsViewModel;
        scanMetadataStub = {
            timespan: {
                scanComplete: scanDateStub,
            },
            toolData: {} as ToolData,
            targetAppInfo: {
                name: 'scan target name',
            },
        };
        narrowModeStatusStub = {
            isHeaderAndNavCollapsed: false,
            isCommandBarCollapsed: false,
        };
        scanDateStub = new Date(0);
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        scanPortStub = 1111;

        props = {
            deps: {
                scanActionCreator: null,
                reportGenerator: reportGeneratorMock.object,
            } as ReflowCommandBarDeps,
            scanStoreData: {
                status: ScanStatus.Scanning,
            },
            cardsViewData: cardsViewDataStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            scanMetadata: scanMetadataStub,
            scanPort: scanPortStub,
            narrowModeStatus: narrowModeStatusStub,
            isSideNavOpen: true,
            setSideNavOpen: () => null,
            currentContentPageInfo: {
                allowsExportReport: true,
            } as ContentPageInfo,
        };
    });

    describe('renders', () => {
        it('while status is <Scanning>', () => {
            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('does not create report export when scan metadata is null', () => {
            props.scanMetadata = null;
            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('does not create report export when allowsExportReport is false', () => {
            props.currentContentPageInfo.allowsExportReport = false;
            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        const notScanningStatuses = EnumHelper.getNumericValues<ScanStatus>(ScanStatus)
            .filter(status => status !== ScanStatus.Scanning)
            .map(status => ScanStatus[status]);

        it.each(notScanningStatuses)('while status is <%s>', status => {
            props.scanStoreData.status = ScanStatus[status];

            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();

        it('handles start over click', () => {
            const scanActionCreatorMock = Mock.ofType<ScanActionCreator>(
                undefined,
                MockBehavior.Strict,
            );
            props.deps.scanActionCreator = scanActionCreatorMock.object;
            props.scanStoreData.status = ScanStatus.Default;

            scanActionCreatorMock
                .setup(creator => creator.scan(scanPortStub))
                .verifiable(Times.once());

            const rendered = mount(<ReflowCommandBar {...props} />);

            const buttonSelector = `button${getAutomationIdSelector(commandButtonRefreshId)}`;
            const button = rendered.find(buttonSelector);

            button.simulate('click', eventStub);

            scanActionCreatorMock.verifyAll();
        });

        it('handles settings click', () => {
            const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
            props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

            const rendered = mount(<ReflowCommandBar {...props} />);
            const button = rendered.find('button[aria-label="settings"]');

            button.simulate('click', eventStub);

            dropdownClickHandlerMock.verify(
                handler => handler.openSettingsPanelHandler(It.isAny()),
                Times.once(),
            );
        });
    });

    describe('reflow behavior', () => {
        test('isCommandBarCollapsed is true', () => {
            props.narrowModeStatus.isCommandBarCollapsed = true;

            const rendered = shallow(<ReflowCommandBar {...props} />);
            const commandBar = rendered.find(CommandBarButtonsMenu);

            expect(rendered.getElement()).toMatchSnapshot();
            expect(commandBar.prop('renderExportReportButton')()).toMatchSnapshot('export report');
        });

        test('isHeaderAndNavCollapsed is true', () => {
            props.narrowModeStatus.isHeaderAndNavCollapsed = true;

            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        test('dropdown menu is dismissed and button focused when dialog is dismissed', () => {
            props.narrowModeStatus.isCommandBarCollapsed = true;
            const rendered = shallow(<ReflowCommandBar {...props} />);
            const buttonMock = Mock.ofType<IButton>();
            const commandBar = rendered.find(CommandBarButtonsMenu);
            const buttonRefCallback = commandBar.prop('buttonRef') as any;
            const onDialogDismissCallback = commandBar.prop('renderExportReportButton')().props[
                'onDialogDismiss'
            ];

            buttonMock.setup(bm => bm.dismissMenu()).verifiable();
            buttonMock.setup(bm => bm.focus()).verifiable();

            buttonRefCallback(buttonMock.object);
            onDialogDismissCallback();

            buttonMock.verifyAll();
        });
    });
});
