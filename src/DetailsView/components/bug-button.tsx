// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

export class BugButton extends React.Component {
    public render(): JSX.Element {
        return (
            <Link className="bugs-details-view">
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </Link>
        );
    }
}
