// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { ContentReference } from 'views/content/content-page';
import { VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import {
    StaticContentDetailsView,
    StaticContentDetailsViewProps,
} from '../../../../../DetailsView/components/static-content-details-view';
import { BaseDataBuilder } from '../../../common/base-data-builder';
import { EventStubFactory, NativeEventStub } from '../../../common/event-stub-factory';

describe('StaticContentDetailsViewTest', () => {
    it('renders content page component', () => {
        const props = new StaticContentDetailsViewPropsBuilder().build();

        const actual = shallow(<StaticContentDetailsView {...props} />);

        expect(actual.debug()).toMatchSnapshot();
    });

    it('click the toggle', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;
        const clickHandlerMock = Mock.ofInstance(theEvent => {});
        clickHandlerMock.setup(chm => chm(event)).verifiable(Times.once());

        const propsBuilder = new StaticContentDetailsViewPropsBuilder().setupOnToggleClickMock(
            event,
        );
        const props: StaticContentDetailsViewProps = propsBuilder.build();
        const testObject = shallow(<StaticContentDetailsView {...props} />);
        const visualizationToggle = testObject.find(VisualizationToggle);
        visualizationToggle.prop('onClick')(event);
        propsBuilder.verifyAll();
    });
});

class StaticContentDetailsViewPropsBuilder extends BaseDataBuilder<StaticContentDetailsViewProps> {
    private onToggleClickMock: IMock<(event) => void> = Mock.ofInstance(event => {});

    constructor() {
        super();

        this.data = {
            title: 'my test title',
            visualizationEnabled: true,
            toggleLabel: 'my test toggle label',
            onToggleClick: this.onToggleClickMock.object,
            content: Mock.ofType<ContentReference>().object,
            guidance: Mock.ofType<ContentReference>().object,
            stepsText: 'test steps text',
        } as StaticContentDetailsViewProps;
    }

    public setupOnToggleClickMock(event: NativeEventStub): StaticContentDetailsViewPropsBuilder {
        this.onToggleClickMock.setup(click => click(It.isValue(event))).verifiable(Times.once());

        return this;
    }

    public verifyAll(): void {
        this.onToggleClickMock.verifyAll();
    }
}
