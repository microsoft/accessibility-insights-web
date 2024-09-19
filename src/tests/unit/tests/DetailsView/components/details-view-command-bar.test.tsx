// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import '@testing-library/jest-dom';
import { Button } from '@fluentui/react-components';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Assessments } from 'assessments/assessments';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { FileURLProvider } from 'common/file-url-provider';
import { FileNameBuilder } from 'common/filename-builder';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UrlParser } from 'common/url-parser';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import {
    CommandBarProps,
    DetailsViewCommandBar,
    DetailsViewCommandBarProps,
    LoadAssessmentButtonFactory,
    ReportExportDialogFactory,
    SaveAssessmentButtonFactory,
    TransferToAssessmentButtonFactory,
} from 'DetailsView/components/details-view-command-bar';
import { DetailsRightPanelConfiguration } from 'DetailsView/components/details-view-right-panel';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
    LeftNavProps,
} from 'DetailsView/components/details-view-switcher-nav';
import { ExportDialog } from 'DetailsView/components/export-dialog';
import { InvalidLoadAssessmentDialog } from 'DetailsView/components/invalid-load-assessment-dialog';
import { LoadAssessmentButton } from 'DetailsView/components/load-assessment-button';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';
import { LoadAssessmentDialog } from 'DetailsView/components/load-assessment-dialog';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import { QuickAssessToAssessmentDialog } from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { ReportExportButton } from 'DetailsView/components/report-export-button';
import { ReportExportDialogFactoryProps } from 'DetailsView/components/report-export-dialog-factory';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';
import {
    SaveAssessmentButtonFactoryProps,
    getSaveButtonForAssessment,
} from 'DetailsView/components/save-assessment-button-factory';
import { SaveAssessmentDialog } from 'DetailsView/components/save-assessment-dialog';
import {
    StartOverFactoryProps,
    getStartOverComponentForAssessment,
} from 'DetailsView/components/start-over-component-factory';
import { StartOverDialog } from 'DetailsView/components/start-over-dialog';
import {
    TransferToAssessmentButtonProps,
    getTransferToAssessmentButton,
} from 'DetailsView/components/transfer-to-assessment-button';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import { isNil } from 'lodash';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportExportServiceProviderImpl } from 'report-export/report-export-service-provider-impl';
import { ReportNameGenerator, WebReportNameGenerator } from 'reports/report-name-generator';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentCall,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock } from 'typemoq';
import { AssessmentDataFormatter } from '../../../../../common/assessment-data-formatter';

jest.mock('DetailsView/components/report-export-button');
jest.mock('DetailsView/components/load-assessment-dialog');
jest.mock('DetailsView/components/start-over-dialog');
jest.mock('DetailsView/components/export-dialog');
jest.mock('DetailsView/components/command-bar-buttons-menu');
jest.mock('DetailsView/components/invalid-load-assessment-dialog');
jest.mock('DetailsView/components/save-assessment-dialog');
jest.mock('common/components/new-tab-link-with-tooltip');
jest.mock('DetailsView/components/quick-assess-to-assessment-dialog');
jest.mock('DetailsView/components/load-assessment-button');
jest.mock('DetailsView/components/save-assessment-button');

