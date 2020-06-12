// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { StateMachineStep } from 'electron/platform/android/setup/state-machine/state-machine-step';
import {
    createStateMachineSteps,
    StateMachineStepConfigs,
} from 'electron/platform/android/setup/state-machine/state-machine-step-configs';
import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';

type MartiniStepId = 'gin' | 'vermouth' | 'olives';

class MartiniActions {
    public shake = new Action<void>();
    public stir = new Action<void>();
}

type MartiniDeps = {
    chillGlass: () => string;
};

type MartiniStep = StateMachineStep<MartiniActions>;

describe('state machine step configs', () => {
    const martiniDeps = {} as MartiniDeps;

    it('calls config functions with expected deps', () => {
        const testDeps = deps => {
            expect(deps).toBe(martiniDeps);
            expect(deps).toEqual(martiniDeps);
            return null;
        };

        const configs: StateMachineStepConfigs<MartiniStepId, MartiniActions, MartiniDeps> = {
            gin: deps => testDeps(deps),
            vermouth: deps => testDeps(deps),
            olives: deps => testDeps(deps),
        };

        createStateMachineSteps(martiniDeps, configs);
    });

    it('handles null config functions gracefully', () => {
        const expectedSteps: StateMachineSteps<MartiniStepId, MartiniActions> = {
            gin: null,
            vermouth: null,
            olives: null,
        };

        const configs: StateMachineStepConfigs<MartiniStepId, MartiniActions, MartiniDeps> = {
            gin: null,
            vermouth: null,
            olives: null,
        };

        let testSteps: StateMachineSteps<MartiniStepId, MartiniActions>;
        const testFunc = () => (testSteps = createStateMachineSteps(martiniDeps, configs));
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

        const configs: StateMachineStepConfigs<MartiniStepId, MartiniActions, MartiniDeps> = {
            gin: _ => ginStep,
            vermouth: _ => vermouthStep,
            olives: null,
        };

        const testSteps = createStateMachineSteps(martiniDeps, configs);

        expect(testSteps.gin).toBe(ginStep);
        expect(testSteps.gin).toEqual(ginStep);

        expect(testSteps.vermouth).toBe(vermouthStep);
        expect(testSteps.vermouth).toEqual(vermouthStep);
    });
});
