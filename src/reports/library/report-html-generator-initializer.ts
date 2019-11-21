// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecksReportSectionFactory } from 'reports/components/report-sections/automated-checks-report-section-factory';
import { getDefaultAddListenerForCollapsibleSection } from 'reports/components/report-sections/collapsible-script-provider';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { DateProvider } from '../../common/date-provider';
import { EnvironmentInfoProvider } from '../../common/environment-info-provider';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { GetGuidanceTagsFromGuidanceLinks } from '../../common/get-guidance-tags-from-guidance-links';
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';

const browserVersion = "PLACEHOLDER_FOR_BROWSER_VERSION";
const browserSpec = "PLACEHOLDER_FOR_BROWSER_SPEC";
const axeVersion = "PLACEHOLDER_FOR_AXE_VERSION";

export const reportHtmlGeneratorInitializer = () => {

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
