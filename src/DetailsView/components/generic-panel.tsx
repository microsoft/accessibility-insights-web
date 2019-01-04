// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind, css } from '@uifabric/utilities';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';


export interface GenericPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    title: string;
    className?: string;
    closeButtonAriaLabel: string;
    hasCloseButton: boolean;
}

export class GenericPanel extends React.Component<GenericPanelProps> {

    public render(): JSX.Element {
        return (
            <Panel
                isOpen={this.props.isOpen}
                type={PanelType.custom}
                customWidth="550px"
                className={css('generic-panel', this.props.className)}
                isLightDismiss={true}
                onDismiss={this.props.onDismiss}
                onRenderHeader={this.renderHeader}
                closeButtonAriaLabel={this.props.closeButtonAriaLabel}
                hasCloseButton={this.props.hasCloseButton}
            >
                {this.props.children}
            </Panel>
        );
    }

    @autobind
    protected renderHeader(): JSX.Element {
        return <div>
            <h1 className="header-text">{this.props.title}</h1>
        </div>;
    }
}
