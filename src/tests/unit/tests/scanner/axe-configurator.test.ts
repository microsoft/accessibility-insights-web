// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { It, Mock, MockBehavior } from 'typemoq';

import { AxeConfigurator } from '../../../../scanner/axe-configurator';
import { RuleConfiguration } from '../../../../scanner/iruleresults';
import { localeConfiguration } from '../../../../scanner/locale-configuration';

describe('AxeConfigurator', () => {
    describe('configureAxe', () => {
        it('should call axe.configure with expected config', () => {
            const testObject = new AxeConfigurator();
            const configureMock = Mock.ofInstance((config: Axe.Spec) => null, MockBehavior.Strict);
            const rulesStub: RuleConfiguration[] = [
                {
                    checks: [
                        {
                            id: 'check1',
                            evaluate: null,
                        },
                        {
                            id: 'check2',
                            evaluate: null,
                        },
                    ],
                    rule: {
                        id: 'rule1',
                        selector: 's1',
                    },
                },
                {
                    checks: [
                        {
                            id: 'check3',
                            evaluate: null,
                        },
                    ],
                    rule: {
                        id: 'rule2',
                        selector: 's2',
                    },
                },
            ];

            const axeConfig = {
                checks: [
                    {
                        id: 'check1',
                        evaluate: null,
                    },
                    {
                        id: 'check2',
                        evaluate: null,
                    },
                    {
                        id: 'check3',
                        evaluate: null,
                    },
                ],
                rules: [
                    {
                        id: 'rule1',
                        selector: 's1',
                    },
                    {
                        id: 'rule2',
                        selector: 's2',
                    },
                ],
            };

            configureMock.setup(c => c(It.isValue(axeConfig))).verifiable();

            configureMock.setup(cm => cm(It.isValue({ locale: localeConfiguration }))).verifiable();

            configureMock.setup(cm => cm(It.isValue({ branding: 'msftAI' }))).verifiable();

            const axeStub = {
                configure: configureMock.object,
            };

            testObject.configureAxe(axeStub as typeof Axe, rulesStub);
            configureMock.verifyAll();
        });
    });
});
