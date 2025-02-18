import React from 'react';
import FormState from './form-state';
import { FIELD_NAME_PREFIX } from './constants';
import { FormContext, splitCoords, getSchemaType } from './util';


export default function TopspinForm({
    formState,
    onChange,
    errorMap,
    readonly,
    fields,
    templates,
    widgets,
    classnames,
    
}) {
    const data = formState.getData();
    const schema = formState.getSchema();

    const childProps = {
        data: formState.getData(),
        schema: formState.getSchema(),
        name: FIELD_NAME_PREFIX,
        level: 0,
    };

    if (readonly)
        schema.readonly = true; // TODO: don't mutate schema

    const type = getSchemaType(schema);
    let Field = fields[type];

    return (
        <div className="tsf-form-wrapper">
            <FormContext.Provider 
                value={{
                    formState: formState,
                    errorMap: errorMap || {},
                    onChange: (coords, value) => handleChange(coords, value, formState, onChange),
                    onAdd: (coords, value) => addPropertyOrItem(coords, value, formState, onChange),
                    onRemove: (coords) => removePropertyOrItem(coords, formState, onChange),
                    onMove: (oldCoords, newCoords) => moveItem(oldCoords, newCoords, formState, onChange),
                    onRename: (coords, newCoords, value) => renameProperty(coords, newCoords, value, formState),
                    fields: fields,
                    widgets: widgets,
                    templates: templates,
                    classnames: classnames,
                    //fileHandler: this.props.fileHandler,
                    //fileHandlerArgs: this.props.fileHandlerArgs,
                }}
            >
                <Field {...childProps} />
            </FormContext.Provider>
        </div>
    );
}


function handleChange(coords, value, formState, onChange) {
    /*
        e.target.name is a chain of indices and keys:
        xxx-0-key-1-key2 and so on.
        These can be used as coordinates to locate 
        a particular deeply nested item.

        This first coordinate is not important and should be removed.
    */
    coords = splitCoords(coords);

    coords.shift(); // remove first coord

    // TODO: use immutable JS instead of JSON-ising the data
    let data = setDataUsingCoords(coords, JSON.parse(JSON.stringify(formState.getData())), value);

    onChange(FormState.update({formState: formState, data: data}));
}


function addPropertyOrItem(coords, value, formState, onChange) {
    function recursiveUpdate(coords, data, value) {
        let coord = coords.shift();
        if (!isNaN(Number(coord)))
            coord = Number(coord);

        if (coords.length) {
            data[coord] = recursiveUpdate(coords, data[coord], value);
        } else {
            if (Array.isArray(data[coord])) {
                data[coord].push(value);
            } else {
                if (Array.isArray(data)) {
                    data.push(value);
                } else {
                    data[coord] = value;
                }
            }
        }
        return data;
    }

    coords = splitCoords(coords);
    coords.shift(); // remove first coord

    let newData = recursiveUpdate(coords, formState.getData(), value);
    onChange(FormState.update({formState: formState, data: newData}));
}


function removePropertyOrItem(coords, formState, onChange) {
    function recursiveRemove(coords, data) {
        let coord = coords.shift();
        if (!isNaN(Number(coord)))
            coord = Number(coord);

        if (coords.length) {
            recursiveRemove(coords, data[coord]);
        } else {
            if (Array.isArray(data))
                data.splice(coord, 1); // in-place mutation
            else
                delete data[coord];
        }
        return data;
    }

    coords = splitCoords(coords);
    coords.shift(); // remove first coord

    let newData = recursiveRemove(coords, formState.getData());
    onChange(FormState.update({formState: formState, data: newData}));
}


function moveItem(oldCoords, newCoords, formState, onChange) {
    function recursiveMove(oldCoords, newCoords, data) {
        let oldCoord = oldCoords.shift();

        if (!isNaN(Number(oldCoord)))
            oldCoord = Number(oldCoord);

        if (oldCoords.length) {
            recursiveMove(oldCoords, newCoords, data[oldCoord]);
        } else {
            if (Array.isArray(data)) {
                /* Using newCoords allows us to move items from 
                one array to another. 
                However, for now, we're only moving items in a 
                single array.
                */
                let newCoord = newCoords[newCoords.length - 1];
                
                let item = data[oldCoord];

                data.splice(oldCoord, 1);
                data.splice(newCoord, 0, item);
            }
        }

        return data;
    }

    oldCoords = splitCoords(oldCoords);
    oldCoords.shift(); // remove first coord
    newCoords = splitCoords(newCoords);
    newCoords.shift(); // remove first coord 

    let newData = recursiveMove(oldCoords, newCoords, formState.getData());
    onChange(FormState.update({formState: formState, data: newData}));
}


function setDataUsingCoords(coords, data, value) {
    let coord = coords.shift();

    if (!isNaN(Number(coord)))
        coord = Number(coord);

    if (coords.length) {
        data[coord] = setDataUsingCoords(coords, data[coord], value);
    } else {
        if (coord === undefined) // top level array with multiselect widget
            data = value;
        else
            data[coord] = value;
    }

    return data;
}
