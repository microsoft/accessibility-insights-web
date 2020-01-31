// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GenericPanel, GenericPanelProps } from 'DetailsView/components/generic-panel';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('GenericPanel', () => {
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

            const wrapper = shallow(<GenericPanel {...props}>{childContent}</GenericPanel>);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('minimal content', () => {
            const props: GenericPanelProps = {};

            const wrapper = shallow(<GenericPanel {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
