// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RenderResult, render } from '@testing-library/react';
import styles from 'DetailsView/components/assessment-instance-details-column.scss';
import { isNull } from 'lodash';
import * as React from 'react';

import {
    AssessmentInstanceDetailsColumn,
    AssessmentInstanceDetailsColumnProps,
} from '../../../../../DetailsView/components/assessment-instance-details-column';

describe('AssessmentInstanceDetailsColumn', () => {
    test('constructor', () => {
        expect(
            new AssessmentInstanceDetailsColumn({} as AssessmentInstanceDetailsColumnProps),
        ).toBeDefined();
    });

    test('render: heading instance', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'labelText',
            textContent: 'textContent',
        };

        const wrapper = render(<AssessmentInstanceDetailsColumn {...props} />);
        verifyBaseRender(wrapper, props);
    });

    test('render: N/A instance', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
            headerText: 'headerText',
        };

        const wrapper = render(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);
    });

    test('render: no label text', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            textContent: 'textContent',
        };

        const wrapper = render(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);
    });

    test('render: with custom class name', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
            customClassName: 'custom-class-name',
        };

        const wrapper = render(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.getByText('N/A');

        expect(label.classList.contains(props.customClassName)).toEqual(true);
    });

    function verifyBaseRender(
        wrapper: RenderResult,
        props: AssessmentInstanceDetailsColumnProps,
    ): void {
        const hasLabel = !isNull(
            wrapper.queryByText(props.labelText, {
                selector: `.${styles.assessmentInstanceLabel}`,
            }),
        );

        props.labelText ? expect(hasLabel).toEqual(true) : expect(hasLabel).toEqual(false);
        expect(!isNull(wrapper.container.querySelector('.ms-TooltipHost'))).toBe(true);
        expect(
            !isNull(wrapper.container.querySelector(`.${styles.assessmentInstanceTextContent}`)),
        ).toEqual(true);
        expect(
            wrapper.container.querySelector(`.${styles.assessmentInstanceTextContent}`).innerHTML,
        ).toEqual(props.textContent);
    }
});
