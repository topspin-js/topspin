import { useWidget, useClassNames, useTemplate } from '../hooks';
import { makeId, joinCoords, getKeyword } from '../util';


/**
 * Checkbox widget for boolean type.
 */
export function CheckboxWidget({
    name, title, titleEditButton, isInvalid, schema, value, onChange,
    helpText, errorMsg,
    ...props
}) {
    const classNames = useClassNames();

    let checked = value;

    if (value === '' || value === null || value === undefined || value === 0)
        checked = false;
    else if (value)
        checked = true;

    const inputProps = {
        type: 'checkbox',
        'data-name': name,
        checked: checked,
        onChange: onChange,
        className: classNames('widget__input', 'widget__input--checkbox', {'widget__input--invalid' : isInvalid}),
    };

    const Template = useTemplate('checkbox-widget');
    const input = <input {...inputProps} />;

    return (
        <Template
            title={title}
            titleEditButton={titleEditButton}
            input={input}
            helpText={helpText}
            errorMsg={errorMsg}
        />
    );
}


export function MultiCheckboxWidget({name, title, titleEditButton, isInvalid, schema, value, onChange,
    helpText, errorMsg,
    ...props}) {
    // works inside array, or comma separated input field

    if (schema.type === 'string') {
        // string field is treated as comma separated values
        if (value)
            value = value.split(','); // TODO: allow comma escape within quotes
        else
            value = [];
    }

    let options = [];
    if (schema.hasOwnProperty('items'))
        options = getKeyword(schema.items, 'enum', 'choices' , [])
    else
        options = getKeyword(schema, 'enum', 'choices', []);

    function handleChange(e) {
        let newValue = new Set(value);

        if (e.target.checked)
            newValue.add(e.target.value);
        else
            newValue.delete(e.target.value);

        newValue = Array.from(newValue);

        if (schema.type === 'string')
            newValue = newValue.join(',');

        const event = {
            target: {
                dataset: {
                    name: name
                },
                value: newValue
            }
        }

        onChange(event);
    }

    const checkboxes = options.map((option, index) => {
        let optionTitle;
        let optionValue;

        if (typeof option === 'object') {
            optionTitle = option.title;
            optionValue = option.value;
        } else {
            optionTitle = optionValue = option;
        }

        return (
            <MultiCheckboxWidgetOption
                title={optionTitle}
                value={optionValue}
                checked={value.indexOf(optionValue) > -1}
                name={joinCoords(name, 'opt-' + index)}
                onChange={handleChange}
                isInvalid={isInvalid}
                key={index}
            />
        );
    });

    const Template = useTemplate('multicheckbox-widget');

    return (
        <Template
            title={title}
            titleEditButton={titleEditButton}
            input={checkboxes}
            isInvalid={isInvalid}
            helpText={helpText}
            errorMsg={errorMsg}
        />
    );
}


export function MultiCheckboxWidgetOption({title, value, checked, name, onChange, isInvalid}) {
    const classNames = useClassNames();

    const inputId = makeId(name);

    const inputProps = {
        type: 'checkbox',
        'data-name': name,
        checked: checked,
        value: value,
        onChange: onChange,
        id: inputId,
        className: classNames('widget__input', 'widget__input--multicheckbox', {'widget__input--invalid' : isInvalid})
    };

    const Template = useTemplate('multicheckbox-widget-option');
    const input = <input {...inputProps} />;

    return (
        <Template
            input={input}
            title={title}
            inputId={inputId}
        />
    );
}
