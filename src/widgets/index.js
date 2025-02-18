import { TextWidget, EmailWidget } from './text';
import { NumberWidget, IntegerWidget, RangeWidget } from './number';
import { CheckboxWidget, MultiCheckboxWidget } from './check';


const WIDGETS = {
    'text': TextWidget,
    'email': EmailWidget,
    'number': NumberWidget,
    'integer': IntegerWidget,
    'range': RangeWidget,
    'checkbox': CheckboxWidget,
    'multicheckbox': MultiCheckboxWidget,
};


export {
    WIDGETS,
    TextWidget,
    EmailWidget,
    NumberWidget,
    IntegerWidget,
    RangeWidget,
    CheckboxWidget,
    MultiCheckboxWidget,
};
