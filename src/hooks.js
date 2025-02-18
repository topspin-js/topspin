import { useContext } from 'react';
import { FormContext, convertType } from './util';
import { CLASS_NAME_PREFIX } from './constants';


/**
 * A hook that makes the CSS classnames map available for use.
 *
 * @returns {useClassNames~classNames} A function which takes one or more class
 *     name keys, looks them up in the global classname map,
 *     then joins the class values and returns a string.
 *     If the classname is not found in the map, it returns the parameters
 *     by prepending a namespace prefix.
 */
export function useClassNames() {
    const formContext = useContext(FormContext);

    /**
     * Joins multiple CSS classes.
     * It takes arbitrary number of arguments in the form of strings and objects.
     * It looks up the class names from the.
     * In case of missing keys from class maps, it prepends tsf- to the provided
     * key and returns.
     *
     * @example
     * // returns 'a b c'
     * classNames('a', 'b', {'c': true, 'd': 'false'});
     * 
     * @param {...(string|Object.<string, boolean>)} nameKeys - One or more keys
     *     in the form of string of objects. 
    */
    function classNames(...nameKeys) {
        const keys = [];

        for (let i = 0; i < nameKeys.length; i++) {
            let name = nameKeys[i];

            if (typeof name === 'object') {
                for (let key in name) {
                    if (!name.hasOwnProperty(key))
                        continue;

                    if (name[key])
                        keys.push(key);
                }
            } else {
                if (name)
                    keys.push(name);
            }
        }

        let className = '';

        for (let i = 0; i < keys.length; i++) {
            let name = keys[i];
            const value = formContext.classnames[name] ?? CLASS_NAME_PREFIX + '-' + name;
            className = className + value + ' ';
        }

        return className.trim();
    }

    return classNames;
}



export function useTemplate(name, fallback) {
    const formContext = useContext(FormContext);
    // TODO: log error message if template is not found
    return formContext.templates[name] || formContext.templates[fallback];
}


export function useWidget(name) {
    const formContext = useContext(FormContext);
    // TODO: log error message if widget is not found
    return formContext.widgets[name];
}
