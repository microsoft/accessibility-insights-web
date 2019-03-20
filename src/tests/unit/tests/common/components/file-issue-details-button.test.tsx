// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { IssueDetailsTextGenerator } from '../../../../../background/issue-details-text-generator';
import { FileIssueDetailsButton, FileIssueDetailsButtonProps } from '../../../../../common/components/file-issue-details-button';
import { BugActionMessageCreator } from '../../../../../common/message-creators/bug-action-message-creator';

describe('FileIssueDetailsButtonTest', () => {
    test('render and click with an issue tracker path', () => {
        const issueTrackerPath = 'https://github.com/example/example/issues';

        const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildTitle(It.isAny()))
            .returns(() => 'buildTitle')
            .verifiable();
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildGithubText(It.isAny()))
            .returns(() => 'buildText')
            .verifiable();

        const bugActionMessageCreatorMock = Mock.ofType(BugActionMessageCreator);
        bugActionMessageCreatorMock
            .setup(messageCreator => messageCreator.trackFileIssueClick(It.isAny(), 'gitHub'))
            .verifiable(Times.once());

        const props: FileIssueDetailsButtonProps = {
            deps: {
                issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
                bugActionMessageCreator: bugActionMessageCreatorMock.object,
            },
            issueTrackerPath: issueTrackerPath,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
            restoreFocus: false,
        };
        const wrapper = shallow(<FileIssueDetailsButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        issueDetailsTextGeneratorMock.verifyAll();

        wrapper.find(DefaultButton).simulate('click');
        bugActionMessageCreatorMock.verifyAll();
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render and click without issue tracker set', () => {
        const issueTrackerPath = '';

        const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildTitle(It.isAny()))
            .returns(() => 'buildTitle')
            .verifiable(Times.never());
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildGithubText(It.isAny()))
            .returns(() => 'buildText')
            .verifiable(Times.never());

        const bugActionMessageCreatorMock = Mock.ofType(BugActionMessageCreator);
        bugActionMessageCreatorMock
            .setup(messageCreator => messageCreator.trackFileIssueClick(It.isAny(), 'none'))
            .verifiable(Times.once());

        const props: FileIssueDetailsButtonProps = {
            deps: {
                issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
                bugActionMessageCreator: bugActionMessageCreatorMock.object,
            },
            onOpenSettings: (ev: React.MouseEvent<HTMLElement>) => {},
            issueTrackerPath: issueTrackerPath,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
            restoreFocus: false,
        };
        const wrapper = shallow(<FileIssueDetailsButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        issueDetailsTextGeneratorMock.verifyAll();

        wrapper.find(DefaultButton).simulate('click');
        bugActionMessageCreatorMock.verifyAll();
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('componentDidUpdate', () => {
        type TestCase = {
            issueTrackerPath: string;
            initialShowingHelpText: boolean;
            expectedShowingHelpText: boolean;
        };
        const testCases: Array<TestCase> = [
            {
                issueTrackerPath: 'not-empty',
                initialShowingHelpText: false,
                expectedShowingHelpText: false,
            },
            {
                issueTrackerPath: undefined,
                initialShowingHelpText: true,
                expectedShowingHelpText: true,
            },
            {
                issueTrackerPath: '',
                initialShowingHelpText: true,
                expectedShowingHelpText: true,
            },
            {
                issueTrackerPath: 'not-empty',
                initialShowingHelpText: true,
                expectedShowingHelpText: false,
            },
        ];

        test.each(testCases)('%p', (testCase: TestCase) => {
            const { issueTrackerPath, initialShowingHelpText, expectedShowingHelpText } = testCase;

            const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
            if (issueTrackerPath) {
                issueDetailsTextGeneratorMock
                    .setup(generator => generator.buildTitle(It.isAny()))
                    .returns(() => 'buildTitle')
                    .verifiable(Times.atLeastOnce());
                issueDetailsTextGeneratorMock
                    .setup(generator => generator.buildGithubText(It.isAny()))
                    .returns(() => 'buildText')
                    .verifiable(Times.atLeastOnce());
            }

            const props: FileIssueDetailsButtonProps = {
                deps: {
                    issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
                    bugActionMessageCreator: undefined,
                },
                onOpenSettings: undefined,
                issueTrackerPath,
                issueDetailsData: {
                    pageTitle: 'pageTitle',
                    pageUrl: 'http://pageUrl',
                    ruleResult: null,
                },
                restoreFocus: undefined,
            };

            const testSubject = shallow(<FileIssueDetailsButton {...props} />).instance();
            testSubject.state = { showingHelpText: initialShowingHelpText, showingFileIssueDialog: false };

            testSubject.componentDidUpdate(undefined, undefined);

            expect(testSubject.state.showingHelpText).toBe(expectedShowingHelpText);
            issueDetailsTextGeneratorMock.verifyAll();
        });
    });
});
