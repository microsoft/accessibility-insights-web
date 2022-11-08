// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton } from '@fluentui/react';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FileURLProvider } from 'common/file-url-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ReportExportButton } from 'DetailsView/components/report-export-button';
import { ReportExportComponent } from 'DetailsView/components/report-export-component';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ContentPageInfo } from 'electron/types/content-page-info';
import {
    commandButtonRefreshId,
    ReflowCommandBar,
    ReflowCommandBarDeps,
    ReflowCommandBarProps,
} from 'electron/views/results/components/reflow-command-bar';
import { mount, shallow } from 'enzyme';
import { isMatch } from 'lodash';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ReportNameGenerator } from 'reports/report-name-generator';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ReflowCommandBar', () => {
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let cardsViewDataStub: CardsViewModel;
    let reportHtmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let reportNameGeneratorMock: IMock<ReportNameGenerator>;
    let scanMetadataStub: ScanMetadata;
    let scanDateStub: Date;
    let narrowModeStatusStub: NarrowModeStatus;
    let props: ReflowCommandBarProps;
    let reportExportServiceProviderMock: IMock<ReportExportServiceProvider>;
    let fileUrlProviderMock: IMock<FileURLProvider>;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;

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
            isVirtualKeyboardCollapsed: false,
            isCardFooterCollapsed: false,
        };
        scanDateStub = new Date(0);
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        reportHtmlGeneratorMock = Mock.ofType(ReportHtmlGenerator);
        reportNameGeneratorMock = Mock.ofType<ReportNameGenerator>(null);
        reportExportServiceProviderMock = Mock.ofType(ReportExportServiceProvider);
        fileUrlProviderMock = Mock.ofType(FileURLProvider);
        setReportExportServiceProviderForFastPass();
        props = {
            deps: {
                scanActionCreator: null,
                reportHtmlGenerator: reportHtmlGeneratorMock.object,
                reportNameGenerator: reportNameGeneratorMock.object,
                reportExportServiceProvider: reportExportServiceProviderMock.object,
                fileURLProvider: fileUrlProviderMock.object,
                assessmentActionMessageCreator: assessmentActionMessageCreatorMock.object,
            } as ReflowCommandBarDeps,
            scanStoreData: {} as ScanStoreData,
            cardsViewData: cardsViewDataStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            scanMetadata: scanMetadataStub,
            narrowModeStatus: narrowModeStatusStub,
            isSideNavOpen: true,
            setSideNavOpen: () => null,
            currentContentPageInfo: {
                allowsExportReport: true,
                startOverButtonSettings: _ => {
                    return {
                        onClick: e => {},
                        disabled: false,
                    };
                },
            } as ContentPageInfo,
        };
    });

    function setReportExportServiceProviderForFastPass(): void {
        reportExportServiceProviderMock
            .setup(r => r.servicesForFastPass())
            .returns(() => [
                { key: 'html', generateMenuItem: null },
                { key: 'codepen', generateMenuItem: null },
            ])
            .verifiable(Times.once());
    }

    describe('renders', () => {
        it('with start over button disabled', () => {
            props.currentContentPageInfo.startOverButtonSettings = _ => {
                return {
                    onClick: () => {},
                    disabled: true,
                };
            };

            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.debug()).toMatchSnapshot();
            reportExportServiceProviderMock.verifyAll();
        });

        it('does not create report export when scan metadata is null', () => {
            props.scanMetadata = null;
            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.debug()).toMatchSnapshot();
        });

        it('does not create report export when allowsExportReport is false', () => {
            props.currentContentPageInfo.allowsExportReport = false;
            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.debug()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();

        it('handles start over click', () => {
            let clickWasCalled: boolean = false;

            props.currentContentPageInfo.startOverButtonSettings = _ => {
                return {
                    onClick: e => {
                        clickWasCalled = true;

                        // The event passed through is decorated with other properties so we only check subset.
                        expect(isMatch(e, eventStub)).toBeTruthy();
                    },
                    disabled: false,
                };
            };

            const rendered = mount(<ReflowCommandBar {...props} />);

            const buttonSelector = `button${getAutomationIdSelector(commandButtonRefreshId)}`;
            const button = rendered.find(buttonSelector);

            button.simulate('click', eventStub);

            expect(clickWasCalled).toBeTruthy();
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

        test('exportResultsClickedTelemetry sends exportResultsClicked message', () => {
            const reportExportFormat = 'Assessment';
            const selectedServiceKey = 'html';
            assessmentActionMessageCreatorMock
                .setup(d => d.exportResultsClicked(reportExportFormat, selectedServiceKey, null))
                .verifiable(Times.once());

            const rendered = shallow(<ReflowCommandBar {...props} />);
            const exportDialog = rendered.find(ReportExportComponent);
            exportDialog.prop('exportResultsClickedTelemetry')(
                reportExportFormat,
                selectedServiceKey,
                null,
            );

            assessmentActionMessageCreatorMock.verifyAll();
        });
    });

    describe('reflow behavior', () => {
        test('isCommandBarCollapsed is true', () => {
            props.narrowModeStatus.isCommandBarCollapsed = true;

            const rendered = shallow(<ReflowCommandBar {...props} />);
            const commandBar = rendered.find(CommandBarButtonsMenu);

            expect(rendered.debug()).toMatchSnapshot();
            expect(commandBar.prop('renderExportReportButton')()).toMatchSnapshot('export report');
        });

        test('isHeaderAndNavCollapsed is true', () => {
            props.narrowModeStatus.isHeaderAndNavCollapsed = true;

            const rendered = shallow(<ReflowCommandBar {...props} />);

            expect(rendered.debug()).toMatchSnapshot();
        });

        test('dropdown menu is dismissed and button focused when dialog is dismissed', () => {
            props.narrowModeStatus.isCommandBarCollapsed = true;
            const rendered = shallow(<ReflowCommandBar {...props} />);
            const buttonMock = Mock.ofType<IButton>();
            const commandBar = rendered.find(CommandBarButtonsMenu);
            const buttonRefCallback = commandBar.prop('buttonRef') as any;

            const exportDialog = rendered.find(ReportExportComponent);
            const onDialogDismissCallback = exportDialog.props()['afterDialogDismissed'];

            buttonMock.setup(bm => bm.dismissMenu()).verifiable();
            buttonMock.setup(bm => bm.focus()).verifiable();

            buttonRefCallback(buttonMock.object);
            onDialogDismissCallback();

            buttonMock.verifyAll();
        });

        test('dropdown menu is dismissed and button focused when dialog is dismissed (isCommandBarCollapsed is not collapsed)', () => {
            props.narrowModeStatus.isCommandBarCollapsed = false;
            const rendered = shallow(<ReflowCommandBar {...props} />);
            const buttonMock = Mock.ofType<IButton>();

            const exportButton = rendered.find(ReportExportButton);
            const buttonRefCallback = exportButton.prop('buttonRef') as any;

            const exportDialog = rendered.find(ReportExportComponent);
            const onDialogDismissCallback = exportDialog.props()['afterDialogDismissed'];

            buttonMock.setup(bm => bm.dismissMenu()).verifiable();
            buttonMock.setup(bm => bm.focus()).verifiable();

            buttonRefCallback(buttonMock.object);
            onDialogDismissCallback();

            buttonMock.verifyAll();
        });
    });
});
