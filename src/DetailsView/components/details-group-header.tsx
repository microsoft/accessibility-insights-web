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
    insertButtonLabels?: boolean;
    hideHeaderCount?: boolean;
    group: DetailsGroup;
}

export class DetailsGroupHeader extends GroupHeader {
    public render(): JSX.Element {
        const props = this.props as GroupHeaderProps;

        const rendered: JSX.Element = super.render();
        const focusZone: JSX.Element = rendered.props.children;
        const selectButton: JSX.Element = focusZone.props.children[0];
        const expandButton: JSX.Element = focusZone.props.children[3];
        const groupHeaderTitle: JSX.Element = focusZone.props.children[4];
        const headerCount: JSX.Element = groupHeaderTitle.props.children[1];
        const customHeaderCount: JSX.Element = props.hideHeaderCount ? null : (
            <span className={headerCount.props.className}>
                {headerCount.props.children[0]}
                {props.countIcon}
                {headerCount.props.children[1]}
                {headerCount.props.children[2]}
                {headerCount.props.children[3]}
            </span>
        );

        const buttonAriaLabel = this.props.group.isCollapsed === true ? 'Expand group' : 'Collapse group';

        return (
            <div
                className={rendered.props.className}
                style={rendered.props.style}
                onClick={rendered.props.onClick}
                aria-label={rendered.props['aria-label']}
                data-is-focusable={rendered.props['data-is-focusable']}
            >
                <FocusZone
                    className={focusZone.props.className}
                    direction={focusZone.props.direction}>
                    {this.renderButtonWithAriaLabel(selectButton, 'Toggle selection')}
                    {focusZone.props.children[1]}
                    {focusZone.props.children[2]}
                    {this.renderButtonWithAriaLabel(expandButton, buttonAriaLabel)}
                    <div className={groupHeaderTitle.props.className}>
                        {this.renderRuleLink(props)}
                        {groupHeaderTitle.props.children[0]}
                        {customHeaderCount}
                        {this.renderGuidanceLinks(props)}
                    </div>
                    {focusZone.props.children[5]}
                </FocusZone>
            </div>
        );
    }

    public renderButtonWithAriaLabel(rendered: JSX.Element, ariaLabel: string): JSX.Element {
        const props = this.props as GroupHeaderProps;
        if (!props.insertButtonLabels) {
            return rendered;
        }

        if (rendered.type !== 'button') {
            return rendered;
        }

        const buttonProps = {
            ...rendered.props,
            'aria-label': ariaLabel,
        };
        return React.createElement('button', buttonProps, rendered.props.children);
    }

    private renderRuleLink(props: GroupHeaderProps): JSX.Element {
        return (
            <div className={'rule-link-wrap'}>
                <NewTabLink
                    href={props.group.ruleUrl}
                    onClick={this.onRuleLinkClick}
                >
                    {props.group.key}
                </NewTabLink>
                :&nbsp;
            </div>
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
