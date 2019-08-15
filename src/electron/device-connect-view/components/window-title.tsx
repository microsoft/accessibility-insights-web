// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export interface WindowTitleProps {
    title: string;
    children?: JSX.Element;
}

export const WindowTitle = NamedSFC<WindowTitleProps>('WindowTitle', (props: WindowTitleProps) => {
    return (
        <header className="ms-Grid window-title">
            <div className={css('ms-Grid-row')}>
                {props.children}
                <div role="heading" aria-level={1} className="ms-Grid-col header-text">
                    {props.title}
                </div>
            </div>
        </header>
    );
});
