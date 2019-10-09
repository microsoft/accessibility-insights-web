// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { createGetApplicationProperties } from 'electron/common/application-properties-provider';
import { Mock } from 'typemoq';

describe('getApplicationProperties', () => {
    it('returns proper application properties', () => {
        const appDataAdapterMock = Mock.ofType<AppDataAdapter>();
        appDataAdapterMock.setup(adapter => adapter.getVersion()).returns(() => 'test-version');

        const testSubject = createGetApplicationProperties(appDataAdapterMock.object);

        const result = testSubject();

        expect(result).toMatchInlineSnapshot(`
            Object {
              "name": "Accessibility Insights for Android",
              "version": "test-version",
            }
        `);
    });
});
