// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from '../../../common/tool-data-creator';

describe('createToolData', () => {
    it('returns proper tool data', () => {
        const result = createToolData(
            'test-version',
            'test-axe-version',
            'axe-core',
            'Accessibility Insights for Web',
            'test-browser-spec',
        );

        expect(result).toMatchInlineSnapshot(`
            Object {
              "applicationProperties": Object {
                "environmentName": "test-browser-spec",
                "name": "Accessibility Insights for Web",
                "version": "test-version",
              },
              "scanEngineProperties": Object {
                "name": "axe-core",
                "version": "test-axe-version",
              },
            }
        `);
    });
});
