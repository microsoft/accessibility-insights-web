// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { CheckMessageTransformer } from '../../../../scanner/check-message-transformer';
import { AxeRule, RuleConfiguration } from '../../../../scanner/iruleresults';
import { MessageDecorator } from '../../../../scanner/message-decorator';
import { CustomRulesConfigurationStub } from './custom-rules-configuration-stub';

describe('MessageDecorator', () => {
    let axeResultStub: AxeRule;
    let checkMessageTransformerMock: IMock<CheckMessageTransformer>;
    let configuration: RuleConfiguration[];

    beforeEach(() => {
        configuration = CustomRulesConfigurationStub;
        axeResultStub = generateAxeResultStubWithStatus(configuration[0]);
        checkMessageTransformerMock = Mock.ofType(
            CheckMessageTransformer,
            MockBehavior.Strict,
        );
    });

    describe('constructor', () => {
        it('should construct the generator', () => {
            const testSubject = new MessageDecorator(null, null);
            expect(testSubject).not.toBeNull();
        });
    });

    describe('decorateResultsWithMessages', () => {
        it('should add messages to all checks via check message creator & execute decorateNode from config', () => {
            configuration[0].rule.decorateNode = node =>
                (node.snippet = 'test snippet');
            const expectedResult = generateAxeResultStubWithStatus(
                configuration[0],
            );
            expectedResult.nodes[0].snippet = 'test snippet';
            const testSubject = new MessageDecorator(
                configuration,
                checkMessageTransformerMock.object,
            );
            testBasicDecorateMessage(expectedResult, testSubject);
        });

        it('should add messages to all checks via check message creator (no decorateNode in config)', () => {
            configuration[0].rule.decorateNode = null;
            const expectedResult = generateAxeResultStubWithStatus(
                configuration[0],
            );
            const testSubject = new MessageDecorator(
                configuration,
                checkMessageTransformerMock.object,
            );
            testBasicDecorateMessage(expectedResult, testSubject);
        });

        it("should not do anything as rule config doesn't exist", () => {
            const expectedResult = generateAxeResultStubWithStatus(
                configuration[0],
            );
            const testSubject = new MessageDecorator(
                [],
                checkMessageTransformerMock.object,
            );
            testSubject.decorateResultWithMessages(axeResultStub);

            expect(axeResultStub).toEqual(expectedResult);
        });
    });

    function testBasicDecorateMessage(
        expectedResult: AxeRule,
        testSubject: MessageDecorator,
    ): void {
        checkMessageTransformerMock
            .setup(cmcm =>
                cmcm.addMessagesToChecks(
                    axeResultStub.nodes[0].any,
                    configuration[0].checks,
                ),
            )
            .verifiable(Times.once());

        checkMessageTransformerMock
            .setup(cmcm =>
                cmcm.addMessagesToChecks(
                    axeResultStub.nodes[0].none,
                    configuration[0].checks,
                ),
            )
            .verifiable(Times.once());

        checkMessageTransformerMock
            .setup(cmcm =>
                cmcm.addMessagesToChecks(
                    axeResultStub.nodes[0].all,
                    configuration[0].checks,
                ),
            )
            .verifiable(Times.once());

        expectedResult.description = configuration[0].rule.description;
        expectedResult.help = configuration[0].rule.help;

        testSubject.decorateResultWithMessages(axeResultStub);
        expect(axeResultStub).toEqual(expectedResult);
        checkMessageTransformerMock.verifyAll();
    }

    function generateAxeResultStubWithStatus(
        config: RuleConfiguration,
    ): AxeRule {
        return {
            id: config.rule.id,
            nodes: [
                {
                    any: [
                        {
                            id: 'node1',
                        },
                    ],
                    all: [
                        {
                            id: 'node2',
                        },
                    ],
                    none: [
                        {
                            id: 'node3',
                        },
                    ],
                },
            ],
        } as AxeRule;
    }
});
