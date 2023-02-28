import './_checkbox.scss';

interface IPanelContentProfiles {
    value: string,
    label?: string,
    disabled?: boolean,
    handleClick: (value: string) => void,
    checked: boolean,
}

function Checkbox(props: IPanelContentProfiles) {
    const { label, value, checked, handleClick, disabled } = props;
    return (
        <label className='checkbox'>
            <input type='checkbox'
                checked={checked}
                disabled={disabled}
                onChange={() => handleClick(value)}
            />
            <span>
                {label ? label : value}
            </span>
        </label>
    )
}

export default Checkbox;