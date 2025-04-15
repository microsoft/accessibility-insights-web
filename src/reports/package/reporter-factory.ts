// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from 'common/application-properties-provider';
import { GetNextHeadingLevel } from 'common/components/heading-element-for-level';
import { RecommendColor } from 'common/components/recommend-color';
import { getA11yInsightsWebRuleUrl } from 'common/configs/a11y-insights-rule-resources';
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { generateUID } from 'common/uid-generator';
import { extractRelatedSelectors } from 'injected/adapters/extract-related-selectors';
import { getCheckResolution, getFixResolution } from 'injected/adapters/resolution-creator';
import { ConvertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { AxeResultsReportSectionFactory } from 'reports/components/report-sections/axe-results-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { CombinedReportSectionFactory } from 'reports/components/report-sections/combined-report-section-factory';
import { getDefaultCopyToClipboardScript } from 'reports/components/report-sections/copy-to-clipboard-script-provider';
import { SummaryReportSectionFactory } from 'reports/components/report-sections/summary-report-section-factory';
import { AxeResultsReport, AxeResultsReportDeps } from 'reports/package/axe-results-report';
import { CombinedResultsReport, CombinedResultsReportDeps } from 'reports/package/combined-results-report';
import { CombinedResultsToCardsModelConverter } from 'reports/package/combined-results-to-cards-model-converter';
import { SummaryResultsReport } from 'reports/package/summary-results-report';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';
import { CheckMessageTransformer } from 'scanner/check-message-transformer';
import { configuration } from 'scanner/custom-rule-configurations';
import { DocumentUtils } from 'scanner/document-utils';
import { HelpUrlGetter } from 'scanner/help-url-getter';
import { mapAxeTagsToGuidanceLinks } from 'scanner/map-axe-tags-to-guidance-links';
import { MessageDecorator } from 'scanner/message-decorator';
import { ResultDecorator } from 'scanner/result-decorator';
import { RuleProcessor } from 'scanner/rule-processor';
import { FixInstructionProcessor } from '../../common/components/fix-instruction-processor';
import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { DateProvider } from '../../common/date-provider';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { GetGuidanceTagsFromGuidanceLinks } from '../../common/get-guidance-tags-from-guidance-links';
import { AxeReportParameters, CombinedReportParameters, ReporterFactory, SummaryReportParameters } from './accessibilityInsightsReport';
import { Reporter } from './reporter';

const axeResultsReportGenerator = (parameters: AxeReportParameters) => {
    const {
        results: {
            testEngine: {
                version: axeVersion,
            },
            testEnvironment: {
                userAgent,
                windowHeight,
                windowWidth,
            },
        },
        scanContext: {
            pageTitle: targetPageTitle,
        },
        serviceName,
    } = parameters;

    const reactStaticRenderer = new ReactStaticRenderer();
    const fixInstructionProcessor = new FixInstructionProcessor();
    const recommendColor = new RecommendColor();

    const toolData = createToolData(
        'axe-core',
        axeVersion,
        serviceName,
        null,
        userAgent,
        `${windowWidth}x${windowHeight}`
    );    

    const reportHtmlGenerator = new ReportHtmlGenerator(
        AxeResultsReportSectionFactory,
        reactStaticRenderer,
        getDefaultAddListenerForCollapsibleSection,
        DateProvider.getUTCStringFromDate,
        GetGuidanceTagsFromGuidanceLinks,
        fixInstructionProcessor,
        recommendColor,
        getPropertyConfiguration,
        GetNextHeadingLevel,
        getDefaultCopyToClipboardScript,
    );

    const titleProvider = {
        title: () => targetPageTitle,
    } as DocumentUtils;
    const messageDecorator = new MessageDecorator(configuration, new CheckMessageTransformer());
    const helpUrlGetter = new HelpUrlGetter(configuration, getA11yInsightsWebRuleUrl);
    const ruleProcessor = new RuleProcessor();
    const resultDecorator = new ResultDecorator(
        titleProvider,
        messageDecorator,
        (ruleId, axeHelpUrl) => helpUrlGetter.getHelpUrl(ruleId, axeHelpUrl),
        mapAxeTagsToGuidanceLinks,
        ruleProcessor,
    );
    const getUnifiedResults = new ConvertScanResultsToUnifiedResults(
        generateUID,
        getFixResolution,
        getCheckResolution,
        extractRelatedSelectors
    ).automatedChecksConversion;

    const deps: AxeResultsReportDeps = {
        reportHtmlGenerator,
        resultDecorator,
        getUnifiedRules: convertScanResultsToUnifiedRules,
        getUnifiedResults: getUnifiedResults,
        getCards: getCardViewData,
        getDateFromTimestamp: DateProvider.getDateFromTimestamp,
    };

    return new AxeResultsReport(deps, parameters, toolData);
};

const summaryResultsReportGenerator = (parameters: SummaryReportParameters) => {
    const { serviceName, axeVersion, userAgent, browserResolution } = parameters;

    const toolData = createToolData(
        'axe-core',
        axeVersion,
        serviceName,
        null,
        userAgent,
        browserResolution,
    );

    const reportHtmlGenerator = new SummaryReportHtmlGenerator(
        SummaryReportSectionFactory,
        new ReactStaticRenderer(),
        getDefaultAddListenerForCollapsibleSection,
        DateProvider.getUTCStringFromDate,
        DateProvider.getTimeStringFromSeconds,
    );

    const deps = {
        reportHtmlGenerator,
    }

    return new SummaryResultsReport(deps, parameters, toolData);
};

const combinedResultsReportGenerator = (parameters: CombinedReportParameters) => {
    const { serviceName, axeVersion, userAgent, browserResolution } = parameters;

    const toolData = createToolData(
        'axe-core',
        axeVersion,
        serviceName,
        null,
        userAgent,
        browserResolution,
    );

    const fixInstructionProcessor = new FixInstructionProcessor();
    const recommendColor = new RecommendColor();

    const reportHtmlGenerator = new CombinedReportHtmlGenerator(
        CombinedReportSectionFactory,
        new ReactStaticRenderer(),
        getDefaultAddListenerForCollapsibleSection,
        DateProvider.getUTCStringFromDate,
        DateProvider.getTimeStringFromSeconds,
        GetGuidanceTagsFromGuidanceLinks,
        fixInstructionProcessor,
        recommendColor,
        getPropertyConfiguration,
        getDefaultCopyToClipboardScript,
    );
    const deps: CombinedResultsReportDeps = {
        reportHtmlGenerator,
    }

    const cardSelectionViewData: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };

    const helpUrlGetter = new HelpUrlGetter(configuration, getA11yInsightsWebRuleUrl);
    const resultsToCardsConverter = new CombinedResultsToCardsModelConverter(
        mapAxeTagsToGuidanceLinks,
        cardSelectionViewData,
        generateUID,
        helpUrlGetter,
        getFixResolution,
        extractRelatedSelectors,
    );

    return new CombinedResultsReport(deps, parameters, toolData, resultsToCardsConverter);
}

initializeFabricIcons();

export const reporterFactory: ReporterFactory = () => {

    return new Reporter(
        axeResultsReportGenerator,
        summaryResultsReportGenerator,
        combinedResultsReportGenerator
    );
};
