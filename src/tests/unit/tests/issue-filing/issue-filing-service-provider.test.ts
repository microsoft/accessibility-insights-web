// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingServiceProvider } from './../../../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from './../../../../issue-filing/types/issue-filing-service';

describe('IssueFilingServiceProviderTest', () => {
    test('constructor', () => {
        expect(new IssueFilingServiceProvider([])).not.toBeNull();
    });

    test('all', () => {
        const testOptions: IssueFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as IssueFilingService,
        ];

        expect(new IssueFilingServiceProvider(testOptions).all()).toEqual(testOptions);
    });

    test('allVisible', () => {
        const givenTestOptions: IssueFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as IssueFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as IssueFilingService,
        ];

        const expectedTestOptions = [givenTestOptions[0]];

        expect(new IssueFilingServiceProvider(givenTestOptions).allVisible()).toEqual(
            expectedTestOptions,
        );
    });

    test('forKey', () => {
        const givenTestOptions: IssueFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as IssueFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as IssueFilingService,
        ];

        const expectedTestOption = givenTestOptions[0];

        expect(new IssueFilingServiceProvider(givenTestOptions).forKey('github')).toEqual(
            expectedTestOption,
        );
    });

    test('forKey: service not found', () => {
        const givenTestOptions: IssueFilingService[] = [
            {
                key: 'github',
                displayName: 'Github',
            } as IssueFilingService,
            {
                key: 'random key',
                displayName: 'random name',
                isHidden: true,
            } as IssueFilingService,
        ];

        expect(() =>
            new IssueFilingServiceProvider(givenTestOptions).forKey('invalid key'),
        ).toThrowError(/invalid key/);
    });
});
