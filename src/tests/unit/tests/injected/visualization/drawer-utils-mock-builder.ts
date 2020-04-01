// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';

export class DrawerUtilsMockBuilder {
    private drawerUtilsMock: IMock<DrawerUtils>;
    private documentMock;
    private isOutSideOfDocument: boolean = false;
    private styleStub: CSSStyleDeclaration;

    constructor(dom, styleStub) {
        this.documentMock = dom;
        this.styleStub = styleStub;
        this.drawerUtilsMock = Mock.ofType(DrawerUtils);
    }

    public build(): IMock<DrawerUtils> {
        this.drawerUtilsMock
            .setup(d => d.getDocumentElement())
            .returns(() => this.documentMock)
            .verifiable(Times.atLeastOnce());

        this.drawerUtilsMock
            .setup(d => d.isOutsideOfDocument(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .returns(() => this.isOutSideOfDocument);

        return this.drawerUtilsMock;
    }

    public setupGetContainerSize(sizeValue: number): DrawerUtilsMockBuilder {
        this.drawerUtilsMock
            .setup(d =>
                d.getContainerHeight(
                    It.isAny(),
                    It.isAny(),
                    It.isAnyNumber(),
                    It.isValue(this.styleStub),
                    It.isValue(this.styleStub),
                ),
            )
            .returns(
                (offset, doc, elementBoundingClientRectHeight, bodyStyle, docStyle) => sizeValue,
            );
        this.drawerUtilsMock
            .setup(d =>
                d.getContainerWidth(
                    It.isAny(),
                    It.isAny(),
                    It.isAnyNumber(),
                    It.isValue(this.styleStub),
                    It.isValue(this.styleStub),
                ),
            )
            .returns(
                (offset, doc, elementBoundingClientRectHeight, bodyStyle, docStyle) => sizeValue,
            );
        return this;
    }

    public setupGetDocSize(sizeValue: number): DrawerUtilsMockBuilder {
        this.drawerUtilsMock
            .setup(d => d.getDocumentHeight(It.isAny(), this.styleStub, this.styleStub))
            .returns(
                (offset, doc, elementBoundingClientRectHeight, bodyStyle, docStyle) => sizeValue,
            )
            .verifiable(Times.once());
        this.drawerUtilsMock
            .setup(d => d.getDocumentWidth(It.isAny(), this.styleStub, this.styleStub))
            .returns(
                (offset, doc, elementBoundingClientRectHeight, bodyStyle, docStyle) => sizeValue,
            )
            .verifiable(Times.once());
        return this;
    }

    public setupGetContainerOffsetNeverCall(): DrawerUtilsMockBuilder {
        this.drawerUtilsMock
            .setup(d => d.getContainerTopOffset(It.isAny()))
            .verifiable(Times.never());
        this.drawerUtilsMock
            .setup(d => d.getContainerLeftOffset(It.isAny()))
            .verifiable(Times.never());
        return this;
    }

    public setupGetContainerOffset(offsetValue: number): DrawerUtilsMockBuilder {
        this.drawerUtilsMock
            .setup(d => d.getContainerTopOffset(It.isAny()))
            .returns(() => offsetValue);
        this.drawerUtilsMock
            .setup(d => d.getContainerLeftOffset(It.isAny()))
            .returns(() => offsetValue);

        return this;
    }

    public setupGetContainerSizeNeverCall(): DrawerUtilsMockBuilder {
        this.drawerUtilsMock
            .setup(d =>
                d.getContainerHeight(
                    It.isAny(),
                    It.isAny(),
                    It.isAnyNumber(),
                    It.isAny(),
                    It.isAny(),
                ),
            )
            .verifiable(Times.never());
        this.drawerUtilsMock
            .setup(d =>
                d.getContainerWidth(
                    It.isAny(),
                    It.isAny(),
                    It.isAnyNumber(),
                    It.isAny(),
                    It.isAny(),
                ),
            )
            .verifiable(Times.never());
        return this;
    }

    public setupIsOutsideOfDocument(isOutside: boolean): DrawerUtilsMockBuilder {
        this.isOutSideOfDocument = isOutside;
        return this;
    }
}
