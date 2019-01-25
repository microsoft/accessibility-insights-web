// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { IOnDetailsViewPivotSelected } from '../../../../background/actions/action-payloads';
import { DetailsViewPivotValidator } from '../../../../background/details-view-pivot-validator';
import { Interpreter } from '../../../../background/interpreter';
import { FeatureFlagStore } from '../../../../background/stores/global/feature-flag-store';
import { TabStore } from '../../../../background/stores/tab-store';
import { FeatureFlags } from '../../../../common/feature-flags';
import { Messages } from '../../../../common/messages';
import { DetailsViewPivotType } from '../../../../common/types/details-view-pivot-type';
import { ITabStoreData } from '../../../../common/types/store-data/itab-store-data';
import { WindowUtils } from '../../../../common/window-utils';

let featureFlagStoreMock: IMock<FeatureFlagStore>;
let interpreterMock: IMock<Interpreter>;
let tabStoreMock: IMock<TabStore>;
let windowUtilsMock: IMock<WindowUtils>;

let testSubject: DetailsViewPivotValidator;

describe('DetailsViewPivotValidatorTest', () => {
    beforeEach(() => {
        featureFlagStoreMock = Mock.ofType(FeatureFlagStore, MockBehavior.Strict);
        interpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        tabStoreMock = Mock.ofType(TabStore, MockBehavior.Strict);
        windowUtilsMock = Mock.ofType(WindowUtils, MockBehavior.Strict);

        testSubject = new DetailsViewPivotValidator(
            featureFlagStoreMock.object,
            interpreterMock.object,
            tabStoreMock.object,
            windowUtilsMock.object,
        );
    });

    test('constructor', () => {
        expect(testSubject).toBeDefined();
    });

    test('onFlagChange: new assessment experience was disabled', () => {
        let windowCallback;
        let featureFlagCallback;
        const tabId = 1;
        const payload = {
            pivotKey: DetailsViewPivotType.allTest,
        } as IOnDetailsViewPivotSelected;
        const featureFlagData = {
            [FeatureFlags.newAssessmentExperience]: true,
        };
        const newStateFeatureFlagData = {
            [FeatureFlags.newAssessmentExperience]: false,
        };
        const expectedMessage = {
            type: Messages.Visualizations.DetailsView.PivotSelect,
            tabId: tabId,
            payload,
        };

        setupInterpreterMockWithMessage(expectedMessage, Times.once());
        setupTabStoreMock(tabId);
        setupFeatureFlagStoreMockWithData(featureFlagData);

        featureFlagStoreMock
            .setup(flsm => flsm.addChangedListener(It.isAny()))
            .callback(callback => {
                featureFlagCallback = callback;
            });

        windowUtilsMock
            .setup(wm => wm.setTimeout(It.isAny(), It.isAnyNumber()))
            .callback(handler => {
                windowCallback = handler;
            })
            .verifiable(Times.once());

        testSubject.initialize();
        featureFlagStoreMock.reset();
        setupFeatureFlagStoreMockWithData(newStateFeatureFlagData);
        featureFlagCallback();

        windowCallback();

        windowUtilsMock.verifyAll();
        interpreterMock.verifyAll();
    });

    test('onFlagChange: new assessment experience was enabled', () => {
        let windowCallback;
        let featureFlagCallback;
        const tabId = 1;
        const payload = {
            pivotKey: DetailsViewPivotType.fastPass,
        } as IOnDetailsViewPivotSelected;
        const featureFlagData = {
            [FeatureFlags.newAssessmentExperience]: false,
        };
        const newStateFeatureFlagData = {
            [FeatureFlags.newAssessmentExperience]: true,
        };
        const expectedMessage = {
            type: Messages.Visualizations.DetailsView.PivotSelect,
            tabId: tabId,
            payload,
        };

        setupInterpreterMockWithMessage(expectedMessage, Times.once());
        setupTabStoreMock(tabId);
        setupFeatureFlagStoreMockWithData(featureFlagData);

        featureFlagStoreMock
            .setup(flsm => flsm.addChangedListener(It.isAny()))
            .callback(callback => {
                featureFlagCallback = callback;
            });

        windowUtilsMock
            .setup(wm => wm.setTimeout(It.isAny(), It.isAnyNumber()))
            .callback(handler => {
                windowCallback = handler;
            })
            .verifiable(Times.once());

        testSubject.initialize();
        featureFlagStoreMock.reset();
        setupFeatureFlagStoreMockWithData(newStateFeatureFlagData);
        featureFlagCallback();

        windowCallback();

        windowUtilsMock.verifyAll();
        interpreterMock.verifyAll();
    });

    test('onFlagChange: new assessment experience was not changed', () => {
        let windowCallback;
        let featureFlagCallback;
        const tabId = 1;
        const payload = {
            pivotKey: DetailsViewPivotType.allTest,
        } as IOnDetailsViewPivotSelected;
        const featureFlagData = {
            [FeatureFlags.newAssessmentExperience]: false,
        };
        const newStateFeatureFlagData = {
            [FeatureFlags.newAssessmentExperience]: false,
        };
        const expectedMessage = {
            type: Messages.Visualizations.DetailsView.PivotSelect,
            tabId: tabId,
            payload,
        };

        setupInterpreterMockWithMessage(expectedMessage, Times.never());
        setupTabStoreMock(tabId);
        setupFeatureFlagStoreMockWithData(featureFlagData);

        featureFlagStoreMock
            .setup(flsm => flsm.addChangedListener(It.isAny()))
            .callback(callback => {
                featureFlagCallback = callback;
            });

        windowUtilsMock
            .setup(wm => wm.setTimeout(It.isAny(), It.isAnyNumber()))
            .callback(handler => {
                windowCallback = handler;
            })
            .verifiable(Times.never());

        testSubject.initialize();
        featureFlagStoreMock.reset();
        setupFeatureFlagStoreMockWithData(newStateFeatureFlagData);
        featureFlagCallback();

        interpreterMock.verifyAll();
        windowUtilsMock.verifyAll();
        expect(windowCallback).toBeUndefined();
    });
});

function setupTabStoreMock(tabId: number) {
    tabStoreMock
        .setup(tsm => tsm.getState())
        .returns(() => {
            return { id: tabId } as ITabStoreData;
        });
}

function setupFeatureFlagStoreMockWithData(data) {
    featureFlagStoreMock.setup(flsm => flsm.getState()).returns(() => data);
}

function setupInterpreterMockWithMessage(message, times) {
    interpreterMock.setup(im => im.interpret(It.isValue(message))).verifiable(times);
}
