import { useContext } from 'react';
import { FormContext, convertType, getCoordsFromName, getKeyword } from '../util';
import { FieldControls, FieldTitleEditButton } from '../components';


export default function InputField({data, schema, onChange, parentType, ...props}) {
    /**
     * Props:
     *   - data: The current value of the field.
     *   - schema: The schema for this field.
     *   - onChange: The function to call when changes happend.
     *   - parentType: The parent type of this field.
     *   - parentName: The name (coords) of the parent.
     *   - name: The name (coords) of this field.
     *   - level: Integer. A number denoting the nesting level of this field.
     *   - index: The index of this field in the parent array.
     *   - upMovable: Boolean. Whether this field can be moved up in the parent array.
     *   - downMovable: Boolean. Whether this field can be moved down in the parent array.
     *   - removable: Boolean. Whether this field can be removed from the parent array or object.
     *   - renamable: Boolean. Whether this field's title can be edited.
     */
    const formContext = useContext(FormContext);

    function handleChange(e) {
        const fieldType = schema.type;
        const type = e.target.type;
        let value;

        if (type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }

        if (Array.isArray(value)) {
            // multi-check, multi-select widget values are arrays
            value = value.map((item) => convertType(item, fieldType));
        } else {
            value = convertType(value, fieldType);
        }

        formContext.onChange(e.target.dataset.name, value);
    }

    const errorMsg = formContext.errorMap[getCoordsFromName(props.name)];

    let showControls = false;
    if (props.removable || props.upMovable || props.downMovable)
        showControls = true;

    const controls = showControls && (
        <FieldControls
            name={props.name}
            parentType={parentType}
            parentName={props.parentName}
            index={props.index}
            upMovable={props.upMovable}
            downMovable={props.downMovable}
            removable={props.removable}
        />
    );

    const titleEditButton = schema.title && props.renamable && (
        <FieldTitleEditButton />
    );

    const widgetProps = {
        name: props.name,
        onChange: handleChange,
        value: data ?? '',
        isInvalid: errorMsg ? true : false,
        title: schema.title,
        titleEditButton: titleEditButton,
        schema: schema,
        helpText: getKeyword(schema, 'help_text', 'helpText') || schema['description'],
        errorMsg: errorMsg,
    };

    let widgetName;

    if (!schema.hasOwnProperty('widget')) {
        switch (schema.type) {
            case 'string':
                widgetName = 'text';
                break;
            case 'integer':
                widgetName = 'integer';
                break;
            case 'number':
                widgetName = 'number';
                break;
            case 'boolean':
                widgetName = 'checkbox';
                break;
        }
    } else {
        widgetName = schema.widget;
    }

    if (!formContext.widgets.hasOwnProperty(widgetName)) {
        console.error('(!) Widget "' + widgetName + '" not found in the registry. Falling back to text input.');
        widgetName = 'text';
    }

    const Widget = formContext.widgets[widgetName];

    const Template = formContext.templates['input-field'];

    return (
        <Template
            widget={<Widget {...widgetProps} />}
            controls={controls}
        />
    );
}
