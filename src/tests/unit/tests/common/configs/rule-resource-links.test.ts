// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getRuleResourceUrl } from 'common/configs/rule-resource-links';

describe(getRuleResourceUrl, () => {
    const ruleIdWithResource = 'rule-id';
    const resourcePath = 'https://base/resource/path';
    const rulesList = [ruleIdWithResource];

    it('for rule that has a resource', () => {
        const defaultUrl = 'default url';
        const expectedUrl = `${resourcePath}/${ruleIdWithResource}`;

        const resourceUrl = getRuleResourceUrl(
            ruleIdWithResource,
            rulesList,
            resourcePath,
            defaultUrl,
        );

        expect(resourceUrl).toBe(expectedUrl);
    });

    it('for rule that does not have a resource', () => {
        const defaultUrl = 'default url';
        const ruleIdWithoutResource = 'another-rule-id';

        const resourceUrl = getRuleResourceUrl(
            ruleIdWithoutResource,
            rulesList,
            resourcePath,
            defaultUrl,
        );

        expect(resourceUrl).toBe(defaultUrl);
    });
});
