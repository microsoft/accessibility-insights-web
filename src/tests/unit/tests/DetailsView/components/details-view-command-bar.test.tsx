// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, IButton } from '@fluentui/react';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    CommandBarProps,
    DetailsViewCommandBar,
    DetailsViewCommandBarProps,
    LoadAssessmentButtonFactory,
    ReportExportDialogFactory,
    SaveAssessmentButtonFactory,
    TransferToAssessmentButtonFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    DetailsViewSwitcherNavConfiguration,
    LeftNavProps,
} from 'DetailsView/components/details-view-switcher-nav';
import { ReportExportDialogFactoryProps } from 'DetailsView/components/report-export-dialog-factory';
import { SaveAssessmentButtonFactoryProps } from 'DetailsView/components/save-assessment-button-factory';
import {
    StartOverComponentFactory,
    StartOverFactoryProps,
} from 'DetailsView/components/start-over-component-factory';
import { TransferToAssessmentButtonProps } from 'DetailsView/components/transfer-to-assessment-button';
import { shallow } from 'enzyme';
import { isNil } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('DetailsViewCommandBar', () => {
    const thePageTitle = 'command-bar-test-tab-title';
    const thePageUrl = 'command-bar-test-url';
    const reportExportDialogStub = <div>Export dialog</div>;
    const saveAssessmentStub = <div>Save assessment</div>;
    const loadAssessmentStub = <div>Load assessment</div>;
    const transferToAssessmentStub = <div>Transfer to assessment stub</div>;

    let assessmentStoreData: AssessmentStoreData;
    let tabStoreData: TabStoreData;
    let startOverComponent: JSX.Element;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let isCommandBarCollapsed: boolean;
    let showReportExportButton: boolean;
    let reportExportDialogFactory: IMock<ReportExportDialogFactory>;
    let saveAssessmentButtonFactoryMock: IMock<SaveAssessmentButtonFactory>;
    let loadAssessmentButtonFactoryMock: IMock<LoadAssessmentButtonFactory>;
    let transferToAssessmentButtonFactoryMock: IMock<TransferToAssessmentButtonFactory>;
    let getStartOverComponentMock: IMock<(Props: StartOverFactoryProps) => JSX.Element>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            MockBehavior.Loose,
        );
        reportExportDialogFactory = Mock.ofInstance(props => null);
        saveAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        loadAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        transferToAssessmentButtonFactoryMock = Mock.ofInstance(props => null);
        getStartOverComponentMock = Mock.ofInstance(props => null);
        tabStoreData = {
            id: 5,
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        startOverComponent = null;
        isCommandBarCollapsed = false;
        showReportExportButton = true;

        assessmentStoreData = {} as AssessmentStoreData;
        assessmentStoreData.persistedTabInfo = {
            id: 5,
            title: thePageTitle,
            isClosed: false,
            detailsViewId: undefined,
        } as PersistedTabInfo;
    });

    function getProps(): DetailsViewCommandBarProps {
        const CommandBarStub: ReactFCWithDisplayName<DetailsViewCommandBarProps> =
            NamedFC<DetailsViewCommandBarProps>('test', _ => null);
        const LeftNavStub: ReactFCWithDisplayName<LeftNavProps> = NamedFC<LeftNavProps>(
            'test',
            _ => null,
        );
        const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
            CommandBar: CommandBarStub,
            ReportExportDialogFactory: reportExportDialogFactory.object,
            SaveAssessmentButton: saveAssessmentButtonFactoryMock.object,
            LoadAssessmentButton: loadAssessmentButtonFactoryMock.object,
            TransferToAssessmentButton: transferToAssessmentButtonFactoryMock.object,
            shouldShowReportExportButton: p => showReportExportButton,
            StartOverComponentFactory: {
                getStartOverComponent: getStartOverComponentMock.object,
            } as StartOverComponentFactory,
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
            assessmentStoreData,
            tabStoreData,
            switcherNavConfiguration: switcherNavConfiguration,
            scanMetadata: scanMetadata,
            narrowModeStatus: {
                isCommandBarCollapsed,
            },
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
        tabStoreData.isClosed = true;

        expect(render()).toBeNull();
    });

    test('renders with buttons collapsed into a menu', () => {
        isCommandBarCollapsed = true;
        const props = getProps();
        setupTransferToAssessmentButtonFactory(props);
        setupSaveAssessmentButtonFactory(props);
        setupLoadAssessmentButtonFactory(props);

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with report export dialog open', () => {
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isReportExportDialogOpen: true });

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with load assessment dialog hidden', () => {
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isLoadAssessmentDialogOpen: false });
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with load assessment dialog open', () => {
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isLoadAssessmentDialogOpen: true });

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with invalid load assessment dialog hidden', () => {
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isInvalidLoadAssessmentDialogOpen: false });
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with invalid load assessment dialog open', () => {
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isInvalidLoadAssessmentDialogOpen: true });

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with start test over dialog open', () => {
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ startOverDialogState: 'test' });

        expect(rendered.debug()).toMatchSnapshot();
    });

    test('renders with start assessment over dialog open', () => {
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ startOverDialogState: 'assessment' });

        expect(rendered.debug()).toMatchSnapshot();
    });

    describe('Button focus', () => {
        let focusRef: IButton;
        let focusFunctionMock: IMock<() => void>;

        beforeEach(() => {
            focusFunctionMock = Mock.ofInstance(() => null);
            focusRef = {
                focus: focusFunctionMock.object,
            } as IButton;
        });

        test('set export button ref', () => {
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBeUndefined();

            const exportButton = wrapper.find('ReportExportButton');
            const setRef = exportButton.prop('buttonRef') as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBe(focusRef);
        });

        test('set start over button ref', () => {
            const props = getProps();

            let startOverFactoryProps: StartOverFactoryProps;
            getStartOverComponentMock
                .setup(g => g(It.isAny()))
                .callback(startOverProps => (startOverFactoryProps = startOverProps));

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.startOverDialogCloseFocus).toBeUndefined();

            expect(startOverFactoryProps).toBeDefined();
            const setRef = startOverFactoryProps.buttonRef as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.startOverDialogCloseFocus).toBe(focusRef);
        });

        test('set ... menu button ref', () => {
            isCommandBarCollapsed = true;
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBeUndefined();
            expect(instance.startOverDialogCloseFocus).toBeUndefined();

            const commandBarButtonsMenu = wrapper.find('CommandBarButtonsMenu');
            const setRef = commandBarButtonsMenu.prop('buttonRef') as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBe(focusRef);
            expect(instance.startOverDialogCloseFocus).toBe(focusRef);
        });

        test('focus export report button', () => {
            const props = getProps();

            let reportExportDialogFactoryProps: ReportExportDialogFactoryProps;
            reportExportDialogFactory
                .setup(r => r(It.isAny()))
                .callback(p => (reportExportDialogFactoryProps = p));

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);
            wrapper.setState({ isReportExportDialogOpen: true });

            const instance = wrapper.instance() as DetailsViewCommandBar;
            instance.exportDialogCloseFocus = focusRef;

            focusFunctionMock.setup(f => f()).verifiable(Times.once());

            reportExportDialogFactoryProps.afterDialogDismissed();

            focusFunctionMock.verifyAll();
        });

        test('focus start over button', () => {
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);
            wrapper.setState({ startOverDialogState: 'test' });

            const instance = wrapper.instance() as DetailsViewCommandBar;
            instance.startOverDialogCloseFocus = focusRef;

            focusFunctionMock.setup(f => f()).verifiable(Times.once());

            wrapper.setState({ startOverDialogState: 'none' });
            wrapper.update();

            focusFunctionMock.verifyAll();
        });
    });

    function testOnPivot(renderExportResults: boolean, renderStartOver: boolean): void {
        showReportExportButton = renderExportResults;

        if (renderStartOver) {
            startOverComponent = <ActionButton>Start Over Component</ActionButton>;
        }

        const props = getProps();

        setupSaveAssessmentButtonFactory(props);
        setupTransferToAssessmentButtonFactory(props);
        setupStartOverButtonFactory(props);
        setupReportExportDialogFactory({ isOpen: false });

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

    function setupSaveAssessmentButtonFactory(
        expectedProps?: Partial<SaveAssessmentButtonFactoryProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        saveAssessmentButtonFactoryMock.setup(r => r(argMatcher)).returns(() => saveAssessmentStub);
    }

    function setupLoadAssessmentButtonFactory(
        expectedProps?: Partial<LoadAssessmentButtonFactory>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        loadAssessmentButtonFactoryMock.setup(r => r(argMatcher)).returns(() => loadAssessmentStub);
    }

    function setupTransferToAssessmentButtonFactory(
        expectedProps?: Partial<TransferToAssessmentButtonProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        transferToAssessmentButtonFactoryMock
            .setup(r => r(argMatcher))
            .returns(() => transferToAssessmentStub);
    }

    function setupStartOverButtonFactory(props: CommandBarProps): void {
        const expectedProps = props as Partial<StartOverFactoryProps>;
        getStartOverComponentMock
            .setup(g => g(It.isObjectWith(expectedProps)))
            .returns(() => startOverComponent);
    }
});
