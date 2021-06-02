// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';


describe('Recommend Color', () => {
    let testSubject: FixInstructionProcessor;

    beforeEach(() => {
        testSubject = new FixInstructionProcessor();
    });

    test('White on White recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 1 (foreground color: #ffffff, background color: #ffffff, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';

        const result = testSubject.process(fixInstruction);

        expect(result).toMatchSnapshot();
    });

    test('Black on black recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 1 (foreground color: #000000, background color: #000000, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';

        const result = testSubject.process(fixInstruction);

        expect(result).toMatchSnapshot();
    });

    test('Same Color recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 1 (foreground color: #8a94a8, background color: #8a94a8, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';

        const result = testSubject.process(fixInstruction);

        expect(result).toMatchSnapshot();
        expect(true).toBeTruthy();
    });

    test('Normal Font Recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt, font weight: normal). Expected contrast ratio of 4.5:1';

        const result = testSubject.process(fixInstruction);

        expect(result).toMatchSnapshot();
    });

    test('Large Font Recommendation', () => {
        const fixInstruction =
            'Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt, font weight: normal). Expected contrast ratio of 3:1';

        const result = testSubject.process(fixInstruction);

        expect(result).toMatchSnapshot();
    });
});
