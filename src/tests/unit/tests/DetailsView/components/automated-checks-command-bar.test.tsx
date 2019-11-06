// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { DictionaryStringTo } from 'types/common-types';

function getProps(enableCardsUI: boolean, returnCommandBarProps: boolean): CommandBarProps {
    const featureFlags: DictionaryStringTo<boolean> = {
        universalCardsUI: enableCardsUI,
    };

    const reporExportComponentProps = returnCommandBarProps ? {} : null;

    const props = {
        featureFlagStoreData: featureFlags,
        reportExportComponentPropertyFactory: commandBarProps => reporExportComponentProps,
    } as CommandBarProps;

    return props;
}

describe('getAutomatedChecksCommandBar reportExportComponentPropertyFactory returns null and universalCardsUi is false', () => {
    it('should return command bar with reportExportComponentProps as null and renderStartOver as false', () => {
        const props = getProps(false, false);
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getAutomatedChecksCommandBar reportExportComponentPropertyFactory returns non-null and universalCardsUi is false', () => {
    it('should return command bar with reportExportComponentProps as null and renderStartOver as false', () => {
        const props = getProps(false, true);
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getAutomatedChecksCommandBar reportExportComponentPropertyFactory returns null and universalCardsUi is true', () => {
    it('should return command bar with reportExportComponentProps as null and renderAndStartOver as true', () => {
        const props = getProps(true, false);
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
