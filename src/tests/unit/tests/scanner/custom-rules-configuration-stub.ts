// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../../../../scanner/iruleresults';

const passMessageStub = 'pass message';
const failMessageStub = 'fail message';
const fakeRuleConfigurationA: RuleConfiguration = {
    checks: [
        {
            id: 'fake-check-id',
            evaluate: () => {
                throw new Error('unimplemented evaluate stub');
            },
            passMessage: () => passMessageStub,
            failMessage: () => failMessageStub,
        },
    ],
    rule: {
        id: 'fake-rule-id',
        selector: '*',
        any: ['fake-check-id'],
        description: 'fake description',
        help: 'fake help',
    },
};

export const CustomRulesConfigurationStub: RuleConfiguration[] = [fakeRuleConfigurationA];
