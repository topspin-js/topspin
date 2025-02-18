import Story from './base';


const story = new Story({
    name: 'Form',

    description: 'Simple form demo',

    formConfig: {
        schema: {'type': 'object', 'properties': {'name': {'type': 'string'}}},
        data: {},
        errorMap: {},
        readonly: false

    },

});

export default story;
