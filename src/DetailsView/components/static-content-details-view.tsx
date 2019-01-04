// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationToggle } from '../../common/components/visualization-toggle';

export interface IStaticContentDetailsViewProps {
    title: string;
    visualizationEnabled: boolean;
    toggleLabel: string;
    content: JSX.Element;
    onToggleClick: (event) => void;
}

export class StaticContentDetailsView extends React.Component<IStaticContentDetailsViewProps , undefined> {
    public render(): JSX.Element {
        return (
            <div className="static-content-details-view">
                <h1>{this.props.title}</h1>
                <VisualizationToggle
                    checked={this.props.visualizationEnabled}
                    onClick={this.props.onToggleClick}
                    label={this.props.toggleLabel}
                    className="details-view-toggle"
                    visualizationName={this.props.title}
                />
                <div className="details-view-static-content">
                    {this.props.content}
                </div>
            </div>
        );
    }
}
