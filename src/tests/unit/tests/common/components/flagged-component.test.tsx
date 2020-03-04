// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    FlaggedComponent,
    FlaggedComponentProps,
} from '../../../../../common/components/flagged-component';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';

describe('FlaggedComponentTest', () => {
    const flagName: string = 'TestFlaggedComponentTest';
    const className: string = 'find-me';
    const divText: string = 'Flagged Component';
    const jsxElement: JSX.Element = <div className={className}>{divText}</div>;

    test('render for feature enable', () => {
        const featureFlagStoreData: FeatureFlagStoreData = {};
        featureFlagStoreData[flagName] = true;

        const props: FlaggedComponentProps = {
            featureFlagStoreData: featureFlagStoreData,
            featureFlag: flagName,
            enableJSXElement: jsxElement,
        };

        const wrapper = shallow(<FlaggedComponent {...props} />);

        const div = wrapper.find(`.${className}`);
        expect(div.exists()).toBeTruthy();
        expect(div.text()).toBe(divText);
    });

    test('render for feature disable', () => {
        const featureFlagStoreData: FeatureFlagStoreData = {};
        featureFlagStoreData[flagName] = false;

        const props: FlaggedComponentProps = {
            featureFlagStoreData: featureFlagStoreData,
            featureFlag: FeatureFlags[flagName],
            enableJSXElement: null,
            disableJSXElement: jsxElement,
        };

        const wrapper = shallow(<FlaggedComponent {...props} />);

        const div = wrapper.find(`.${className}`);
        expect(div.exists()).toBe(true);
        expect(div.text()).toBe(divText);
    });

    test('render for feature disable with no disableJSXElement', () => {
        const props: FlaggedComponentProps = {
            featureFlagStoreData: null,
            featureFlag: FeatureFlags[flagName],
            enableJSXElement: jsxElement,
        };

        const wrapper = shallow(<FlaggedComponent {...props} />);

        expect(wrapper.children().length).toBe(0);
    });
});
