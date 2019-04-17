// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { NamedSFC, ReactSFCWithDisplayName } from '../react/named-sfc';

type VisibilityToggleProps = {
    isVisible: boolean;
    onShow: () => void;
    onHide: () => void;
};

type VisibilityToggleState = {
    isVisible: boolean;
};

export function withVisibilityToggle<P extends VisibilityToggleProps>(
    Component: ReactSFCWithDisplayName<P>,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof VisibilityToggleProps>>, VisibilityToggleState> {
    return class extends React.Component<Pick<P, Exclude<keyof P, keyof VisibilityToggleProps>>, VisibilityToggleState> {
        constructor(props: P) {
            super(props);
            this.state = { isVisible: false };
        }

        public render(): JSX.Element {
            const visibilityToggleProps: VisibilityToggleProps = {
                isVisible: this.state.isVisible,
                onHide: () => this.setState({ isVisible: false }),
                onShow: () => this.setState({ isVisible: true }),
            };
            const partialProps: Pick<P, Exclude<keyof P, keyof VisibilityToggleProps>> = this.props;
            const props = Object.assign(visibilityToggleProps, partialProps);
            return <Component {...props} />;
        }
    }
}

export type TestProps = VisibilityToggleProps & { text: string };

export const TestComponent = NamedSFC<TestProps>('testComponent', props => {
    return (
        <>
            <DefaultButton
                className={'test-button'}
                onClick={() => props.isVisible ? props.onHide() : props.onShow()}
            >
                Toggle Visibility
            </DefaultButton>
            {props.isVisible ? <h1>{props.text} </h1> : null}
        </>
    );
});

export const TestComponentWithVisibilityToggle = withVisibilityToggle<TestProps>(TestComponent);
