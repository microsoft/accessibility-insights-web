// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { Toast } from 'common/components/toast';
import { NavigatorUtils } from 'common/navigator-utils';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { WindowUtils } from 'common/window-utils';
import * as Enzyme from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    CopyIssueDetailsButton,
    CopyIssueDetailsButtonProps,
} from '../../../../../common/components/copy-issue-details-button';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';

describe('CopyIssueDetailsButtonTest', () => {
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
        const result = Enzyme.shallow(<CopyIssueDetailsButton {...props} />);
        expect(result.debug()).toMatchSnapshot();
    });
    describe('toast message', () => {
        test('render after click shows copy success message', async () => {
            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.resolve();
                })
                .verifiable(Times.once());

            const result = Enzyme.mount(<CopyIssueDetailsButton {...props} />);
            const button = result.find(DefaultButton);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            // tslint:disable-next-line: await-promise
            await button.simulate('click');

            const toast = result.find(Toast);

            expect(toast.state().toastVisible).toBe(true);
            expect(toast.state().content).toBe('Failure details copied.');

            verifyMocks();
        });
        test('render after click shows copy failure message', async () => {
            navigatorUtilsMock
                .setup(navigatorUtils => navigatorUtils.copyToClipboard(issueDetailsText))
                .returns(() => {
                    return Promise.reject();
                })
                .verifiable(Times.once());

            const result = Enzyme.mount(<CopyIssueDetailsButton {...props} />);
            const button = result.find(DefaultButton);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            // tslint:disable-next-line: await-promise
            await button.simulate('click');

            const toast = result.find(Toast);

            expect(toast.state().toastVisible).toBe(true);
            expect(toast.state().content).toBe('Failed to copy failure details. Please try again.');

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
            const result = Enzyme.mount(<CopyIssueDetailsButton {...props} />);
            const button = result.find(DefaultButton);
            onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
            // tslint:disable-next-line: await-promise
            await button.simulate('click');

            const toast = result.find(Toast);

            expect(toast.state().toastVisible).toBe(false);

            verifyMocks();
        });
    });

    function verifyMocks(): void {
        onClickMock.verifyAll();
        windowUtilsMock.verifyAll();
        navigatorUtilsMock.verifyAll();
    }
});
