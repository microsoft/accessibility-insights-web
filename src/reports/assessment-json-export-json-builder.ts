// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { guidelineMetadata } from 'content/guideline-metadata';
import { AssessmentJsonExport } from 'reports/assessment-json-export-generator';
import { ReportModel } from 'reports/assessment-report-model';

export interface AssessmentJsonExportFailureInstance {
    path?: string;
    snippet?: string;
    comment?: string;
}

export interface AssessmentJsonExportRequirement {
    requirementKey: string;
    requirementDescription: string;
}

export type AssessmentJsonExportRequirementFailed = AssessmentJsonExportRequirement & {
    instances: AssessmentJsonExportFailureInstance[];
};

export type AssessmentJsonExportSuccessCriterionStatus = 'pass' | 'fail' | 'incomplete';
export interface AssessmentJsonExportSuccessCriterion {
    wcagNumber: string;
    wcagName: string;
    status: AssessmentJsonExportSuccessCriterionStatus;
    requirementsFailed: AssessmentJsonExportRequirementFailed[];
    requirementsPassed: AssessmentJsonExportRequirement[];
    requirementsIncomplete: AssessmentJsonExportRequirement[];
}

const buildResultsDataForJsonExport = (
    assessmentData: ReportModel,
): AssessmentJsonExportSuccessCriterion[] => {
    const criteria: AssessmentJsonExportSuccessCriterion[] = [];

    processPassedDetailsData(assessmentData, criteria);
    processIncompleteDetailsData(assessmentData, criteria);
    processFailedDetailsData(assessmentData, criteria);
    sortResults(criteria);

    return criteria;
};

function processPassedDetailsData(
    assessmentData: ReportModel,
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    assessmentData.passedDetailsData.forEach(passObject => {
        passObject.steps.forEach(requirement => {
            const currentRequirementKey = requirement.key;
            const currentGuidanceLinks = requirement.header.guidanceLinks;
            const currentRequirementDescription: string = processRequirementDescription(
                requirement.header.description.props,
            );

            currentGuidanceLinks.forEach(link => {
                if (!isWcagRequirement(link)) {
                    return;
                }
                const currentWcagNumber: string = guidelineMetadata[link.text].number;
                const currentWcagName: string = guidelineMetadata[link.text].name;

                addPassedRequirementToData(
                    currentRequirementKey,
                    currentRequirementDescription,
                    currentWcagNumber,
                    currentWcagName,
                    criteria,
                );
            });
        });
    });
}

function processIncompleteDetailsData(
    assessmentData: ReportModel,
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    assessmentData.incompleteDetailsData.forEach(incompleteObject => {
        incompleteObject.steps.forEach(requirement => {
            const currentRequirementKey = requirement.key;
            const currentGuidanceLinks = requirement.header.guidanceLinks;
            const currentRequirementDescription: string = processRequirementDescription(
                requirement.header.description.props,
            );

            currentGuidanceLinks.forEach(link => {
                if (!isWcagRequirement(link)) {
                    return;
                }
                const currentWcagNumber: string = guidelineMetadata[link.text].number;
                const currentWcagName: string = guidelineMetadata[link.text].name;

                addIncompleteRequirementToData(
                    currentRequirementKey,
                    currentRequirementDescription,
                    currentWcagNumber,
                    currentWcagName,
                    criteria,
                );
            });
        });
    });
}

function processFailedDetailsData(
    assessmentData: ReportModel,
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    assessmentData.failedDetailsData.forEach(failObject => {
        failObject.steps.forEach(requirement => {
            const currentRequirementKey: string = requirement.key;
            const currentGuidanceLinks: HyperlinkDefinition[] = requirement.header.guidanceLinks;
            const currentRequirementDescription: string = processRequirementDescription(
                requirement.header.description.props,
            );
            const currentInstances: AssessmentJsonExportFailureInstance[] = [];
            requirement.instances.forEach(instance => {
                const currentInstance: AssessmentJsonExportFailureInstance = {};
                instance.props.forEach(prop => {
                    if (prop.key === 'Comment') {
                        currentInstance.comment = prop.value.toString();
                    } else if (prop.key === 'Path') {
                        currentInstance.path = prop.value.toString();
                    } else if (prop.key === 'Snippet') {
                        currentInstance.snippet = prop.value.toString();
                    }
                });
                currentInstances.push(currentInstance);
            });

            currentGuidanceLinks.forEach(link => {
                if (!isWcagRequirement(link)) {
                    return;
                }

                const currentWcagNumber: string = guidelineMetadata[link.text].number;
                const currentWcagName: string = guidelineMetadata[link.text].name;

                addFailedRequirementToData(
                    currentRequirementKey,
                    currentRequirementDescription,
                    currentWcagNumber,
                    currentWcagName,
                    currentInstances,
                    criteria,
                );
            });
        });
    });
}

