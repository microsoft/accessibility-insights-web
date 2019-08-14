// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';

export interface WindowTitleProps {
    title: string;
    children?: JSX.Element;
}

export class WindowTitle extends React.Component<WindowTitleProps> {
    constructor(props: WindowTitleProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <header className="ms-Grid window-title">
                <div className={css('ms-Grid-row')}>
                    {this.props.children}
                    <div role="heading" aria-level={1} className="ms-Grid-col header-text">
                        {this.props.title}
                    </div>
                </div>
            </header>
        );
    }
}
