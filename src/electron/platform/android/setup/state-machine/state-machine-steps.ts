// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActionBag } from './state-machine-action-callback';
import { StateMachineStep } from './state-machine-step';

export type StateMachineSteps<StepIdT extends string, ActionT extends ActionBag<ActionT>> = {
    [stepId in StepIdT]: StateMachineStep<ActionT>;
};
