// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

export type AutomatedChecksViewDeps = {};

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public render(): JSX.Element {
        return <>automated checks</>;
    }
}
