// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
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
            navMenuAriaLabel: 'test-aria-label',
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
            navMenuAriaLabel: 'test-aria-label',
        };

        const rendered = shallow(<InteractiveHeader {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });
});
