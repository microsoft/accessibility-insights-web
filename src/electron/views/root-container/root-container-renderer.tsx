// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RootContainer, RootContainerProps } from 'electron/views/root-container/components/root-container';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class RootContainerRenderer {
    constructor(
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: ParentNode,
        private readonly props: RootContainerProps,
    ) {}

    public render(): void {
        const rootContainer = this.dom.querySelector('#root-container');
        this.renderer(<RootContainer {...this.props} />, rootContainer);
    }
}
