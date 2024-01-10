// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { NavigatorUtils } from 'common/navigator-utils';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { WindowUtils } from 'common/window-utils';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';
import { CopyIcon } from '../../../../../../src/common/icons/copy-icon';
import {
    CopyIssueDetailsButton,
    CopyIssueDetailsButtonProps,
} from '../../../../../common/components/copy-issue-details-button';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';

jest.mock('../../../../../../src/common/icons/copy-icon');
describe('CopyIssueDetailsButtonTest', () => {
    mockReactComponents([CopyIcon]);
    let props: CopyIssueDetailsButtonProps;
    let onClickMock: IMock<(event: React.MouseEvent<any>) => void>;
    let windowUtilsMock: IMock<WindowUtils>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;
    const issueDetailsText = 'placeholder text';
    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

    beforeEach(() => {
        onClickMock = Mock.ofInstance(e => {});
        windowUtilsMock = Mock.ofType<WindowUtils>();
        navigatorUtilsMock = Mock.ofType<NavigatorUtils>();
        props = {
            deps: {
                windowUtils: windowUtilsMock.object,
                navigatorUtils: navigatorUtilsMock.object,
                issueDetailsTextGenerator: {
                    buildText: (_, __) => issueDetailsText,
                } as IssueDetailsTextGenerator,
                toolData,
            },
            issueDetailsData: {} as CreateIssueDetailsTextData,
            onClick: onClickMock.object,
            hasSecureTargetPage: true,
        };
    });

    test('render', () => {
        const result = render(<CopyIssueDetailsButton {...props} />);
        expect(result.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CopyIcon]);
    });
    describe('toast message', () => {
        test('render after click shows copy success message', async () => {
            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.resolve();
                })
                .verifiable(Times.once());

            const result = render(<CopyIssueDetailsButton {...props} />);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            await userEvent.click(result.getByRole('button'));

            const toast = result.container.querySelector('.toastContainer');
            expect(toast).toBeInTheDocument();
            expect(toast).toHaveTextContent('Failure details copied.');

            verifyMocks();
        });
        test('render after click shows copy failure message', async () => {
            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.reject();
                })
                .verifiable(Times.once());

            const result = render(<CopyIssueDetailsButton {...props} />);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            // tslint:disable-next-line: await-promise
            await userEvent.click(result.getByRole('button'));

            const toast = result.container.querySelector('.toastContainer');
            expect(toast).toBeInTheDocument();
            expect(toast).toHaveTextContent('Failed to copy failure details. Please try again.');

            verifyMocks();
        });
        test('does not show toast message for insecure origin', async () => {
            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.reject();
                })
                .verifiable(Times.once());
            props.hasSecureTargetPage = false;
            const result = render(<CopyIssueDetailsButton {...props} />);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            // tslint:disable-next-line: await-promise
            await userEvent.click(result.getByRole('button'));

            const toast = result.container.querySelector('.toastContainer');
            expect(toast).toBeInTheDocument();

            verifyMocks();
        });
    });

    function verifyMocks(): void {
        onClickMock.verifyAll();
        windowUtilsMock.verifyAll();
        navigatorUtilsMock.verifyAll();
    }
});
