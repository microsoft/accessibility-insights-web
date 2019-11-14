// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    IssueFilingNeedsSettingsHelpText,
    IssueFilingNeedsSettingsHelpTextProps,
} from '../../../../../common/components/issue-filing-needs-settings-help-text';

describe('IssueFilingNeedsSettingsHelpTextTest', () => {
    test.each([true, false])('render with isOpen = %s', isOpen => {
        const props: IssueFilingNeedsSettingsHelpTextProps = { isOpen: isOpen };
        const wrapper = shallow(
            <IssueFilingNeedsSettingsHelpText {...props} />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
