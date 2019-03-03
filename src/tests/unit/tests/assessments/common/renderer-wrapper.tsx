// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

// tslint:disable-next-line:interface-name
interface IRendererProps {
    render: () => JSX.Element;
}

export class RendererWrapper extends React.Component<IRendererProps> {
    public render(): JSX.Element {
        return this.props.render();
    }
}
