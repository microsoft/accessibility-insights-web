// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { CommandBarProps, DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';

function getProps(): CommandBarProps {
    const deps: DetailsViewCommandBarDeps = {
        reportExportComponentPropertyFactory: p => null,
        startOverComponentPropertyFactory: p => null,
    } as DetailsViewCommandBarDeps;

    const props = {
        deps: deps,
    } as CommandBarProps;

    return props;
}

describe('getAssessementCommandBar ', () => {
    it('should return DetailsViewCommandBar with deps of reportExportComponentPropertyFactory and startOverComponentPropertyFactory', () => {
        const props = getProps();
        const actual = shallow(<AssessmentCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
