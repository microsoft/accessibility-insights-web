// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DocumentUtils } from '../../../../scanner/document-utils';
import { RuleResult } from '../../../../scanner/iruleresults';
import { MessageDecorator } from '../../../../scanner/message-decorator';
import { Processor } from '../../../../scanner/processor';
import { ResultDecorator } from '../../../../scanner/result-decorator';

describe('ResultDecorator', () => {
    let instanceStub;
    let nonEmptyResultStub;
    let nodeStub;
    let documentUtilsMock: IMock<DocumentUtils>;
    let messageDecoratorMock: IMock<MessageDecorator>;
    let getHelpUrlMock: IMock<(rule, axeHelpUrl) => string>;
    let urlStub: string;

    beforeEach(() => {
        nodeStub = {};
        urlStub = 'test url';
        instanceStub = {
            id: 'test-rule',
            nodes: [nodeStub],
            description: null,
        };
        nonEmptyResultStub = {
            passes: [],
            violations: [instanceStub],
            inapplicable: [],
            incomplete: [],
            timestamp: 100,
            targetPageTitle: 'test title',
            url: 'https://test_url',
        };
        messageDecoratorMock = Mock.ofType(MessageDecorator, MockBehavior.Strict);
        getHelpUrlMock = Mock.ofInstance(rule => null, MockBehavior.Strict);
        documentUtilsMock = Mock.ofType(DocumentUtils);

        documentUtilsMock
            .setup(dum => dum.title())
            .returns(() => {
                return 'test title';
            })
            .verifiable();
    });

    describe('constructor', () => {
        it('should construct the generator', () => {
            const guidanceLink = {} as any;
            const configuration = {
                'test-rule': [guidanceLink],
            };
            const resultDecorator = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                configuration,
            );
            expect(resultDecorator).not.toBeNull();
        });
    });

    describe('decorateResults: w/ no configuration', () => {
        it('should return without guidance links', () => {
            const scanResultInstance: RuleResult = {
                ...instanceStub,
                guidanceLinks: undefined,
                helpUrl: urlStub,
            };
            const nonEmptyScanResultStub = {
                passes: [],
                violations: [scanResultInstance],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
            };
            const suppressChecksByMessagesMock = GlobalMock.ofInstance(
                Processor.suppressChecksByMessages,
                'suppressChecksByMessages',
                Processor,
                MockBehavior.Strict,
            );

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            getHelpUrlMock.setup(gchm => gchm(instanceStub.id, It.isAny())).returns(() => urlStub);

            suppressChecksByMessagesMock
                .setup(scbmm => scbmm(instanceStub, true))
                .returns(result => {
                    return result;
                })
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                undefined,
            );
            let decoratedResult;
            GlobalScope.using(suppressChecksByMessagesMock).with(() => {
                decoratedResult = testSubject.decorateResults(nonEmptyResultStub);
            });

            expect(decoratedResult).toEqual(nonEmptyScanResultStub);
            suppressChecksByMessagesMock.verifyAll();
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
        });
    });

    describe('decorateResults: with ruleToLinksConfiguration', () => {
        it('should call success callback with correct result', () => {
            const guidanceLink = {} as any;
            const configuration = {
                'test-rule': [guidanceLink],
            };
            const resultStubWithGuidanceLinks = {
                passes: [],
                violations: [
                    {
                        id: 'test-rule',
                        nodes: [nodeStub],
                        description: null,
                        guidanceLinks: [guidanceLink],
                        helpUrl: urlStub,
                    },
                ],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
            };
            const suppressChecksByMessagesMock = GlobalMock.ofInstance(
                Processor.suppressChecksByMessages,
                'suppressChecksByMessages',
                Processor,
                MockBehavior.Strict,
            );

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            getHelpUrlMock.setup(gchm => gchm(instanceStub.id, It.isAny())).returns(() => urlStub);

            suppressChecksByMessagesMock
                .setup(scbmm => scbmm(instanceStub, true))
                .returns(result => {
                    return result;
                })
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                configuration,
            );
            let decoratedResult;
            GlobalScope.using(suppressChecksByMessagesMock).with(() => {
                decoratedResult = testSubject.decorateResults(nonEmptyResultStub);
            });

            expect(decoratedResult).toEqual(resultStubWithGuidanceLinks);
            suppressChecksByMessagesMock.verifyAll();
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
        });
    });

    describe('decorateResults: w/ inapplicable', () => {
        it('should call success callback with correct result', () => {
            const inapplicableInstance = {
                id: 'test-inapplicable-rule',
                nodes: [],
                description: null,
            };
            const nonEmptyResultWithInapplicable = {
                passes: [],
                violations: [instanceStub],
                inapplicable: [inapplicableInstance],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                url: 'https://test_url',
            };
            const guidanceLinkStub = {} as any;
            const configuration = {
                'test-rule': [guidanceLinkStub],
                'test-inapplicable-rule': [guidanceLinkStub],
            };
            const resultStubWithGuidanceLinks = {
                passes: [],
                violations: [
                    {
                        id: 'test-rule',
                        nodes: [nodeStub],
                        description: null,
                        guidanceLinks: [guidanceLinkStub],
                        helpUrl: urlStub,
                    },
                ],
                inapplicable: [
                    {
                        ...inapplicableInstance,
                        guidanceLinks: [guidanceLinkStub],
                        helpUrl: urlStub,
                    },
                ],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
            };
            const suppressChecksByMessagesMock = GlobalMock.ofInstance(
                Processor.suppressChecksByMessages,
                'suppressChecksByMessages',
                Processor,
                MockBehavior.Strict,
            );

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(inapplicableInstance))
                .verifiable(Times.once());

            getHelpUrlMock.setup(gchm => gchm(instanceStub.id, It.isAny())).returns(() => urlStub);

            getHelpUrlMock
                .setup(gchm => gchm(inapplicableInstance.id, It.isAny()))
                .returns(() => urlStub);

            suppressChecksByMessagesMock
                .setup(scbmm => scbmm(instanceStub, true))
                .returns(result => {
                    return result;
                })
                .verifiable();

            suppressChecksByMessagesMock
                .setup(scbmm => scbmm(inapplicableInstance, false))
                .returns(result => {
                    return result;
                })
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                configuration,
            );
            let decoratedResult;
            GlobalScope.using(suppressChecksByMessagesMock).with(() => {
                decoratedResult = testSubject.decorateResults(
                    nonEmptyResultWithInapplicable as any,
                );
            });

            expect(decoratedResult).toEqual(resultStubWithGuidanceLinks);
            suppressChecksByMessagesMock.verifyAll();
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
        });
    });

    describe('decorateResults: w/ eliminating nullified processed results', () => {
        it('should call success callback with correct result', () => {
            const guidanceLinkStub = {} as any;
            const configuration = {
                'test-rule': [guidanceLinkStub],
            };
            const emptyResultsStub = {
                passes: [],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
            };
            const suppressChecksByMessagesMock = GlobalMock.ofInstance(
                Processor.suppressChecksByMessages,
                'suppressChecksByMessages',
                Processor,
                MockBehavior.Strict,
            );

            instanceStub.nodes = [];

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            suppressChecksByMessagesMock
                .setup(scbmm => scbmm(instanceStub, true))
                .returns(result => {
                    return null;
                })
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                configuration,
            );
            let decoratedResult;
            GlobalScope.using(suppressChecksByMessagesMock).with(() => {
                decoratedResult = testSubject.decorateResults(nonEmptyResultStub);
            });

            expect(decoratedResult).toEqual(emptyResultsStub);
            suppressChecksByMessagesMock.verifyAll();
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
        });
    });
});
