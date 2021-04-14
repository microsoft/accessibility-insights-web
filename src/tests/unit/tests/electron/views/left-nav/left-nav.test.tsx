// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { LeftNavProps, LeftNav } from 'electron/views/left-nav/left-nav';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('LeftNav', () => {
    let leftNavItemsStub: LeftNavItem[];
    let navLinkRendererStub: NavLinkRenderer;
    let props: LeftNavProps;
    const featureFlagStoreData = { 'disabled-flag': false, 'enabled-flag': true };

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
                featureFlag: 'disabled-flag',
            },
            {
                key: 'needs-review',
                displayName: 'some display name 3',
                onSelect: () => null,
                featureFlag: 'enabled-flag',
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
            featureFlagStoreData,
            selectedKey: 'automated-checks',
        };
    });

    test('render', () => {
        const testSubject = shallow(<LeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
