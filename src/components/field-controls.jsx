import { useContext } from 'react';
import { useClassNames } from '../hooks';
import { FormContext, joinCoords } from '../util';


export default function FieldControls({name, parentType, parentName, index, upMovable, downMovable, removable}) {
    const classNames = useClassNames();
    const formContext = useContext(FormContext);

    function handleClick(type) {
        if (type === 'remove' && removable) {
            return formContext.onRemove(name);
        } else if (type === 'moveUp' && upMovable) {
            return formContext.onMove(joinCoords(parentName, index), joinCoords(parentName, index - 1));
        } else if (type === 'moveDown' && downMovable) {
            return formContext.onMove(joinCoords(parentName, index), joinCoords(parentName, index + 1));
        }
    }

    return (
        <>
            {parentType === 'array' &&
                <ControlButton variant="moveup" text="Move up" onClick={(e) => handleClick('moveUp')} disabled={!upMovable} />
            }
            {parentType === 'array' && 
                <ControlButton variant="movedown" text="Move down" onClick={(e) => handleClick('moveDown')} disabled={!downMovable} />
            }
            <ControlButton variant="remove" text="Remove" onClick={(e) => handleClick('remove')} disabled={!removable} />
        </>
    );
}


function ControlButton({variant, text, disabled, onClick}) {
    const classNames = useClassNames();

    return (
        <button
            type="button"
            className={classNames('field__control-btn', 'field__control-btn--' + variant)}
            onClick={onClick}
            disabled={disabled}
            title={text}
        >
            <span className={classNames('btn__icon')}></span>
            <span className={classNames('btn__text')}>{text}</span>
        </button>
    );
}
