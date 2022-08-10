// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStartListener } from 'electron/platform/android/setup/android-setup-start-listener';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidSetupStartListener', () => {
    test.each`
        step               | firstTime | shouldSend
        ${'wait-to-start'} | ${false}  | ${true}
        ${'wait-to-start'} | ${true}   | ${false}
        ${'detect-adb'}    | ${false}  | ${false}
    `(
        'sends ready-to-start? ($shouldSend) when in $step and isFirstTime $firstTime',
        async ({ step, firstTime, shouldSend }) => {
            await testWhetherReadyToStartFired(
                {
                    stepId: step,
                    isFirstTimeTelemetry: firstTime,
                },
                null,
                shouldSend,
                false,
            );
        },
    );

    it('sends ready-to-start when initial state is not ready but changed state is', async () => {
        await testWhetherReadyToStartFired(
            {
                stepId: 'wait-to-start',
                isFirstTimeTelemetry: true,
            },
            {
                stepId: 'detect-adb',
                isFirstTimeTelemetry: true,
            },
            false,
            true,
        );
    });

    it('does not send ready-to-start twice (because listeners are removed)', async () => {
        await testWhetherReadyToStartFired(
            {
                stepId: 'wait-to-start',
                isFirstTimeTelemetry: true,
            },
            {
                stepId: 'detect-adb',
                isFirstTimeTelemetry: true,
            },
            true,
            false,
        );
    });

    async function testWhetherReadyToStartFired(
        initialState: ReadyToStartState,
        changedState: ReadyToStartState,
        expectReadyToStartInitially: boolean,
        expectReadyToStartAfterwards: boolean,
    ): Promise<void> {
        const androidSetupStoreMock = Mock.ofType(AndroidSetupStore, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
        const androidSetupActionCreatorMock = Mock.ofType(
            AndroidSetupActionCreator,
            MockBehavior.Strict,
        );

        setupStoreStates(androidSetupStoreMock, userConfigStoreMock, initialState);

        let callback;
        androidSetupStoreMock
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
            androidSetupActionCreatorMock.object,
        );

        if (expectReadyToStartInitially) {
            setupReadyToStartAction(
                androidSetupStoreMock,
                userConfigStoreMock,
                androidSetupActionCreatorMock,
            );
        }

        await testListener.initialize();

        if (changedState !== null) {
            setupStoreStates(androidSetupStoreMock, userConfigStoreMock, changedState);

            if (expectReadyToStartAfterwards) {
                setupReadyToStartAction(
                    androidSetupStoreMock,
                    userConfigStoreMock,
                    androidSetupActionCreatorMock,
                );
            }

            callback();
        }
    }

    type ReadyToStartState = {
        stepId: AndroidSetupStepId;
        isFirstTimeTelemetry: boolean;
    };

    function setupReadyToStartAction(
        androidSetupStoreMock: IMock<AndroidSetupStore>,
        userConfigStoreMock: IMock<UserConfigurationStore>,
        androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>,
    ): void {
        androidSetupStoreMock.setup(m =>
            m.removeChangedListener(It.is(p => p instanceof Function)),
        );
        userConfigStoreMock.setup(m => m.removeChangedListener(It.is(p => p instanceof Function)));
        androidSetupActionCreatorMock.setup(m => m.readyToStart());
    }

    function setupStoreStates(
        androidSetupStoreMock: IMock<AndroidSetupStore>,
        userConfigStoreMock: IMock<UserConfigurationStore>,
        state: ReadyToStartState,
    ): void {
        androidSetupStoreMock
            .setup(m => m.getState())
            .returns(_ => ({ currentStepId: state.stepId }));
        userConfigStoreMock
            .setup(m => m.getState())
            .returns(_ => ({ isFirstTime: state.isFirstTimeTelemetry } as any));
    }
});
