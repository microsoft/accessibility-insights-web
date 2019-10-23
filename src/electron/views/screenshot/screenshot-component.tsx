// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export type ScreenshotComponentProps = {
    image: string;
    alt: string;
};

export class ScreenshotComponent extends React.Component<ScreenshotComponentProps> {
    public render(): JSX.Element {
        return <img src={'data:image/png;base64,' + this.props.image} alt={this.props.alt} />;
    }
}
