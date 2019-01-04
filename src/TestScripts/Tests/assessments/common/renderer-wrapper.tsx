// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

interface IRendererProps {
    render: () => JSX.Element;
}

export class RendererWrapper extends React.Component<IRendererProps> {
    public render(): JSX.Element {
        return this.props.render();
    }
}
