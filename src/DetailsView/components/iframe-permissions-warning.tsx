// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { isEmpty, forOwn } from 'lodash';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import * as React from 'react';

export type ScanIncompleteWarningProps = {
    warnings: ScanIncompleteWarningId[];
    onRender: () => void;
};

const warningToMessage: { [key in ScanIncompleteWarningId]: (props: ScanIncompleteWarningProps) => JSX.Element } = {
    'missing-required-cross-origin-permissions': () => (
        <>We have detected iframes in the target page. To have complete results, please give us permissions. Learn more here.</>
    ),
};

export class ScanIncompleteWarning extends React.PureComponent<ScanIncompleteWarningProps> {
    public render(): JSX.Element {
        if (!this.shouldShowMessage(this.props)) {
            return null;
        }

        this.props.onRender();
        const messages = [];
        forOwn(warningToMessage, (render, warningId: ScanIncompleteWarningId) => {
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
