// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { userEvent } from '@testing-library/user-event';

import { render } from '@testing-library/react';
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

            const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        describe('handles failures count', () => {
            it('0 failures', () => {
                controlProps.failuresCount = 0;

                const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('1 failure', () => {
                controlProps.failuresCount = 1;

                const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('multiple failures', () => {
                controlProps.failuresCount = 5;

                const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });

    describe('user interaction', () => {
        it('handles next button activation', async () => {
            const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

            const nextButton = renderResult.getByRole('button', {
                name: /Next/i
            });
            expect(nextButton).not.toBeNull();
            //expect(nextButton).toHaveLength(1);

            await userEvent.click(nextButton);

            navigationHandlerMock.verify(
                handler => handler.nextButtonClickHandler(controlProps.container),
                Times.once(),
            );
        });

        it('handles back button activation', async () => {
            const renderResult = render(<IssueDetailsNavigationControls {...controlProps} />);

            const backButton = renderResult.getByRole('button', {
                name: /Back/i
            });

            expect(backButton).not.toBeNull();
            //expect(backButton).toHaveLength(1);

            await userEvent.click(backButton);

            navigationHandlerMock.verify(
                handler => handler.backButtonClickHandler(controlProps.container),
                Times.once(),
            );
        });
    });
});
