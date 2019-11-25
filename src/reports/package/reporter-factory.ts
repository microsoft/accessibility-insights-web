// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { generateUID } from 'common/uid-generator';
import { convertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { AutomatedChecksReportSectionFactory } from 'reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { AxeResultReport, AxeResultReportDeps } from 'reports/package/axe-results-report';
import { Reporter } from 'reports/package/reporter';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { CheckMessageTransformer } from 'scanner/check-message-transformer';
import { configuration } from 'scanner/custom-rule-configurations';
import { DocumentUtils } from 'scanner/document-utils';
import { HelpUrlGetter } from 'scanner/help-url-getter';
import { MessageDecorator } from 'scanner/message-decorator';
import { ResultDecorator } from 'scanner/result-decorator';
import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { DateProvider } from '../../common/date-provider';
import { EnvironmentInfoProvider } from '../../common/environment-info-provider';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { GetGuidanceTagsFromGuidanceLinks } from '../../common/get-guidance-tags-from-guidance-links';
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

const axeResultsReportGenerator = (results: axe.AxeResults, options: AccessibilityInsightsReport.ReportOptions) => {
    const { browserVersion, browserSpec, pageTitle: targetPageTitle } = options;
    const axeVersion = results.testEngine.version;

    initializeFabricIcons();

    const environmentInfoProvider = new EnvironmentInfoProvider(browserVersion, browserSpec, axeVersion);
    const reactStaticRenderer = new ReactStaticRenderer();
    const fixInstructionProcessor = new FixInstructionProcessor();

    const reportHtmlGenerator = new ReportHtmlGenerator(
        AutomatedChecksReportSectionFactory,
        reactStaticRenderer,
        environmentInfoProvider.getEnvironmentInfo(),
        getDefaultAddListenerForCollapsibleSection,
        DateProvider.getUTCStringFromDate,
        GetGuidanceTagsFromGuidanceLinks,
        fixInstructionProcessor,
        getPropertyConfiguration,
    );

    const titleProvider = {
        title: () => targetPageTitle,
    } as DocumentUtils;
    const messageDecorator = new MessageDecorator(configuration, new CheckMessageTransformer());
    const helpUrlGetter = new HelpUrlGetter(configuration);
    const resultDecorator = new ResultDecorator(titleProvider, messageDecorator, (ruleId, axeHelpUrl) =>
        helpUrlGetter.getHelpUrl(ruleId, axeHelpUrl),
    );

    const deps: AxeResultReportDeps = {
        reportHtmlGenerator,
        resultDecorator,
        getRules: convertScanResultsToUnifiedRules,
        getResults: convertScanResultsToUnifiedResults,
        getCards: getCardViewData,
        getUUID: generateUID,
    };

    return new AxeResultReport(results, options, deps);
};

export const reporterFactory: AccessibilityInsightsReport.ReporterFactory = () => new Reporter(axeResultsReportGenerator);
