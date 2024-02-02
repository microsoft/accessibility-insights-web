// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import { VisualizationToggle } from 'common/components/visualization-toggle';
import {
    StaticContentDetailsView,
    StaticContentDetailsViewDeps,
    StaticContentDetailsViewProps,
} from 'DetailsView/components/static-content-details-view';
import * as React from 'react';
import { BaseDataBuilder } from 'tests/unit/common/base-data-builder';
import { EventStubFactory, NativeEventStub } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { ContentInclude } from 'views/content/content-include';
import { ContentReference } from 'views/content/content-page';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-include');
jest.mock('views/content/content-link');
jest.mock('common/components/heading-with-content-link');
jest.mock('common/components/visualization-toggle');

describe('StaticContentDetailsViewTest', () => {
    mockReactComponents([ContentInclude, HeadingWithContentLink, VisualizationToggle]);

    it('renders content page component', () => {
        const props = new StaticContentDetailsViewPropsBuilder().build();

        const renderResult = render(<StaticContentDetailsView {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('click the toggle', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;
        const clickHandlerMock = Mock.ofInstance(theEvent => {});
        clickHandlerMock.setup(chm => chm(event)).verifiable(Times.once());

        const propsBuilder = new StaticContentDetailsViewPropsBuilder().setupOnToggleClickMock(
            event,
        );
        const props: StaticContentDetailsViewProps = propsBuilder.build();
        render(<StaticContentDetailsView {...props} />);
        getMockComponentClassPropsForCall(VisualizationToggle).onClick();
        propsBuilder.verifyAll();
    });
});

class StaticContentDetailsViewPropsBuilder extends BaseDataBuilder<StaticContentDetailsViewProps> {
    private onToggleClickMock: IMock<(event) => void> = Mock.ofInstance(event => {});

    constructor() {
        super();

        this.data = {
            deps: 'stub-deps' as unknown as StaticContentDetailsViewDeps,
            title: 'my test title',
            visualizationEnabled: true,
            toggleLabel: 'my test toggle label',
            onToggleClick: this.onToggleClickMock.object,
            content: 'stub-content' as unknown as ContentReference,
            guidance: 'stub-guidance' as unknown as ContentReference,
            stepsText: 'test steps text',
        } as StaticContentDetailsViewProps;
    }

    public setupOnToggleClickMock(event: NativeEventStub): StaticContentDetailsViewPropsBuilder {
        this.onToggleClickMock.setup(click => click(It.isAny())).verifiable(Times.once());

        return this;
    }

    public verifyAll(): void {
        this.onToggleClickMock.verifyAll();
    }
}