function isWcagRequirement(link: HyperlinkDefinition): boolean {
    return /WCAG\s\d+\.\d+\.\d+/.test(link.text);
}

function addNewCriterion(
    criteria: AssessmentJsonExportSuccessCriterion[],
    wcagNumber: string,
    wcagName: string,
    status: AssessmentJsonExportSuccessCriterionStatus,
): AssessmentJsonExportSuccessCriterion[] {
    criteria.push({
        wcagNumber: wcagNumber,
        wcagName: wcagName,
        status: status,
        requirementsFailed: [],
        requirementsPassed: [],
        requirementsIncomplete: [],
    });
    return criteria;
}

function addPassedRequirementToData(
    currentRequirementKey: string,
    currentRequirementDescription: string,
    currentWcagNumber: string,
    currentWcagName: string,
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    let existingCriterion = criteria.find(criterion => criterion.wcagNumber === currentWcagNumber);
    if (existingCriterion === undefined) {
        criteria = addNewCriterion(criteria, currentWcagNumber, currentWcagName, 'pass');
        existingCriterion = criteria[criteria.length - 1];
    }
    existingCriterion.requirementsPassed.push({
        requirementKey: currentRequirementKey,
        requirementDescription: currentRequirementDescription,
    });
}

function addIncompleteRequirementToData(
    currentRequirementKey: string,
    currentRequirementDescription: string,
    currentWcagNumber: string,
    currentWcagName: string,
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    let existingCriterion = criteria.find(criterion => criterion.wcagNumber === currentWcagNumber);
    if (existingCriterion === undefined) {
        criteria = addNewCriterion(criteria, currentWcagNumber, currentWcagName, 'incomplete');
        existingCriterion = criteria[criteria.length - 1];
    }
    if (existingCriterion.status === 'pass') {
        existingCriterion.status = 'incomplete';
    }
    existingCriterion.requirementsIncomplete.push({
        requirementKey: currentRequirementKey,
        requirementDescription: currentRequirementDescription,
    });
}

function addFailedRequirementToData(
    currentRequirementKey: string,
    currentRequirementDescription: string,
    currentWcagNumber: string,
    currentWcagName: string,
    currentInstances: AssessmentJsonExportFailureInstance[],
    criteria: AssessmentJsonExportSuccessCriterion[],
): void {
    let existingCriterion = criteria.find(criterion => criterion.wcagNumber === currentWcagNumber);
    if (existingCriterion === undefined) {
        criteria = addNewCriterion(criteria, currentWcagNumber, currentWcagName, 'fail');
        existingCriterion = criteria[criteria.length - 1];
    }
    if (existingCriterion.status === 'pass' || existingCriterion.status === 'incomplete') {
        existingCriterion.status = 'fail';
    }
    existingCriterion.requirementsFailed.push({
        requirementKey: currentRequirementKey,
        requirementDescription: currentRequirementDescription,
        instances: currentInstances,
    });
}

function processRequirementDescription(descriptionProps): string {
    let requirementDescription: string = '';
    if (Array.isArray(descriptionProps.children)) {
        descriptionProps.children.forEach(item => {
            if (typeof item === 'object') {
                requirementDescription += processRequirementDescription(item.props);
            } else {
                requirementDescription += item;
            }
        });
    } else {
        requirementDescription += descriptionProps.children ?? descriptionProps.tagName;
    }
    return requirementDescription;
}

function sortResults(
    criteria: AssessmentJsonExportSuccessCriterion[],
): AssessmentJsonExportSuccessCriterion[] {
    return criteria.sort((a, b) => a.wcagNumber.localeCompare(b.wcagNumber));
}

export function buildAssessmentJsonExportData(
    comment: string,
    version: string,
    assessmentData: ReportModel,
): AssessmentJsonExport {
    return {
        url: assessmentData.scanDetails.url,
        title: assessmentData.scanDetails.targetPage,
        date: assessmentData.scanDetails.reportDate.toISOString(),
        comment,
        version,
        results: buildResultsDataForJsonExport(assessmentData),
    };
}
