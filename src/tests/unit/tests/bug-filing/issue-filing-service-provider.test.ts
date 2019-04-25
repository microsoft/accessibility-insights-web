// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingServiceProvider } from './../../../../issue-filing/issue-filing-service-provider';
import { BugFilingService } from './../../../../issue-filing/types/issue-filing-service';

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

    test('allVisible', () => {
        const givenTestOptions: BugFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as BugFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as BugFilingService,
        ];

        const expectedTestOptions = [givenTestOptions[0]];

        expect(new BugFilingServiceProvider(givenTestOptions).allVisible()).toEqual(expectedTestOptions);
    });

    test('forKey', () => {
        const givenTestOptions: BugFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as BugFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as BugFilingService,
        ];

        const expectedTestOption = givenTestOptions[0];

        expect(new BugFilingServiceProvider(givenTestOptions).forKey('github')).toEqual(expectedTestOption);
    });

    test('forKey: service not found', () => {
        const givenTestOptions: BugFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as BugFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as BugFilingService,
        ];

        expect(new BugFilingServiceProvider(givenTestOptions).forKey('invalid key')).not.toBeDefined();
    });
});
