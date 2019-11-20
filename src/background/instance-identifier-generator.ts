// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface HTMLInstance {
    html: string;
}

interface SelectorInstance {
    target: string[];
}

export type UniquelyIdentifiableInstances = HTMLInstance & SelectorInstance;

export interface InstanceWithHtmlAndSelector {
    html: string;
    target: string[];
}

export class InstanceIdentifierGenerator {
    public static generateSelectorIdentifier(
        instance: SelectorInstance,
    ): string {
        return instance.target.join(';');
    }

    public static defaultHtmlSelectorIdentifier(
        instance: InstanceWithHtmlAndSelector,
    ): string {
        return instance.html + ',' + instance.target.join(';');
    }
}
