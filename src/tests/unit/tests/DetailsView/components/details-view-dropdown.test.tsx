// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { DetailsViewDropDown, DetailsViewDropDownProps } from '../../../../../DetailsView/components/details-view-dropdown';

describe('DetailsViewDropDownTest', () => {
    describe('renders', () => {
        const contextMenuVisibleValues = [true, false];

        it.each(contextMenuVisibleValues)('with isContextMenuVisible = %s', isContextMenuVisible => {
            const menuItemsStub: IContextualMenuItem[] = [
                {
                    key: 'my-test-item',
                    iconProps: {
                        iconName: 'contactCard',
                    },
                    onClick: null,
                    name: 'My test item',
                },
            ];

            const props: DetailsViewDropDownProps = {
                menuItems: menuItemsStub,
            };

            const wrapper = shallow(<DetailsViewDropDown {...props} />);
            wrapper.setState({ isContextMenuVisible });

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    test('verify open/close menu', () => {
        const props: DetailsViewDropDownProps = {
            menuItems: [],
        };
        const target = { currentTarget: {} };
        const expectedMenuOpenState = {
            isContextMenuVisible: true,
            target: target.currentTarget,
        };
        const expectedMenuClosedState = {
            isContextMenuVisible: false,
            target: null,
        };
        const testObject = shallow(<DetailsViewDropDown {...props} />);
        const link = testObject.find(Link);
        link.prop('onClick')(target as React.MouseEvent<HTMLElement>);

        expect(testObject.state()).toEqual(expectedMenuOpenState);

        const contextualMenu = testObject.find(ContextualMenu);
        contextualMenu.prop('onDismiss')();

        expect(testObject.state()).toEqual(expectedMenuClosedState);
    });
});
