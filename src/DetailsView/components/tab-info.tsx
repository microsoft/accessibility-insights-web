// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export interface TabInfoDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}

export interface TabInfoProps {
    deps: TabInfoDeps;
    isTargetPageHidden: boolean;
    url: string;
    title: string;
    selectedPivot: DetailsViewPivotType;
    dropdownClickHandler: DropdownClickHandler;
}

export class TabInfo extends React.Component<TabInfoProps> {
    public render(): JSX.Element {
        if (!this.props.isTargetPageHidden) {
            return null;
        }

        const messageContent = (
            <div>
                The Target page is in a hidden state. For better performance, use the Target page link above to make the page visible.
            </div>
        );

        return <div>{this.renderMessageBar(messageContent, MessageBarType.warning, 'waring-message-bar')}</div>;
    }

    private renderMessageBar(messageContent: JSX.Element, messageBarType: MessageBarType, className: string): JSX.Element {
        return (
            <MessageBar messageBarType={messageBarType} className={className}>
                {messageContent}
            </MessageBar>
        );
    }
}
