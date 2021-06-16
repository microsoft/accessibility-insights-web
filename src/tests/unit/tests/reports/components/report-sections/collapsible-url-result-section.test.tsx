// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CollapsibleUrlResultSection,
    CollapsibleUrlResultSectionProps,
} from 'reports/components/report-sections/collapsible-url-result-section';
import { It, Mock } from 'typemoq';

describe('CollapsibleUrlResultSection', () => {
    it('renders', () => {
        const collapsibleControlMock =
            Mock.ofType<(props: CollapsibleComponentCardsProps) => JSX.Element>();
        const containerId = 'container-id';
        const props: CollapsibleUrlResultSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            },
            containerId,
            content: <div>Content</div>,
        } as CollapsibleUrlResultSectionProps;

        const expectedCollapsibleControlProps: Partial<CollapsibleComponentCardsProps> = {
            id: containerId,
            headingLevel: 3,
            deps: null,
        };

        collapsibleControlMock
            .setup(cc => cc(It.isObjectWith(expectedCollapsibleControlProps)))
            .returns(() => <div>Collapsible component</div>);

        const wrapper = shallow(<CollapsibleUrlResultSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
