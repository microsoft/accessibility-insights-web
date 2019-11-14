// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { rectify } from '../../../../../../issue-filing/services/github/github-url-rectifier';

describe('Github Url Rectifier', () => {
    const testSubject = rectify;

    const shouldAddSuffixTestCases = [
        'https://github.com/me/my-repo',
        'https://github.com/me/my-repo/',
        'http://github.com/me/my-repo',
        'http://github.com/me/my-repo/',
        // the following 2 cases represent real cases where the repo name is 'issues'
        // we still want to append the suffix in this cases
        'http://github.com/me/issues/',
        'http://github.com/me/issues',
    ];

    it.each(shouldAddSuffixTestCases)('should append to: %s', (url: string) => {
        const expected =
            url + (url[url.length - 1] === '/' ? 'issues' : '/issues');
        expect(testSubject(url)).toEqual(expected);
    });

    const shouldNotChangeTestCases = [
        'this doesnt match',
        'https://github.com/mine/my-repo/pull-request',
        'file://my-files/issue.text',
        'https://my-github-enterprise-url.com',
    ];

    it.each(shouldNotChangeTestCases)('should not change: %s', url => {
        expect(testSubject(url)).toEqual(url);
    });
});
