export default function Story({name, description, formConfig, beforeRender, beforeUnmount}) {
    this.name = name;
    this.description = description;
    this.formConfig = formConfig;
    this.beforeRender = beforeRender ? beforeRender.bind(this) : null;
    this.beforeUnmount = beforeUnmount ? beforeUnmount.bind(this) : null;

    this.render = function(containerId, dataInputId, controlsId) {
        this.containerId = containerId;
        this.dataInputId = dataInputId;
        this.controlsId = controlsId;

        const config = {
            containerId: containerId,
            dataInputId: dataInputId,
            ...this.formConfig,
        }

        this.form = window.topspin.createForm(config);
        
        if (this.beforeRender)
            this.beforeRender();
        
        this.form.render();
    }

    this.unmount = function() {

        if (!this.form)
            return;

        if (this.beforeUnmount)
            this.beforeUnmount();

        window.topspin.deleteFormInstance(this.containerId);
    }
}
