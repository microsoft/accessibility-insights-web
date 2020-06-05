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
import { Mock } from 'typemoq';

describe('InteractiveHeader', () => {
    let navMenuStub: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;

    beforeEach(() => {
        navMenuStub = NamedFC<ExpandCollpaseLeftNavButtonProps>('test-nav-menu', _ => null);
    });

    it.each([false, true])('render: tabClosed is %s', tabClosed => {
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
        const props: InteractiveHeaderProps = {
            featureFlagStoreData: {
                'test-flag': true,
            },
            avatarUrl: 'avatarUrl',
            tabClosed,
            deps: {
                dropdownClickHandler: dropdownClickHandlerMock.object,
            } as InteractiveHeaderDeps,
            selectedPivot: DetailsViewPivotType.assessment,
            navMenu: navMenuStub,
            isNarrowMode: false,
        };

        const rendered = shallow(<InteractiveHeader {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render: no feature flag store data', () => {
        const props: InteractiveHeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: null,
            connected: null,
            avatarUrl: null,
            tabClosed: true,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
            navMenu: navMenuStub,
            isNarrowMode: false,
        };

        const rendered = shallow(<InteractiveHeader {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });
});
