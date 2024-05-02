// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from '@fluentui/react';
import * as React from 'react';

import { LaunchPanelHeader } from '../components/launch-panel-header';

export class LaunchPanelHeaderClickHandler {
    public onClickLink(
        popupWindow: Window,
        ev?: React.MouseEvent<HTMLElement>,
        item?: IContextualMenuItem,
    ): void {
        if (item == null) {
            return;
        }

        const url: string = item.data;

        // the following warning is thrown incorrectly because the call to 'open' is not on the file system
        // see bug: https://github.com/nodesecurity/eslint-plugin-security/issues/54
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        popupWindow.open(url);
    }

    public onOpenContextualMenu(header: LaunchPanelHeader, event: React.MouseEvent<any>): void {
        header.setState({
            target: event.currentTarget,
        });
    }

    public openAdhocToolsPanel(header: LaunchPanelHeader): void {
        header.props.openAdhocToolsPanel();
    }
}