describe('DetailsViewCommandBar', () => {
    mockReactComponents([
        ReportExportButton,
        SaveAssessmentButton,
        LoadAssessmentDialog,
        StartOverDialog,
        SaveAssessmentDialog,
        CommandBarButtonsMenu,
        InvalidLoadAssessmentDialog,
        NewTabLinkWithTooltip,
        ReportExportButton,
        ExportDialog,
        QuickAssessToAssessmentDialog,
        LoadAssessmentButton,
    ]);
    const thePageTitle = 'command-bar-test-tab-title';
    const thePageUrl = 'command-bar-test-url';
    const reportExportDialogStub = <div>Export dialog</div>;
    const saveAssessmentStub = <div>Save assessment</div>;
    const transferToAssessmentStub = <div>Transfer to assessment stub</div>;
    const assessmentStub: Assessment = {
        title: 'SingleTest',
    } as Assessment;

    const assessmentsProviderStub = {
        forType: _ => assessmentStub,
    } as AssessmentsProvider;
    let assessmentStoreData: AssessmentStoreData;
    let tabStoreData: TabStoreData;
    let featureFlagStoreData: FeatureFlagStoreData;
    let startOverComponent: JSX.Element;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let getAssessmentActionMessageCreatorStub: () => AssessmentActionMessageCreator;
    let isCommandBarCollapsed: boolean;
    let showReportExportButton: boolean;
    let reportExportDialogFactory: IMock<ReportExportDialogFactory>;
    let saveAssessmentButtonFactoryMock: IMock<SaveAssessmentButtonFactory>;
    let loadAssessmentButtonFactoryMock: IMock<LoadAssessmentButtonFactory>;
    let transferToAssessmentButtonFactoryMock: IMock<TransferToAssessmentButtonFactory>;
    let getStartOverComponentMock: IMock<(Props: StartOverFactoryProps) => JSX.Element>;
    let fileNameBuilderMock: IMock<FileNameBuilder>;
    let fileURLProviderMock: IMock<FileURLProvider>;
    let loadAssessmentHelper: LoadAssessmentHelper;
    let assessmentDataParser: AssessmentDataParser;
    let assessmentDataFormatter: AssessmentDataFormatter;
    const urlParser: UrlParser = new UrlParser();
    let dataTransferViewControllerMock: IMock<DataTransferViewController>;
    const reportExportServiceProvider: ReportExportServiceProvider =
        ReportExportServiceProviderImpl;
    const reportNameGenerator: ReportNameGenerator = new WebReportNameGenerator();
    let rightPanelConfiguration: DetailsRightPanelConfiguration;
    let loadAssessmentDataValidator: LoadAssessmentDataValidator;
    const getLoadAssessmentHelperStub: (props) => LoadAssessmentHelper = ({
        toggleLoad,
        toggleInvalidLoad,
    }) => {
        return {
            getAssessmentForLoad: (
                _setAssessmentState,
                toggleInvalidLoadAssessmentDialog,
                toggleLoadAssessmentDialog,
                _prevTargetPageData,
                _newTargetPageId,
            ) => {
                if (toggleLoad) {
                    toggleLoadAssessmentDialog();
                }
                if (toggleInvalidLoad) toggleInvalidLoadAssessmentDialog();
            },
        } as LoadAssessmentHelper;
    };
    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        getAssessmentActionMessageCreatorStub = () => assessmentActionMessageCreatorMock.object;
        reportExportDialogFactory = Mock.ofInstance(props => null);
        saveAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        loadAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        transferToAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        getStartOverComponentMock = Mock.ofInstance(props => null);
        fileURLProviderMock = Mock.ofType(FileURLProvider);
        assessmentDataParser = new AssessmentDataParser();
        assessmentDataFormatter = new AssessmentDataFormatter();
        loadAssessmentDataValidator = new LoadAssessmentDataValidator(
            Assessments,
            featureFlagStoreData,
        );
        loadAssessmentHelper = new LoadAssessmentHelper(
            assessmentDataParser,
            assessmentActionMessageCreatorMock.object,
            new FileReader(),
            document,
            loadAssessmentDataValidator,
        );
        fileNameBuilderMock = Mock.ofType(FileNameBuilder);
        dataTransferViewControllerMock = Mock.ofType(DataTransferViewController);

        tabStoreData = {
            id: 5,
            title: thePageTitle,
            url: thePageUrl,
            isClosed: false,
        } as TabStoreData;
        featureFlagStoreData = { exportReportOptions: true };
        startOverComponent = null;
        isCommandBarCollapsed = false;
        showReportExportButton = true;

        assessmentStoreData = {} as AssessmentStoreData;
        assessmentStoreData.persistedTabInfo = {
            id: 5,
            title: thePageTitle,
            isClosed: false,
            url: thePageUrl,
            detailsViewId: undefined,
        } as PersistedTabInfo;
        assessmentStoreData.assessmentNavState = {
            selectedTestType: 2,
            selectedTestSubview: 'landmark-roles',
        };
        rightPanelConfiguration = {
            startOverContextMenuKeyOptions: {
                showTest: true,
            },
        } as DetailsRightPanelConfiguration;
    });

    function getProps(switcherNavButtonOverrides?: string[]): DetailsViewCommandBarProps {
        const CommandBarStub: ReactFCWithDisplayName<DetailsViewCommandBarProps> =
            NamedFC<DetailsViewCommandBarProps>('test', _ => null);
        const LeftNavStub: ReactFCWithDisplayName<LeftNavProps> = NamedFC<LeftNavProps>(
            'test',
            _ => null,
        );

        const actualSwitcherNavConfiguration = {
            ...GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
            }),
            TransferToAssessmentButton: getTransferToAssessmentButton,
        };

        const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
            CommandBar: switcherNavButtonOverrides?.includes('CommandBar')
                ? actualSwitcherNavConfiguration.CommandBar
                : CommandBarStub,
            ReportExportDialogFactory: actualSwitcherNavConfiguration.ReportExportDialogFactory,
            SaveAssessmentButton: switcherNavButtonOverrides?.includes('SaveAssessmentButton')
                ? actualSwitcherNavConfiguration.SaveAssessmentButton
                : saveAssessmentButtonFactoryMock.object,
            LoadAssessmentButton: switcherNavButtonOverrides?.includes('LoadAssessmentButton')
                ? actualSwitcherNavConfiguration.LoadAssessmentButton
                : loadAssessmentButtonFactoryMock.object,
            TransferToAssessmentButton: switcherNavButtonOverrides?.includes(
                'TransferToAssessmentButton',
            )
                ? actualSwitcherNavConfiguration.TransferToAssessmentButton
                : transferToAssessmentButtonFactoryMock.object,
            shouldShowReportExportButton: p => showReportExportButton,
            StartOverComponentFactory: {
                getStartOverMenuItem:
                    actualSwitcherNavConfiguration.StartOverComponentFactory.getStartOverMenuItem,
                getStartOverComponent: switcherNavButtonOverrides?.includes('StartOverComponent')
                    ? actualSwitcherNavConfiguration.StartOverComponentFactory.getStartOverComponent
                    : getStartOverComponentMock.object,
            },
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
                getAssessmentActionMessageCreator: getAssessmentActionMessageCreatorStub,
                getCurrentDate: () => new Date(),
                fileNameBuilder: fileNameBuilderMock.object,
                fileURLProvider: fileURLProviderMock.object,
                loadAssessmentHelper: loadAssessmentHelper,
                assessmentDataParser: assessmentDataParser,
                assessmentDataFormatter: assessmentDataFormatter,
                urlParser: urlParser,
                dataTransferViewController: dataTransferViewControllerMock.object,
                getProvider: () => assessmentsProviderStub,
                detailsViewId: 'test-details-view-id',
                reportExportServiceProvider: reportExportServiceProvider,
                reportNameGenerator: reportNameGenerator,
            },
            assessmentStoreData,
            tabStoreData,
            featureFlagStoreData,
            switcherNavConfiguration: switcherNavConfiguration,
            scanMetadata: scanMetadata,
            narrowModeStatus: {
                isCommandBarCollapsed,
            },
            rightPanelConfiguration,
            dataTransferViewStoreData: { showQuickAssessToAssessmentConfirmDialog: false },
            userConfigurationStoreData: { showSaveAssessmentDialog: false },
        } as DetailsViewCommandBarProps;
    }

    test('renders with export button and start over', () => {
        testOnPivot(true, true);
    });

    test('renders without export button and without start over', () => {
        testOnPivot(false, false);
    });

    test('renders with export button, without start over', () => {
        testOnPivot(true, false);
    });

    test('renders without export button, with start over', () => {
        testOnPivot(false, true);
    });

    test('renders null when tab closed', () => {
        const props = getProps();
        props.tabStoreData.isClosed = true;
        const result = render(<DetailsViewCommandBar {...props} />);
        expect(result.container.firstChild).toBeNull();
    });

    test('renders with buttons collapsed into a menu', () => {
        isCommandBarCollapsed = true;
        const props = getProps();

        const renderResult = render(<DetailsViewCommandBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CommandBarButtonsMenu]);
    });

    test('renders with buttons ', () => {
        useOriginalReactElements('DetailsView/components/load-assessment-button', [
            'LoadAssessmentButton',
        ]);
        tabStoreData.isClosed = true;
        isCommandBarCollapsed = false;
        const props = getProps();

        const renderResult = render(<DetailsViewCommandBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CommandBarButtonsMenu]);
    });

    test('renders report export dialog', async () => {
        const originalDate = Date;
        const mockDate = new Date('2024-03-07T12:00:00Z');
        global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
        global.Date.now = jest.fn(() => mockDate.getTime()) as unknown as typeof Date.now;
        const props = getProps();
        useOriginalReactElements('DetailsView/components/report-export-button', [
            'ReportExportButton',
        ]);
        const renderResult = render(<DetailsViewCommandBar {...props} />);

        const exportButton = renderResult.getByText('Export result');
        expect(getMockComponentClassPropsForCall(ExportDialog, 1).isOpen).toBe(false);
        expect(renderResult.asFragment()).toMatchSnapshot('export dialog hidden');
        await userEvent.click(exportButton);
        expect(getMockComponentClassPropsForCall(ExportDialog, 2).isOpen).toBe(true);
        expect(renderResult.asFragment()).toMatchSnapshot('export dialog open');
        global.Date = originalDate;
    });

    test('renders save assessment dialog', async () => {
        const props = getProps(['SaveAssessmentButton']);
        props.userConfigurationStoreData.showSaveAssessmentDialog = true;
        useOriginalReactElements('DetailsView/components/save-assessment-button', [
            'SaveAssessmentButton',
        ]);
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        const saveButton = renderResult.getByText('Save assessment');
        expect(getMockComponentClassPropsForCall(SaveAssessmentDialog, 1).isOpen).toBe(false);
        expect(renderResult.asFragment()).toMatchSnapshot('save assessment dialog hidden');
        await userEvent.click(saveButton);
        expect(getMockComponentClassPropsForCall(SaveAssessmentDialog, 2).isOpen).toBe(true);
        expect(renderResult.asFragment()).toMatchSnapshot('Save assessment dialog open');
    });

    test('renders load assessment dialog', async () => {
        const props = getProps(['LoadAssessmentButton']);
        props.deps.loadAssessmentHelper = getLoadAssessmentHelperStub({ toggleLoad: true });
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        const loadAssessmentButton = renderResult.getByText('Load assessment');
        expect(getMockComponentClassPropsForCall(LoadAssessmentDialog, 1).isOpen).toBe(false);
        expect(renderResult.asFragment()).toMatchSnapshot('load assessment dialog hidden');
        await userEvent.click(loadAssessmentButton);
        expect(getMockComponentClassPropsForCall(LoadAssessmentDialog, 2).isOpen).toBe(true);
        expect(renderResult.asFragment()).toMatchSnapshot('load assessment dialog open');
    });

    test('renders invalid load assessment dialog', async () => {
        const props = getProps(['LoadAssessmentButton']);
        props.deps.loadAssessmentHelper = getLoadAssessmentHelperStub({ toggleInvalidLoad: true });
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        const loadAssessmentButton = renderResult.getByText('Load assessment');
        expect(getMockComponentClassPropsForCall(InvalidLoadAssessmentDialog, 1).isOpen).toBe(
            false,
        );
        expect(renderResult.asFragment()).toMatchSnapshot('invalid load assessment dialog hidden');
        await userEvent.click(loadAssessmentButton);
        expect(getMockComponentClassPropsForCall(InvalidLoadAssessmentDialog, 2).isOpen).toBe(true);
        expect(renderResult.asFragment()).toMatchSnapshot('invalid load assessment dialog open');
    });

    test('renders start test over dialog', async () => {
        const props = getProps(['StartOverComponent']);
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        expect(getMockComponentClassPropsForCall(StartOverDialog, 1).dialogState).toBe('none');
        const startOverMenuButton = renderResult.getByRole('button', { name: 'start over menu' });
        await userEvent.click(startOverMenuButton);
        const startOverAssessmentButton = renderResult.getByRole('menuitem', {
            name: 'Start over SingleTest',
        });
        expect(renderResult.asFragment()).toMatchSnapshot('start test over dialog hidden');
        await userEvent.click(startOverAssessmentButton);
        expect(getMockComponentClassPropsForCall(StartOverDialog, 2).dialogState).toBe('test');
        expect(renderResult.asFragment()).toMatchSnapshot('start test over dialog open');
    });

    test('renders start assessment over dialog', async () => {
        const props = getProps(['StartOverComponent']);
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        expect(getMockComponentClassPropsForCall(StartOverDialog, 1).dialogState).toBe('none');
        const startOverMenuButton = renderResult.getByText('Start over');
        await userEvent.click(startOverMenuButton);
        const startOverAssessmentButton = renderResult.getByRole('menuitem', {
            name: 'Start over Assessment',
        });
        expect(renderResult.asFragment()).toMatchSnapshot('start assessment over dialog hidden');
        await userEvent.click(startOverAssessmentButton, { pointerEventsCheck: 0 });
        expect(getMockComponentClassPropsForCall(StartOverDialog, 2).dialogState).toBe(
            'assessment',
        );
        expect(renderResult.asFragment()).toMatchSnapshot('start assessment over dialog open');
    });

    test('renders transfer to assessment dialog', async () => {
        const props = getProps();
        setupTransferToAssessmentButtonFactory(props);
        const renderResult = render(<DetailsViewCommandBar {...props} />);
        expect(getMockComponentClassPropsForCall(QuickAssessToAssessmentDialog, 1).isShown).toBe(
            false,
        );
        expect(renderResult.asFragment()).toMatchSnapshot('transfer to assessment dialog hidden');
        props.dataTransferViewStoreData.showQuickAssessToAssessmentConfirmDialog = true;
        setupTransferToAssessmentButtonFactory(props);
        renderResult.rerender(<DetailsViewCommandBar {...props} />);
        expect(getMockComponentClassPropsForCall(QuickAssessToAssessmentDialog, 2).isShown).toBe(
            true,
        );
        expect(renderResult.asFragment()).toMatchSnapshot('transfer to assessment dialog open');
    });

    describe('Button focus', () => {
        beforeEach(() => {
            useOriginalReactElements('DetailsView/components/command-bar-buttons-menu', [
                'CommandBarButtonsMenu',
            ]);
        });
        test('do not change focus to export report button when focus ref is not set', async () => {
            mockReactComponents([ReportExportButton]);
            useOriginalReactElements('DetailsView/components/export-dialog', ['ExportDialog']);
            const props = getProps(['ReportExportDialogFactory', 'CommandBar']);
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            expect(renderResult.baseElement).toHaveFocus();
            getMockComponentCall(ExportDialog)[0].afterDismissed();
            expect(renderResult.baseElement).toHaveFocus();
        });
        test('focus export report button when focus ref is set', async () => {
            useOriginalReactElements('DetailsView/components/report-export-button', [
                'ReportExportButton',
            ]);
            useOriginalReactElements('DetailsView/components/export-dialog', ['ExportDialog']);
            const props = getProps(['ReportExportDialogFactory', 'CommandBar']);
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            const exportButton = renderResult.getByText('Export result');
            expect(exportButton).not.toHaveFocus();
            getMockComponentCall(ExportDialog)[0].afterDismissed();
            expect(exportButton).toHaveFocus();
            await userEvent.click(exportButton); //open the dialog
            const textArea = renderResult.getByRole('textbox');
            expect(textArea).toHaveFocus();

            const exportDialogProps = getMockComponentCall(ExportDialog, 2)[0];

            act(() => {
                exportDialogProps.afterDismissed();
            });

            expect(exportButton).toHaveFocus();
        });

        test('do not change focus to transfer assessment button when focus ref is not set', async () => {
            useOriginalReactElements('DetailsView/components/quick-assess-to-assessment-dialog', [
                'QuickAssessToAssessmentDialog',
            ]);
            useOriginalReactElements;
            const props = getProps(['CommandBar']);
            let setRef;
            transferToAssessmentButtonFactoryMock
                .setup(m => m(It.isAny()))
                .callback(props => {
                    setRef = props.buttonRef;
                });
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            expect(setRef).toBeDefined();
            expect(renderResult.baseElement).toHaveFocus();
            setRef(undefined);
            getMockComponentCall(QuickAssessToAssessmentDialog)[0].afterDialogDismissed();
            expect(renderResult.baseElement).toHaveFocus();
        });

        test('focus transfer assessment button when focus ref is set', async () => {
            useOriginalReactElements('DetailsView/components/quick-assess-to-assessment-dialog', [
                'QuickAssessToAssessmentDialog',
            ]);
            const props = getProps(['TransferToAssessmentButton', 'CommandBar']);
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            const transferButton = renderResult.getByRole('button', {
                name: 'Move to assessment',
            });
            expect(transferButton).not.toHaveFocus();
            getMockComponentCall(QuickAssessToAssessmentDialog)[0].afterDialogDismissed();
            expect(transferButton).toHaveFocus();
            props.dataTransferViewStoreData.showQuickAssessToAssessmentConfirmDialog = true;
            renderResult.rerender(<DetailsViewCommandBar {...props} />); //open the dialog
            const continueButton = renderResult.getByRole('button', {
                name: 'Continue to Assessment',
            });
            expect(continueButton).toHaveFocus();
            getMockComponentCall(QuickAssessToAssessmentDialog, 1)[0].afterDialogDismissed();
            expect(transferButton).toHaveFocus();
        });

        test('do not change focus to start over button when focus ref is not set', async () => {
            useOriginalReactElements('DetailsView/components/start-over-dialog', [
                'StartOverDialog',
            ]);
            const props = getProps(['StartOverComponent', 'CommandBar']);
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            expect(renderResult.baseElement).toHaveFocus();
            act(() => {
                getMockComponentCall(StartOverDialog)[0].dismissDialog();
            });

            expect(renderResult.baseElement).toHaveFocus();
        });

        test('render statover component', async () => {
            isCommandBarCollapsed = true;
            useOriginalReactElements('DetailsView/components/start-over-dialog', [
                'StartOverDialog',
            ]);
            const props = getProps(['StartOverComponent', 'CommandBar']);
            const renderResult = render(<DetailsViewCommandBar {...props} />);
            expect(renderResult).toMatchSnapshot();
        });

        test('focus start over button when focus ref is set', async () => {
            useOriginalReactElements('DetailsView/components/start-over-dialog', [
                'StartOverDialog',
            ]);
            const props = getProps(['StartOverComponent']);

            const renderResult = render(<DetailsViewCommandBar {...props} />);
            expect(renderResult.baseElement).toHaveFocus();
            const startOverMenuButton = renderResult.getByText('Start over');
            act(() => {
                getMockComponentCall(StartOverDialog)[0].dismissDialog();
            });

            expect(renderResult.baseElement).toHaveFocus();
            await userEvent.click(startOverMenuButton);
            const startOverAssessmentButton = renderResult.getByRole('menuitem', {
                name: 'Start over Assessment',
            });
            await userEvent.click(startOverAssessmentButton, { pointerEventsCheck: 0 });
            const cancelDialogButton = renderResult.getByRole('button', { name: 'Cancel' });
            expect(cancelDialogButton).toHaveFocus();

            act(() => {
                getMockComponentCall(StartOverDialog, 3)[0].dismissDialog();
            });
            expect(startOverMenuButton).toHaveFocus();
        });
    });

    function testOnPivot(renderExportResults: boolean, renderStartOver: boolean): void {
        showReportExportButton = renderExportResults;

        if (renderStartOver) {
            startOverComponent = <Button>Start Over Component</Button>;
        }

        const props = getProps();

        setupSaveAssessmentButtonFactory(props);
        setupTransferToAssessmentButtonFactory(props);
        setupStartOverButtonFactory(props);
        setupReportExportDialogFactory({ isOpen: false });

        const renderResult = render(<DetailsViewCommandBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    }

    function setupReportExportDialogFactory(
        expectedProps?: Partial<ReportExportDialogFactoryProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        reportExportDialogFactory.setup(r => r(argMatcher)).returns(() => reportExportDialogStub);
    }

    function setupSaveAssessmentButtonFactory(
        expectedProps?: Partial<SaveAssessmentButtonFactoryProps>,
        useOriginalReactElements?: boolean,
    ): void {
        const SaveButtonFactory = getSaveButtonForAssessment;
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        saveAssessmentButtonFactoryMock
            .setup(r => r(argMatcher))
            .returns(() =>
                useOriginalReactElements
                    ? SaveButtonFactory(expectedProps as SaveAssessmentButtonFactoryProps)
                    : saveAssessmentStub,
            );
    }

    function setupTransferToAssessmentButtonFactory(
        expectedProps?: Partial<TransferToAssessmentButtonProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        transferToAssessmentButtonFactoryMock
            .setup(r => r(argMatcher))
            .returns(() => transferToAssessmentStub);
    }

    function setupStartOverButtonFactory(
        props: CommandBarProps,
        useOriginalReactElements?: boolean,
    ): void {
        const expectedProps = props as Partial<StartOverFactoryProps>;
        getStartOverComponentMock
            .setup(g => g(It.isObjectWith(expectedProps)))
            .returns(() =>
                useOriginalReactElements
                    ? getStartOverComponentForAssessment(
                          expectedProps as StartOverFactoryProps,
                          'down',
                      )
                    : startOverComponent,
            );
    }
});
