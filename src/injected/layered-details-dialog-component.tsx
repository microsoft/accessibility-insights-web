// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LayerHost } from '@fluentui/react';
import { getRTL } from '@fluentui/utilities';
import * as React from 'react';

import { BaseStore } from '../common/base-store';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { NamedFC } from '../common/react/named-fc';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
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
    devToolsShortcut: string;
}

export const LayeredDetailsDialogComponent = NamedFC<LayeredDetailsDialogProps>(
    'LayeredDetailsDialogComponent',
    props => (
        <LayerHost id="insights-dialog-layer-host" dir={props.deps.getRTL() ? 'rtl' : 'ltr'}>
            <DetailsDialog {...props} />
        </LayerHost>
    ),
);
