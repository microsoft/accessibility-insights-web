// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
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

describe('getAutomatedChecksCommandBar ', () => {
    it('should return DetailsViewCommandBar with deps of reportExportComponentPropertyFactory and startOverComponentPropertyFactory', () => {
        const props = getProps();
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
