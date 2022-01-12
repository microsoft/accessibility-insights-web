// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { forEach } from 'lodash';
import {
    DetailsRow,
    FocusZone,
    GroupedList,
    IColumn,
    IGroup,
    Selection,
    SelectionMode,
    SelectionZone,
    Spinner,
} from '@fluentui/react';
import * as React from 'react';

export const columns: IColumn[] = [
    {
        key: 'key',
        name: 'property',
        fieldName: 'key',
        minWidth: 300,
    },
    {
        key: 'value',
        name: 'value',
        fieldName: 'value',
        minWidth: 300,
        onRender: item => JSON.stringify(item.value),
    },
];

export interface StoresTreeState {
    featureFlagStoreData: FeatureFlagStoreData;
    scopingStoreData: ScopingStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
}

type StoresTreeStateDatum = StoresTreeState[keyof StoresTreeState];

export type StoresTreeDeps = {
    storesHub: ClientStoresHub<StoresTreeState>;
};

export interface StoresTreeProps {
    deps: StoresTreeDeps;
    state: StoresTreeState;
}

type StoresTreeListItem = {
    key: string;
    value: StoresTreeStateDatum;
};

export const StoresTree = NamedFC<StoresTreeProps>('StoresTree', ({ deps, state }) => {
    const { storesHub } = deps;

    if (!storesHub.hasStoreData()) {
        return <Spinner label="loading..." />;
    }

    const compact = true;
    const selection = new Selection();
    const selectionMode = SelectionMode.none;

    const groups: IGroup[] = [];
    let items: StoresTreeListItem[] = [];

    let instanceCount: number = 0;

    forEach(state, (storeState, storeKey) => {
        const stateKeys = Object.keys(storeState);

        const currentGroup: IGroup = {
            key: storeKey,
            name: storeKey,
            startIndex: instanceCount,
            count: stateKeys.length,
        };

        groups.push(currentGroup);

        const currentGroupItems = stateKeys.map(key => {
            return {
                key,
                value: storeState[key],
            };
        });

        items = items.concat(currentGroupItems);

        instanceCount += currentGroupItems.length;
    });

    const onRenderCell = (nestingDepth: number, item: any, itemIndex: number): JSX.Element => {
        return (
            <DetailsRow
                columns={columns}
                groupNestingDepth={nestingDepth}
                item={item}
                itemIndex={itemIndex}
                selection={selection}
                selectionMode={selectionMode}
                compact={compact}
            />
        );
    };

    return (
        <FocusZone>
            <SelectionZone selection={selection} selectionMode={selectionMode}>
                <GroupedList
                    items={items}
                    onRenderCell={onRenderCell}
                    selection={selection}
                    selectionMode={selectionMode}
                    groups={groups}
                    compact={compact}
                />
            </SelectionZone>
        </FocusZone>
    );
});
