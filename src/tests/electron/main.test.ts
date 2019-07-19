// A simple test to verify a visible window is opened with a title
import * as Electron from 'electron';
import { Application } from 'spectron';

describe('ElectronE2E', () => {
    let app: Application;
    jest.setTimeout(15000);

    beforeAll(() => {
        const electronPath = `${(global as any).rootDir}/drop/electron/extension/bundle/main.bundle.js`;
        app = new Application({
            path: Electron as any,
            args: [electronPath],
        });

        return app.start();
    });

    test('test for getBuild variants', () => {
        return Promise.resolve()
            .then(function(): boolean {
                // Check if the window is visible
                return app.isRunning();
            })
            .then(function(isVisible: boolean): void {
                // Verify the window is visible
                expect(isVisible).toBe(true);
            })
            .then(function(): Promise<number> {
                return app.client.getWindowCount();
            })
            .then(function(count: number): void {
                // Verify the window count
                expect(count).toBe(2);
            })
            .then(function(): string {
                return app.webContents.getTitle();
            })
            .then(function(title: string): void {
                expect(title).toBe('Accessible University Demo Site - Inaccessible Version');
            })
            .catch(function(error: Error): void {
                // Log any failures
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
