// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IStoreActionMessageCreator } from '../../common/message-creators/istore-action-message-creator';
import { IClientStoresHub } from '../../common/stores/iclient-stores-hub';

export type WithStoreSubscriptionProps<T> = StoreSubscriberDeps<T> & {
    storeState?: T;
};

export type StoreSubscriberDeps<T> = {
    storesHub: IClientStoresHub<T>;
    storeActionCreator: IStoreActionMessageCreator;
};

export function withStoreSubscription<P extends WithStoreSubscriptionProps<S>, S>(WrappedComponent: React.ComponentType<P>) {
    return class extends React.Component<P, S> {
        constructor(props: P) {
            super(props);
            if (this.hasStores()) {
                this.state = this.props.storesHub.getAllStoreData();
            }
        }

        public componentDidMount(): void {
            if (!this.hasStores()) {
                return;
            }

            this.props.storesHub.addChangedListenerToAllStores(this.onStoreChange);
            this.props.storeActionCreator.getAllStates();
        }

        public componentWillUnmount(): void {
            if (!this.hasStores()) {
                return;
            }
            this.props.storesHub.removeChangedListenerFromAllStores(this.onStoreChange);
        }

        public onStoreChange = () => {
            const storeData = this.props.storesHub.getAllStoreData();
            this.setState(storeData);
        };

        public hasStores = () => {
            return this.props.storesHub && this.props.storesHub.hasStores();
        };

        public render() {
            return <WrappedComponent {...this.props} storeState={this.state} />;
        }
    };
}
