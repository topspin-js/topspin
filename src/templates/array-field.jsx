import { useClassNames } from '../hooks';


export default function ArrayFieldTemplate({title, titleEditButton, fields, addItemButton, controls}) {
    const classNames = useClassNames();

    return (
        <div className={classNames('field', 'field--array')}>
            {(title || controls) &&
                <div className={classNames('field__header')}>
                    <div className={classNames('field__title')}>{title} {titleEditButton}</div>
                    {controls}
                </div>
            }
            <div className={classNames('field__content')}>
                {fields}
                {addItemButton}
            </div>
        </div>
    );
}
