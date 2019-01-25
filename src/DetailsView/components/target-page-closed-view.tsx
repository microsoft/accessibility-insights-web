// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export class TargetPageClosedView extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="target-page-closed">
                <h1>No content available</h1>
                <p>The target page was closed. You can close this tab or reuse it for something else.</p>
            </div>
        );
    }
}
