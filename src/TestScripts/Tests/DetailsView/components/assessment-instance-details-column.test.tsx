// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';

import {
    AssessmentInstanceDetailsColumn,
    IAssessmentInstanceDetailsColumnProps,
} from '../../../../DetailsView/components/assessment-instance-details-column';

describe('AssessmentInstanceDetailsColumn', () => {
    test('constructor', () => {
        expect(new AssessmentInstanceDetailsColumn({} as IAssessmentInstanceDetailsColumnProps)).toBeDefined();
    });

    test('render: heading instance', () => {
        const props: IAssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'labelText',
            textContent: 'textContent',
            tooltipId: undefined,
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.find('.assessment-instance-label');
        expect(label.getElement().props.children).toBe(props.labelText);
        expect(label.getElement().props.className).toBe('assessment-instance-label');
    });

    test('render: N/A instance', () => {
        const props: IAssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
            tooltipId: undefined,
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.find('.assessment-instance-label');

        expect(label.getElement().props.children).toBeDefined();
        expect(label.getElement().props.children).toBe(props.labelText);
    });

    test('render: no label text', () => {
        const props: IAssessmentInstanceDetailsColumnProps = {
            background: 'background',
            textContent: 'textContent',
            tooltipId: undefined,
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);
    });

    test('render: with custom class name', () => {
        const props: IAssessmentInstanceDetailsColumnProps = {
            background: 'background',
            labelText: 'N/A',
            textContent: 'textContent',
            tooltipId: undefined,
            customClassName: 'custom-class-name',
        };

        const wrapper = Enzyme.shallow(<AssessmentInstanceDetailsColumn {...props} />);

        verifyBaseRender(wrapper, props);

        const label = wrapper.find('.assessment-instance-label');
        expect(label.hasClass(props.customClassName)).toEqual(true);
    });

    function verifyBaseRender(wrapper: Enzyme.ShallowWrapper, props: IAssessmentInstanceDetailsColumnProps): void {
        const hasLabel = wrapper.find('.assessment-instance-label').exists();
        !!props.labelText ? expect(hasLabel).toEqual(true) : expect(hasLabel).toEqual(false);
        expect(wrapper.find(TooltipHost).exists()).toBe(true);
        expect(wrapper.find(TooltipHost).props().content).toEqual(props.textContent);
        expect(wrapper.find(TooltipHost).props().id).toEqual(props.tooltipId);
        expect(wrapper.find('.assessment-instance-textContent').exists()).toEqual(true);
        expect(wrapper.find('.assessment-instance-textContent').getElement().props.children).toEqual(props.textContent);
    }
});
