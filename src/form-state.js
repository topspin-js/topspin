import { getBlankData, getSyncedData } from './data';
import { validateSchema } from './schema-validator';
import { resolveReference } from './util';


export default class FormState {
    /**
     * Constructor is not for public consumption.
     * To create a FormState instance, don't use `new FormState(...)`.
     * Instead use `FormState.create(...)` method.
     */
    constructor({schema, data}) {
        this.schema = schema;
        this.data = data;
    }

    static create({schema, data}) {
        /* schema and data can be either a JSON string or a JS object.
         * data is optional.
         */

        if (typeof schema === 'string')
            schema = JSON.parse(schema);

        let validation = validateSchema(schema);

        if (!validation.isValid)
            throw new Error('Error while creating FormState: Invalid schema: ' + validation.msg);

        if (typeof data === 'string' && data !== '')
            data = JSON.parse(data);

        if (!data) {
            // create empty data from schema
            data = getBlankData(schema, (ref) => resolveReference(ref, schema));
        } else {
            // data might be stale if schema has new keys, so add them to data
            try {
                data = getSyncedData(data, schema, (ref) => resolveReference(ref, schema));
            } catch (error) {
                console.error("Error while creating FormState: Schema and data structure don't match");
                throw error;
            }
        }

        return new FormState({schema: schema, data: data});
    }

    static update({formState, data}) {
        /* Only for updating data.
         * For updating schema, create a new state.
         */
        return new FormState({schema: formState.getSchema(), data: data});
    }

    _getState() {
        return {schema: this.getSchema(), data: this.getData()};
    }

    getData() {
        return this.data;
    }

    getSchema() {
        return this.schema;
    }
}
