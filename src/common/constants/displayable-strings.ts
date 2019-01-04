// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from '../../content/strings/application';

export class DisplayableStrings {
    public static previewFeaturesDescription: string =
        'The following preview features are available for your evalution. Help us make them better!';
    public static fileUrlDoesNotHaveAccess: string = `Your Chrome settings don't allow ${title} to run on file URLs.`;
    public static urlNotScannable: string[] = [
        `${title} can't run on this URL.`,
        "You'll need to go to a different page."];
}
