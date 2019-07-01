// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class HTMLCollectionOfBuilder {
    public static create<T extends Element>(items: T[]): HTMLCollectionOf<T> {
        const length = items.length;
        const nodeList: HTMLCollectionOf<T> = {
            length: length,
            item: (pos: number) => {
                return items[pos];
            },
            namedItem: (name: string) => {
                return null;
            },
        };
        for (let i = 0; i < items.length; i++) {
            nodeList[i] = items[i];
        }
        return nodeList;
    }
}
