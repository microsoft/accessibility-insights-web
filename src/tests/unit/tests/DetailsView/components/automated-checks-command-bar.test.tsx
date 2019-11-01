// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import { DictionaryStringTo } from 'types/common-types';
import { CommandBarProps } from '../../../../../DetailsView/components/details-view-command-bar';

describe('getAutomatedChecksCommandBar universalCardsUI disabled', () => {
    it('should return command bar with renderExportAndStartOver as false', () => {
        const featureFlags: DictionaryStringTo<boolean> = {
            universalCardsUI: false,
        };
        const props = {
            assessmentsProvider: null,
            featureFlagStoreData: featureFlags,
        } as CommandBarProps;
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getAutomatedChecksCommandBar universalCardsUI enabled', () => {
    it('should return command bar with renderExportAndStartOver as true', () => {
        const featureFlags: DictionaryStringTo<boolean> = {
            universalCardsUI: true,
        };
        const props = {
            assessmentsProvider: null,
            featureFlagStoreData: featureFlags,
        } as CommandBarProps;
        const actual = shallow(<AutomatedChecksCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
