// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// tslint:disable-next-line:interface-name
interface IHTMLInstance {
    html: string;
}

// tslint:disable-next-line:interface-name
interface ISelectorInstance {
    target: string[];
}

// tslint:disable-next-line:interface-name
export type IUniquelyIdentifiableInstances = IHTMLInstance & ISelectorInstance;

// tslint:disable-next-line:interface-name
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
