// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { AxeInfo } from '../../common/axe-info';
import { ExternalLink, ExternalLinkDeps } from '../../common/components/external-link';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPadItemRow } from './launch-pad-item-row';

export type LaunchPadDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    axeInfo: AxeInfo;
} & ExternalLinkDeps;

export interface LaunchPadProps {
    deps: LaunchPadDeps;
    productName: string;
    popupWindow?: Window;
    rowConfigs: LaunchPadRowConfiguration[];
    version: string;
}

export interface LaunchPadRowConfiguration {
    iconName: string;
    title: string;
    description: string;
    onClickTitle: (ev?) => void;
}

export class LaunchPad extends React.Component<LaunchPadProps, undefined> {
    constructor(props: LaunchPadProps) {
        super(props);
    }

    private renderLaunchPadItemRows(rowConfigs: LaunchPadRowConfiguration[]): JSX.Element[] {
        const launchPadItemRows: JSX.Element[] = rowConfigs.map(
            (config: LaunchPadRowConfiguration, index: number) => {
                return (
                    <div key={`row-item-${index + 1}`}>
                        <LaunchPadItemRow
                            iconName={config.iconName}
                            description={config.description}
                            title={config.title}
                            onClickTitle={config.onClickTitle}
                        />
                        <hr className="launch-pad-hr" />
                    </div>
                );
            },
        );

        return launchPadItemRows;
    }

    public render(): JSX.Element {
        const { axeInfo } = this.props.deps;
        return (
            <div className="main-section">
                <div className="popup-grid">
                    <main>
                        <h2 className="launch-pad-title ms-fontWeight-semibold">Launch pad</h2>
                        <hr className="launch-pad-hr" />
                        <div className="launch-pad-main-section">
                            {this.renderLaunchPadItemRows(this.props.rowConfigs)}
                        </div>
                    </main>
                    <div role="complementary" className="launch-pad-footer">
                        <div>
                            {`Version ${this.props.version} | Powered by `}
                            <ExternalLink
                                deps={this.props.deps}
                                title="Navigate to axe-core npm page"
                                href="https://www.npmjs.com/package/axe-core"
                            >
                                axe-core
                            </ExternalLink>{' '}
                            {axeInfo.version}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
