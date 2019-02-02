// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactDOM from 'react-dom';

import { initializeFabricIcons } from '../../../../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { rendererDependencies } from '../../../../../views/insights/dependencies';

describe('rendererDependencies', () => {
    const subject = rendererDependencies;
    it('includes dom', () => {
        expect(subject.dom).toBe(document);
    });

    it('includes contentActionMessageCreator', () => {
        expect(subject.contentActionMessageCreator).toBeInstanceOf(ContentActionMessageCreator);
    });

    it('includes contentProvider', () => {
        expect(subject.contentProvider.allPaths().length).toBeGreaterThan(0);
    });

    it('includes initializeFabricIcons', () => {
        expect(subject.initializeFabricIcons).toBe(initializeFabricIcons);
    });

    it('includes render', () => {
        expect(subject.render).toBe(ReactDOM.render);
    });

    it('includes storesHub', () => {
        expect(subject.storesHub).toBeDefined();
    });

    it('includes storeActionCreator', () => {
        expect(subject.storeActionCreator).toBeDefined();
    });
});
