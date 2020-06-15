// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';
import { mapValues } from 'lodash';
import { ActionBag } from './state-machine-action-callback';
import { StateMachineStep } from './state-machine-step';

export type StateMachineStepConfig<ActionT extends ActionBag<ActionT>, DepsT> = (
    deps: DepsT,
) => StateMachineStep<ActionT>;

export type StateMachineStepConfigs<
    StepIdT extends string,
    ActionT extends ActionBag<ActionT>,
    DepsT
> = {
    [stepId in StepIdT]: StateMachineStepConfig<ActionT, DepsT>;
};

export const createStateMachineSteps = <
    StepIdT extends string,
    ActionT extends ActionBag<ActionT>,
    DepsT
>(
    deps: DepsT,
    configs: StateMachineStepConfigs<StepIdT, ActionT, DepsT>,
): StateMachineSteps<StepIdT, ActionT> => {
    return mapValues(configs, config => config && config(deps));
};
