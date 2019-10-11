// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';
import { WindowUtils } from '../window-utils';

export type ToastDeps = {
    windowUtils: WindowUtils;
};

export type ToastProps = {
    deps: ToastDeps;
    onTimeout?: () => void;
    timeoutLength?: number;
};

export class Toast extends React.Component<ToastProps> {
    private timeoutId: number;
    private hidden: boolean;

    public static defaultProps = {
        timeoutLength: 6000,
    };

    public componentWillUnmount(): void {
        if (this.timeoutId) {
            this.props.deps.windowUtils.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    public componentDidMount(): void {
        this.timeoutId = this.props.deps.windowUtils.setTimeout(() => {
            this.hidden = true;
            this.forceUpdate();
            if (this.props.onTimeout) {
                this.props.onTimeout();
            }
        }, this.props.timeoutLength);
    }

    public render(): JSX.Element {
        return this.hidden ? null : (
            <div role="alert" aria-live="polite" className={css('ms-fadeIn100', 'toast')}>
                {this.props.children}
            </div>
        );
    }
}
