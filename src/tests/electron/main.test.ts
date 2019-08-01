// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { Application } from 'spectron';

describe('Electron E2E', () => {
    let app: Application;

    beforeAll(() => {
        const electronPath = `${(global as any).rootDir}/drop/electron/extension/bundle/main.bundle.js`;
        app = new Application({
            path: Electron as any,
            args: [electronPath],
        });

        return app.start();
    });

    test('test that app opened & loaded site', () => {
        return Promise.resolve(app.browserWindow.isVisible())
            .then(function(isVisible: boolean): void {
                expect(isVisible).toBe(true);
            })
            .then(function(): Promise<number> {
                return app.client.getWindowCount();
            })
            .then(function(count: number): void {
                expect(count).toBe(2);
            })
            .then(function(): string {
                return app.webContents.getTitle();
            })
            .then(function(title: string): void {
                expect(title).toBe('Accessible University Demo Site - Inaccessible Version');
            })
            .catch(function(error: Error): void {
                console.error('Test failed', error.message);
                expect(error).toBeNull();
            });
    });

    afterAll(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });
});
