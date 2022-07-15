// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar, MessageBarType } from '@fluentui/react';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanIncompleteWarningMessageBarDeps,
    WarningConfiguration,
} from 'DetailsView/components/warning-configuration';
import { forOwn, isEmpty } from 'lodash';
import * as React from 'react';

export type ScanIncompleteWarningDeps = ScanIncompleteWarningMessageBarDeps;

export type ScanIncompleteWarningProps = {
    deps: ScanIncompleteWarningDeps;
    warnings: ScanIncompleteWarningId[];
    warningConfiguration: WarningConfiguration;
    test: VisualizationType;
};

export class ScanIncompleteWarning extends React.PureComponent<ScanIncompleteWarningProps> {
    public render() {
        if (!this.shouldShowMessage(this.props)) {
            return null;
        }

        const messages: JSX.Element[] = [];
        forOwn(this.props.warningConfiguration, (render, warningId: ScanIncompleteWarningId) => {
            if (!this.props.warnings.includes(warningId)) {
                return;
            }

            const message = (
                <MessageBar key={warningId} messageBarType={MessageBarType.warning}>
                    {render(this.props)}
                </MessageBar>
            );

            messages.push(message);
        });

        return <>{messages}</>;
    }

    private shouldShowMessage(props: ScanIncompleteWarningProps): boolean {
        return !isEmpty(props.warnings);
    }
}
