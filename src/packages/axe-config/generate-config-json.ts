// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as fs from 'fs';
import * as path from 'path';
import * as axe from 'axe-core';
import { explicitRuleOverrides, getRuleInclusions } from 'scanner/get-rule-inclusions';
import { ScanParameterGenerator } from 'scanner/scan-parameter-generator';

const defaultConfigFilePath = path.join(__dirname, '../../../drop/axe-config.json');
const configFilePath = process.argv[2] || defaultConfigFilePath;

const generateAxeConfig = () => {
    console.log('Generating axe config file...');

    const ruleOverrides = explicitRuleOverrides;
    ruleOverrides['frame-tested'] = {
        status: 'excluded',
        reason: `This is included by our scanner, but special cased during post-processing to
                 display a special warning bar rather than appearing with automated check results.
                 We omit it from @accessibility-insights/axe-config to avoid confusing disparities
                 between automated check results and external config users.`,
    };

    const ruleIncludedStatus = getRuleInclusions(axe._audit.rules, explicitRuleOverrides);
    const scanParameterGenerator = new ScanParameterGenerator(ruleIncludedStatus);
    const scanOptions = scanParameterGenerator.getAxeEngineOptions({});
    const config = JSON.stringify(scanOptions, null, '\t');

    console.log(`Writing config to ${configFilePath}...`);
    if (!fs.existsSync(path.dirname(configFilePath))) {
        fs.mkdirSync(path.dirname(configFilePath));
    }
    fs.writeFileSync(configFilePath, config);

    console.log('Finished generating axe config file.');
};

generateAxeConfig();
