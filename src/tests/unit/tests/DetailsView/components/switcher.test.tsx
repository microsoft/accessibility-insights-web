// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { Switcher, SwitcherProps } from 'DetailsView/components/switcher';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('Switcher', () => {
    let defaultProps: SwitcherProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    const quickAssessFeatureFlag = 'quickAssess';

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        defaultProps = {
            pivotKey: DetailsViewPivotType.fastPass,
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            featureFlagStoreData: {},
        };
    });

    describe('renders', () => {
        it.each([true, false])(
            'Switcher itself matches snapshot when quick assess feature flag is %s',
            featureFlagValue => {
                defaultProps.featureFlagStoreData[quickAssessFeatureFlag] = featureFlagValue;
                const renderer = shallow(<Switcher {...defaultProps} />);

                expect(renderer.debug()).toMatchSnapshot();
            },
        );

        it.each([true, false])(
            'option renderer override matches snapshotm when quick assess feature flag is %s',
            featureFlagValue => {
                defaultProps.featureFlagStoreData[quickAssessFeatureFlag] = featureFlagValue;

                const renderer = shallow(<Switcher {...defaultProps} />);

                const dropdown = renderer.find(Dropdown);

                const options = dropdown.prop('options');

                const onRenderOption = dropdown.prop('onRenderOption');

                expect(onRenderOption(options[0])).toMatchSnapshot();
            },
        );
    });

    describe('props', () => {
        it.each([true, false])(
            'dropdown has correct options when quick assess feature flag is %s',
            featureFlagValue => {
                defaultProps.featureFlagStoreData[quickAssessFeatureFlag] = featureFlagValue;

                const renderer = shallow(<Switcher {...defaultProps} />);

                const dropdown = renderer.find(Dropdown);

                expect(dropdown.prop('options')).toMatchSnapshot();
            },
        );
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
            const dropdown = wrapper.find(Dropdown);

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
