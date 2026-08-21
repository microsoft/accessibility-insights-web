// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { adaptableContent } from './adaptable-content';
import { audioVideoOnly } from './audio-video-only';
import { automatedChecks } from './automated-checks';
import { cognitive } from './cognitive';
import { contrast } from './contrast';
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
import { pointerMotion } from './pointer-motion';
import { repetitiveContent } from './repetitive-content';
import { semantics } from './semantics';
import { sensory } from './sensory';
import { sequence } from './sequence';
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
    repetitiveContent,
    sensory,
    semantics,
    sequence,
    adaptableContent,
    timedEvents,
    nativeWidgets,
    customWidgets,
    focus,
    automatedChecks,
    pointerMotion,
    contrast,
    cognitive,
};
