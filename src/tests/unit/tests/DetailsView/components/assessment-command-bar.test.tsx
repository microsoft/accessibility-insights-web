// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';

function getProps(returnCommandBarProps: boolean): CommandBarProps {
    const reportExportComponentProps = returnCommandBarProps ? {} : null;

    const props = {
        reportExportComponentPropertyFactory: commandBarProps => reportExportComponentProps,
    } as CommandBarProps;

    return props;
}

describe('getAutomatedChecksCommandBar reportExportComponentPropertyFactory returns null', () => {
    it('should return command bar with renderExportComponentProps as null and renderStartOver as true', () => {
        const props = getProps(false);
        const actual = shallow(<AssessmentCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getAutomatedChecksCommandBar reportExportComponentPropertyFactory returns non-null', () => {
    it('should return command bar with renderExportComponentProps as non-null and renderStartOver as true', () => {
        const props = getProps(true);
        const actual = shallow(<AssessmentCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
