// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    CollapsibleUrlResultSection,
    CollapsibleUrlResultSectionProps,
} from 'reports/components/report-sections/collapsible-url-result-section';

describe('CollapsibleUrlResultSection', () => {
    it('renders', () => {
        const collapsibleControlMock = Mock.ofType<
            (props: CollapsibleComponentCardsProps) => JSX.Element
        >();
        const props: CollapsibleUrlResultSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            },
            containerId: 'container-id',
        } as CollapsibleUrlResultSectionProps;

        const wrapper = shallow(<CollapsibleUrlResultSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
