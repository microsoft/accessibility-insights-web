// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import * as React from 'react';

export type IframePermissionsWarningProps = {
    pageHasIframes: boolean;
    allUrlPermissionsGiven: boolean;
    onRender: () => void;
};

export class IframePermissionsWarning extends React.PureComponent<IframePermissionsWarningProps> {
    public render(): JSX.Element {
        if (!this.shouldShowMessage(this.props)) {
            return null;
        }

        this.props.onRender();
        return <MessageBar messageBarType={MessageBarType.warning}>Placeholder text</MessageBar>;
    }

    private shouldShowMessage(props: IframePermissionsWarningProps): boolean {
        return props.pageHasIframes && !props.allUrlPermissionsGiven;
    }
}
