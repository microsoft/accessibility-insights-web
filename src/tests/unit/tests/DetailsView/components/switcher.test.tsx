// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IDropdownOption } from '@fluentui/react';
import { InsightsDropdown } from 'common/components/insights-dropdown';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { Switcher, SwitcherProps } from 'DetailsView/components/switcher';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('Switcher', () => {
    let defaultProps: SwitcherProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        defaultProps = {
            pivotKey: DetailsViewPivotType.fastPass,
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
        };
    });

    describe('renders', () => {
        it('Switcher itself matches snapshot', () => {
            const renderer = shallow(<Switcher {...defaultProps} />);

            expect(renderer.debug()).toMatchSnapshot();
        });

        it('option renderer override matches snapshot ', () => {
            const renderer = shallow(<Switcher {...defaultProps} />);

            const dropdown = renderer.find(InsightsDropdown);

            const options = dropdown.prop('options');

            const onRenderOption = dropdown.prop('onRenderOption');

            expect(onRenderOption(options[0])).toMatchSnapshot();
        });
    });

    describe('props', () => {
        it('dropdown has correct options', () => {
            const renderer = shallow(<Switcher {...defaultProps} />);

            const dropdown = renderer.find(InsightsDropdown);

            expect(dropdown.prop('options')).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('triggers action message and state change when the user changes selection', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator =>
                    creator.sendPivotItemClicked(
                        DetailsViewPivotType[DetailsViewPivotType.assessment],
                    ),
                )
                .verifiable(Times.once());
            const wrapper = shallow<Switcher>(<Switcher {...defaultProps} />);
            const dropdown = wrapper.find(InsightsDropdown);

            expect(wrapper.state().selectedKey).toBe(DetailsViewPivotType.fastPass);

            dropdown.props().onChange(null, {
                key: DetailsViewPivotType.assessment,
            } as IDropdownOption);

            expect(wrapper.state().selectedKey).toBe(DetailsViewPivotType.assessment);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('componentDidUpdate', () => {
        it('pivotKey has changed', () => {
            const newProps = {
                ...defaultProps,
                pivotKey: DetailsViewPivotType.assessment,
            };
            const component = shallow(<Switcher {...newProps} />).instance() as Switcher;
            component.componentDidUpdate(defaultProps);
            expect(component.state).toMatchObject({ selectedKey: DetailsViewPivotType.assessment });
        });

        it('pivotKey has not changed', () => {
            const component = shallow(<Switcher {...defaultProps} />).instance() as Switcher;
            component.componentDidUpdate(defaultProps);
            expect(component.state).toMatchObject({ selectedKey: DetailsViewPivotType.fastPass });
        });
    });
});
