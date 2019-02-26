// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { FileIssueDetailsButton, FileIssueDetailsButtonProps } from '../../../../../common/components/file-issue-details-button';
import { IssueDetailsTextGenerator } from '../../../../../background/issue-details-text-generator';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';

describe('FileIssueDetailsButtonTest', () => {
    test('render with an issue tracker path', () => {
        const issueTrackerPath = 'https://github.com/example/example/issues';

        const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildTitle(It.isAny()))
            .returns(() => 'buildTitle')
            .verifiable();
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildText(It.isAny()))
            .returns(() => 'buildText')
            .verifiable();

        const props: FileIssueDetailsButtonProps = {
            deps: {
                issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
            },
            onOpenSettings: (ev: React.MouseEvent<HTMLElement>) => {},
            issueTrackerPath: issueTrackerPath,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
        };
        const wrapper = shallow(<FileIssueDetailsButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        issueDetailsTextGeneratorMock.verifyAll();
    });

    test('render without issue tracker set', () => {
        const issueTrackerPath = '';

        const issueDetailsTextGeneratorMock = Mock.ofType(IssueDetailsTextGenerator);
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildTitle(It.isAny()))
            .returns(() => 'buildTitle')
            .verifiable(Times.never());
        issueDetailsTextGeneratorMock
            .setup(generator => generator.buildText(It.isAny()))
            .returns(() => 'buildText')
            .verifiable(Times.never());

        const props: FileIssueDetailsButtonProps = {
            deps: {
                issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
            },
            onOpenSettings: (ev: React.MouseEvent<HTMLElement>) => {},
            issueTrackerPath: issueTrackerPath,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
        };
        const wrapper = shallow(<FileIssueDetailsButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        issueDetailsTextGeneratorMock.verifyAll();
    });
});
