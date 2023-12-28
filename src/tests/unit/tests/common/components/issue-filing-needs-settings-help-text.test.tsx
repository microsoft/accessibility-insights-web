// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    IssueFilingNeedsSettingsHelpText,
    IssueFilingNeedsSettingsHelpTextProps,
} from '../../../../../common/components/issue-filing-needs-settings-help-text';

describe('IssueFilingNeedsSettingsHelpTextTest', () => {
    test.each([true, false])('render with isOpen = %s', isOpen => {
        const props: IssueFilingNeedsSettingsHelpTextProps = { isOpen: isOpen };
        const renderResult = render(<IssueFilingNeedsSettingsHelpText {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
