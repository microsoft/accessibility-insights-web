// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';

import { getA11yInsightsWebRuleUrl } from 'common/configs/a11y-insights-rule-resources';
import { explicitRuleOverrides, getRuleInclusions } from 'scanner/get-rule-inclusions';
import { AxeConfigurator } from './axe-configurator';
import { AxeResponseHandler } from './axe-response-handler';
import { CheckMessageTransformer } from './check-message-transformer';
import { configuration } from './custom-rule-configurations';
import { DocumentUtils } from './document-utils';
import { getRules } from './get-rules';
import { HelpUrlGetter } from './help-url-getter';
import { ScanResults } from './iruleresults';
import { Launcher } from './launcher';
import { mapAxeTagsToGuidanceLinks } from './map-axe-tags-to-guidance-links';
import { MessageDecorator } from './message-decorator';
import { ResultDecorator } from './result-decorator';
import { ScanOptions } from './scan-options';
import { ScanParameterGenerator } from './scan-parameter-generator';
import { ScannerRuleInfo } from './scanner-rule-info';

export const scan = (
    options: ScanOptions,
    successCallback: (results: ScanResults) => void,
    errorCallback: (results: Error) => void,
) => {
    options = options || {};

    const messageDecorator = new MessageDecorator(configuration, new CheckMessageTransformer());
    const ruleIncludedStatus = getRuleInclusions(axe._audit.rules, explicitRuleOverrides);
    const scanParameterGenerator = new ScanParameterGenerator(ruleIncludedStatus);
    const documentUtils: DocumentUtils = new DocumentUtils(document);
    const helpUrlGetter = new HelpUrlGetter(configuration, getA11yInsightsWebRuleUrl);
    const resultDecorator = new ResultDecorator(
        documentUtils,
        messageDecorator,
        (ruleId, axeHelpUrl) => helpUrlGetter.getHelpUrl(ruleId, axeHelpUrl),
        mapAxeTagsToGuidanceLinks,
    );
    const launcher = new Launcher(axe, scanParameterGenerator, document, options);
    const axeResponseHandler = new AxeResponseHandler(
        successCallback,
        errorCallback,
        resultDecorator,
    );
    launcher.runScan(axeResponseHandler);
};

export const getVersion = (): string => {
    return axe.version;
};

export const getDefaultRules = (): ScannerRuleInfo[] => {
    const helpUrlGetter = new HelpUrlGetter(configuration, getA11yInsightsWebRuleUrl);
    const ruleIncludedStatus = getRuleInclusions(axe._audit.rules, explicitRuleOverrides);
    return getRules(
        axe,
        (ruleId, axeHelpUrl) => helpUrlGetter.getHelpUrl(ruleId, axeHelpUrl),
        ruleIncludedStatus,
        mapAxeTagsToGuidanceLinks,
    );
};

new AxeConfigurator().configureAxe(axe, configuration);
