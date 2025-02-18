import React from 'react';
import { JOIN_SYMBOL, ID_WHITESPACE_SYMBOL, FIELD_NAME_PREFIX } from './constants';


export const FormContext = React.createContext();


export function capitalize(string) {
    if (!string)
        return '';
    
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}


export function convertType(value, to) {
    if (typeof value === to)
        return value;

    if (to === 'number' || to === 'integer') {
        if (typeof value === 'string') {
            value = value.trim();
            if (value === '')
                value = null;
            else if (!isNaN(Number(value))) {
                value = Number(value);
            }
        } else if (typeof value === 'boolean') {
            value = value === true ? 1 : 0;
        }
    } else if (to === 'boolean') {
        if (value === 'false' || value === false)
            value = false;
        else
            value = true;
    }

    return value;
}


export function actualType(value) {
    /* Returns the "actual" type of the given value.

        - array -> 'array'
        - null -> 'null'
    */

    let type = typeof value;

    if (type === 'object') {
        if (Array.isArray(value))
            type = 'array';
        else if (value === null)
            type = 'null';
    }

    return type;
}


export function getSchemaType(schema) {
    /* Returns type of the given schema.

       If schema.type is not present, it tries to guess the type.

       If data is given, it will try to use that to guess the type.
    */
    let type;

    if (schema.hasOwnProperty('const'))
        type = actualType(schema.const);
    else
        type = normalizeKeyword(schema.type);

    if (!type) {
        if (schema.hasOwnProperty('properties') ||
            schema.hasOwnProperty('keys')
        )
            type = 'object';
        else if (schema.hasOwnProperty('items'))
            type = 'array';
        else if (schema.hasOwnProperty('allOf'))
            type = 'allOf';
        else if (schema.hasOwnProperty('oneOf'))
            type = 'oneOf';
        else if (schema.hasOwnProperty('anyOf'))
            type = 'anyOf';
        else
            type = 'string';
    }

    return type;
}


/**
 * Returns the value referenced by the $ref keyword.
 *
 * This will not normalize keywords, i.e. it won't convert 'keys'
 * to 'properties', etc. Because what if there's an actual key called
 * 'keys'? Substituting the keywords will lead to unexpected lookup.
 */
export function resolveReference(schema, ref) {
    let refSchema;
    let tokens = ref.split('/');

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token === '#')
            refSchema = schema;
        else
            refSchema = refSchema[token];
    }

    return {...refSchema};
}


export function getDisplayName(name) {
    if (name === undefined || name === null)
        return '';

    name = name.replace(/_/g, ' ');
    return capitalize(name);
}


export function getCsrfCookie() {
    let csrfCookies = document.cookie.split(';').filter((item) => item.trim().indexOf('csrftoken=') === 0);

    if (csrfCookies.length) {
        return csrfCookies[0].split('=')[1];
    } else {
        // if no cookie found, get the value from the csrf form input
        let input = document.querySelector('input[name="csrfmiddlewaretoken"]');
        if (input)
            return input.value;
    }

    return null;
}


export function joinCoords() {
    /* Generates coordinates from given arguments */
    return Array.from(arguments).join(JOIN_SYMBOL);
}


export function splitCoords(coords) {
    /* Generates coordinates */
    return coords.split(JOIN_SYMBOL);
}


export function getCoordsFromName(name) {
    /* Returns coordinates of a field in the data from
     * the given name of the input.
     * Field names have FIELD_NAME_PREFIX prepended but the coordinates don't.
     * e.g.:
     * name: rjf-0-field (where rjf- is the FIELD_NAME_PREFIX)
     * coords: 0-field
    */
    return name.slice((FIELD_NAME_PREFIX + JOIN_SYMBOL).length);
}


export function makeId(name) {
    return name.replaceAll(' ', ID_WHITESPACE_SYMBOL);
}


export function debounce(func, wait) {
    let timeout;

    return function() {
        clearTimeout(timeout);

        let args = arguments;
        let context = this;

        timeout = setTimeout(function() {
            func.apply(context, args);
        }, (wait || 1));
    }
}


export function normalizeKeyword(kw) {
    /* Converts custom supported keywords to standard JSON schema keywords */

    if (Array.isArray(kw))
        kw = kw.find((k) => k !== 'null') || 'null';

    switch (kw) {
        case 'list': return 'array';
        case 'dict': return 'object';
        case 'keys': return 'properties';
        case 'choices': return 'enum';
        case 'datetime': return 'date-time';
        default: return kw;
    }
}

export function getKeyword(obj, keyword, alias, default_value) {
    /* Function useful for getting value from schema if a
     * keyword has an alias.
    */
    return getKey(obj, keyword, getKey(obj, alias, default_value));
}

export function getKey(obj, key, default_value) {
    /* Approximation of Python's dict.get() function. */

    let val = obj[key];
    return (typeof val !== 'undefined') ? val : default_value;
}


export function choicesValueTitleMap(choices) {
    /* Returns a mapping of {value: title} for the given choices.
     * E.g.:
     *      Input: [{'title': 'One', 'value': 1}, 2]
     *      Output: {1: 'One', 2: 2}
    */

    let map = {};

    for (let i = 0; i < choices.length; i++) {
        let choice = choices[i];
        let value, title;
        if (actualType(choice) === 'object') {
            value = choice.value;
            title = choice.title;
        } else {
            value = choice;
            title = choice;
        }

        map[value] = title;
    }

    return map;
}


export function valueInChoices(schema, value) {
    /* Checks whether the given value is in schema choices or not.
       If schema doesn't have choices, returns true.
    */

    let choices = getKeyword(schema, 'choices', 'enum');
    if (!choices)
        return true;

    let found = choices.find((choice) => {
        if (typeof choice == 'object')
            choice = choice.value;

        return value == choice;
    })

    return found !== undefined ? true : false;
}


/* Set operations */

export function isEqualset(a, b) {
    return a.size === b.size && Array.from(a).every((i) => b.has(i));
}

export function isSuperset(set, subset) {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

export function isSubset(set, superset) {
    for (const elem of set) {
        if (!superset.has(elem)) {
            return false;
        }
    }
    return true;
}
