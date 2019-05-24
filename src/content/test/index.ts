// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { audioVideoOnly } from './audio-video-only';
import { automatedChecks } from './automated-checks';
import { customWidgets } from './custom-widgets';
import { errors } from './errors';
import { focus } from './focus';
import { headings } from './headings';
import { images } from './images';
import { keyboard } from './keyboard';
import { landmarks } from './landmarks';
import { language } from './language';
import { links } from './links';
import { liveMultimedia } from './live-multimedia';
import { multimedia } from './multimedia';
import { nativeWidgets } from './native-widgets';
import { page } from './page';
import { parsing } from './parsing';
import { repetitiveContent } from './repetitive-content';
import { sensory } from './sensory';
import { semantics } from './semantics';
import { sequence } from './sequence';
import { textLegibility } from './text-legibility';
import { timedEvents } from './timed-events';

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
    semantics,
    sequence,
    textLegibility,
    timedEvents,
    nativeWidgets,
    customWidgets,
    focus,
    automatedChecks,
};
