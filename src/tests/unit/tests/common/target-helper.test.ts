// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TargetHelper } from 'common/target-helper';
import { It, Mock, Times } from 'typemoq';

describe(TargetHelper, () => {
    const testScenarios = [
        { target: undefined, selector: undefined },
        { target: [], selector: '' },
        {
            target: ['target'],
            selector: 'target',
            expectedFinalTargetElement: 'target',
            expectedIndex0Selector: 'target',
        },
        {
            target: ['target1', 'target2'],
            selector: 'target1;target2',
            expectedFinalTargetElement: 'target1',
            expectedIndex0Selector: 'target1',
        },
        {
            target: ['target1', ['target2', 'target3']],
            selector: 'target1;target2,target3',
            expectedFinalTargetElement: 'target1',
            expectedIndex0Selector: 'target1',
        },
        {
            target: [
                ['target1', 'target2'],
                ['target3', 'target4'],
            ],
            selector: 'target1,target2;target3,target4',
            expectedShadowDomElements: ['target1'],
            expectedFinalTargetElement: 'target2',
            expectedIndex0Selector: 'target1,target2',
        },
        {
            target: [['target1', 'target2', 'target3']],
            selector: 'target1,target2,target3',
            expectedShadowDomElements: ['target1', 'target2'],
            expectedFinalTargetElement: 'target3',
            expectedIndex0Selector: 'target1,target2,target3',
        },
    ];
    let shadowRootElementStub;
    let documentMock;
    let elementStub;
    let shadowRootMock;

    beforeEach(() => {
        documentMock = Mock.ofType<Document>();
        shadowRootMock = Mock.ofType<ShadowRoot>();
        elementStub = {} as HTMLIFrameElement;
        shadowRootElementStub = { shadowRoot: shadowRootMock.object } as HTMLIFrameElement;
    });

    afterEach(() => {
        documentMock.verifyAll();
        shadowRootMock.verifyAll();
    });

    it.each(testScenarios)('getTargetElements', testScenario => {
        if (testScenario.expectedShadowDomElements && testScenario.expectedFinalTargetElement) {
            // Set up for element in the shadow dom
            documentMock
                .setup(dm => dm.querySelector(testScenario.expectedShadowDomElements[0]))
                .returns(() => shadowRootElementStub)
                .verifiable(Times.once());
            for (let i = 1; i < testScenario.expectedShadowDomElements.length; i++) {
                shadowRootMock
                    .setup(dm => dm.querySelector(testScenario.expectedShadowDomElements[i]))
                    .returns(() => shadowRootElementStub)
                    .verifiable(Times.once());
            }

            shadowRootMock
                .setup(dm => dm.querySelectorAll(testScenario.expectedFinalTargetElement))
                .returns(() => [elementStub])
                .verifiable(Times.once());
        } else if (testScenario.expectedFinalTargetElement) {
            // Set up for element not in the shadow dom
            documentMock
                .setup(dm => dm.querySelectorAll(testScenario.expectedFinalTargetElement))
                .returns(() => [elementStub])
                .verifiable(Times.once());
        } else {
            // Set up for no valid element
            documentMock.setup(dm => dm.querySelector(It.isAny())).verifiable(Times.never());
            shadowRootMock.setup(dm => dm.querySelector(It.isAny())).verifiable(Times.never());
        }

        const actualTargetElements = TargetHelper.getTargetElements(
            testScenario.target,
            documentMock.object,
            0,
        );
        expect(actualTargetElements).toEqual(
            testScenario.expectedFinalTargetElement ? [elementStub] : [],
        );
    });

    it.each(testScenarios)('getTargetElement', testScenario => {
        if (testScenario.expectedShadowDomElements && testScenario.expectedFinalTargetElement) {
            // Set up for element in the shadow dom
            documentMock
                .setup(dm => dm.querySelector(testScenario.expectedShadowDomElements[0]))
                .returns(() => shadowRootElementStub)
                .verifiable(Times.once());
            for (let i = 1; i < testScenario.expectedShadowDomElements.length; i++) {
                shadowRootMock
                    .setup(dm => dm.querySelector(testScenario.expectedShadowDomElements[i]))
                    .returns(() => shadowRootElementStub)
                    .verifiable(Times.once());
            }

            shadowRootMock
                .setup(dm => dm.querySelector(testScenario.expectedFinalTargetElement))
                .returns(() => elementStub)
                .verifiable(Times.once());
        } else if (testScenario.expectedFinalTargetElement) {
            // Set up for element not in the shadow dom
            documentMock
                .setup(dm => dm.querySelector(testScenario.expectedFinalTargetElement))
                .returns(() => elementStub)
                .verifiable(Times.once());
        } else {
            // Set up for no valid element
            documentMock.setup(dm => dm.querySelector(It.isAny())).verifiable(Times.never());
            shadowRootMock.setup(dm => dm.querySelector(It.isAny())).verifiable(Times.never());
        }

        const actualTargetElement = TargetHelper.getTargetElement(
            testScenario.target,
            documentMock.object,
            0,
        );
        expect(actualTargetElement).toBe(
            testScenario.expectedFinalTargetElement ? elementStub : undefined,
        );
    });

    it.each(testScenarios)('getTargetFromSelector', testScenario => {
        const actualTarget = TargetHelper.getTargetFromSelector(testScenario.selector);
        expect(actualTarget).toEqual(testScenario.target);
    });

    it.each(testScenarios)('getSelectorFromTarget', testScenario => {
        const actualSelector = TargetHelper.getSelectorFromTarget(testScenario.target);
        expect(actualSelector).toBe(testScenario.selector);
    });

    it.each(testScenarios)('getSelectorFromTargetElement', testScenario => {
        const actualSelector = TargetHelper.getSelectorFromTargetElement(testScenario.target, 0);
        expect(actualSelector).toBe(testScenario.expectedIndex0Selector);
    });
});
