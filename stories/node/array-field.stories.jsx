import { useState } from 'react';
import { FormView } from './base';


export function Basic(props) {
    const schema = {
        type: 'array',
        title: 'Shopping list',
        items: {type: 'string'},
    };

    const data = [];
    return (
        <FormView
            title="Basic array"
            schema={schema}
            data={data}
        />
    );
}
