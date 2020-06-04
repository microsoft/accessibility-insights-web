// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActionBag } from './state-machine-action-callback';
import { StateMachineSteps } from './state-machine-steps';

type StepTransitionCallback<StepIdT> = (nextStepId: StepIdT) => void;

export type StateMachineStepsFactory<StepIdT extends string, ActionT extends ActionBag<ActionT>> = (
    callback: StepTransitionCallback<StepIdT>,
) => StateMachineSteps<StepIdT, ActionT>;
