import { useClassNames } from '../hooks';


export function CheckboxWidgetTemplate({input, title, titleEditButton, isInvalid, helpText, errorMsg}) {
    const classNames = useClassNames();

    return (
        <div className={classNames('widget', 'widget--checkbox', {'widget--invalid' : isInvalid})}>
            <div className={classNames('widget__content')}>
                <label>{input} {title}</label> {titleEditButton}
                {helpText && <div className={classNames('widget__help-text')}>{helpText}</div>}
                {errorMsg && <div className={classNames('widget__error-message')}>{errorMsg}</div>}
            </div>
        </div>
    );
}


export function MultiCheckboxWidgetTemplate({title, titleEditButton, input, isInvalid, helpText, errorMsg}) {
    const classNames = useClassNames();

    return (
        <fieldset className={classNames('widget', 'widget--multicheckbox')}>
            <legend className={classNames('widget__header')}>{title} {titleEditButton}</legend>
            <div className={classNames('widget__content')}>
                {input}
                {helpText && <div className={classNames('widget__help-text')}>{helpText}</div>}
                {errorMsg && <div className={classNames('widget__error-message')}>{errorMsg}</div>}
            </div>
        </fieldset>
    );
}


export function MultiCheckboxWidgetOptionTemplate({title, input, inputId}) {
    const classNames = useClassNames();
    return (
        <div className={classNames('widget__option')}>
            <label htmlFor={inputId}>{input} {title}</label>
        </div>
    );
}
