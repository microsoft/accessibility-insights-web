// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { initializeFabricIcons } from 'common/fabric-icons';
import { Logger } from 'common/logging/logger';
import { ContentActionMessageCreator } from 'common/message-creators/content-action-message-creator';
import * as ReactDOM from 'react-dom';
import { Mock } from 'typemoq';
import { rendererDependencies } from 'views/insights/dependencies';
import { RendererDeps } from 'views/insights/renderer';

describe('rendererDependencies', () => {
    let subject: RendererDeps;
    beforeAll(() => {
        subject = rendererDependencies(
            Mock.ofType<BrowserAdapter>().object,
            Mock.ofType<Logger>().object,
        );
    });

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

    it('includes ContentRootComponent', () => {
        expect(subject.ContentRootComponent).toBeDefined();
    });
});
