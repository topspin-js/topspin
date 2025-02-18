import { useContext } from 'react';
import InputField from './input';
import { useClassNames } from '../hooks';
import { FormContext, getKeyword, joinCoords, normalizeKeyword, resolveReference } from '../util';
import { getBlankData } from '../data';


export default function ArrayField({data, schema, name, level, parentType, ...props}) {
    const formContext = useContext(FormContext);

    const fields = []; // children fields

    const isReadonly = getKeyword(schema, 'readonly', 'readOnly', false);

    if (schema.items.hasOwnProperty('$ref')) {
        schema.items = {
            ...resolveReference(formContext.formState.getSchema(), schema.items['$ref']),
            ...schema.items
        };
        delete schema.items['$ref']; // TODO: don't mutate the original schema
    }

    let childRemovable = true;
    let min_items = getKeyword(schema, 'min_items', 'minItems') || 0;

    if (data.length <= min_items || isReadonly)
        childRemovable = false;

    let childAddable = true;
    let max_items = getKeyword(schema, 'max_items', 'maxItems') || 1000;
    if (data.length >= max_items || isReadonly)
        childAddable = false;

    for (let i = 0; i < data.length; i++) {
        let childSchema = schema.items;

        let childType = normalizeKeyword(schema.items.type);

        let childProps = {
            schema: {...childSchema},
            level: level + 1,
            removable: childRemovable,
            parentType: 'array',
            parentName: name,
            index: i,
        };

        if (isReadonly)
            childProps.schema.readOnly = true;

        childProps.data = data[i];
        childProps.name = joinCoords(name, i);

        if (i === 0 || isReadonly)
            childProps.upMovable = false;
        else
            childProps.upMovable = true;

        if (i === data.length - 1 || isReadonly)
            childProps.downMovable = false;
        else
            childProps.downMovable = true;

        let Child;
        if (childProps.schema.hasOwnProperty('widget')) {
            // If any type of field has a widget, it will be rendered as an InputField.
            Child = formContext.fields['input'];
        } else if (childType === 'array') {
            Child = formContext.fields['array'];
        } else if (childType === 'object') {
            Child = formContext.fields['object'];
        } else {
            // oneOf/anyOf
            if (schema.items.hasOwnProperty('oneOf')) {
                // TODO
            } else if (schema.items.hasOwnProperty('anyOf')) {
                // TODO
            } else {
                Child = formContext.fields['input'];
            }
        }
        fields.push(<Child {...childProps} key={joinCoords(name, i)} />)
    }

    let coords = name; // coordinates for insertion and deletion

    const Template = formContext.templates['array-field'];

    return (
        <Template
            title={schema.title}
            fields={fields}
            addItemButton={childAddable && 
                <AddItemButton
                    arrayName={name}
                    onAdd={formContext.onAdd}
                    itemSchema={schema.items}
                    formState={formContext.formState}
                />
            }
        />
    );
}


function AddItemButton({arrayName, onAdd, itemSchema, formState}) {
    const classNames = useClassNames();

    function handleClick() {
        onAdd(
            arrayName,
            getBlankData(
                itemSchema,
                (ref) => resolveReference(ref, formState.getSchema())
            )
        );
    }

    return (
        <button onClick={handleClick} className={classNames('field__add-btn')}>
            Add item
        </button>
    );
}
