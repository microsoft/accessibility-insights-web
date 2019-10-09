// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { detailsViewDropdownCallout } from './details-view-dropdown.scss';

export interface DetailsViewDropDownProps {
    menuItems: IContextualMenuItem[];
}

export interface DetailsViewDropDownState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export class DetailsViewDropDown extends React.Component<DetailsViewDropDownProps, DetailsViewDropDownState> {
    constructor(props) {
        super(props);
        this.state = {
            isContextMenuVisible: false,
            target: null,
        };
    }

    public render(): JSX.Element {
        return (
            <div className="details-view-dropdown">
                <Link className={'gear-button'} onClick={this.openDropdown}>
                    <Icon className="gear-options-icon" iconName="Gear" ariaLabel={'Manage Settings'} />
                </Link>
                {this.renderContextMenu()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
        if (!this.state.isContextMenuVisible) {
            return null;
        }
        return (
            <ContextualMenu
                calloutProps={{
                    className: detailsViewDropdownCallout,
                }}
                gapSpace={12}
                shouldFocusOnMount={true}
                target={this.state.target}
                onDismiss={this.dismissDropdown}
                directionalHint={DirectionalHint.bottomRightEdge}
                directionalHintForRTL={DirectionalHint.bottomLeftEdge}
                items={this.props.menuItems}
                id="settings-dropdown-menu"
            />
        );
    }

    protected openDropdown = (target: React.MouseEvent<HTMLElement>): void => {
        this.setState({ target: target.currentTarget, isContextMenuVisible: true });
    };

    protected dismissDropdown = (): void => {
        this.setState({ target: null, isContextMenuVisible: false });
    };
}
