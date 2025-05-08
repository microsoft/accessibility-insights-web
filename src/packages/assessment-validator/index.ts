// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone';
import { Assessments } from 'assessments/assessments';
import { LoadAssessmentDataSchemaProvider } from 'DetailsView/components/load-assessment-data-schema-provider';

const validatorFilePath = path.join(
    __dirname,
    '../../../src/DetailsView/components/generated-validate-assessment-json.js',
);

const generateValidator = () => {
    console.log('Generating schema...');
    const assessments = Assessments.all();
    const loadAssessmentDataSchemaProvider = new LoadAssessmentDataSchemaProvider();
    const schema = loadAssessmentDataSchemaProvider.getAssessmentSchema(assessments);

    console.log('Generating validator...');
    const ajv = new Ajv({ code: { source: true } });
    const validate = ajv.compile(schema);
    let moduleCode = standaloneCode(ajv, validate);

    console.log(`Writing validator file to ${validatorFilePath}...`);
    fs.writeFileSync(validatorFilePath, moduleCode);

    console.log('Finished generating assessment JSON validator.');
};

generateValidator();
