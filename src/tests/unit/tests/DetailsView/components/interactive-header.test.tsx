// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExpandCollpaseLeftNavButtonProps } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import {
    InteractiveHeader,
    InteractiveHeaderDeps,
    InteractiveHeaderProps,
} from 'DetailsView/components/interactive-header';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InteractiveHeader', () => {
    let navMenuStub: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;

    beforeEach(() => {
        navMenuStub = NamedFC<ExpandCollpaseLeftNavButtonProps>('test-nav-menu', _ => null);
    });

    it.each([false, true])('render: tabClosed is %s', tabClosed => {
        const dropdownClickHandlerStub = {} as DropdownClickHandler;
        const props: InteractiveHeaderProps = {
            featureFlagStoreData: {
                'test-flag': true,
            },
            avatarUrl: 'avatarUrl',
            tabClosed,
            deps: {
                dropdownClickHandler: dropdownClickHandlerStub,
            } as InteractiveHeaderDeps,
            selectedPivot: DetailsViewPivotType.assessment,
            navMenu: navMenuStub,
            isNarrowMode: false,
            isSideNavOpen: false,
            setSideNavOpen: null,
        };

        const rendered = shallow(<InteractiveHeader {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('does render nav menu button if not in narrow mode', () => {
        const props: InteractiveHeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: null,
            connected: null,
            avatarUrl: null,
            tabClosed: false,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
            navMenu: navMenuStub,
            isNarrowMode: true,
            isSideNavOpen: false,
            setSideNavOpen: null,
        };

        const rendered = shallow(<InteractiveHeader {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
