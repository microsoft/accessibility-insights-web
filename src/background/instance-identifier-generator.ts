// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface HTMLInstance {
    html: string;
}

interface SelectorInstance {
    target: string[];
}

// tslint:disable-next-line:interface-name
export type IUniquelyIdentifiableInstances = HTMLInstance & SelectorInstance;

// tslint:disable-next-line:interface-name
export interface IInstanceWithHtmlAndSelector {
    html: string;
    target: string[];
}

export class InstanceIdentifierGenerator {
    public static generateSelectorIdentifier(instance: SelectorInstance): string {
        return instance.target.join(';');
    }

    public static defaultHtmlSelectorIdentifier(instance: IInstanceWithHtmlAndSelector): string {
        return instance.html + ',' + instance.target.join(';');
    }
}
