// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DictionaryStringTo } from 'types/common-types';
import {
    CommandBarProps,
    CommandBarWithExportAndStartOver,
    CommandBarWithOptionalExportAndStartOver,
} from '../../../../../DetailsView/components/command-bars';

describe('getCommandBarWithExportAndStartOver', () => {
    it('should return command bar with renderExportAndStartOver as true', () => {
        const props = {
            assessmentsProvider: null,
        } as CommandBarProps;
        const actual = shallow(<CommandBarWithExportAndStartOver {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getCommandBarWithOptionalExportAndStartOver universalCardsUI disabled', () => {
    it('should return command bar with renderExportAndStartOver as false', () => {
        const featureFlags: DictionaryStringTo<boolean> = {
            universalCardsUI: false,
        };
        const props = {
            assessmentsProvider: null,
            featureFlagStoreData: featureFlags,
        } as CommandBarProps;
        const actual = shallow(<CommandBarWithOptionalExportAndStartOver {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('getCommandBarWithOptionalExportAndStartOver universalCardsUI enabled', () => {
    it('should return command bar with renderExportAndStartOver as true', () => {
        const featureFlags: DictionaryStringTo<boolean> = {
            universalCardsUI: true,
        };
        const props = {
            assessmentsProvider: null,
            featureFlagStoreData: featureFlags,
        } as CommandBarProps;
        const actual = shallow(<CommandBarWithOptionalExportAndStartOver {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
