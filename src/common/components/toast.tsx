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
    timeoutLength?: number;
};

export type ToastState = {
    toastVisible: boolean;
};

export class Toast extends React.Component<ToastProps, ToastState> {
    private timeoutId: number;

    public static defaultProps = {
        timeoutLength: 1000,
    };

    public show(): void {
        this.setState({ toastVisible: true });
    }

    public componentWillUnmount(): void {
        if (this.timeoutId) {
            this.props.deps.windowUtils.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    public componentDidMount(): void {
        this.timeoutId = this.props.deps.windowUtils.setTimeout(() => {
            this.setState({ toastVisible: false });
            this.forceUpdate();
        }, this.props.timeoutLength);
    }

    public render(): JSX.Element {
        return this.state.toastVisible ? <div className={css('ms-fadeIn100', 'toast')}>{this.props.children}</div> : null;
    }
}
