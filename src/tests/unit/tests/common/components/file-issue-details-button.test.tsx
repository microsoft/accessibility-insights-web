// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
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

    test('componentDidUpdate preserves state when showingHelpText not set', () => {
        const props = { issueTrackerPath: 'not-empty' } as FileIssueDetailsButtonProps;
        const testSubject = new FileIssueDetailsButton(props);
        testSubject.state = { showingHelpText: false, showingFileIssueDialog: false };

        testSubject.componentDidUpdate();

        expect(testSubject.state.showingHelpText).toBe(false);
    });

    test('componentDidUpdate preserves state when issueTrackerPath not set', () => {
        const props = { issueTrackerPath: undefined } as FileIssueDetailsButtonProps;
        const testSubject = new FileIssueDetailsButton(props);
        testSubject.state = { showingHelpText: true, showingFileIssueDialog: false };

        testSubject.componentDidUpdate();

        expect(testSubject.state.showingHelpText).toBe(true);
    });

    test('componentDidUpdate preserves state when issueTrackerPath is empty', () => {
        const props = { issueTrackerPath: '' } as FileIssueDetailsButtonProps;
        const testSubject = new FileIssueDetailsButton(props);
        testSubject.state = { showingHelpText: true, showingFileIssueDialog: false };

        testSubject.componentDidUpdate();

        expect(testSubject.state.showingHelpText).toBe(true);
    });

    test('componentDidUpdate clears state when issueTrackerPath set', () => {
        // TODO: Refactor props generation to share across tests
        const issueTrackerPath = 'not-empty';

        const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildTitle(It.isAny()))
            .returns(() => 'buildTitle')
            .verifiable(Times.never());
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildGithubText(It.isAny()))
            .returns(() => 'buildText')
            .verifiable(Times.never());

        const props: FileIssueDetailsButtonProps = {
            deps: {
                issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
                bugActionMessageCreator: undefined,
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

        const testSubject = shallow(<FileIssueDetailsButton {...props} />).instance();
        testSubject.state = { showingHelpText: true, showingFileIssueDialog: false } as any;

        testSubject.componentDidUpdate(undefined, undefined);

        expect((testSubject.state as any).showingHelpText).toBe(false);
    });
});
