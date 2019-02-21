// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface ConfigIssueTrackerButtonProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}
export class ConfigIssueTrackerButton extends React.Component<ConfigIssueTrackerButtonProps> {
    public render(): JSX.Element {
        return (
            <Button className="bugs-details-view-config" onClick={this.openMenu}>
                <Icon className="create-bug-button" iconName="Add" />
                {'Configure issue tracker'}
            </Button>
        );
    }

    // Needed to satisfy type checking
    @autobind
    protected openMenu(ev: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>) {
        this.props.onClick(ev);
    }
}
