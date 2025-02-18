import { useState } from 'react';
import { FormView } from './base';


export function Basic(props) {
    const schema = {
        type: 'object',
        properties: {
            name: {type: 'string'},
            age: {type: 'number', default: 4},
            isActive: {type: 'boolean', title: 'Is Active?'},
        }
    };

    const data = {'name': 'John'};
    return (
        <FormView
            title="Basic object"
            schema={schema}
            data={data}
        />
    );
}


export function AdditionalProperties(props) {
    const schema = {
        type: 'object',
        properties: {
            name: {type: 'string'},
            age: {type: 'number', default: 4},
        },
        additionalProperties: {type: 'string'},
    };

    const data = {'location': 'Antarctica'};

    return (
        <FormView
            title="Additonal properties"
            schema={schema}
            data={data}
        />
    );
}


export function NestedObject(props) {
    const schema = {
        type: 'object',
        properties: {
            name: {type: 'string'},
            phone: {
                type: 'object',
                properties: {
                    brand: {type: 'string'},
                    model: {type: 'string'},
                }
            },
        },
    };

    const data = {};

    return (
        <FormView
            title="Nested object"
            description="Object within object"
            schema={schema}
            data={data}
        />
    );
}

export function NestedArray(props) {
    const schema = {
        type: 'object',
        title: 'Person details',
        properties: {
            name: {
                type: 'string',
            },
            skills: {
                type: 'array',
                items: {type: 'string'}
            }
        }
    };

    const data = {};

    return (
        <FormView
            title="Nested array"
            description="Array within object"
            schema={schema}
            data={data}
        />
    );
}