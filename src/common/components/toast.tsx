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
    content: React.ReactNode;
};

export class Toast extends React.Component<ToastProps, ToastState> {
    private timeoutId: number;

    public static defaultProps = {
        timeoutLength: 6000,
    };

    constructor(props) {
        super(props);
        this.state = { toastVisible: false, content: null };
    }

    public show(content: React.ReactNode): void {
        this.setState({ toastVisible: true, content });
        this.timeoutId = this.props.deps.windowUtils.setTimeout(() => {
            this.setState({ toastVisible: false, content: null });
        }, this.props.timeoutLength);
    }

    public componentWillUnmount(): void {
        if (this.timeoutId) {
            this.props.deps.windowUtils.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    public render(): JSX.Element {
        return this.state.toastVisible ? <div className={css('ms-fadeIn100', 'toast')}>{this.state.content}</div> : null;
    }
}
