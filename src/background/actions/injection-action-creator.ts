// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionFailedPayload } from 'background/actions/action-payloads';
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { InjectionActions } from '../actions/injection-actions';
import { Interpreter } from '../interpreter';

export class InjectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly injectionActions: InjectionActions,
        private readonly notificationCreator: NotificationCreator,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.State.InjectionStarted,
            this.injectionStarted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.State.InjectionCompleted,
            this.injectionCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.State.InjectionFailed,
            this.injectionFailed,
        );
    }

    private injectionStarted = async (): Promise<void> =>
        await this.injectionActions.injectionStarted.invoke(null);

    private injectionCompleted = async (): Promise<void> =>
        await this.injectionActions.injectionCompleted.invoke(null);

    private injectionFailed = async (payload: InjectionFailedPayload): Promise<void> => {
        if (payload.injectionFailed) {
            this.notificationCreator.createNotification(DisplayableStrings.injectionFailed);
        }
        return await this.injectionActions.injectionFailed.invoke(payload);
    };
}
