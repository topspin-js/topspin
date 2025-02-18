import ObjectField from './object';
import ArrayField from './array';
import InputField from './input';


const FIELDS = {
    'object': ObjectField,
    'input': InputField,
    'array': ArrayField,
};


export {
    FIELDS,
    ObjectField,
    ArrayField,
    InputField,
};