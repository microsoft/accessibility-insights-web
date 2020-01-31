// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GenericPanel, GenericPanelProps } from 'DetailsView/components/generic-panel';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DetailsViewPanelTest', () => {
    test.each([true, false])('render - isPanelOpen: %s', (isPanelOpen: boolean) => {
        const childContent = <div>child content</div>;

        const props: GenericPanelProps = {
            isOpen: isPanelOpen,
            onDismiss: () => {},
            headerText: 'panel title',
            className: 'panel-custom-class',
            closeButtonAriaLabel: 'close button label',
            children: childContent,
            hasCloseButton: true,
        };

        const wrapper = shallow(<GenericPanel {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
