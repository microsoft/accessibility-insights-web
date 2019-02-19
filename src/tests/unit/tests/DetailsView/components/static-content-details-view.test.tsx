// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import { StaticContentDetailsView, StaticContentDetailsViewProps } from '../../../../../DetailsView/components/static-content-details-view';
import { ContentPageComponent } from '../../../../../views/content/content-page';
import { BaseDataBuilder } from '../../../common/base-data-builder';
import { EventStubFactory, INativeEventStub } from '../../../common/event-stub-factory';

describe('StaticContentDetailsViewTest', () => {
    it('render content page component', () => {
        const props = new StaticContentDetailsViewPropsBuilder().build();

        const actual = shallow(<StaticContentDetailsView {...props} />);

        expect(actual.debug()).toMatchSnapshot();
    });

    it('handle null content page component', () => {
        const props = new StaticContentDetailsViewPropsBuilder().with('content', null).build();

        const actual = shallow(<StaticContentDetailsView {...props} />);

        expect(actual.debug()).toMatchSnapshot();
    });

    it('click the toggle', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;
        const clickHandlerMock = Mock.ofInstance(event => {});
        clickHandlerMock.setup(chm => chm(event)).verifiable(Times.once());

        const propsBuilder = new StaticContentDetailsViewPropsBuilder().setupOnToggleClickMock(event);
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
            content: Mock.ofType<ContentPageComponent>().object,
        } as StaticContentDetailsViewProps;
    }

    public setupOnToggleClickMock(event: INativeEventStub): StaticContentDetailsViewPropsBuilder {
        this.onToggleClickMock.setup(click => click(It.isValue(event))).verifiable(Times.once());

        return this;
    }

    public verifyAll(): void {
        this.onToggleClickMock.verifyAll();
    }
}
