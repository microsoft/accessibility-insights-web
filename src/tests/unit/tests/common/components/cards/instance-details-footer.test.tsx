// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    allCardInteractionsSupported,
    noCardInteractionsSupported,
    onlyUserConfigAgnosticCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import {
    HighlightState,
    InstanceDetailsFooter,
    InstanceDetailsFooterDeps,
    InstanceDetailsFooterProps,
} from 'common/components/cards/instance-details-footer';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedResult } from './sample-view-model-data';

describe('InstanceDetailsFooter', () => {
    let resultStub: UnifiedResult;
    let props: InstanceDetailsFooterProps;
    let deps: InstanceDetailsFooterDeps;

    beforeEach(() => {
        resultStub = exampleUnifiedResult;
        deps = {
            cardInteractionSupport: allCardInteractionsSupported,
        } as InstanceDetailsFooterDeps;
        props = {
            deps,
            result: resultStub,
            highlightState: 'hidden',
        } as InstanceDetailsFooterProps;
    });

    it('renders as null when no card interactions are supported', () => {
        deps.cardInteractionSupport = noCardInteractionsSupported;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toBeNull();
    });

    it('renders per snapshot when all card interactions are supported (ie, web)', () => {
        deps.cardInteractionSupport = allCardInteractionsSupported;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot when only UserConfig-agnostic card interactions are supported (ie, electron)', () => {
        deps.cardInteractionSupport = onlyUserConfigAgnosticCardInteractionsSupported;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    const allHighlightStates: HighlightState[] = ['visible', 'hidden', 'unavailable'];

    it.each(allHighlightStates)('renders per snapshot with highlightState="%s"', (highlightState: HighlightState) => {
        props.highlightState = highlightState;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
