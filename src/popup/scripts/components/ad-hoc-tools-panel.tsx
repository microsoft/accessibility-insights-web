// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';

export interface IAdHocToolsPanelProps {
    backLinkHandler: () => void;
    diagnosticViewToggleFactory: DiagnosticViewToggleFactory;
}

export class AdHocToolsPanel extends React.Component<IAdHocToolsPanelProps, {}> {
    private sliceSize: number = 3;

    public render(): JSX.Element {
        const toggles = this.props.diagnosticViewToggleFactory.createTogglesForAdhocToolsPanel();
        const groups = this.getToggleGroups(toggles);

        return (
            <div className="ms-Grid main-section">
                <main id="launch-pad-main">
                    <div className="ms-Grid-row">
                        {groups}
                    </div>
                </main>
                <div role="navigation" className="ad-hoc-tools-panel-footer">
                    <Link
                        onClick={this.props.backLinkHandler}
                    >
                        <Icon iconName="back" />&nbsp;
                        Back to launch pad
                    </Link>
                </div>
            </div>
        );
    }

    private getToggleGroups(toggles: JSX.Element[]): JSX.Element[] {
        const groups: JSX.Element[] = [];

        while (toggles.length > 0) {
            const groupIndex = groups.length;
            const currentSlice = toggles.splice(0, this.sliceSize);
            this.insertDivider(currentSlice, groupIndex);

            const currentGroup: JSX.Element = (
                <div
                    key={`visualization-toggle-group-${groupIndex}`}
                    className={`ms-Grid-col ms-sm6 ms-md6 ms-lg6 ad-hoc-tools-panel-group-${groupIndex}`}
                >
                    {currentSlice}
                </div>
            );

            groups.push(currentGroup);
        }

        return groups;
    }

    private insertDivider(toggles: JSX.Element[], groupIndex: number): void {
        for (let index = 1; index < toggles.length; index += 2) {
            toggles.splice(index, 0, <div key={`diagnostic-view-toggle-divider-${groupIndex}-${index}`} className="ms-fontColor-neutralLight launch-panel-hr"></div>);
        }
    }
}

