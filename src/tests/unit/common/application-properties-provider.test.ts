// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from 'common/application-properties-provider';

describe('createToolData', () => {
    it('returns proper tool data', () => {
        const result = createToolData(
            'test-engine-name',
            'test-engine-version',
            'test-tool-name',
            'test-tool-version',
            'test-environment-name',
            'test-resolution',
        );

        expect(result).toMatchInlineSnapshot(`
            {
              "applicationProperties": {
                "environmentName": "test-environment-name",
                "name": "test-tool-name",
                "resolution": "test-resolution",
                "version": "test-tool-version",
              },
              "scanEngineProperties": {
                "name": "test-engine-name",
                "version": "test-engine-version",
              },
            }
        `);
    });
});
