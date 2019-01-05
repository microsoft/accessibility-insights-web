// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ILinkProps, Link } from 'office-ui-fabric-react/lib/Link';
import { BaseComponent } from '@uifabric/utilities';
import * as React from 'react';

export class NewTabLink extends BaseComponent<ILinkProps> {
    public render(): JSX.Element {
        return <Link className="insights-link" {...this.props} target="_blank" />;
    }
}
