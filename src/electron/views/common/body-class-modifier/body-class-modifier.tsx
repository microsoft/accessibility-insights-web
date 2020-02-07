// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformInfo } from 'electron/window-management/platform-info';
import { css } from 'office-ui-fabric-react';
import * as React from 'react';
import Helmet from 'react-helmet';

export type BodyClassModifierDeps = {
    platformInfo: PlatformInfo;
};

export type BodyClassModifierProps = {
    deps: BodyClassModifierDeps;
};

export class BodyClassModifier extends React.Component<BodyClassModifierProps> {
    public render(): JSX.Element {
        const classNames = [];

        if (this.props.deps.platformInfo.isMac()) {
            classNames.push('is-mac-os');
        }

        return (
            <Helmet>
                <body className={css(...classNames)} />
            </Helmet>
        );
    }
}
