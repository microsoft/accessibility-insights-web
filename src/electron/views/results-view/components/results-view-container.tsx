// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

export type ResultsViewContainerDeps = {};

export type ResultsViewContainerProps = {
    deps: ResultsViewContainerDeps;
};

export type ResultViewContainerState = {};

export class ResultsViewContainer extends React.Component<ResultsViewContainerProps, ResultViewContainerState> {
    constructor(props: ResultsViewContainerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return null;
    }
}
