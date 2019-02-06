// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { Header, HeaderProps } from '../../../../../DetailsView/components/header';

describe('HeaderTest', () => {
    test('render header: tabClosed is false, new assessment experience enabled', () => {
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
        const props: HeaderProps = {
            dropdownClickHandler: dropdownClickHandlerMock.object,
            featureFlagStoreData: {
                [FeatureFlags.newAssessmentExperience]: true,
            },
            avatarUrl: 'avatarUrl',
            tabClosed: false,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render header: target tabClosed is true, new assessment experience enabled', () => {
        const props: HeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: {
                [FeatureFlags.newAssessmentExperience]: true,
            },
            connected: null,
            avatarUrl: null,
            tabClosed: true,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render header: no feature flag store data', () => {
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

    test('render header: new assessment experience disabled', () => {
        const props: HeaderProps = {
            dropdownClickHandler: null,
            featureFlagStoreData: {
                [FeatureFlags.newAssessmentExperience]: false,
            },
            connected: null,
            avatarUrl: null,
            tabClosed: false,
            deps: null,
            selectedPivot: DetailsViewPivotType.assessment,
        };

        const rendered = shallow(<Header {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });
});
