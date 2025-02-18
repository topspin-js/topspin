import { useContext } from 'react';
import { useClassNames } from '../hooks';
import { FormContext, getKeyword, joinCoords, normalizeKeyword, getDisplayName, resolveReference } from '../util';
import { getBlankData } from '../data';


export default function ObjectField({data, schema, name, level, parentType, ...props}) {
    const formContext = useContext(FormContext);

    const fields = []; // children fields

    const isReadonly = getKeyword(schema, 'readonly', 'readOnly', false);
    let properties = getKeyword(schema, 'keys', 'properties', {}); // the properties object

    if (schema.hasOwnProperty('allOf')) {
        for (let i = 0; i < schema.allOf.length; i++) {
            properties = {...properties, ...getKeyword(schema.allOf[i], 'keys', 'properties', {})};
        }
    }

    let propertyNames = [...Object.keys(properties)]; // names of the declared properties

    if (schema.additionalProperties) {
        // include the additional properties present in the data
        propertyNames = [...propertyNames, ...Object.keys(data).filter((k) => propertyNames.indexOf(k) === -1)];
    }

    for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];
        const value = data[propertyName];
        const childName = joinCoords(name, propertyName);
        const isAdditionalProperty = properties.hasOwnProperty(propertyName) ? false : true;
        let propertySchema;

        if (isAdditionalProperty) {
            if (typeof schema.additionalProperties === 'boolean')
                propertySchema = {type: 'string'};
            else
                propertySchema = {...schema.additionalProperties};
        } else {
            propertySchema = {...properties[propertyName]};
        }

        const isRef = propertySchema.hasOwnProperty('$ref');

        if (isRef) {
            propertySchema = {
                ...resolveReference(formContext.formState.getSchema(), propertySchema['$ref']),
                ...propertySchema
            };
            delete propertySchema['$ref'];
        }

        if (isReadonly)
            propertySchema.readOnly = true;

        let type = normalizeKeyword(propertySchema.type);

        if (!propertySchema.title) {
            if (isAdditionalProperty)
                propertySchema.title = propertyName;
            else
                propertySchema.title = getDisplayName(propertyName);
        }

        let removable = false;
        if (properties[propertyName] === undefined)
            removable = true;

        if (schema.hasOwnProperty('required') && Array.isArray(schema.required)) {
            if (schema.required.indexOf(propertyName) > -1)
                propertySchema['required'] = true;
        }

        let childProps = {
            data: value,
            schema: propertySchema,
            name: childName,
            level: level + 1,
            removable: removable,
            parentType: 'object',
            parentName: name,
        };

        childProps.onKeyRename = () => handleKeyEdit(data, propertyName, value, childName, onRename);
        childProps.renamable = removable;

        let Child;
        if (childProps.schema.hasOwnProperty('widget')) {
            // If any type of field has a widget, it will be rendered as an InputField.
            Child = formContext.fields['input'];
        } else if (type === 'array') {
            Child = formContext.fields['array'];
        } else if (type === 'object') {
            Child = formContext.fields['object'];
        } else {
            // oneOf/anyOf
            if (childProps.schema.hasOwnProperty('oneOf')) {
                // TODO
            } else if (childProps.schema.hasOwnProperty('anyOf')) {
                // TODO
            } else {
                Child = formContext.fields['input'];
            }
        }

        fields.push(<Child {...childProps} key={childName} />);
    }

    const Template = formContext.templates['object-field'];
    const addPropertyButton = schema.additionalProperties && (
        <AddPropertyButton
            data={data}
            objectName={name}
            onAdd={formContext.onAdd}
            propertySchema={schema.additionalProperties}
            formState={formContext.formState}
        />
    );

    return (
        <Template
            title={schema.title}
            titleEditButton={null}
            fields={fields}
            addPropertyButton={addPropertyButton}
        />
    );
}


function AddPropertyButton({data, objectName, onAdd, propertySchema, formState}) {
    const classNames = useClassNames();

    function handleClick() {
        let key = prompt("Add new key");
        if (key === null) // clicked cancel
            return;

        if (propertySchema === true)
            propertySchema = {type: 'string'};

        key = key.trim();
        if (!key)
            alert("(!) Can't add empty key.\r\n\r\n‎");
        else if (data.hasOwnProperty(key))
            alert("(!) Duplicate keys not allowed. This key already exists.\r\n\r\n‎");
        else
            onAdd(
                joinCoords(objectName, key),
                getBlankData(
                    propertySchema,
                    (ref) => resolveReference(ref, formState.getSchema())
                )
            );
    }

    return (
        <button onClick={handleClick} className={classNames('field__add-btn')}>
            Add key
        </button>
    );
}
