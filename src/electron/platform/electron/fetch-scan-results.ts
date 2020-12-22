// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { getA11yInsightsWebRuleUrl } from 'common/configs/a11y-insights-rule-resources';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ProcessInjector } from 'electron/platform/electron/process-injector';
import { CheckMessageTransformer } from 'scanner/check-message-transformer';
import { configuration } from 'scanner/custom-rule-configurations';
import { DocumentUtils } from 'scanner/document-utils';
import { HelpUrlGetter } from 'scanner/help-url-getter';
import { mapAxeTagsToGuidanceLinks } from 'scanner/map-axe-tags-to-guidance-links';
import { MessageDecorator } from 'scanner/message-decorator';
import { ResultDecorator } from 'scanner/result-decorator';
export type ScanResultsFetcher = (port: number) => Promise<AxeAnalyzerResult>;

export const createScanResultsFetcher = (getCurrentDate: () => Date): ScanResultsFetcher => {
    return async (port: number) => {
        const injector = new ProcessInjector();
        const windows = await injector.listWindows();

        // This is a hack for https://github.com/dequelabs/axe-core/issues/1427
        var axeSource = await axios.get(
            'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.1.1/axe.min.js',
        );

        const injected = await windows[0].evaluate({
            expression: axeSource.data.toString(),
        });

        const results = await windows[0].evaluate({
            expression: `new Promise((resolve, reject) => {
                const axeObj = window.axe;
                if (!axeObj) throw new Error('no axe, ' + window.axe);
                axeObj.run().then(resolve).catch(reject);
            })`,
            returnByValue: true,
            awaitPromise: true,
        });

        // We will need to reuse some of the code in rule-analyzer, launcher,
        // exposed-apis to avoid repeating/stubbing the below code
        const helpGetter = new HelpUrlGetter(configuration, getA11yInsightsWebRuleUrl);
        const messageDecorator = new MessageDecorator(configuration, new CheckMessageTransformer());
        const resultDecorator = new ResultDecorator(
            {
                title: () => 'fake title',
            } as DocumentUtils,
            messageDecorator,
            (ruleId, axeHelpUrl) => helpGetter.getHelpUrl(ruleId, axeHelpUrl),
            mapAxeTagsToGuidanceLinks,
        );
        const decorated = resultDecorator.decorateResults(results.value);
        const result: AxeAnalyzerResult = {
            results: results.value,
            include: [],
            exclude: [],
            originalResult: decorated,
        };
        return result;
    };
};
