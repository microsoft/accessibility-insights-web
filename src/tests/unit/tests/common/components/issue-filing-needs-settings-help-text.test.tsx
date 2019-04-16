// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    IssueFilinigNeedsSettingsHelpText,
    IssueFilinigNeedsSettingsHelpTextProps,
} from '../../../../../common/components/needs-settings-help-text';

describe('IssueFilinigNeedsSettingsHelpTextTest', () => {
    test.each([true, false])('render with isOpen = %s', isOpen => {
        const props: IssueFilinigNeedsSettingsHelpTextProps = { isOpen: isOpen };
        const wrapper = shallow(<IssueFilinigNeedsSettingsHelpText {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
