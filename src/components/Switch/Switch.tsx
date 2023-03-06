import ReactSwitch from "react-switch";

import './_switch.scss';

interface ISwitch {
    handleChange: () => void,
    checked: boolean,
    label: string,
}

function Switch(props: ISwitch) {
    const { handleChange, checked, label = '' } = props;

    return (
        <label className="switch">
            <ReactSwitch
                onChange={handleChange}
                checked={checked}
                checkedIcon={false}
                uncheckedIcon={false}
                height={18}
                width={32}
                handleDiameter={14}
                offColor={'#e6e6e6'}
                onColor={'#000'}
            />
            <span className="switch__label">{label}</span>
        </label>
    );
}

export default Switch;
