import { useClassNames } from '../hooks';


export default function FieldTitleEditButton(props) {
    const classNames = useClassNames();

    function handleClick(e) {

    }

    return (
        <button
            type="button"
            className={classNames('field__title-edit-btn')}
            onClick={handleClick}
        >
            Edit
        </button>
    );
}
