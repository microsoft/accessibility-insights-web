// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';
import { mapValues } from 'lodash';
import { ActionBag } from './state-machine-action-callback';
import { StateMachineStep } from './state-machine-step';

export type StateMachineStepConfig<
    StepIdT extends string,
    ActionT extends ActionBag<ActionT>,
    DepsT,
    StoreCallbacksT,
> = (
    stepTransition: (stepId: StepIdT) => void,
    deps: DepsT,
    store?: StoreCallbacksT,
) => StateMachineStep<ActionT>;

export type StateMachineStepConfigs<
    StepIdT extends string,
    ActionT extends ActionBag<ActionT>,
    DepsT,
    StoreCallbacksT,
> = {
    [stepId in StepIdT]: StateMachineStepConfig<StepIdT, ActionT, DepsT, StoreCallbacksT>;
};

export const createStateMachineSteps = <
    StepIdT extends string,
    ActionT extends ActionBag<ActionT>,
    DepsT,
    StoreCallbacksT,
>(
    configs: StateMachineStepConfigs<StepIdT, ActionT, DepsT, StoreCallbacksT>,
    stepTransition: (stepId: StepIdT) => void,
    deps: DepsT,
    storeCallbacks?: StoreCallbacksT,
): StateMachineSteps<StepIdT, ActionT> => {
    return mapValues(configs, config => config && config(stepTransition, deps, storeCallbacks));
};
