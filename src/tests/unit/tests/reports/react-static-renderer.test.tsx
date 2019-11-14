// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReactStaticRenderer } from 'reports/react-static-renderer';

describe('ReactStaticRendererTest', () => {
    test('render', () => {
        const element = (
            <div>
                <h1>Header</h1>
                <a href="https://url/">Link</a>
            </div>
        );

        const testObject = new ReactStaticRenderer();
        const actual = testObject.renderToStaticMarkup(element);

        const expected =
            '<div><h1>Header</h1><a href="https://url/">Link</a></div>';
        expect(actual).toEqual(expected);
    });
});
