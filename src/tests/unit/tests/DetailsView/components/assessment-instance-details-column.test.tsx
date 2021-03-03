// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as styles from 'DetailsView/components/assessment-instance-details-column.scss';
import * as Enzyme from 'enzyme';
import { TooltipHost } from 'office-ui-fabric-react';
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

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);
        verifyBaseRender(wrapper, props);

        const label = wrapper.find(`.${styles.assessmentInstanceLabel}`);
        expect(label.getElement().props.children).toBe(props.labelText);
    });

    test('render: N/A instance', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.find(`.${styles.assessmentInstanceLabel}`);

        expect(label.getElement().props.children).toBeDefined();
        expect(label.getElement().props.children).toBe(props.labelText);
    });

    test('render: no label text', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            textContent: 'textContent',
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);
    });

    test('render: with custom class name', () => {
        const props: AssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
            customClassName: 'custom-class-name',
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.find(`.${styles.assessmentInstanceLabel}`);
        expect(label.hasClass(props.customClassName)).toEqual(true);
    });

    function verifyBaseRender(
        wrapper: Enzyme.ShallowWrapper,
        props: AssessmentInstanceDetailsColumnProps,
    ): void {
        const hasLabel = wrapper.find(`.${styles.assessmentInstanceLabel}`).exists();
        props.labelText ? expect(hasLabel).toEqual(true) : expect(hasLabel).toEqual(false);
        expect(wrapper.find(TooltipHost).exists()).toBe(true);
        expect(wrapper.find(TooltipHost).props().content).toEqual(props.textContent);
        expect(wrapper.find(`.${styles.assessmentInstanceTextContent}`).exists()).toEqual(true);
        expect(
            wrapper.find(`.${styles.assessmentInstanceTextContent}`).getElement().props.children,
        ).toEqual(props.textContent);
    }
});
