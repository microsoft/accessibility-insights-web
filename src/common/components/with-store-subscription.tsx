// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ClientStoresHub } from '../stores/client-stores-hub';

export type WithStoreSubscriptionProps<T> = {
    deps: WithStoreSubscriptionDeps<T>;
    storeState: T;
};

export type WithStoreSubscriptionDeps<T> = {
    storesHub: ClientStoresHub<T>;
};

export function withStoreSubscription<P extends WithStoreSubscriptionProps<S>, S>(
    WrappedComponent: React.ComponentType<P>,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof { storeState: S }>>, Partial<S>> & {
    displayName: string;
} {
    return class extends React.Component<P, Partial<S>> {
        public static readonly displayName = `WithStoreSubscriptionFor${WrappedComponent.displayName}`;

        constructor(props: P) {
            super(props);
            if (this.hasStores()) {
                this.state = this.props.deps.storesHub.getAllStoreData()!;
            } else {
                this.state = {} as Partial<S>;
            }
        }

        public componentDidMount(): void {
            if (!this.hasStores()) {
                return;
            }

            const { storesHub } = this.props.deps;
            storesHub.addChangedListenerToAllStores(this.onStoreChange);
        }

        public componentWillUnmount(): void {
            if (!this.hasStores()) {
                return;
            }
            this.props.deps.storesHub.removeChangedListenerFromAllStores(this.onStoreChange);
        }

        private onStoreChange = async () => {
            const storeData = this.props.deps.storesHub.getAllStoreData();
            this.setState(storeData);
        };

        public hasStores = () => {
            if (this.props.deps == null) {
                return false;
            }

            const { storesHub } = this.props.deps;
            return storesHub && storesHub.hasStores();
        };

        public render(): JSX.Element {
            return <WrappedComponent {...this.props} storeState={this.state} />;
        }
    };
}
