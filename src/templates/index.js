import ArrayFieldTemplate from './array-field';
import ObjectFieldTemplate from './object-field';
import InputFieldTemplate from './input-field';
import { TextWidgetTemplate } from './text-widgets';
import { CheckboxWidgetTemplate, MultiCheckboxWidgetTemplate, MultiCheckboxWidgetOptionTemplate } from './check-widgets';


const TEMPLATES = {
    'array-field': ArrayFieldTemplate,
    'object-field': ObjectFieldTemplate,
    'input-field': InputFieldTemplate,
    'text-widget': TextWidgetTemplate,
    'checkbox-widget': CheckboxWidgetTemplate,
    'multicheckbox-widget': MultiCheckboxWidgetTemplate,
    'multicheckbox-widget-option': MultiCheckboxWidgetOptionTemplate,
};


export {
    TEMPLATES,
    ArrayFieldTemplate,
    ObjectFieldTemplate,
    InputFieldTemplate,
    TextWidgetTemplate,
    CheckboxWidgetTemplate,
    MultiCheckboxWidgetTemplate,
    MultiCheckboxWidgetOptionTemplate,
};
