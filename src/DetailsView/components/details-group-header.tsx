// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { GroupHeader } from 'office-ui-fabric-react/lib/components/GroupedList/GroupHeader';
import { IGroupDividerProps } from 'office-ui-fabric-react/lib/DetailsList';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { GuidanceLinks } from './guidance-links';
import { DetailsGroup } from './issues-table-handler';

export interface GroupHeaderProps extends IGroupDividerProps {
    countIcon?: JSX.Element;
    group: DetailsGroup;
}

export class DetailsGroupHeader extends React.Component<GroupHeaderProps> {
    public render(): JSX.Element {
        return (
            <GroupHeader
                onRenderTitle={this.onRenderTitle}
                {...this.props}
            />
        );
    }

    @autobind
    private onRenderTitle(): JSX.Element {
        return <>
            {this.renderRuleLink(this.props)}
            {': '}
            {this.props.group.name}
            {' ('}
            {this.props.countIcon}
            {' '}
            {this.props.group.count}
            {') '}
            {this.renderGuidanceLinks(this.props)}
        </>;
    }

    private renderRuleLink(props: GroupHeaderProps): JSX.Element {
        return (
            <NewTabLink
                href={props.group.ruleUrl}
                onClick={this.onRuleLinkClick}
            >
                {props.group.key}
            </NewTabLink>
        );
    }

    private renderGuidanceLinks(props: GroupHeaderProps): JSX.Element {
        return <GuidanceLinks
            links={props.group.guidanceLinks}
        />;
    }

    @autobind
    private onRuleLinkClick(event: React.MouseEvent<HTMLElement>): void {
        event.stopPropagation();
    }
}
