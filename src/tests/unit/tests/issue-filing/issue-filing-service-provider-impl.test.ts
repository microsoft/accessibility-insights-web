// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { uniq } from 'lodash';
import { IssueFilingServiceProviderImpl } from '../../../../issue-filing/issue-filing-service-provider-impl';

describe('Name of the group', () => {
    test('unique key across issue filing services', () => {
        const all = IssueFilingServiceProviderImpl.all();

        const keys = all.map(current => current.key);

        expect(uniq(keys)).toEqual(keys);
    });
});
