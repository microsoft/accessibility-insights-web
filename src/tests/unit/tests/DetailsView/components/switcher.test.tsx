// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { Switcher, SwitcherProps } from '../../../../../DetailsView/components/switcher';

describe('Switcher', () => {
    let defaultProps: SwitcherProps;
    let actionCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        actionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        defaultProps = {
            pivotKey: DetailsViewPivotType.fastPass,
            deps: {
                detailsViewActionMessageCreator: actionCreatorMock.object,
            },
        };
    });


    test('render', () => {

        const renderer = shallow(<Switcher {...defaultProps} />);

        expect(renderer.debug()).toMatchSnapshot();
    });

    test('render options', () => {
        const renderer = shallow(<Switcher {...defaultProps} />);
        renderer.find(Dropdown).simulate('click');

        expect(renderer.debug()).toMatchSnapshot();

    });

    test('onOptionClick', () => {
        actionCreatorMock
            .setup(creator => creator.sendPivotItemClicked(DetailsViewPivotType[DetailsViewPivotType.fastPass]))
            .verifiable(Times.once());
        const renderer = shallow(<Switcher {...defaultProps} />);

        renderer.find(Dropdown).props().onChange(null, {
            data: {
                key: DetailsViewPivotType.fastPass,
            },
        } as any);

        actionCreatorMock.verifyAll();
    });
});
