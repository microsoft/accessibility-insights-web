// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { BasicCommandBar, CommandBarProps, CommandBarWithExportAndStartOver } from '../../../../../DetailsView/components/command-bars';

describe('getCommandBarWithExportAndStartOver', () => {
    it('should return command bar with renderExportAndStartOver as true', () => {
        const props = {
            deps: {
                assessmentsProvider: null,
            },
        } as CommandBarProps;
        const actual = shallow(<CommandBarWithExportAndStartOver {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getBasicCommandBar', () => {
    it('should return command bar with renderExportAndStartOver as false', () => {
        const props = {
            deps: {
                assessmentsProvider: null,
            },
        } as CommandBarProps;
        const actual = shallow(<BasicCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
