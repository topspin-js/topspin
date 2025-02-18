import Story from './base';


const story = new Story({
    name: 'Event handling',

    description: 'Event data is logged in console on every change',

    formConfig: {
        schema: {'type': 'object', 'properties': {'name': {'type': 'string'}}},
        data: {},
        errorMap: {},
    },

    beforeRender: function() {
        this.form.addEventListener('change', console.log);
    },
});

export default story;
