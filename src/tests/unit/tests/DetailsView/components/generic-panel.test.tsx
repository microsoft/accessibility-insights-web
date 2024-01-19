// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel } from '@fluentui/react';
import { render } from '@testing-library/react';
import { GenericPanel, GenericPanelProps } from 'DetailsView/components/generic-panel';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('GenericPanel', () => {
    mockReactComponents([Panel]);
    describe('renders', () => {
        it.each([true, false])('isPanelOpen: %s', (isPanelOpen: boolean) => {
            const childContent = <div>child content</div>;

            const props: GenericPanelProps = {
                isOpen: isPanelOpen,
                onDismiss: () => {},
                headerText: 'panel title',
                className: 'panel-custom-class',
                closeButtonAriaLabel: 'close button label',
                hasCloseButton: true,
            };

            const renderResult = render(<GenericPanel {...props}>{childContent}</GenericPanel>);
            //expectMockedComponentPropsToMatchSnapshots([Panel]);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('minimal content', () => {
            const props: GenericPanelProps = {};

            const renderResult = render(<GenericPanel {...props} />);
            //expectMockedComponentPropsToMatchSnapshots([Panel]);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
