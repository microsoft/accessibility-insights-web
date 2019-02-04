// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IStoreActionMessageCreator } from '../message-creators/istore-action-message-creator';
import { IClientStoresHub } from '../stores/iclient-stores-hub';

export type WithStoreSubscriptionProps<T> = {
    deps: StoreSubscriberDeps<T>;
    storeState?: T;
};

export type StoreSubscriberDeps<T> = {
    storesHub: IClientStoresHub<T>;
    storeActionMessageCreator: IStoreActionMessageCreator;
};

export function withStoreSubscription<P extends WithStoreSubscriptionProps<S>, S>(WrappedComponent: React.ComponentType<P>) {
    return class extends React.Component<P, S> {
        constructor(props: P) {
            super(props);
            if (this.hasStores()) {
                this.state = this.props.deps.storesHub.getAllStoreData();
            }
        }

        public componentDidMount(): void {
            if (!this.hasStores()) {
                return;
            }

            const { storesHub, storeActionMessageCreator } = this.props.deps;
            storesHub.addChangedListenerToAllStores(this.onStoreChange);
            storeActionMessageCreator.getAllStates();
        }

        public componentWillUnmount(): void {
            if (!this.hasStores()) {
                return;
            }
            this.props.deps.storesHub.removeChangedListenerFromAllStores(this.onStoreChange);
        }

        public onStoreChange = () => {
            const storeData = this.props.deps.storesHub.getAllStoreData();
            this.setState(storeData);
        };

        public hasStores = () => {
            const { storesHub } = this.props.deps;
            return storesHub && storesHub.hasStores();
        };

        public render(): JSX.Element {
            return <WrappedComponent {...this.props} storeState={this.state} />;
        }
    };
}
