import { useClassNames } from '../hooks';


export default function ObjectFieldTemplate({title, titleEditButton, fields, addPropertyButton, controls}) {
    const classNames = useClassNames();

    return (
        <div className={classNames('field', 'field--object')}>
            {(title || controls) &&
                <div className={classNames('field__header')}>
                    <div className={classNames('field__title')}>{title} {titleEditButton}</div>
                    {controls}
                </div>
            }
            <div className={classNames('field__content')}>
                {fields}
                {addPropertyButton}
            </div>
        </div>
    );
}
