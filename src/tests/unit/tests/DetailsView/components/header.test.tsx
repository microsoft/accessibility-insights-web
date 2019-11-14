// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import {
    Header,
    HeaderProps,
} from '../../../../../DetailsView/components/header';

describe('HeaderTest', () => {
    test('render: tabClosed is false', () => {
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
        const props: HeaderProps = {
            dropdownClickHandler: dropdownClickHandlerMock.object,
            featureFlagStoreData: {
                'test-flag': true,
            },
            avatarUrl: 'avatarUrl',
            tabClosed: false,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render: tabClosed is true', () => {
        const props: HeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: {
                'test-flag': true,
            },
            connected: null,
            avatarUrl: null,
            tabClosed: true,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render: no feature flag store data', () => {
        const props: HeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: null,
            connected: null,
            avatarUrl: null,
            tabClosed: true,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });
});
