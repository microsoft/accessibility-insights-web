// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class NodeListBuilder {
    public static createNodeList<T extends Node>(items: T[]): NodeListOf<T> {
        const length = items.length;

        const nodeList: NodeListOf<T> = {
            length: length,
            item: (pos: number) => {
                return items[pos];
            },
        };

        for (let i = 0; i < items.length; i++) {
            nodeList[i] = items[i];
        }

        return nodeList;
    }
}
