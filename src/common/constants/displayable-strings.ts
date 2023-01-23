// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';

export class DisplayableStrings {
    public static previewFeaturesDescription: string =
        'The following preview features are available for your evaluation. Help us make them better!';
    public static fileUrlDoesNotHaveAccess: string = `Your browser settings don't allow ${title} to run on file URLs.`;
    public static urlNotScannable: string[] = [
        `${title} can't run on this URL.`,
        "You'll need to go to a different page.",
    ];
    public static noPreviewFeatureDisplayMessage: string =
        'No preview features are currently available to manage. Follow this page for future cool features.';
    public static injectionFailed: string =
        'Unable to communicate with target page. If you are using Microsoft Edge, make sure that the target page is not in Internet Explorer mode.';
}
