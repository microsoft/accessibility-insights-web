// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { generateARIACuesDictionary, generateHTMLCuesDictionary } from '../cues';
import { RuleConfiguration } from '../iruleresults';
import {
    createNativeWidgetConfiguration,
    getNativeWidgetElementType,
} from './native-widgets-default';

export const cuesConfiguration: RuleConfiguration = createNativeWidgetConfiguration(
    'cues',
    'cues-collector',
    evaluateCues,
);

export function evaluateCues(node: HTMLElement): boolean {
    // tslint:disable-next-line:no-invalid-this
    this.data({
        element: getNativeWidgetElementType(node),
        accessibleName: AxeUtils.getAccessibleText(node),
        htmlCues: generateHTMLCuesDictionary(node),
        ariaCues: generateARIACuesDictionary(node),
    });

    return true;
}
