// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface IHTMLInstance {
    html: string;
}

interface ISelectorInstance {
    target: string[];
}

export type IUniquelyIdentifiableInstances = IHTMLInstance & ISelectorInstance;

export interface IInstanceWithHtmlAndSelector {
    html: string;
    target: string[];
}

export class InstanceIdentifierGenerator {
    public static generateSelectorIdentifier(instance: ISelectorInstance): string {
        return instance.target.join(';');
    }

    public static defaultHtmlSelectorIdentifier(instance: IInstanceWithHtmlAndSelector): string {
        return instance.html + ',' + instance.target.join(';');
    }
}
