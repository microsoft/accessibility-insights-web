// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { LayerHost } from 'office-ui-fabric-react';
import * as React from 'react';

import { BaseStore } from '../common/base-store';
import { FeatureFlags } from '../common/feature-flags';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { NamedFC } from '../common/react/named-fc';
import { DevToolStoreData } from '../common/types/store-data/idev-tool-state';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { DictionaryStringTo } from '../types/common-types';
import { DetailsDialog, DetailsDialogDeps } from './components/details-dialog';
import { DetailsDialogHandler } from './details-dialog-handler';
import { DecoratedAxeNodeResult } from './scanner-utils';

export type LayeredDetailsDialogDeps = DetailsDialogDeps & {
    getRTL: typeof getRTL;
};

export interface LayeredDetailsDialogProps {
    deps: LayeredDetailsDialogDeps;
    userConfigStore: BaseStore<UserConfigurationStoreData>;
    elementSelector: string;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    target: string[];
    dialogHandler: DetailsDialogHandler;
    devToolStore: BaseStore<DevToolStoreData>;
    devToolActionMessageCreator: DevToolActionMessageCreator;
    featureFlagStoreData: DictionaryStringTo<boolean>;
    devToolsShortcut: string;
}

export const LayeredDetailsDialogComponent = NamedFC<LayeredDetailsDialogProps>('LayeredDetailsDialogComponent', props => {
    const isShadowDOMDialogEnabled = (): boolean => {
        return props.featureFlagStoreData[FeatureFlags.shadowDialog];
    };

    const detailsDialog = <DetailsDialog {...props} />;

    if (isShadowDOMDialogEnabled()) {
        return detailsDialog;
    }

    return (
        <LayerHost id="insights-dialog-layer-host" dir={props.deps.getRTL() ? 'rtl' : 'ltr'}>
            {detailsDialog}
        </LayerHost>
    );
});
