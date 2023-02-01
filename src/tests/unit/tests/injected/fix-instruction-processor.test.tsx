// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('FixInstructionProcessor', () => {
    let testSubject: FixInstructionProcessor;
    const recommendColorMock = Mock.ofType(RecommendColor);

    beforeEach(() => {
        recommendColorMock.reset();
        testSubject = new FixInstructionProcessor();
    });

    test('updates aria-required-children "(see related nodes)" text to "(see <em>Related paths</em>)"', () => {
        const fixInstruction = 'Element has children which are not allowed (see related nodes)';

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
    });

    test('no-ops if neither background nor foreground on the message', () => {
        const fixInstruction =
            'there is nothing that will trigger the processor to change the fix instruction here';

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toEqual(<>{fixInstruction}</>);
    });

    test('foreground color on the message', () => {
        const fixInstruction =
            'color contrast of 2.52 (foreground color: #8a94a8; nothing else to match here)';
        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
    });

    test('foreground and background color on the message (mind the order)', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';
        setupRecommendColorMock('#8a94a8', '#e7ecd8', 'test return value');

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
        recommendColorMock.verifyAll();
    });

    test('background and foreground on the message (mind the order)', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 2.52 (background color: #8a94a8, foreground color: #e7ecd8, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';
        setupRecommendColorMock('#e7ecd8', '#8a94a8', 'test return value');

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
        recommendColorMock.verifyAll();
    });

    test('we assume only one instance of fore/background color, second instance will be ignored', () => {
        const fixInstruction =
            'first foreground color: #ffffff, second foreground: #000000, first background color: #AAAAAA, second background color: #bbBBbb';
        setupRecommendColorMock('#ffffff', '#AAAAAA', 'test return value');

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
        recommendColorMock.verifyAll();
    });

    test('when we have nothing to process', () => {
        const fixInstruction = 'nothing to process';

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
    });

    test('recommendColor has one recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 4.48 (foreground color: #fefefe, background color: #21809d, font size: 10.8pt (14.4px), font weight: normal). Expected contrast ratio of 4.5:1';

        const getRecommendColorReturnValue =
            'Use foreground color: #ffffff and the original background color: #21809d to meet a contrast ratio of 4.53:1. Or use background color: #1f7995 and the original foreground color: #fcfcfc to meet a contrast ratio of 4.84:1.';

        setupRecommendColorMock('#fefefe', '#21809d', getRecommendColorReturnValue);

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
        recommendColorMock.verifyAll();
    });

    test('recommendColor has two recommendations', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 4.48 (foreground color: #fefefe, background color: #21809d, font size: 10.8pt (14.4px), font weight: normal). Expected contrast ratio of 4.5:1';

        const getRecommendColorReturnValue =
            'Use foreground color: #ffffff and the original background color: #21809d to meet a contrast ratio of 4.53:1.';

        setupRecommendColorMock('#fefefe', '#21809d', getRecommendColorReturnValue);

        const result = testSubject.process(fixInstruction, recommendColorMock.object);

        expect(result).toMatchSnapshot();
        recommendColorMock.verifyAll();
    });

    const setupRecommendColorMock = (colorOne, colorTwo, returns) =>
        recommendColorMock
            .setup(rc => rc.getRecommendColor(colorOne, colorTwo, 4.5))
            .returns(() => returns)
            .verifiable(Times.once());
});
