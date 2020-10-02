// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItem } from 'electron/types/left-nav-item';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { LeftNavProps, LeftNav } from 'electron/views/left-nav/left-nav';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('LeftNav', () => {
    let leftNavItemsStub: LeftNavItem[];
    let navLinkRendererStub: NavLinkRenderer;
    let props: LeftNavProps;

    beforeEach(() => {
        leftNavItemsStub = [
            {
                key: 'automated-checks',
                displayName: 'some display name',
                onSelect: () => null,
            },
            {
                key: 'needs-review',
                displayName: 'some display name 2',
                onSelect: () => null,
            },
        ];
        navLinkRendererStub = {
            renderVisualizationLink: _ => <>{'some link'}</>,
        } as NavLinkRenderer;
        props = {
            deps: {
                navLinkRenderer: navLinkRendererStub,
                leftNavItems: leftNavItemsStub,
            },
            selectedKey: 'automated-checks',
        };
    });

    test('render', () => {
        const testSubject = shallow(<LeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
