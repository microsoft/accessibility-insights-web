// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStartListener } from 'electron/platform/android/setup/android-setup-start-listener';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidSetupStartListener', () => {
    test.each`
        step               | adbFlag  | firstTime | shouldSend
        ${'wait-to-start'} | ${true}  | ${false}  | ${true}
        ${'wait-to-start'} | ${true}  | ${true}   | ${false}
        ${'wait-to-start'} | ${false} | ${false}  | ${false}
        ${'wait-to-start'} | ${false} | ${true}   | ${false}
        ${'detect-adb'}    | ${true}  | ${false}  | ${false}
    `(
        'sends ready-to-start? ($shouldSend) when in $step with feature flag $adbFlag and isFirstTime $firstTime',
        ({ step, adbFlag, firstTime, shouldSend }) => {
            testWhetherReadyToStartFired(
                {
                    stepId: step,
                    adbFeatureFlag: adbFlag,
                    isFirstTimeTelemetry: firstTime,
                },
                null,
                shouldSend,
                false,
            );
        },
    );

    it('sends ready-to-start when initial state is not ready but changed state is', () => {
        testWhetherReadyToStartFired(
            {
                stepId: 'wait-to-start',
                adbFeatureFlag: false,
                isFirstTimeTelemetry: false,
            },
            {
                stepId: 'wait-to-start',
                adbFeatureFlag: true,
                isFirstTimeTelemetry: false,
            },
            false,
            true,
        );
    });

    it('does not send ready-to-start twice (because listeners are removed)', () => {
        testWhetherReadyToStartFired(
            {
                stepId: 'wait-to-start',
                adbFeatureFlag: true,
                isFirstTimeTelemetry: false,
            },
            {
                stepId: 'wait-to-start',
                adbFeatureFlag: true,
                isFirstTimeTelemetry: false,
            },
            true,
            false,
        );
    });

    function testWhetherReadyToStartFired(
        initialState: ReadyToStartState,
        changedState: ReadyToStartState,
        expectReadyToStartInitially: boolean,
        expectReadyToStartAfterwards: boolean,
    ): void {
        const androidSetupStoreMock = Mock.ofType(AndroidSetupStore, MockBehavior.Strict);
        const featureFlagStoreMock = Mock.ofType(FeatureFlagStore, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
        const androidSetupActionCreatorMock = Mock.ofType(
            AndroidSetupActionCreator,
            MockBehavior.Strict,
        );

        setupStoreStates(
            androidSetupStoreMock,
            featureFlagStoreMock,
            userConfigStoreMock,
            initialState,
        );

        let callback;
        androidSetupStoreMock
            .setup(m => m.addChangedListener(It.is(p => p instanceof Function)))
            .callback(cb => (callback = cb))
            .verifiable(Times.once());
        featureFlagStoreMock
            .setup(m => m.addChangedListener(It.is(p => p instanceof Function)))
            .callback(cb => (callback = cb))
            .verifiable(Times.once());
        userConfigStoreMock
            .setup(m => m.addChangedListener(It.is(p => p instanceof Function)))
            .callback(cb => (callback = cb))
            .verifiable(Times.once());

        const testListener = new AndroidSetupStartListener(
            userConfigStoreMock.object,
            androidSetupStoreMock.object,
            featureFlagStoreMock.object,
            androidSetupActionCreatorMock.object,
        );

        if (expectReadyToStartInitially) {
            setupReadyToStartAction(
                androidSetupStoreMock,
                featureFlagStoreMock,
                userConfigStoreMock,
                androidSetupActionCreatorMock,
            );
        }

        testListener.initialize();

        if (changedState !== null) {
            setupStoreStates(
                androidSetupStoreMock,
                featureFlagStoreMock,
                userConfigStoreMock,
                changedState,
            );

            if (expectReadyToStartAfterwards) {
                setupReadyToStartAction(
                    androidSetupStoreMock,
                    featureFlagStoreMock,
                    userConfigStoreMock,
                    androidSetupActionCreatorMock,
                );
            }

            callback();
        }
    }

    type ReadyToStartState = {
        stepId: AndroidSetupStepId;
        adbFeatureFlag: boolean;
        isFirstTimeTelemetry: boolean;
    };

    function setupReadyToStartAction(
        androidSetupStoreMock: IMock<AndroidSetupStore>,
        featureFlagStoreMock: IMock<FeatureFlagStore>,
        userConfigStoreMock: IMock<UserConfigurationStore>,
        androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>,
    ): void {
        androidSetupStoreMock.setup(m =>
            m.removeChangedListener(It.is(p => p instanceof Function)),
        );
        featureFlagStoreMock.setup(m => m.removeChangedListener(It.is(p => p instanceof Function)));
        userConfigStoreMock.setup(m => m.removeChangedListener(It.is(p => p instanceof Function)));
        androidSetupActionCreatorMock.setup(m => m.readyToStart());
    }

    function setupStoreStates(
        androidSetupStoreMock: IMock<AndroidSetupStore>,
        featureFlagStoreMock: IMock<FeatureFlagStore>,
        userConfigStoreMock: IMock<UserConfigurationStore>,
        state: ReadyToStartState,
    ): void {
        androidSetupStoreMock
            .setup(m => m.getState())
            .returns(_ => ({ currentStepId: state.stepId }));
        featureFlagStoreMock
            .setup(m => m.getState())
            .returns(_ => ({ [UnifiedFeatureFlags.adbSetupView]: state.adbFeatureFlag }));
        userConfigStoreMock
            .setup(m => m.getState())
            .returns(_ => ({ isFirstTime: state.isFirstTimeTelemetry } as any));
    }
});
