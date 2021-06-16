// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryCommonFields } from 'debug-tools/components/telemetry-viewer/telemetry-common-fields';
import {
    TelemetryMessagesList,
    TelemetryMessagesListDeps,
} from 'debug-tools/components/telemetry-viewer/telemetry-messages-list';
import {
    DebugToolsTelemetryMessage,
    TelemetryListener,
} from 'debug-tools/controllers/telemetry-listener';
import * as React from 'react';

export type TelemetryViewerDeps = {
    telemetryListener: TelemetryListener;
} & TelemetryMessagesListDeps;

export interface TelemetryViewerProps {
    deps: TelemetryViewerDeps;
}

interface TelemetryViewerState {
    telemetryMessages: DebugToolsTelemetryMessage[];
}

export class TelemetryViewer extends React.Component<TelemetryViewerProps, TelemetryViewerState> {
    constructor(props: TelemetryViewerProps) {
        super(props);

        this.state = {
            telemetryMessages: [],
        };
    }

    public componentDidMount(): void {
        this.props.deps.telemetryListener.addListener(this.onTelemetryMessage);
    }

    public render(): JSX.Element {
        if (this.state.telemetryMessages.length === 0) {
            return this.renderNoMessages();
        }

        return (
            <>
                {this.renderCommonFields()}
                {this.renderTelemetryMessagesList()}
            </>
        );
    }

    private renderNoMessages = () => (
        <strong>No telemetry messages yet. Use the extension to see something here.</strong>
    );

    private renderCommonFields(): JSX.Element {
        const lastMessage = this.state.telemetryMessages[0];

        const { applicationBuild, applicationName, applicationVersion, installationId } =
            lastMessage;

        const props = {
            applicationBuild,
            applicationName,
            applicationVersion,
            installationId,
        };

        return <TelemetryCommonFields {...props} />;
    }

    private renderTelemetryMessagesList = () => (
        <TelemetryMessagesList deps={this.props.deps} items={this.state.telemetryMessages} />
    );

    private onTelemetryMessage = (telemetryMessage: DebugToolsTelemetryMessage) => {
        this.setState(prevState => ({
            telemetryMessages: [telemetryMessage, ...prevState.telemetryMessages],
        }));
    };
}
