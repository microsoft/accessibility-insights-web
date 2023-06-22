// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isResultHighlightUnavailableWeb } from 'common/is-result-highlight-unavailable';

describe('isResultHighlightUnavailableWeb', () => {
    test('should always be available', () => {
        expect(isResultHighlightUnavailableWeb(null, null)).toEqual(false);
    });
});
