import { useClassNames } from '../hooks';


export function TextWidgetTemplate({
    input, inputId, inputType, title, titleEditButton, isInvalid,
    helpText, errorMsg,
}) {
    const classNames = useClassNames();

    return (
        <div className={classNames('widget', 'widget--' + inputType, {'widget--invalid': isInvalid})}>
            {title &&
                <div className={classNames('widget__header')}>
                    <label htmlFor={inputId}>{title}</label>
                    {titleEditButton}
                </div>
            }
            <div className={classNames('widget__content')}>
                {input}
                {helpText && <div className={classNames('widget__help-text')}>{helpText}</div>}
                {errorMsg && <div className={classNames('widget__error-message')}>{errorMsg}</div>}
            </div>
        </div>
    );
}
