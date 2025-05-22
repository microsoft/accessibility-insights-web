// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DocumentUtils } from 'scanner/document-utils';
import { MessageDecorator } from 'scanner/message-decorator';
import { ResultDecorator } from 'scanner/result-decorator';
import { RuleProcessor } from 'scanner/rule-processor';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('ResultDecorator', () => {
    let instanceStub;
    let nonEmptyResultStub;
    let nodeStub;
    let documentUtilsMock: IMock<DocumentUtils>;
    let messageDecoratorMock: IMock<MessageDecorator>;
    let getHelpUrlMock: IMock<(rule, axeHelpUrl) => string>;
    let ruleProcessorMock: IMock<RuleProcessor>;
    let urlStub: string;

    beforeEach(() => {
        nodeStub = {};
        urlStub = 'test url';
        instanceStub = {
            id: 'test-rule',
            nodes: [nodeStub],
            description: null,
            tags: ['tag1', 'tag2'],
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
        ruleProcessorMock = Mock.ofType(RuleProcessor, MockBehavior.Strict);

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
            const stubTagToLinkMapper = () => [guidanceLink];
            const resultDecorator = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                stubTagToLinkMapper,
                ruleProcessorMock.object,
            );
            expect(resultDecorator).not.toBeNull();
        });
    });

    describe('decorateResults with only violations', () => {
        it('should call success callback with correct result', () => {
            const guidanceLink = {} as any;
            const mockTagToLinkMapper = Mock.ofInstance((ruleId, tags) => []);
            mockTagToLinkMapper
                .setup(m => m('test-rule', ['tag1', 'tag2']))
                .returns(() => [guidanceLink])
                .verifiable();
            const resultStubWithGuidanceLinks = {
                passes: [],
                violations: [
                    {
                        id: 'test-rule',
                        nodes: [nodeStub],
                        description: null,
                        guidanceLinks: [guidanceLink],
                        helpUrl: urlStub,
                        tags: ['tag1', 'tag2'],
                    },
                ],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
                framesSkipped: false,
            };

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            getHelpUrlMock.setup(gchm => gchm(instanceStub.id, It.isAny())).returns(() => urlStub);

            ruleProcessorMock
                .setup(m => m.suppressChecksByMessages(instanceStub, true))
                .returns(result => {
                    return result;
                })
                .verifiable();

            ruleProcessorMock
                .setup(m => m.suppressFluentUITabsterResult(instanceStub))
                .returns(result => result)
                .verifiable();

            ruleProcessorMock
                .setup(m => m.normalizedSuppressedMessages)
                .returns(() => [])
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                mockTagToLinkMapper.object,
                ruleProcessorMock.object,
            );
            const decoratedResult = testSubject.decorateResults(nonEmptyResultStub);

            expect(decoratedResult).toEqual(resultStubWithGuidanceLinks);

            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
            mockTagToLinkMapper.verifyAll();
        });
    });

    describe('decorateResults with both violation and inapplicable', () => {
        it('should call success callback with correct result', () => {
            const violationInstance = {
                id: 'test-violation-rule',
                nodes: [],
                description: null,
                tags: ['tag1'],
            };
            const inapplicableInstance = {
                id: 'test-inapplicable-rule',
                nodes: [],
                description: null,
                tags: ['tag2'],
            };
            const nonEmptyResultWithInapplicable = {
                passes: [],
                violations: [violationInstance],
                inapplicable: [inapplicableInstance],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                url: 'https://test_url',
            };
            const guidanceLinkStub1 = { stubId: '1' } as any;
            const guidanceLinkStub2 = { stubId: '2' } as any;
            const urlStub1 = 'url-1';
            const urlStub2 = 'url-2';
            const tagToLinkMapperMock = Mock.ofInstance((ruleId, tags) => []);
            const resultStubWithGuidanceLinks = {
                passes: [],
                violations: [
                    {
                        ...violationInstance,
                        guidanceLinks: [guidanceLinkStub1],
                        helpUrl: urlStub1,
                    },
                ],
                inapplicable: [
                    {
                        ...inapplicableInstance,
                        guidanceLinks: [guidanceLinkStub2],
                        helpUrl: urlStub2,
                    },
                ],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
                framesSkipped: false,
            };

            tagToLinkMapperMock
                .setup(m => m(violationInstance.id, ['tag1']))
                .returns(() => [guidanceLinkStub1])
                .verifiable();
            tagToLinkMapperMock
                .setup(m => m(inapplicableInstance.id, ['tag2']))
                .returns(() => [guidanceLinkStub2])
                .verifiable();

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(violationInstance))
                .verifiable(Times.once());

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(inapplicableInstance))
                .verifiable(Times.once());

            getHelpUrlMock
                .setup(gchm => gchm(violationInstance.id, It.isAny()))
                .returns(() => urlStub1);

            getHelpUrlMock
                .setup(gchm => gchm(inapplicableInstance.id, It.isAny()))
                .returns(() => urlStub2);

            ruleProcessorMock
                .setup(m => m.suppressChecksByMessages(violationInstance, true))
                .returns(result => {
                    return result;
                })
                .verifiable();

            ruleProcessorMock
                .setup(m => m.suppressChecksByMessages(inapplicableInstance, false))
                .returns(result => {
                    return result;
                })
                .verifiable();

            ruleProcessorMock
                .setup(m => m.suppressFluentUITabsterResult(violationInstance))
                .returns(result => result)
                .verifiable();

            ruleProcessorMock
                .setup(m => m.normalizedSuppressedMessages)
                .returns(() => [])
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                tagToLinkMapperMock.object,
                ruleProcessorMock.object,
            );
            const decoratedResult = testSubject.decorateResults(
                nonEmptyResultWithInapplicable as any,
            );

            expect(decoratedResult).toEqual(resultStubWithGuidanceLinks);
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
            tagToLinkMapperMock.verifyAll();
        });
    });

    describe('decorateResults: w/ eliminating nullified processed results', () => {
        it('should call success callback with correct result', () => {
            const guidanceLinkStub = {} as any;
            const tagToLinkMapper = () => [guidanceLinkStub];
            const emptyResultsStub = {
                passes: [],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
                framesSkipped: false,
            };

            instanceStub.nodes = [];

            messageDecoratorMock
                .setup(mdm => mdm.decorateResultWithMessages(instanceStub))
                .verifiable(Times.once());

            ruleProcessorMock
                .setup(m => m.suppressChecksByMessages(instanceStub, true))
                .returns(result => {
                    return null;
                })
                .verifiable();

            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                tagToLinkMapper,
                ruleProcessorMock.object,
            );

            const decoratedResult = testSubject.decorateResults(nonEmptyResultStub);

            expect(decoratedResult).toEqual(emptyResultsStub);
            ruleProcessorMock.verifyAll();
            documentUtilsMock.verifyAll();
            messageDecoratorMock.verifyAll();
        });
    });

    describe('decorateResults: with incomplete results', () => {
        it('should set framesSkipped', () => {
            const incompleteInstance = {
                id: 'frame-tested',
                nodes: [],
                description: null,
                tags: ['tag2'],
            };
            const guidanceLinkStub = {} as any;
            const tagToLinkMapper = () => [guidanceLinkStub];
            const emptyResultsStub = {
                passes: [],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 100,
                targetPageTitle: 'test title',
                targetPageUrl: 'https://test_url',
                framesSkipped: true,
            };
            messageDecoratorMock.setup(mdm => mdm.decorateResultWithMessages(It.isAny()));
            ruleProcessorMock
                .setup(m => m.suppressChecksByMessages(It.isAny(), It.isAny()))
                .returns(result => {
                    return null;
                });
            const testSubject = new ResultDecorator(
                documentUtilsMock.object,
                messageDecoratorMock.object,
                getHelpUrlMock.object,
                tagToLinkMapper,
                ruleProcessorMock.object,
            );
            nonEmptyResultStub.incomplete = [incompleteInstance];
            const decoratedResult = testSubject.decorateResults(nonEmptyResultStub);
            expect(decoratedResult).toEqual(emptyResultsStub);
        });
    });
});
