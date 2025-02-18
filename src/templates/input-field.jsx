import { useClassNames } from '../hooks';


export default function InputFieldTemplate({widget, controls}) {
    /**
     * Props:
     *   - inputWidget: Component. Widget for the input.
     *   - controls: Component. Field control buttons (move, remove).
     */
    const classNames = useClassNames();

    return (
        <div className={classNames('field', 'field--input')}>
            <div className={classNames('field__content')}>
                {widget}
            </div>
            <div className={classNames('field__controls')}>
                {controls}
            </div>
        </div>
    );
}
