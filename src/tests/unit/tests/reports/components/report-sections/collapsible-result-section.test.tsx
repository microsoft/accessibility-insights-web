// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import * as React from 'react';
import {
    CollapsibleResultSection,
    CollapsibleResultSectionDeps,
    CollapsibleResultSectionProps,
} from 'reports/components/report-sections/collapsible-result-section';
import { Mock } from 'typemoq';

describe('CollapsibleResultSection', () => {
    it('renders', () => {
        const collapsibleControlMock =
            Mock.ofType<(props: CollapsibleComponentCardsProps) => JSX.Element>();
        const props: CollapsibleResultSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            } as CollapsibleResultSectionDeps,
            containerClassName: 'result-section-class-name',
            containerId: 'container-id',
        } as CollapsibleResultSectionProps;

        const wrapper = render(<CollapsibleResultSection {...props} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
