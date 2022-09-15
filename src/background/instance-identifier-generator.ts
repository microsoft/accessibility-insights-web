// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { Target } from 'scanner/iruleresults';

interface HTMLInstance {
    html: string;
}

interface SelectorInstance {
    target: Target;
}

export type UniquelyIdentifiableInstances = HTMLInstance & SelectorInstance;

interface InstanceWithHtmlAndSelector {
    html: string;
    target: Target;
}

export class InstanceIdentifierGenerator {
    public static generateSelectorIdentifier(instance: SelectorInstance): string {
        return TargetHelper.getSelectorFromTarget(instance.target)!;
    }

    public static defaultHtmlSelectorIdentifier(instance: InstanceWithHtmlAndSelector): string {
        return instance.html + ',' + TargetHelper.getSelectorFromTarget(instance.target);
    }
}
