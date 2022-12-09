// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class HTMLCollectionOfBuilder {
    public static create<T extends Element>(items: T[]): HTMLCollectionOf<T> {
        const length = items.length;
        const nodeList: HTMLCollectionOf<T> = {
            ...(items ? [...items] : []),
            length: length,
            item: (pos: number) => {
                return items[pos];
            },
            namedItem: (name: string) => {
                return null;
            },
        };
        return nodeList;
    }
}
