// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReactSFCWithDisplayName } from '../react/named-sfc';

export type VisibilitySwitchProps = {
    isVisible: boolean;
    onShow: () => void;
    onHide: () => void;
};

export type VisibilitySwitchState = {
    isVisible: boolean;
};

export function withVisibilitySwitch<P extends VisibilitySwitchProps>(
    Component: ReactSFCWithDisplayName<P>,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof VisibilitySwitchProps>>, VisibilitySwitchState> {
    return class extends React.Component<Pick<P, Exclude<keyof P, keyof VisibilitySwitchProps>>, VisibilitySwitchState> {
        constructor(props: P) {
            super(props);
            this.state = { isVisible: false };
        }

        public render(): JSX.Element {
            const visibilitySwitchProps: VisibilitySwitchProps = {
                isVisible: this.state.isVisible,
                onHide: () => this.setState({ isVisible: false }),
                onShow: () => this.setState({ isVisible: true }),
            };
            const partialProps: Pick<P, Exclude<keyof P, keyof VisibilitySwitchProps>> = this.props;
            const props = Object.assign(visibilitySwitchProps, partialProps);
            return <Component {...props} />;
        }
    };
}
