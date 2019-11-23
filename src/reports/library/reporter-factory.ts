// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { AutomatedChecksReportSectionFactory } from 'reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { AxeResultReport } from 'reports/library/axe-results-report';
import { Reporter } from 'reports/library/reporter';
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

const browserVersion = 'PLACEHOLDER_FOR_BROWSER_VERSION';
const browserSpec = 'PLACEHOLDER_FOR_BROWSER_SPEC';
const axeVersion = 'PLACEHOLDER_FOR_AXE_VERSION';

const reportHtmlGeneratorFactory = () => {

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

    return reportHtmlGenerator;
};

const resultDecoratorFactory = () => {

    const messageDecorator = new MessageDecorator(configuration, new CheckMessageTransformer());
    const documentUtils: DocumentUtils = new DocumentUtils(document);
    const helpUrlGetter = new HelpUrlGetter(configuration);
    const resultDecorator = new ResultDecorator(documentUtils, messageDecorator, (ruleId, axeHelpUrl) =>
        helpUrlGetter.getHelpUrl(ruleId, axeHelpUrl),
    );

    return resultDecorator;
};

const axeResultsReportGenerator = (results: axe.AxeResults) => new AxeResultReport(results, reportHtmlGeneratorFactory(), resultDecoratorFactory());

export const reporterFactory = () => new Reporter(axeResultsReportGenerator);
