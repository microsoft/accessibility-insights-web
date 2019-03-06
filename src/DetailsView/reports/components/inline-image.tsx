// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { adaLaptop } from '../../../icons/ada/ada-laptop-base64';
import { adaMulticolorBubbles } from '../../../icons/ada/ada-multicolor-bubbles-base64';
import { blue48 } from '../../../icons/brand/blue/brand-blue-48px-base64';

export enum InlineImageType {
    InsightsLogo48,
    AdaTheCat,
    FailIcon,
    PassIcon,
    NotApplicableIcon,
    AdaLaptop,
}

export interface InlineImageProps {
    type: InlineImageType;
    alt: string;
}

export class InlineImage extends React.Component<InlineImageProps> {
    public render(): JSX.Element {
        const imageData = this.inlineImageTypeToData[this.props.type];
        if (imageData === undefined) {
            return null;
        }
        return <img src={imageData} alt={this.props.alt} />;
    }

    // tslint:disable:max-line-length
    private inlineImageTypeToData: IDictionaryNumberTo<string> = {
        [InlineImageType.AdaTheCat]: adaMulticolorBubbles,
        [InlineImageType.AdaLaptop]: adaLaptop,
        [InlineImageType.InsightsLogo48]: blue48,
        [InlineImageType.FailIcon]:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgSURBVHgBjVO7UcNAFFwdGZFLcAeIChAdEOIIqwJDB1ABUIGVACHqAFwB7oArQY48DvzZlU+e55M09pvR6P12309K0CNfwPACGKyBagT4rpzEGlMmXwKTLfBIc2BCApf0v1uiA/gDSFnpm+oQ/eJJcNsQJE2LVH5OAFsELjheI6CPAJXRVWgqxaldGncmWIjZEKjSNZ/S5GTsNnOcM4uqjNnOTSD41Vt2VEDzpo7BNAKDvkKAewIVl422XAlcdQT8BpiFRc7RcWfGF861A960+m9GOMrjuH9u2W6pDIDCjoDjhanyrL7zJ/DGhAnOl4L7yOs7r4Bn9Hy/HeLZ7ZOUGpxzac1pTgDr0+VhyUkc5YbHdD5gf0L9HEqcE/Qyish3OPNZtBL6xXIAAAAASUVORK5CYII=',
        [InlineImageType.PassIcon]:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEjSURBVHgBjZPdTcMwFIWPLcoLEvIIZQIyApmAEYAJGl5RJYIEz6QT0A3oBmSDdoRswOWBFxoo59rFClF+eqUo1/b9jk98HYOecLmb4gsOxxDJpeqqMS3AocaMaabDuLCDwitMsGgKRdjduYSjVz5T9IWKTJD+CZhocYu3QbBDwPqJGs+jYLAOX1fjxafcNeFgPQJu8IkUJygIX+3nUku7FweBp7iMYIhEbScta4tO8AfLf6IW55Zq0phayaNkhB4GQY1vfNh4EBoGmZu7e3mSfBAMtWuzvxjvraWctqpeUGOLs9DnuSv4muHQ2GFJdzehz0fcqWl/GKz4Sbeaepi3RWg9ZVqOoKXWSSH+kE17lXf8mpLaT22h/hxauNEO0GrZrP0Fh/l0dPtaE5UAAAAASUVORK5CYII=',
        [InlineImageType.NotApplicableIcon]:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBrVI7boNAEJ1dXKQkN+AIiYA6rbukTeVUCKqQE0R0KV0CVdylTJkuKVOAlCNwBNIgWeLjN3hXQrItQPaT3u7ssG9nnhhBA4RhaFZV9YzwCbRU+k8IwYziOC6G94UOgiBY1XW9xiWTjqMEozRN1zph8OJ53kPXdR8QXtFp8Lelbdv/eZ7/9pV937fatv0etDmGUkp5yxZk0zThDCHDVBqSaPWOZgKae94X4I3KFeBmRLeifZdWX5nOwEJVtBRfJ+oKXXms1QPA808vBt7xj8uZ4oh3I8uy0nGcLeLlRG2UJMlnL+aFJ4YnZ8IDLxjPN30wdMAPuK67gYVrHE1FYkuwloCPqPhFl8IO01xYOdncfcYAAAAASUVORK5CYII=',
    };
}
