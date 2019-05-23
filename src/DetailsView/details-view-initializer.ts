// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { loadTheme } from 'office-ui-fabric-react';
import * as ReactDOM from 'react-dom';
import { AssessmentDefaultMessageGenerator } from '../assessments/assessment-default-message-generator';
import { Assessments } from '../assessments/assessments';
import { assessmentsProviderWithFeaturesEnabled } from '../assessments/assessments-feature-flag-filter';
import { ChromeAdapter } from '../background/browser-adapters/chrome-adapter';
import { IssueDetailsTextGenerator } from '../background/issue-details-text-generator';
import { A11YSelfValidator } from '../common/a11y-self-validator';
import { AxeInfo } from '../common/axe-info';
import { provideBlob } from '../common/blob-provider';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DateProvider } from '../common/date-provider';
import { DocumentManipulator } from '../common/document-manipulator';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { EnvironmentInfoProvider } from '../common/environment-info-provider';
import { initializeFabricIcons } from '../common/fabric-icons';
import { getAllFeatureFlagDetails } from '../common/feature-flags';
import { FileURLProvider } from '../common/file-url-provider';
import { GetGuidanceTagsFromGuidanceLinks } from '../common/get-guidance-tags-from-guidance-links';
import { getInnerTextFromJsxElement } from '../common/get-inner-text-from-jsx-element';
import { HTMLElementUtils } from '../common/html-element-utils';
import { Tab } from '../common/itab';
import { ActionMessageDispatcher } from '../common/message-creators/action-message-dispatcher';
import { ContentActionMessageCreator } from '../common/message-creators/content-action-message-creator';
import { DropdownActionMessageCreator } from '../common/message-creators/dropdown-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { IssueFilingActionMessageCreator } from '../common/message-creators/issue-filing-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../common/message-creators/store-action-message-creator-factory';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { VisualizationActionMessageCreator } from '../common/message-creators/visualization-action-message-creator';
import { NavigatorUtils } from '../common/navigator-utils';
import { AutoChecker } from '../common/self-validator';
import { StoreProxy } from '../common/store-proxy';
import { BaseClientStoresHub } from '../common/stores/base-client-stores-hub';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { TelemetryEventSource } from '../common/telemetry-events';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewData } from '../common/types/store-data/details-view-data';
import { InspectStoreData } from '../common/types/store-data/inspect-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { UrlParser } from '../common/url-parser';
import { WindowUtils } from '../common/window-utils';
import { contentPages } from '../content';
import { FixInstructionProcessor } from '../injected/fix-instruction-processor';
import { ScannerUtils } from '../injected/scanner-utils';
import { getVersion, scan } from '../scanner/exposed-apis';
import { DictionaryStringTo } from '../types/common-types';
import { NullUrlDecorator } from '../views/content/url-decorator/null-url-decorator';
import { IssueFilingServiceProviderImpl } from './../issue-filing/issue-filing-service-provider-impl';
import { DetailsViewActionMessageCreator } from './actions/details-view-action-message-creator';
import { IssuesSelectionFactory } from './actions/issues-selection-factory';
import { AssessmentTableColumnConfigHandler } from './components/assessment-table-column-config-handler';
import { GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { IssuesTableHandler } from './components/issues-table-handler';
import { getStatusForTest } from './components/left-nav/get-status-for-test';
import { LeftNavLinkBuilder } from './components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from './components/left-nav/nav-link-handler';
import { SettingsProviderImpl } from './components/settings-panel/settings/settings-provider-impl';
import { DetailsViewContainerDeps, DetailsViewContainerState } from './details-view-container';
import { DetailsViewRenderer } from './details-view-renderer';
import { DocumentTitleUpdater } from './document-title-updater';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { MasterCheckBoxConfigProvider } from './handlers/master-checkbox-config-provider';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';
import { AssessmentReportHtmlGenerator } from './reports/assessment-report-html-generator';
import { AssessmentReportModelBuilderFactory } from './reports/assessment-report-model-builder-factory';
import { AutomatedChecksReportSectionFactory } from './reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from './reports/components/report-sections/collapsible-script-provider';
import {
    outcomeStatsFromManualTestStatus,
    outcomeTypeFromTestStatus,
    outcomeTypeSemanticsFromTestStatus,
} from './reports/components/requirement-outcome-type';
import {
    getAssessmentSummaryModelFromProviderAndStatusData,
    getAssessmentSummaryModelFromProviderAndStoreData,
} from './reports/get-assessment-summary-model';
import { ReactStaticRenderer } from './reports/react-static-renderer';
import { ReportGenerator } from './reports/report-generator';
import { ReportHtmlGenerator } from './reports/report-html-generator';
import { ReportNameGenerator } from './reports/report-name-generator';

declare const window: AutoChecker & Window;

const chromeAdapter = new ChromeAdapter();
const urlParser = new UrlParser();
const tabId = urlParser.getIntParam(window.location.href, 'tabId');
const dom = document;
const documentElementSetter = new DocumentManipulator(dom);

initializeFabricIcons();

if (isNaN(tabId) === false) {
    chromeAdapter.getTab(
        tabId,
        (tab: Tab): void => {
            const telemetryFactory = new TelemetryDataFactory();

            const visualizationStore = new StoreProxy<VisualizationStoreData>(StoreNames[StoreNames.VisualizationStore], chromeAdapter);
            const tabStore = new StoreProxy<TabStoreData>(StoreNames[StoreNames.TabStore], chromeAdapter);
            const visualizationScanResultStore = new StoreProxy<VisualizationScanResultData>(
                StoreNames[StoreNames.VisualizationScanResultStore],
                chromeAdapter,
            );
            const detailsViewStore = new StoreProxy<DetailsViewData>(StoreNames[StoreNames.DetailsViewStore], chromeAdapter);
            const assessmentStore = new StoreProxy<AssessmentStoreData>(StoreNames[StoreNames.AssessmentStore], chromeAdapter);
            const featureFlagStore = new StoreProxy<DictionaryStringTo<boolean>>(StoreNames[StoreNames.FeatureFlagStore], chromeAdapter);
            const scopingStore = new StoreProxy<ScopingStoreData>(StoreNames[StoreNames.ScopingPanelStateStore], chromeAdapter);
            const inspectStore = new StoreProxy<InspectStoreData>(StoreNames[StoreNames.InspectStore], chromeAdapter);
            const userConfigStore = new StoreProxy<UserConfigurationStoreData>(
                StoreNames[StoreNames.UserConfigurationStore],
                chromeAdapter,
            );
            const storesHub = new BaseClientStoresHub<DetailsViewContainerState>([
                detailsViewStore,
                featureFlagStore,
                tabStore,
                visualizationScanResultStore,
                visualizationStore,
                assessmentStore,
                scopingStore,
                userConfigStore,
            ]);

            const actionMessageDispatcher = new ActionMessageDispatcher(chromeAdapter.sendMessageToFrames, tab.id);

            const actionMessageCreator = new DetailsViewActionMessageCreator(telemetryFactory, actionMessageDispatcher);
            const scopingActionMessageCreator = new ScopingActionMessageCreator(
                telemetryFactory,
                TelemetryEventSource.DetailsView,
                actionMessageDispatcher,
            );
            const inspectActionMessageCreator = new InspectActionMessageCreator(
                telemetryFactory,
                TelemetryEventSource.DetailsView,
                actionMessageDispatcher,
            );
            const dropdownActionMessageCreator = new DropdownActionMessageCreator(telemetryFactory, actionMessageDispatcher);

            const issueFilingActionMessageCreator = new IssueFilingActionMessageCreator(
                actionMessageDispatcher,
                telemetryFactory,
                TelemetryEventSource.DetailsView,
            );

            const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(actionMessageDispatcher);

            const contentActionMessageCreator = new ContentActionMessageCreator(
                telemetryFactory,
                TelemetryEventSource.DetailsView,
                actionMessageDispatcher,
            );

            const userConfigMessageCreator = new UserConfigMessageCreator(actionMessageDispatcher);
            const storeActionMessageCreator = storeActionMessageCreatorFactory.forDetailsView();

            const visualizationActionCreator = new VisualizationActionMessageCreator(actionMessageDispatcher);

            const issuesSelection = new IssuesSelectionFactory().createSelection(actionMessageCreator);
            const clickHandlerFactory = new DetailsViewToggleClickHandlerFactory(visualizationActionCreator, telemetryFactory);
            const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
            const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();
            const assessmentInstanceTableHandler = new AssessmentInstanceTableHandler(
                actionMessageCreator,
                new AssessmentTableColumnConfigHandler(new MasterCheckBoxConfigProvider(actionMessageCreator), Assessments),
                Assessments,
            );
            const issuesTableHandler = new IssuesTableHandler();
            const previewFeatureFlagsHandler = new PreviewFeatureFlagsHandler(getAllFeatureFlagDetails());
            const scopingFlagsHandler = new PreviewFeatureFlagsHandler(getAllFeatureFlagDetails());
            const dropdownClickHandler = new DropdownClickHandler(dropdownActionMessageCreator, TelemetryEventSource.DetailsView);

            const extensionVersion = chromeAdapter.getManifest().version;
            const axeVersion = getVersion();
            const browserSpec = new NavigatorUtils(window.navigator).getBrowserSpec();

            const environmentInfoProvider = new EnvironmentInfoProvider(
                chromeAdapter.extensionVersion,
                browserSpec,
                AxeInfo.Default.version,
            );

            const reactStaticRenderer = new ReactStaticRenderer();
            const reportNameGenerator = new ReportNameGenerator();

            const fixInstructionProcessor = new FixInstructionProcessor();

            const reportHtmlGenerator = new ReportHtmlGenerator(
                AutomatedChecksReportSectionFactory,
                reactStaticRenderer,
                environmentInfoProvider.getEnvironmentInfo(),
                getDefaultAddListenerForCollapsibleSection,
                DateProvider.getUTCStringFromDate,
                GetGuidanceTagsFromGuidanceLinks,
                fixInstructionProcessor,
            );

            const assessmentReportHtmlGeneratorDeps = {
                outcomeTypeSemanticsFromTestStatus,
                getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
            };
            const assessmentReportHtmlGenerator = new AssessmentReportHtmlGenerator(
                assessmentReportHtmlGeneratorDeps,
                reactStaticRenderer,
                new AssessmentReportModelBuilderFactory(),
                DateProvider.getCurrentDate,
                extensionVersion,
                axeVersion,
                new NavigatorUtils(window.navigator).getBrowserSpec(),
                assessmentDefaultMessageGenerator,
            );

            visualizationStore.setTabId(tab.id);
            tabStore.setTabId(tab.id);
            visualizationScanResultStore.setTabId(tab.id);
            detailsViewStore.setTabId(tab.id);
            assessmentStore.setTabId(tab.id);
            scopingStore.setTabId(tab.id);
            inspectStore.setTabId(tab.id);

            const actionInitiators = {
                ...contentActionMessageCreator.initiators,
            };

            const documentTitleUpdater = new DocumentTitleUpdater(
                tabStore,
                detailsViewStore,
                visualizationStore,
                assessmentStore,
                GetDetailsRightPanelConfiguration,
                GetDetailsSwitcherNavConfiguration,
                visualizationConfigurationFactory,
                dom,
            );
            documentTitleUpdater.initialize();

            const issueDetailsTextGenerator = new IssueDetailsTextGenerator(
                chromeAdapter.extensionVersion,
                browserSpec,
                AxeInfo.Default.version,
            );

            const windowUtils = new WindowUtils();

            const fileURLProvider = new FileURLProvider(windowUtils, provideBlob);

            const reportGenerator = new ReportGenerator(reportNameGenerator, reportHtmlGenerator, assessmentReportHtmlGenerator);

            const deps: DetailsViewContainerDeps = {
                fixInstructionProcessor,
                dropdownClickHandler,
                issueFilingActionMessageCreator,
                contentProvider: contentPages,
                contentActionMessageCreator,
                detailsViewActionMessageCreator: actionMessageCreator,
                assessmentsProvider: Assessments,
                actionInitiators,
                assessmentDefaultMessageGenerator: assessmentDefaultMessageGenerator,
                issueDetailsTextGenerator,
                windowUtils,
                fileURLProvider,
                getAssessmentSummaryModelFromProviderAndStoreData: getAssessmentSummaryModelFromProviderAndStoreData,
                getAssessmentSummaryModelFromProviderAndStatusData: getAssessmentSummaryModelFromProviderAndStatusData,
                visualizationConfigurationFactory,
                getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration,
                navLinkHandler: new NavLinkHandler(actionMessageCreator),
                getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration,
                userConfigMessageCreator,
                leftNavLinkBuilder: new LeftNavLinkBuilder(),
                getStatusForTest,
                outcomeTypeFromTestStatus,
                outcomeStatsFromManualTestStatus,
                assessmentsProviderWithFeaturesEnabled,
                outcomeTypeSemanticsFromTestStatus,
                getInnerTextFromJsxElement,
                storeActionMessageCreator,
                storesHub,
                loadTheme,
                urlParser,
                getDateFromTimestamp: DateProvider.getDateFromTimestamp,
                getCurrentDate: DateProvider.getCurrentDate,
                settingsProvider: SettingsProviderImpl,
                environmentInfoProvider,
                issueFilingServiceProvider: IssueFilingServiceProviderImpl,
                getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
                reportGenerator,
                contentUrlDecorator: NullUrlDecorator,
            };

            const renderer = new DetailsViewRenderer(
                deps,
                dom,
                ReactDOM.render,
                scopingActionMessageCreator,
                inspectActionMessageCreator,
                issuesSelection,
                clickHandlerFactory,
                visualizationConfigurationFactory,
                issuesTableHandler,
                assessmentInstanceTableHandler,
                previewFeatureFlagsHandler,
                scopingFlagsHandler,
                dropdownClickHandler,
                Assessments,
                documentElementSetter,
            );
            renderer.render();

            const a11ySelfValidator = new A11YSelfValidator(new ScannerUtils(scan), new HTMLElementUtils());
            window.A11YSelfValidator = a11ySelfValidator;
        },
        () => {
            const renderer = createNullifiedRenderer(document, ReactDOM.render);
            renderer.render();
        },
    );
}

function createNullifiedRenderer(doc, render): DetailsViewRenderer {
    return new DetailsViewRenderer(
        null,
        doc,
        render,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        documentElementSetter,
    );
}
