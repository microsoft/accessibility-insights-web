// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { TargetTabController } from 'background/target-tab-controller';
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
    let test: VisualizationType;
    let tabId: number;
    let step: string;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        getSwitchToTargetTabCallbackMock = Mock.ofInstance(() => null);
        configurationFactoryMock = Mock.ofType(
            VisualizationConfigurationFactory,
        );
        configStub = {
            getSwitchToTargetTabOnScan: getSwitchToTargetTabCallbackMock.object,
        } as VisualizationConfiguration;
        tabId = -1;
        test = -2;
        step = 'some step';

        configurationFactoryMock
            .setup(cfm => cfm.getConfiguration(test))
            .returns(() => configStub);

        testSubject = new TargetTabController(
            browserAdapterMock.object,
            configurationFactoryMock.object,
        );
    });

    it('tests the constructor', () => {
        expect(testSubject).toBeDefined();
    });

    it("showTargetTab: test doesn't switch to target tab", () => {
        configurationFactoryMock
            .setup(cfm => cfm.getConfiguration(test))
            .returns(() => configStub);

        getSwitchToTargetTabCallbackMock
            .setup(cm => cm(null))
            .returns(() => false)
            .verifiable(Times.once());

        setupSwitchToTabBrowserCall(Times.never());

        testSubject.showTargetTab(tabId, test);
        browserAdapterMock.verifyAll();
    });

    it('showTargetTab: test does switch to target tab', () => {
        getSwitchToTargetTabCallbackMock
            .setup(cm => cm(step))
            .returns(() => true)
            .verifiable(Times.once());

        setupSwitchToTabBrowserCall(Times.once());

        testSubject.showTargetTab(tabId, test, step);
        browserAdapterMock.verifyAll();
    });

    function setupSwitchToTabBrowserCall(times: Times): void {
        browserAdapterMock
            .setup(bam => bam.switchToTab(tabId))
            .verifiable(times);
    }
});
