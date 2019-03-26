// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { LayerHost } from 'office-ui-fabric-react';
import * as React from 'react';

import { FeatureFlags } from '../common/feature-flags';
import { BaseStore } from '../common/istore';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { DictionaryStringTo } from '../types/common-types';
import { DetailsDialog, DetailsDialogDeps } from './components/details-dialog';
import { DetailsDialogHandler } from './details-dialog-handler';
import { DecoratedAxeNodeResult } from './scanner-utils';

export interface LayeredDetailsDialogDeps extends DetailsDialogDeps {
    getRTL: typeof getRTL;
}

export interface LayeredDetailsDialogProps {
    deps: LayeredDetailsDialogDeps;
    userConfigStore: BaseStore<UserConfigurationStoreData>;
    elementSelector: string;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    target: string[];
    dialogHandler: DetailsDialogHandler;
    devToolStore: BaseStore<DevToolState>;
    devToolActionMessageCreator: DevToolActionMessageCreator;
    featureFlagStoreData: DictionaryStringTo<boolean>;
    devToolsShortcut: string;
}

export class LayeredDetailsDialogComponent extends React.Component<LayeredDetailsDialogProps> {
    public render(): JSX.Element {
        const detailsDialog = <DetailsDialog {...this.props} />;

        if (this.isShadowDOMDialogEnabled()) {
            return detailsDialog;
        }
        return (
            <LayerHost id="insights-dialog-layer-host" dir={this.props.deps.getRTL() ? 'rtl' : 'ltr'}>
                {detailsDialog}
            </LayerHost>
        );
    }

    private isShadowDOMDialogEnabled(): boolean {
        return this.props.featureFlagStoreData[FeatureFlags.shadowDialog];
    }
}
