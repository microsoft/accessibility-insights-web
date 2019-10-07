// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { CopyIssueDetailsButton, CopyIssueDetailsButtonProps } from '../../../../../common/components/copy-issue-details-button';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';

describe('CopyIssueDetailsButtonTest', () => {
    let props: CopyIssueDetailsButtonProps;
    let onClickMock: IMock<(event: React.MouseEvent<any>) => void>;
    beforeEach(() => {
        onClickMock = Mock.ofInstance(e => {});
        props = {
            deps: {
                windowUtils: null,
                issueDetailsTextGenerator: {
                    buildText: _ => 'sample text',
                } as IssueDetailsTextGenerator,
            },
            issueDetailsData: {} as CreateIssueDetailsTextData,
            onClick: onClickMock.object,
        };
    });

    test('render', () => {
        const result = Enzyme.shallow(<CopyIssueDetailsButton {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render after click shows toast', () => {
        const result = Enzyme.shallow(<CopyIssueDetailsButton {...props} />);
        const button = result.find(DefaultButton);
        onClickMock.setup(m => m(It.isAny())).verifiable(Times.once());
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot();
        onClickMock.verifyAll();
    });
});
