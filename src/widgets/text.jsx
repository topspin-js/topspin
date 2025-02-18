import { useClassNames, useTemplate, useWidget } from '../hooks';
import { makeId } from '../util';


/**
 * Text input.
 * It can be reused by other textual input widgets.
 *
 * Props:
 *   - name: String. Name (coords) of the input field.
 *   - title: String. Title of the field. Used as the label for the input.
 *   - titleEditButton: Component. Button for handling title editing.
 *   - isInvalid: Boolean. Whether this field has error or not.
 *   - schema: Object. Schema of the input field.
 *   - value: Any. Value of the input field.
 *   - onChange: Function. Function to call when value is changed.
 *   - helpText: String. Help text message.
 *   - errorMsg: String. Vaidation error message.
 *   - type: String. Optional. Type of the input. This prop useful when reusing this widget.
 *   - templateName: String. Optional. Name of the template. This prop useful when reusing this widget.
 */
export function TextWidget({
    name, title, titleEditButton, isInvalid, schema, value,
    onChange, helpText, errorMsg, type, templateName, ...props
}) {
    if (!type)
        type = 'text';

    const defaultStyles = {
        'widget__input': 'tsf-widget__input',
        ['widget__input--' + type]: 'tsf-widget__input--' + type,
        'widget__input--invalid': 'tsf-widget__input--invalid',
    };
    const classNames = useClassNames();
    const Template = useTemplate(templateName, 'text-widget');

    const inputId = makeId(name);

    const inputProps = {
        type: type,
        'data-name': name,
        className: classNames('widget__input', 'widget__input--' + type, {'widget__input--invalid': isInvalid}),
        value: value,
        onChange: onChange,
        id: inputId,
    }

    const input = <input {...inputProps} />;

    return (
        <Template
            title={title}
            titleEditButton={titleEditButton}
            input={input}
            inputType={type}
            inputId={inputId}
            helpText={helpText}
            errorMsg={errorMsg}
        />
    );
}


export function EmailWidget(props) {
    const Widget = useWidget('text');
    return (
        <Widget
            {...props}
            templateName="email-widget"
            type="email"
        />
    );
}
