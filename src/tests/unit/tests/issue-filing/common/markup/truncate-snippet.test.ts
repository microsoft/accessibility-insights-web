// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { repeat } from 'lodash';

import {
    maxSnippetLength,
    truncateSnippet,
} from '../../../../../../issue-filing/common/markup/truncate-snippet';

describe('truncateSnippet', () => {
    const testSubject = truncateSnippet;
    it('truncates long text', () => {
        const text = repeat('a', maxSnippetLength + 1);

        const result = testSubject(text);

        let expected = repeat('a', maxSnippetLength - 3);
        expected = expected + '...';

        expect(result).toEqual(expected);
    });

    it("doesn't truncate if not necessary", () => {
        const text = repeat('a', maxSnippetLength);

        const result = testSubject(text);

        expect(result).toEqual(text);
    });
});
