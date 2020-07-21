// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from 'common/application-properties-provider';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { generateUID } from 'common/uid-generator';
import { getCheckResolution, getFixResolution } from 'injected/adapters/resolution-creator';
import { ConvertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { AutomatedChecksReportSectionFactory } from 'reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { AxeResultsReport, AxeResultsReportDeps } from 'reports/package/axe-results-report';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { CheckMessageTransformer } from 'scanner/check-message-transformer';
import { configuration } from 'scanner/custom-rule-configurations';
import { DocumentUtils } from 'scanner/document-utils';
import { HelpUrlGetter } from 'scanner/help-url-getter';
import { MessageDecorator } from 'scanner/message-decorator';
import { ResultDecorator } from 'scanner/result-decorator';
import { ruleToLinkConfiguration } from 'scanner/rule-to-links-mappings';
import { FixInstructionProcessor } from '../../common/components/fix-instruction-processor';
import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { DateProvider } from '../../common/date-provider';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { GetGuidanceTagsFromGuidanceLinks } from '../../common/get-guidance-tags-from-guidance-links';
import { AxeReportParameters, ReporterFactory } from './accessibilityInsightsReport';
import { Reporter } from './reporter';

const axeResultsReportGenerator = (parameters: AxeReportParameters) => {
    const {
        results: {
            testEngine: {
                version: axeVersion,
            },
            testEnvironment: {
                userAgent,
            },
        },
        scanContext: {
            pageTitle: targetPageTitle,
        },
        serviceName,
    } = parameters;

    const reactStaticRenderer = new ReactStaticRenderer();
    const fixInstructionProcessor = new FixInstructionProcessor();

    const toolData = createToolData(
        serviceName,
        '',
        'axe-core',
        axeVersion,
        userAgent,
    );

    const sectionFactory = {
        ...AutomatedChecksReportSectionFactory,
        FooterTextForService,
    };

    const reportHtmlGenerator = new ReportHtmlGenerator(
        sectionFactory,
        reactStaticRenderer,
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
        ruleToLinkConfiguration,
    );
    const getUnifiedResults = new ConvertScanResultsToUnifiedResults(generateUID, getFixResolution, getCheckResolution).automatedChecksConversion;

    const deps: AxeResultsReportDeps = {
        reportHtmlGenerator,
        resultDecorator,
        getUnifiedRules: convertScanResultsToUnifiedRules,
        getUnifiedResults: getUnifiedResults,
        getCards: getCardViewData,
    };

    return new AxeResultsReport(deps, parameters, toolData);
};

initializeFabricIcons();

export const reporterFactory: ReporterFactory = () => {

    return new Reporter(axeResultsReportGenerator);
};
