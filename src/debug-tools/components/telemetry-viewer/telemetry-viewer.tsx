// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryCommonFields } from 'debug-tools/components/telemetry-viewer/telemetry-common-fields';
import { TelemetryMessagesList } from 'debug-tools/components/telemetry-viewer/telemetry-messages-list';
import {
    DebugToolsTelemetryMessage,
    TelemetryListener,
} from 'debug-tools/controllers/telemetry-listener';
import * as React from 'react';

export type TelemetryViewerDeps = {
    telemetryListener: TelemetryListener;
};

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
            return (
                <>
                    {this.renderTitle()}
                    {this.renderNoMessages()}
                </>
            );
        }

        return (
            <>
                {this.renderTitle()}
                {this.renderCommonFields()}
                {this.renderTelemetryMessagesList()}
            </>
        );
    }

    private renderTitle = () => <h1>Telemetry Viewer</h1>;

    private renderNoMessages = () => (
        <span>No telemetry messages yet. Use the extension to see something here.</span>
    );

    private renderCommonFields(): JSX.Element {
        const lastMessage = this.state.telemetryMessages[0];

        const {
            applicationBuild,
            applicationName,
            applicationVersion,
            installationId,
        } = lastMessage;

        const props = {
            applicationBuild,
            applicationName,
            applicationVersion,
            installationId,
        };

        return <TelemetryCommonFields {...props} />;
    }

    private renderTelemetryMessagesList = () => (
        <TelemetryMessagesList items={this.state.telemetryMessages} />
    );

    private onTelemetryMessage = (telemetryMessage: DebugToolsTelemetryMessage) => {
        this.setState({
            telemetryMessages: [telemetryMessage, ...this.state.telemetryMessages],
        });
    };
}
