// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { DetailsDialog } from '../../../../../injected/components/details-dialog';
import {
    IssueDetailsNavigationClickHandler,
    IssueDetailsNavigationControls,
    IssueDetailsNavigationControlsProps,
} from '../../../../../injected/components/issue-details-navigation-controls';

describe('IssueDetailsNavigationControls', () => {
    let controlProps: IssueDetailsNavigationControlsProps;
    let navigationHandlerMock: IMock<IssueDetailsNavigationClickHandler>;

    beforeEach(() => {
        navigationHandlerMock = Mock.ofType<IssueDetailsNavigationClickHandler>();
        controlProps = {
            container: Mock.ofType<DetailsDialog>().object,
            dialogHandler: navigationHandlerMock.object,
            featureFlagStoreData: {},
            failuresCount: 5,
        };
    });

    describe('render', () => {
        type ButtonStateTestCase = {
            backButtonDisabled: boolean;
            nextButtonDisabled: boolean;
        };

        const testCases: ButtonStateTestCase[] = [
            {
                backButtonDisabled: true,
                nextButtonDisabled: true,
            },
            {
                backButtonDisabled: true,
                nextButtonDisabled: false,
            },
            {
                backButtonDisabled: false,
                nextButtonDisabled: true,
            },
            {
                backButtonDisabled: false,
                nextButtonDisabled: false,
            },
        ];

        it.each(testCases)('handles button states: %p', testCase => {
            navigationHandlerMock
                .setup(handler => handler.isBackButtonDisabled(controlProps.container))
                .returns(() => testCase.backButtonDisabled);

            navigationHandlerMock
                .setup(handler => handler.isNextButtonDisabled(controlProps.container))
                .returns(() => testCase.nextButtonDisabled);

            const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        describe('handles failures count', () => {
            it('0 failures', () => {
                controlProps.failuresCount = 0;

                const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('1 failure', () => {
                controlProps.failuresCount = 1;

                const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('multiple failures', () => {
                controlProps.failuresCount = 5;

                const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });
    });

    describe('user interaction', () => {
        it('handles next button activation', () => {
            const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

            const nextButton = wrapper.find({ 'data-automation-id': 'next' });

            expect(nextButton).not.toBeNull();
            expect(nextButton).toHaveLength(1);

            nextButton.simulate('click');

            navigationHandlerMock.verify(
                handler => handler.nextButtonClickHandler(controlProps.container),
                Times.once(),
            );
        });

        it('handles back button activation', () => {
            const wrapper = shallow(<IssueDetailsNavigationControls {...controlProps} />);

            const backButton = wrapper.find({ 'data-automation-id': 'back' });

            expect(backButton).not.toBeNull();
            expect(backButton).toHaveLength(1);

            backButton.simulate('click');

            navigationHandlerMock.verify(
                handler => handler.backButtonClickHandler(controlProps.container),
                Times.once(),
            );
        });
    });
});
