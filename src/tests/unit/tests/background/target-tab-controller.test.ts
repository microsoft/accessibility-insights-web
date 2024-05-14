// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetTabController } from 'background/target-tab-controller';
import { IMock, Mock, Times } from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../common/types/visualization-type';

describe('TargetTabControllerTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let configurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let testSubject: TargetTabController;
    let configStub: VisualizationConfiguration;
    let getSwitchToTargetTabCallbackMock: IMock<(step: string) => boolean>;
    const test: VisualizationType = -2 as VisualizationType;
    const tabId: number = -1;
    const step: string = 'some step';

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        getSwitchToTargetTabCallbackMock = Mock.ofInstance(() => null);
        configurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        configStub = {
            getSwitchToTargetTabOnScan: getSwitchToTargetTabCallbackMock.object,
        } as VisualizationConfiguration;

        configurationFactoryMock.setup(cfm => cfm.getConfiguration(test)).returns(() => configStub);

        testSubject = new TargetTabController(
            browserAdapterMock.object,
            configurationFactoryMock.object,
        );
    });

    describe('showTargetTab', () => {
        it("test doesn't switch to target tab", async () => {
            configurationFactoryMock
                .setup(cfm => cfm.getConfiguration(test))
                .returns(() => configStub);

            getSwitchToTargetTabCallbackMock
                .setup(cm => cm(null))
                .returns(() => false)
                .verifiable(Times.once());

            setupSwitchToTabBrowserCall(Times.never());

            await testSubject.showTargetTab(tabId, test);
            browserAdapterMock.verifyAll();
        });

        it('test does switch to target tab', async () => {
            getSwitchToTargetTabCallbackMock
                .setup(cm => cm(step))
                .returns(() => true)
                .verifiable(Times.once());

            setupSwitchToTabBrowserCall(Times.once());

            await testSubject.showTargetTab(tabId, test, step);
            browserAdapterMock.verifyAll();
        });

        it('propagates error from switch to tab', async () => {
            getSwitchToTargetTabCallbackMock
                .setup(cm => cm(step))
                .returns(() => true)
                .verifiable(Times.once());

            const errorMessage = 'switchToTab failed error message';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.reject(errorMessage));

            await expect(testSubject.showTargetTab(tabId, test, step)).rejects.toEqual(
                errorMessage,
            );
        });
    });

    function setupSwitchToTabBrowserCall(times: Times): void {
        browserAdapterMock.setup(adapter => adapter.switchToTab(tabId)).verifiable(times);
    }
});
