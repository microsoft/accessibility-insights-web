// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { Switcher, SwitcherProps } from 'DetailsView/components/switcher';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');
describe('Switcher', () => {
    mockReactComponents([Dropdown]);
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
            const renderResult = render(<Switcher {...defaultProps} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
        it('option renderer override matches snapshot', () => {
            render(<Switcher {...defaultProps} />);
            const options = getMockComponentClassPropsForCall(Dropdown).options;
            const renderOptions =
                getMockComponentClassPropsForCall(Dropdown).onRenderOption(options);
            expect(renderOptions).toMatchSnapshot();
        });
    });
    describe('props', () => {
        it('dropdown has correct options', () => {
            render(<Switcher {...defaultProps} />);

            const dropdown = getMockComponentClassPropsForCall(Dropdown);

            expect(dropdown.options).toMatchSnapshot();
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
            render(<Switcher {...defaultProps} />);
            const dropdown = getMockComponentClassPropsForCall(Dropdown);
            expect(dropdown.selectedKey).toBe(DetailsViewPivotType.fastPass);
            act(() =>
                dropdown.onChange(null, {
                    key: DetailsViewPivotType.assessment,
                } as IDropdownOption),
            );
            const dropdown2 = getMockComponentClassPropsForCall(Dropdown, 2);
            expect(dropdown2.selectedKey).toBe(DetailsViewPivotType.assessment);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });
    describe('componentDidUpdate', () => {
        const newProps = {
            ...defaultProps,
            pivotKey: DetailsViewPivotType.assessment,
        };
        it('pivotKey has changed', () => {
            useOriginalReactElements('@fluentui/react', ['Dropdown']);
            const component = render(<Switcher {...defaultProps} />);
            component.rerender(<Switcher {...newProps} />);
            expect(component.getByText('Assessment')).toBeTruthy();
        });
        it('pivotKey has not changed', () => {
            useOriginalReactElements('@fluentui/react', ['Dropdown']);
            const component = render(<Switcher {...defaultProps} />);
            component.rerender(<Switcher {...defaultProps} />);
            expect(component.getByText('FastPass')).toBeTruthy();
        });
    });
});
