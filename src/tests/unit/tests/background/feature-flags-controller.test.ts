// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagPayload } from 'background/actions/feature-flag-actions';
import { FeatureFlagsController } from 'background/feature-flags-controller';
import { Interpreter } from 'background/interpreter';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { IMock, It, Mock, Times } from 'typemoq';
import { FeatureFlags } from '../../../../common/feature-flags';
import { InterpreterMessage } from '../../../../common/message';
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

    test.each([true, false])('toggle feature flag to enabled: %s', async (enabled: boolean) => {
        const feature = FeatureFlags.logTelemetryToConsole;
        const storeDataStub: FeatureFlagStoreData = {
            [FeatureFlags[feature]]: enabled,
        };
        const payload: FeatureFlagPayload = {
            feature,
            enabled,
        };
        const message: InterpreterMessage = {
            messageType: Messages.FeatureFlags.SetFeatureFlag,
            payload: payload,
        };

        interpreterMock
            .setup(i => i.interpret(It.isObjectWith(message)))
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable();
        featureFlagStoreMock
            .setup(f => f.getState())
            .returns(() => storeDataStub)
            .verifiable();
        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );
        let storeState: FeatureFlagStoreData;
        if (enabled) {
            storeState = await testObject.enableFeature(feature);
        } else {
            storeState = await testObject.disableFeature(feature);
        }
        expect(storeState).toEqual(storeDataStub);
        interpreterMock.verifyAll();
        featureFlagStoreMock.verifyAll();
    });

    test('resetFeatureFlags', async () => {
        const message: InterpreterMessage = {
            messageType: Messages.FeatureFlags.ResetFeatureFlag,
        };
        interpreterMock
            .setup(i => i.interpret(It.isObjectWith(message)))
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable();

        testObject = new FeatureFlagsController(
            featureFlagStoreMock.object,
            interpreterMock.object,
        );
        await testObject.resetFeatureFlags();
        interpreterMock.verifyAll();
    });
});
