// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as axe from 'axe-core';
import * as fs from 'fs';
import * as path from 'path';
import { explicitRuleOverrides, getRuleInclusions } from 'scanner/get-rule-inclusions';
import { ScanParameterGenerator } from 'scanner/scan-parameter-generator';

const configFilePath = path.join(__dirname, '../../../drop/axe-config.json');

const generateAxeConfig = () => {
    console.log('Generating axe config file...');

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
