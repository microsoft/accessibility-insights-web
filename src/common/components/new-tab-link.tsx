// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseComponent, css } from '@uifabric/utilities';
import { omit } from 'lodash';
import { ILinkProps, Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

export class NewTabLink extends BaseComponent<ILinkProps> {
    public render(): JSX.Element {
        const classNames = ['insights-link', this.props.className];
        const allPropsExceptClassName = omit(this.props, 'className');

        return <Link className={css(...classNames)} {...allPropsExceptClassName} target="_blank" />;
    }
}
