// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationStore } from 'background/stores/visualization-store';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { cloneDeep, forOwn } from 'lodash';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import {
    AssessmentScanData,
    VisualizationStoreData,
} from '../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseDataBuilder } from './base-data-builder';

export class VisualizationStoreDataBuilder extends BaseDataBuilder<VisualizationStoreData> {
    constructor() {
        super();
        this.data = new VisualizationStore(
            null,
            null,
            null,
            new WebVisualizationConfigurationFactory(),
        ).getDefaultState();
    }

    public withFocusedTarget(target: string[]): VisualizationStoreDataBuilder {
        this.data.focusedTarget = target;
        return this;
    }

    public withColorEnable(): VisualizationStoreDataBuilder {
        this.data.tests.adhoc.color.enabled = true;
        return this;
    }

    public withIssuesEnable(): VisualizationStoreDataBuilder {
        this.data.tests.adhoc.issues.enabled = true;
        return this;
    }

    public withLandmarksEnable(): VisualizationStoreDataBuilder {
        this.data.tests.adhoc.landmarks.enabled = true;
        return this;
    }

    public withLandmarksAssessment(enable: boolean, step: string): VisualizationStoreDataBuilder {
        return this.withAssessment(this.data.tests.assessments.landmarksAssessment, enable, step);
    }

    public withTabStopsEnable(): VisualizationStoreDataBuilder {
        this.data.tests.adhoc.tabStops.enabled = true;
        return this;
    }

    public withHeadingsEnable(): VisualizationStoreDataBuilder {
        this.data.tests.adhoc.headings.enabled = true;
        return this;
    }

    public withHeadingsAssessment(enable: boolean, step: string): VisualizationStoreDataBuilder {
        return this.withAssessment(this.data.tests.assessments.headingsAssessment, enable, step);
    }

    public withAllAdhocTestsTo(enabled: boolean): VisualizationStoreDataBuilder {
        forOwn(this.data.tests.adhoc, testData => {
            testData.enabled = enabled;
        });
        return this;
    }

    public withEnable(visualizationType: VisualizationType): VisualizationStoreDataBuilder {
        switch (visualizationType) {
            case VisualizationType.Headings:
                this.data.tests.adhoc.headings.enabled = true;
                break;
            case VisualizationType.Issues:
                this.data.tests.adhoc.issues.enabled = true;
                break;
            case VisualizationType.Landmarks:
                this.data.tests.adhoc.landmarks.enabled = true;
                break;
            case VisualizationType.TabStops:
                this.data.tests.adhoc.tabStops.enabled = true;
                break;
            case VisualizationType.Color:
                this.data.tests.adhoc.color.enabled = true;
                break;
            case VisualizationType.HeadingsAssessment:
                this.data.tests.assessments.headingsAssessment.enabled = true;
                break;
            default:
                throw new Error(`Unsupported type ${visualizationType}`);
        }

        return this;
    }

    public withDisable(visualizationType: VisualizationType): VisualizationStoreDataBuilder {
        switch (visualizationType) {
            case VisualizationType.Headings:
                this.data.tests.adhoc.headings.enabled = false;
                break;
            case VisualizationType.Issues:
                this.data.tests.adhoc.issues.enabled = false;
                break;
            case VisualizationType.Landmarks:
                this.data.tests.adhoc.landmarks.enabled = false;
                break;
            case VisualizationType.Color:
                this.data.tests.adhoc.color.enabled = false;
                break;
            case VisualizationType.TabStops:
                this.data.tests.adhoc.tabStops.enabled = false;
                break;
            case VisualizationType.HeadingsAssessment:
                this.data.tests.assessments.headingsAssessment.enabled = false;
                break;
            default:
                throw new Error(`Unsupported type ${visualizationType}`);
        }

        return this;
    }

    private withAssessment(
        assessment: AssessmentScanData,
        enabled: boolean,
        step: string,
    ): VisualizationStoreDataBuilder {
        assessment.stepStatus[step] = enabled;
        assessment.enabled = Object.keys(assessment.stepStatus).some(
            currentStep => assessment.stepStatus[currentStep] === true,
        );
        return this;
    }

    public withSelectedDetailsViewPivot(
        pivot: DetailsViewPivotType,
    ): VisualizationStoreDataBuilder {
        this.data.selectedDetailsViewPivot = pivot;
        return this;
    }

    public build(): VisualizationStoreData {
        return cloneDeep(this.data);
    }
}
