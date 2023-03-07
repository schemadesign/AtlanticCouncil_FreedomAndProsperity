import IconCheck from '../../assets/icons/IconCheck';
import './_checkbox.scss';

interface IPanelContentProfiles {
    value: string,
    label?: string,
    disabled?: boolean,
    handleClick: (value: string) => void,
    checked: boolean,
    color?: string,
}

function Checkbox(props: IPanelContentProfiles) {
    const { label, value, checked, handleClick, disabled, color } = props;
    return (
        <label className={`checkbox ${!color ? 'checkbox--default' : ''}`}>
            <input type='checkbox'
                checked={checked}
                disabled={disabled}
                onChange={() => handleClick(value)}
            />
            <span className='checkbox__marker' style={{backgroundColor: checked ? color : ''}}>
                {checked ? <IconCheck /> : null}
            </span>
            <span className='checkbox__label'>
                {label ? label : value}
            </span>
        </label>
    )
}

export default Checkbox;