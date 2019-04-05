// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingOptionProvider } from './../../../../bug-filing/bug-filing-option-provider';
import { BugFilingOption } from './../../../../bug-filing/types/bug-filing-option';

describe('BugFilingOptionProviderTest', () => {
    test('constructor', () => {
        expect(new BugFilingOptionProvider([])).not.toBeNull();
    });

    test('all', () => {
        const testOptions: BugFilingOption[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as BugFilingOption,
        ];

        expect(new BugFilingOptionProvider(testOptions).all()).toEqual(testOptions);
    });
});
