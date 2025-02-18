import { useWidget } from '../hooks';


function getInputProps(schema) {
    const newProps = {
        type: schema.type,
        step: 1
    };

    if (schema.hasOwnProperty('multipleOf')) {
        newProps.step = schema.multipleOf;
    } else {
        if (schema.type === 'number')
            newProps.step = 'any';
    }

    if (schema.minimum || schema.minimum === 0)
        newProps.min = schema.minimum;

    if (schema.maximum || schema.maximum === 0)
        newProps.max = schema.maximum;

    return newProps;
}


export function NumberWidget(props) {
    const Widget = useWidget('text');
    return <Widget {...props} {...getInputProps(props.schema)} templateName="number-widget" />;
}


export function IntegerWidget(props) {
    const Widget = useWidget('text');
    return <Widget {...props} {...getInputProps(props.schema)} templateName="integre-widget" />;
}


export function RangeWidget(props) {
    const Widget = useWidget('text');
    return <Widget {...props} {...getInputProps(props.schema)} type="range" templateName="range-widget" />;
}
