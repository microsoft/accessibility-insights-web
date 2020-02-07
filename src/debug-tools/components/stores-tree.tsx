// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';
import { forEach, isEmpty } from 'lodash';
import {
    DetailsRow,
    FocusZone,
    GroupedList,
    IColumn,
    Selection,
    SelectionMode,
    SelectionZone,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';

export type StoresTreeProps = {
    global: BaseStore<any>[];
    storeActionMessageCreator: StoreActionMessageCreator;
};

type StoresTreeState = {
    global: {
        [storeId: string]: any;
    };
};

const columns: IColumn[] = [
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

export class StoresTree extends React.Component<StoresTreeProps, StoresTreeState> {
    private selection = new Selection();
    private selectionMode = SelectionMode.none;
    private compact = true;

    constructor(props: StoresTreeProps) {
        super(props);
        this.state = {
            global: {},
        };
    }

    public componentDidMount(): void {
        this.props.global.forEach(store => {
            store.addChangedListener(() => {
                this.setState({
                    global: {
                        ...this.state.global,
                        [store.getId()]: store.getState(),
                    },
                });
            });
        });

        this.props.storeActionMessageCreator.getAllStates();
    }

    public render(): JSX.Element {
        const global = this.state.global;

        if (isEmpty(global)) {
            return <Spinner label="loading..." />;
        }

        const groups = [];
        let items = [];

        let instanceCount: number = 0;

        forEach(global, (storeState, storeKey) => {
            const stateKeys = Object.keys(storeState);

            const currentGroup = {
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

        this.selection.setItems(items);

        const onRenderCell = (nestingDepth: number, item: any, itemIndex: number): JSX.Element => {
            return (
                <DetailsRow
                    columns={columns}
                    groupNestingDepth={nestingDepth}
                    item={item}
                    itemIndex={itemIndex}
                    selection={this.selection}
                    selectionMode={this.selectionMode}
                    compact={this.compact}
                />
            );
        };

        return (
            <FocusZone>
                <SelectionZone selection={this.selection} selectionMode={this.selectionMode}>
                    <GroupedList
                        items={items}
                        onRenderCell={onRenderCell}
                        selection={this.selection}
                        selectionMode={this.selectionMode}
                        groups={groups}
                        compact={this.compact}
                    />
                </SelectionZone>
            </FocusZone>
        );
    }
}
