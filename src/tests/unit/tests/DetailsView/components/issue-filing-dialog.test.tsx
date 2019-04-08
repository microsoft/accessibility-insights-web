// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    IssueFilingDialog,
    IssueFilingDialogDeps,
    IssueFilingDialogProps,
} from '../../../../../DetailsView/components/issue-filing-dialog';

describe('IssueFilingDialog', () => {
    it('renders open', () => {
        const deps: IssueFilingDialogDeps = {};
        const props: IssueFilingDialogProps = {
            deps,
            isOpen: true,
            onClose: null,
        };

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
