// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from '../../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { CustomWidgetsFormatter } from '../../../../../injected/visualization/custom-widgets-formatter';
import { NonTextComponentFormatter } from '../../../../../injected/visualization/non-text-component-formatter';

describe('NonTextComponentFormatterTests', () => {
    let testSubject: NonTextComponentFormatter;
    let customWidgetsFormatter: CustomWidgetsFormatter;
    const htmlElement = document.createElement('div');

    beforeEach(() => {
        testSubject = new NonTextComponentFormatter();
        customWidgetsFormatter = new CustomWidgetsFormatter();
    });

    test('verify drawer configs: getBoundingRect', () => {
        const data = { isFailure: true } as AssessmentVisualizationInstance;
        const rectWithPadding = testSubject
            .getDrawerConfiguration(htmlElement, data)
            .getBoundingRect(htmlElement);
        const baseRect = customWidgetsFormatter
            .getDrawerConfiguration(htmlElement, data)
            .getBoundingRect(htmlElement);
        expect(rectWithPadding.left - baseRect.left).toBe(-NonTextComponentFormatter.PADDING_VALUE);
        expect(rectWithPadding.right - baseRect.right).toBe(
            NonTextComponentFormatter.PADDING_VALUE,
        );
        expect(rectWithPadding.top - baseRect.top).toBe(-NonTextComponentFormatter.PADDING_VALUE);
        expect(rectWithPadding.bottom - baseRect.bottom).toBe(
            NonTextComponentFormatter.PADDING_VALUE,
        );
        expect(rectWithPadding.width - baseRect.width).toBe(
            2 * NonTextComponentFormatter.PADDING_VALUE,
        );
        expect(rectWithPadding.height - baseRect.height).toBe(
            2 * NonTextComponentFormatter.PADDING_VALUE,
        );
    });
});
