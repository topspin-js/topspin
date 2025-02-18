import { useState } from 'react';
import { FormView } from './base';


export function Default(props) {
    const schema = {
        type: 'object',
        properties: {
            name: {type: 'string', 'helpText': 'Your full name'},
            age: {type: 'number', default: 4},
            volume: {type: 'number', default: 4, widget: 'range'},
            isActive: {
                type: 'boolean',
                helpText: 'Whether the user is active', title: 'Is Active?',
            },
            skills: {
                type: 'array',
                description: 'This show dynamic titles',
                items: {type: 'string', titleCounter: '<counter>.'}
            },
            favourites: {
                type: 'object',
                title: 'Favourite stuff',
                description: 'List your favourite things',
                properties: {
                    food: {type: 'string'},
                    drink: {type: 'string'},
                    colours: {
                        type: 'array',
                        items: {type:'string', enum: ['red', 'blue', 'black', 'yellow', 'green'],},
                        widget: 'multicheckbox',
                        helpText: 'Select as many items as you want'
                    }
                }
            },
            'cars': {
                type: 'array',
                items: {
                    'title': 'Car',
                    'titleCounter': '#<counter>',
                    'type': 'object',
                    'properties': {
                        'make': {'type': 'string'},
                        'model': {'type': 'string'},
                        'year': {'type': 'string'},
                    }
                }
            }
        },
        additionalProperties: {type: 'string'}
    };
    const data = {'name': 'John', 'skills': ['Singing', 'Karate'], 'foo': 'bar'};
    return (
        <FormView
            title="Default theme"
            schema={schema}
            data={data}
        />
    );
}
