import Story from './base';


const story = new Story({
    name: 'Validation',

    description: 'Data validation',

    formConfig: {
        schema: {'type': 'object', 'properties': {'age': {'type': 'number'}}},
        data: {},
        errorMap: {},
        readonly: false

    },

    beforeRender: function() {

        const button = window.React.createElement(
            'button',
            {
                'onClick': this.form.validate
            },
            'Validate'
        );
        this.controlsRoot = window.ReactDOM.createRoot(document.getElementById(this.controlsId));
        this.controlsRoot.render(button);

    },

    beforeUnmount: function() {
        this.controlsRoot.unmount();
    }

});

export default story;
