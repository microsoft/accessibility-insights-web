// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClassAssigner } from 'electron/views/common/body-class-modifier/class-assigner';
import { uniq } from 'lodash';
import { css } from 'office-ui-fabric-react';
import * as React from 'react';
import Helmet from 'react-helmet';

export type BodyClassModifierDeps = {
    classAssigners: ClassAssigner[];
};

export type BodyClassModifierProps = {
    deps: BodyClassModifierDeps;
};

export class BodyClassModifier extends React.Component<BodyClassModifierProps> {
    public render(): JSX.Element {
        const classNames = this.props.deps.classAssigners.map(assigner => assigner.assign());

        return (
            <Helmet>
                <body className={css(...uniq(classNames))} />
            </Helmet>
        );
    }
}
