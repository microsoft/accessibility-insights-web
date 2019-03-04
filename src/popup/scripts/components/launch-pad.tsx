// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ExternalLink, ExternalLinkDeps } from '../../../common/components/external-link';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPadItemRow } from './launch-pad-item-row';
import { AxeInfo } from '../../../common/axe-info';

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
    public static demoLink: string =
        'https://msit.microsoftstream.com/video/7817f7b2-7c17-4ad8-a644-42d82ae697a2?channelId=66d47e66-d99c-488b-b9ea-98a153d2a4d4&channelName=Accessibility%20Tools';

    constructor(props: LaunchPadProps) {
        super(props);
    }

    private renderLaunchPadItemRows(rowConfigs: LaunchPadRowConfiguration[]): JSX.Element[] {
        const launchPadItemRows: JSX.Element[] = rowConfigs.map((config: LaunchPadRowConfiguration, index: number) => {
            return (
                <div key={`row-item-${index + 1}`}>
                    <LaunchPadItemRow
                        iconName={config.iconName}
                        description={config.description}
                        title={config.title}
                        onClickTitle={config.onClickTitle}
                    />
                    <hr className="ms-fontColor-neutralTertiaryAlt launch-pad-hr" />
                </div>
            );
        });

        return launchPadItemRows;
    }

    public render(): JSX.Element {
        const { axeInfo } = this.props.deps;
        return (
            <div className="ms-Grid main-section">
                <main>
                    <div role="heading" aria-level={2} className="launch-pad-title ms-fontWeight-semibold">
                        Launch pad
                    </div>
                    <hr className="ms-fontColor-neutralTertiaryAlt launch-pad-hr" />
                    <div className="launch-pad-main-section">{this.renderLaunchPadItemRows(this.props.rowConfigs)}</div>
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
        );
    }
}
