// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { audioVideoOnly } from './audio-video-only';
import { errors } from './errors';
import { headings } from './headings';
import { images } from './images';
import { keyboard } from './keyboard';
import { language } from './language';
import { links } from './links';
import { liveMultimedia } from './live-multimedia';
import { multimedia } from './multimedia';
import { page } from './page';
import { parsing } from './parsing';
import { repetitiveContent } from './repetitive-content';
import { sensory } from './sensory';
import { textLegibility } from './text-legibility';
import { timedEvents } from './timed-events';
import { landmarks } from './landmarks';
import { nativeWidgets } from './native-widgets';
import { customWidgets } from './custom-widgets';
import { focus } from './focus';
import { automatedChecks } from './automated-checks';

export const test = {
    headings,
    landmarks,
    audioVideoOnly,
    liveMultimedia,
    links,
    errors,
    images,
    keyboard,
    language,
    multimedia,
    page,
    parsing,
    repetitiveContent,
    sensory,
    textLegibility,
    timedEvents,
    nativeWidgets,
    customWidgets,
    focus,
    automatedChecks,
};
