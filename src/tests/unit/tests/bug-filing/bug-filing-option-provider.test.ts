// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingServiceProvider } from './../../../../bug-filing/bug-filing-service-provider';
import { BugFilingService } from './../../../../bug-filing/types/bug-filing-service';

describe('BugFilingServiceProviderTest', () => {
    test('constructor', () => {
        expect(new BugFilingServiceProvider([])).not.toBeNull();
    });

    test('all', () => {
        const testOptions: BugFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as BugFilingService,
        ];

        expect(new BugFilingServiceProvider(testOptions).all()).toEqual(testOptions);
    });
});
