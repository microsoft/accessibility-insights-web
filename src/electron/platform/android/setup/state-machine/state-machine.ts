// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionBag } from './state-machine-action-callback';
import { StateMachineSteps } from './state-machine-steps';
import { StateMachineStepsFactory } from './state-machine-steps-factory';

export class StateMachine<StepIdT extends string, ActionT extends ActionBag<ActionT>> {
    private currentStep: StepIdT;
    private readonly steps: StateMachineSteps<StepIdT, ActionT>;
    private readonly stepTransitionCallback: (nextStep: StepIdT) => void;

    constructor(
        stepsFactory: StateMachineStepsFactory<StepIdT, ActionT>,
        stepTransitionCallback: (nextStep: StepIdT) => void,
        firstStep: StepIdT,
    ) {
        if (!stepsFactory) {
            throw new Error('Expected stepsFactory to be defined and not null');
        }
        if (!stepTransitionCallback) {
            throw new Error('Expected stepTransitionCallback to be defined and not null');
        }

        this.steps = stepsFactory(this.stepTransition);
        if (!this.steps) {
            throw new Error('Expected this.steps not to be null');
        }

        this.stepTransitionCallback = stepTransitionCallback;
        this.stepTransition(firstStep);
    }

    public invokeAction(actionName: keyof ActionT, payload?: any): void {
        const currentStep = this.steps[this.currentStep];
        const actionCallback = currentStep.actions[actionName] as (payload: any) => void;

        if (actionCallback != null) {
            actionCallback(payload);
        }
    }

    private stepTransition = (nextStep: StepIdT): void => {
        // during development, all steps may not yet be implemented.
        // Fail gracefully instead of throwing an exception
        if (!this.steps[nextStep]) {
            return;
        }

        this.currentStep = nextStep;

        if (this.steps[nextStep].onEnter != null) {
            this.steps[nextStep].onEnter();
        }

        this.stepTransitionCallback(nextStep);
    };
}
