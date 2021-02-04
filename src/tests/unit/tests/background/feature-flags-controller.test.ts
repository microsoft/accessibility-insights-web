// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagPayload } from 'background/actions/feature-flag-actions';
import { FeatureFlagsController } from 'background/feature-flags-controller';
import { Interpreter } from 'background/interpreter';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { IMock, It, Mock, Times } from 'typemoq';
import { FeatureFlags } from '../../../../common/feature-flags';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';

describe('FeatureFlagsControllerTest', () => {
    let testObject: FeatureFlagsController;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        featureFlagStoreMock = Mock.ofType(FeatureFlagStore);
        interpreterMock = Mock.ofType(Interpreter);
    });

    test('isEnabled', () => {
        const storeDataStub: FeatureFlagStoreData = {
            [FeatureFlags[FeatureFlags.logTelemetryToConsole]]: false,
            ['testFeatureFlag']: true,
        };

        featureFlagStoreMock
            .setup(f => f.getState())
            .returns(() => storeDataStub)
            .verifiable(Times.exactly(3));

        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );

        expect(testObject.isEnabled(FeatureFlags.logTelemetryToConsole)).toBeFalsy();
        expect(testObject.isEnabled('testFeatureFlag')).toBeTruthy();
        expect(testObject.isEnabled('someRandomFlag')).toBeFalsy();

        featureFlagStoreMock.verifyAll();
    });

    test('listFeatureFlags', () => {
        const storeDataStub: FeatureFlagStoreData = {
            [FeatureFlags[FeatureFlags.logTelemetryToConsole]]: false,
        };

        featureFlagStoreMock
            .setup(f => f.getState())
            .returns(() => {
                return storeDataStub;
            })
            .verifiable();

        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );
        expect(testObject.listFeatureFlags()).toEqual(storeDataStub);
        featureFlagStoreMock.verifyAll();
    });

    test.each([true, false])('toggle feature flag to enabled: %s', (enabled: boolean) => {
        const feature = FeatureFlags.logTelemetryToConsole;
        const storeDataStub: FeatureFlagStoreData = {
            [FeatureFlags[feature]]: enabled,
        };
        const payload: FeatureFlagPayload = {
            feature,
            enabled,
        };
        const message: Message = {
            messageType: Messages.FeatureFlags.SetFeatureFlag,
            payload: payload,
            tabId: null,
        };

        interpreterMock.setup(i => i.interpret(It.isObjectWith(message))).verifiable();
        featureFlagStoreMock
            .setup(f => f.getState())
            .returns(() => storeDataStub)
            .verifiable();
        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );
        const storeState = enabled
            ? testObject.enableFeature(feature)
            : testObject.disableFeature(feature);
        expect(storeState).toEqual(storeDataStub);
        interpreterMock.verifyAll();
        featureFlagStoreMock.verifyAll();
    });

    test('resetFeatureFlags', () => {
        const message: Message = {
            messageType: Messages.FeatureFlags.ResetFeatureFlag,
            tabId: null,
        };
        interpreterMock.setup(i => i.interpret(It.isObjectWith(message))).verifiable();

        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );
        testObject.resetFeatureFlags();
        interpreterMock.verifyAll();
    });
});
