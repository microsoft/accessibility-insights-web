// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { StateMachineStep } from 'electron/platform/android/setup/state-machine/state-machine-step';
import {
    createStateMachineSteps,
    StateMachineStepConfigs,
} from 'electron/platform/android/setup/state-machine/state-machine-step-configs';
import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';

type MartiniStepId = 'gin' | 'vermouth' | 'olives';

class MartiniActions {
    public shake = new SyncAction<void>();
    public stir = new SyncAction<void>();
}

type MartiniDeps = {
    chillGlass: () => string;
};

type MartiniStoreCallbacks = {
    serve: (compliment: string) => void;
};

type MartiniStep = StateMachineStep<MartiniActions>;

describe('state machine step configs', () => {
    const stepTransition = (_: MartiniStepId): void => {};
    const martiniDeps = {} as MartiniDeps;
    const martiniStoreCallbacks = {} as MartiniStoreCallbacks;

    it('calls config functions with expected deps', () => {
        const testConfig = (st, deps, store) => {
            expect(st).toBe(stepTransition);
            expect(deps).toBe(martiniDeps);
            expect(deps).toEqual(martiniDeps);
            expect(store).toBe(martiniStoreCallbacks);
            expect(deps).toEqual(martiniStoreCallbacks);
            return null;
        };

        const configs: StateMachineStepConfigs<
            MartiniStepId,
            MartiniActions,
            MartiniDeps,
            MartiniStoreCallbacks
        > = {
            gin: (st, deps, store) => testConfig(st, deps, store),
            vermouth: (st, deps, store) => testConfig(st, deps, store),
            olives: (st, deps, store) => testConfig(st, deps, store),
        };

        createStateMachineSteps(configs, stepTransition, martiniDeps, martiniStoreCallbacks);
    });

    it('handles null config functions gracefully', () => {
        const expectedSteps: StateMachineSteps<MartiniStepId, MartiniActions> = {
            gin: null,
            vermouth: null,
            olives: null,
        };

        const configs: StateMachineStepConfigs<
            MartiniStepId,
            MartiniActions,
            MartiniDeps,
            MartiniStoreCallbacks
        > = {
            gin: null,
            vermouth: null,
            olives: null,
        };

        let testSteps: StateMachineSteps<MartiniStepId, MartiniActions>;
        const testFunc = () =>
            (testSteps = createStateMachineSteps(
                configs,
                stepTransition,
                martiniDeps,
                martiniStoreCallbacks,
            ));
        expect(testFunc).not.toThrow();
        expect(testSteps).toEqual(expectedSteps);
    });

    it('returns expected object', () => {
        const ginStep: MartiniStep = {
            actions: {
                shake: null,
            },
        };

        const vermouthStep: MartiniStep = {
            actions: {
                stir: null,
            },
        };

        const configs: StateMachineStepConfigs<
            MartiniStepId,
            MartiniActions,
            MartiniDeps,
            MartiniStoreCallbacks
        > = {
            gin: (_, __) => ginStep,
            vermouth: (_, __) => vermouthStep,
            olives: null,
        };

        const testSteps = createStateMachineSteps(
            configs,
            stepTransition,
            martiniDeps,
            martiniStoreCallbacks,
        );

        expect(testSteps.gin).toBe(ginStep);
        expect(testSteps.gin).toEqual(ginStep);

        expect(testSteps.vermouth).toBe(vermouthStep);
        expect(testSteps.vermouth).toEqual(vermouthStep);
    });
});
