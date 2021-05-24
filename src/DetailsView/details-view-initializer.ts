// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import Ajv from 'ajv';
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { Assessments } from 'assessments/assessments';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { createToolData } from 'common/application-properties-provider';
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { ExpandCollapseVisualHelperModifierButtons } from 'common/components/cards/cards-visualization-modifier-buttons';
import { ThemeInnerState } from 'common/components/theme';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { FileNameBuilder } from 'common/filename-builder';
import { getCardSelectionViewData } from 'common/get-card-selection-view-data';
import { Globalization } from 'common/globalization';
import { isResultHighlightUnavailableWeb } from 'common/is-result-highlight-unavailable';
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { toolName } from 'content/strings/application';
import { textContent } from 'content/strings/text-content';
import { AssessmentViewUpdateHandler } from 'DetailsView/components/assessment-view-update-handler';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import { NoContentAvailableViewDeps } from 'DetailsView/components/no-content-available/no-content-available-view';
import { AllUrlsPermissionHandler } from 'DetailsView/handlers/allurls-permission-handler';
import { NoContentAvailableViewRenderer } from 'DetailsView/no-content-available-view-renderer';
import { NullStoreActionMessageCreator } from 'electron/adapters/null-store-action-message-creator';
import { getNarrowModeThresholdsForWeb } from 'electron/common/narrow-mode-thresholds';
import { loadTheme, setFocusVisibility } from 'office-ui-fabric-react';
import * as ReactDOM from 'react-dom';
import { ReportExportServiceProviderImpl } from 'report-export/report-export-service-provider-impl';
import { AssessmentReportHtmlGenerator } from 'reports/assessment-report-html-generator';
import { AssessmentReportModelBuilderFactory } from 'reports/assessment-report-model-builder-factory';
import { AutomatedChecksReportSectionFactory } from 'reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import {
    outcomeStatsFromManualTestStatus,
    outcomeTypeFromTestStatus,
    outcomeTypeSemanticsFromTestStatus,
} from 'reports/components/requirement-outcome-type';
import {
    getAssessmentSummaryModelFromProviderAndStatusData,
    getAssessmentSummaryModelFromProviderAndStoreData,
} from 'reports/get-assessment-summary-model';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportGenerator } from 'reports/report-generator';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { WebReportNameGenerator } from 'reports/report-name-generator';
import * as UAParser from 'ua-parser-js';
import { A11YSelfValidator } from '../common/a11y-self-validator';
import { AutoChecker } from '../common/auto-checker';
import { AxeInfo } from '../common/axe-info';
import { provideBlob } from '../common/blob-provider';
import { allCardInteractionsSupported } from '../common/components/cards/card-interaction-support';
import { CardsCollapsibleControl } from '../common/components/cards/collapsible-component-cards';
import { FixInstructionProcessor } from '../common/components/fix-instruction-processor';
import { NewTabLink } from '../common/components/new-tab-link';
import { getPropertyConfiguration } from '../common/configs/unified-result-property-configurations';
import { DateProvider } from '../common/date-provider';
import { DocumentManipulator } from '../common/document-manipulator';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { TelemetryEventSource } from '../common/extension-telemetry-events';
import { initializeFabricIcons } from '../common/fabric-icons';
import { getAllFeatureFlagDetails } from '../common/feature-flags';
import { FileURLProvider } from '../common/file-url-provider';
import { GetGuidanceTagsFromGuidanceLinks } from '../common/get-guidance-tags-from-guidance-links';
import { getInnerTextFromJsxElement } from '../common/get-inner-text-from-jsx-element';
import { HTMLElementUtils } from '../common/html-element-utils';
import { Tab } from '../common/itab';
import { ContentActionMessageCreator } from '../common/message-creators/content-action-message-creator';
import { DropdownActionMessageCreator } from '../common/message-creators/dropdown-action-message-creator';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { IssueFilingActionMessageCreator } from '../common/message-creators/issue-filing-action-message-creator';
import { RemoteActionMessageDispatcher } from '../common/message-creators/remote-action-message-dispatcher';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../common/message-creators/store-action-message-creator-factory';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { VisualizationActionMessageCreator } from '../common/message-creators/visualization-action-message-creator';
import { NavigatorUtils } from '../common/navigator-utils';
import { getCardViewData } from '../common/rule-based-view-model-provider';
import { StoreProxy } from '../common/store-proxy';
import { BaseClientStoresHub } from '../common/stores/base-client-stores-hub';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from '../common/types/store-data/details-view-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { PermissionsStateStoreData } from '../common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from '../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { UrlParser } from '../common/url-parser';
import { WindowUtils } from '../common/window-utils';
import { contentPages } from '../content';
import { ScannerUtils } from '../injected/scanner-utils';
import { createIssueDetailsBuilder } from '../issue-filing/common/create-issue-details-builder';
import { IssueFilingUrlStringUtils } from '../issue-filing/common/issue-filing-url-string-utils';
import { PlainTextFormatter } from '../issue-filing/common/markup/plain-text-formatter';
import { AxeResultToIssueFilingDataConverter } from '../issue-filing/rule-result-to-issue-filing-data';
import { getVersion, scan } from '../scanner/exposed-apis';
import { DictionaryStringTo } from '../types/common-types';
import { IssueFilingServiceProviderImpl } from './../issue-filing/issue-filing-service-provider-impl';
import { UnifiedResultToIssueFilingDataConverter } from './../issue-filing/unified-result-to-issue-filing-data';
import { DetailsViewActionMessageCreator } from './actions/details-view-action-message-creator';
import { AssessmentTableColumnConfigHandler } from './components/assessment-table-column-config-handler';
import { ExtensionSettingsProvider } from './components/details-view-overlay/settings-panel/settings/extension-settings-provider';
import { GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { IssuesTableHandler } from './components/issues-table-handler';
import { getStatusForTest } from './components/left-nav/get-status-for-test';
import { LeftNavLinkBuilder } from './components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from './components/left-nav/nav-link-handler';
import { DetailsViewContainerDeps, DetailsViewContainerState } from './details-view-container';
import { DetailsViewRenderer } from './details-view-renderer';
import { DocumentTitleUpdater } from './document-title-updater';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { MasterCheckBoxConfigProvider } from './handlers/master-checkbox-config-provider';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';

declare const window: AutoChecker & Window;

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const urlParser = new UrlParser();
const tabId: number | null = urlParser.getIntParam(window.location.href, 'tabId');
const dom = document;
const documentElementSetter = new DocumentManipulator(dom);

initializeFabricIcons();

if (tabId != null) {
    browserAdapter.getTab(
        tabId,
        (tab: Tab): void => {
            const telemetryFactory = new TelemetryDataFactory();

            const visualizationStore = new StoreProxy<VisualizationStoreData>(
                StoreNames[StoreNames.VisualizationStore],
                browserAdapter,
                tab.id,
            );
            const permissionsStateStore = new StoreProxy<PermissionsStateStoreData>(
                StoreNames[StoreNames.PermissionsStateStore],
                browserAdapter,
                tab.id,
            );
            const tabStore = new StoreProxy<TabStoreData>(
                StoreNames[StoreNames.TabStore],
                browserAdapter,
                tab.id,
            );
            const visualizationScanResultStore = new StoreProxy<VisualizationScanResultData>(
                StoreNames[StoreNames.VisualizationScanResultStore],
                browserAdapter,
                tab.id,
            );
            const unifiedScanResultStore = new StoreProxy<UnifiedScanResultStoreData>(
                StoreNames[StoreNames.UnifiedScanResultStore],
                browserAdapter,
                tab.id,
            );
            const pathSnippetStore = new StoreProxy<PathSnippetStoreData>(
                StoreNames[StoreNames.PathSnippetStore],
                browserAdapter,
                tab.id,
            );
            const detailsViewStore = new StoreProxy<DetailsViewStoreData>(
                StoreNames[StoreNames.DetailsViewStore],
                browserAdapter,
                tab.id,
            );
            const assessmentStore = new StoreProxy<AssessmentStoreData>(
                StoreNames[StoreNames.AssessmentStore],
                browserAdapter,
                tab.id,
            );
            const featureFlagStore = new StoreProxy<DictionaryStringTo<boolean>>(
                StoreNames[StoreNames.FeatureFlagStore],
                browserAdapter,
                tab.id,
            );
            const scopingStore = new StoreProxy<ScopingStoreData>(
                StoreNames[StoreNames.ScopingPanelStateStore],
                browserAdapter,
                tab.id,
            );
            const userConfigStore = new StoreProxy<UserConfigurationStoreData>(
                StoreNames[StoreNames.UserConfigurationStore],
                browserAdapter,
                tab.id,
            );
            const cardSelectionStore = new StoreProxy<CardSelectionStoreData>(
                StoreNames[StoreNames.CardSelectionStore],
                browserAdapter,
                tab.id,
            );

            const storesHub = new BaseClientStoresHub<DetailsViewContainerState>([
                detailsViewStore,
                featureFlagStore,
                permissionsStateStore,
                tabStore,
                visualizationScanResultStore,
                unifiedScanResultStore,
                visualizationStore,
                assessmentStore,
                pathSnippetStore,
                scopingStore,
                userConfigStore,
                cardSelectionStore,
            ]);

            const logger = createDefaultLogger();
            const actionMessageDispatcher = new RemoteActionMessageDispatcher(
                browserAdapter.sendMessageToFrames,
                tab.id,
                logger,
            );

            const detailsViewActionMessageCreator = new DetailsViewActionMessageCreator(
                telemetryFactory,
                actionMessageDispatcher,
            );
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
            const dropdownActionMessageCreator = new DropdownActionMessageCreator(
                telemetryFactory,
                actionMessageDispatcher,
            );

            const issueFilingActionMessageCreator = new IssueFilingActionMessageCreator(
                actionMessageDispatcher,
                telemetryFactory,
                TelemetryEventSource.DetailsView,
            );

            const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(
                actionMessageDispatcher,
            );

            const contentActionMessageCreator = new ContentActionMessageCreator(
                telemetryFactory,
                TelemetryEventSource.DetailsView,
                actionMessageDispatcher,
            );

            const userConfigMessageCreator = new UserConfigMessageCreator(actionMessageDispatcher);
            const storeActionMessageCreator = storeActionMessageCreatorFactory.fromStores(
                storesHub.stores,
            );

            const visualizationActionCreator = new VisualizationActionMessageCreator(
                actionMessageDispatcher,
            );

            const clickHandlerFactory = new DetailsViewToggleClickHandlerFactory(
                visualizationActionCreator,
                telemetryFactory,
            );
            const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();
            const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();
            const assessmentInstanceTableHandler = new AssessmentInstanceTableHandler(
                detailsViewActionMessageCreator,
                new AssessmentTableColumnConfigHandler(
                    new MasterCheckBoxConfigProvider(detailsViewActionMessageCreator),
                    Assessments,
                ),
                Assessments,
            );
            const issuesTableHandler = new IssuesTableHandler();
            const previewFeatureFlagsHandler = new PreviewFeatureFlagsHandler(
                getAllFeatureFlagDetails(),
            );
            const scopingFlagsHandler = new PreviewFeatureFlagsHandler(getAllFeatureFlagDetails());
            const dropdownClickHandler = new DropdownClickHandler(
                dropdownActionMessageCreator,
                TelemetryEventSource.DetailsView,
            );

            const navigatorUtils = new NavigatorUtils(window.navigator, logger);
            const extensionVersion = browserAdapter.getManifest().version;
            const axeVersion = getVersion();
            const browserSpec = navigatorUtils.getBrowserSpec();

            const toolData = createToolData(
                'axe-core',
                AxeInfo.Default.version,
                toolName,
                browserAdapter.getVersion(),
                browserSpec,
            );

            const reactStaticRenderer = new ReactStaticRenderer();
            const reportNameGenerator = new WebReportNameGenerator();

            const fixInstructionProcessor = new FixInstructionProcessor();

            const reportHtmlGenerator = new ReportHtmlGenerator(
                AutomatedChecksReportSectionFactory,
                reactStaticRenderer,
                getDefaultAddListenerForCollapsibleSection,
                DateProvider.getUTCStringFromDate,
                GetGuidanceTagsFromGuidanceLinks,
                fixInstructionProcessor,
                getPropertyConfiguration,
            );

            // Represents the language in which pages are to be displayed
            // For the time being, content is only in English
            const globalization: Globalization = {
                languageCode: 'en-us',
            };

            const assessmentReportHtmlGeneratorDeps = {
                outcomeTypeSemanticsFromTestStatus,
                getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
                LinkComponent: NewTabLink,
                globalization,
            };

            const assessmentReportHtmlGenerator = new AssessmentReportHtmlGenerator(
                assessmentReportHtmlGeneratorDeps,
                reactStaticRenderer,
                new AssessmentReportModelBuilderFactory(),
                DateProvider.getCurrentDate,
                extensionVersion,
                axeVersion,
                browserSpec,
                assessmentDefaultMessageGenerator,
            );

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
                IssueFilingUrlStringUtils,
                createIssueDetailsBuilder(PlainTextFormatter),
            );

            const cardSelectionMessageCreator = new CardSelectionMessageCreator(
                actionMessageDispatcher,
                telemetryFactory,
                TelemetryEventSource.DetailsView,
            );
            const windowUtils = new WindowUtils();

            const fileURLProvider = new FileURLProvider(windowUtils, provideBlob);

            const reportGenerator = new ReportGenerator(
                reportNameGenerator,
                reportHtmlGenerator,
                assessmentReportHtmlGenerator,
            );

            const assessmentDataFormatter = new AssessmentDataFormatter();

            const assessmentDataParser = new AssessmentDataParser();

            const fileReader = new FileReader();

            const fileNameBuilder = new FileNameBuilder();

            const axeResultToIssueFilingDataConverter = new AxeResultToIssueFilingDataConverter(
                IssueFilingUrlStringUtils.getSelectorLastPart,
            );

            const unifiedResultToIssueFilingDataConverter =
                new UnifiedResultToIssueFilingDataConverter();

            const documentManipulator = new DocumentManipulator(document);

            const assessmentViewUpdateHandler = new AssessmentViewUpdateHandler();

            const navLinkRenderer = new NavLinkRenderer();

            const ajv = new Ajv();

            const loadAssessmentDataValidator = new LoadAssessmentDataValidator(
                ajv,
                Assessments,
                featureFlagStore.getState() as FeatureFlagStoreData,
            );

            const loadAssessmentHelper = new LoadAssessmentHelper(
                assessmentDataParser,
                detailsViewActionMessageCreator,
                fileReader,
                document,
                loadAssessmentDataValidator,
            );

            const deps: DetailsViewContainerDeps = {
                textContent,
                fixInstructionProcessor,
                axeResultToIssueFilingDataConverter,
                unifiedResultToIssueFilingDataConverter,
                dropdownClickHandler,
                issueFilingActionMessageCreator,
                contentProvider: contentPages,
                contentActionMessageCreator,
                detailsViewActionMessageCreator,
                assessmentsProvider: Assessments,
                actionInitiators,
                assessmentDefaultMessageGenerator: assessmentDefaultMessageGenerator,
                issueDetailsTextGenerator,
                windowUtils,
                fileURLProvider,
                assessmentDataFormatter,
                assessmentDataParser,
                fileNameBuilder,
                loadAssessmentHelper,
                getAssessmentSummaryModelFromProviderAndStoreData:
                    getAssessmentSummaryModelFromProviderAndStoreData,
                getAssessmentSummaryModelFromProviderAndStatusData:
                    getAssessmentSummaryModelFromProviderAndStatusData,
                visualizationConfigurationFactory,
                getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration,
                navLinkHandler: new NavLinkHandler(detailsViewActionMessageCreator),
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
                settingsProvider: ExtensionSettingsProvider,
                LinkComponent: NewTabLink,
                toolData,
                issueFilingServiceProvider: IssueFilingServiceProviderImpl,
                getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
                reportGenerator,
                reportExportServiceProvider: ReportExportServiceProviderImpl,
                getCardViewData: getCardViewData,
                getPropertyConfigById: getPropertyConfiguration,
                collapsibleControl: CardsCollapsibleControl,
                cardInteractionSupport: allCardInteractionsSupported,
                navigatorUtils: navigatorUtils,
                cardSelectionMessageCreator,
                getCardSelectionViewData: getCardSelectionViewData,
                cardsVisualizationModifierButtons: ExpandCollapseVisualHelperModifierButtons,
                allUrlsPermissionHandler: new AllUrlsPermissionHandler(
                    browserAdapter,
                    detailsViewActionMessageCreator,
                ),
                isResultHighlightUnavailable: isResultHighlightUnavailableWeb,
                setFocusVisibility,
                documentManipulator,
                customCongratsContinueInvestigatingMessage: null, // uses default message
                scopingActionMessageCreator,
                inspectActionMessageCreator,
                clickHandlerFactory,
                issuesTableHandler,
                assessmentInstanceTableHandler,
                previewFeatureFlagsHandler,
                scopingFlagsHandler,
                Assessments,
                assessmentViewUpdateHandler,
                navLinkRenderer,
                getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
            };

            const renderer = new DetailsViewRenderer(
                deps,
                dom,
                ReactDOM.render,
                documentElementSetter,
            );

            renderer.render();

            const a11ySelfValidator = new A11YSelfValidator(
                new ScannerUtils(scan, logger),
                new HTMLElementUtils(),
                logger,
            );
            window.A11YSelfValidator = a11ySelfValidator;
        },
        () => {
            const renderer = createNullifiedRenderer(
                document,
                ReactDOM.render,
                createDefaultLogger(),
            );
            renderer.render();
        },
    );
}

function createNullifiedRenderer(
    doc: Document,
    render: typeof ReactDOM.render,
    logger: Logger,
): NoContentAvailableViewRenderer {
    // using an instance of an actual store (instead of a StoreProxy) so we can get the default state.
    const store = new UserConfigurationStore(null, new UserConfigurationActions(), null, logger);
    const storesHub = new BaseClientStoresHub<ThemeInnerState>([store]);

    const deps: NoContentAvailableViewDeps = {
        textContent,
        storesHub,
        storeActionMessageCreator: new NullStoreActionMessageCreator(),
        getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
    };

    return new NoContentAvailableViewRenderer(deps, doc, render, documentElementSetter);
}
