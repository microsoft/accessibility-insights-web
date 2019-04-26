// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { uniq } from 'lodash';
import { BugFilingServiceProviderImpl } from '../../../../bug-filing/bug-filing-service-provider-impl';

describe('Name of the group', () => {
    it('holds unique key services', () => {
        const all = BugFilingServiceProviderImpl.all();

        const keys = all.map(current => current.key);

        const uniqueKeys = uniq(keys);

        expect(uniqueKeys).toEqual(keys);
    });
});
