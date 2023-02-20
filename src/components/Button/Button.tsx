import { MouseEventHandler } from 'react';
import { IndexType } from '../../@enums/IndexType';
import Freedom from '../../assets/icons/IconFreedom';
import Prosperity from '../../assets/icons/IconProsperity';
import Close from '../../assets/icons/IconClose';
import Sort from '../../assets/icons/IconSort';

import './_button.scss';

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
    onClick: MouseEventHandler<HTMLButtonElement>,
    variant?: string | IndexType,
    selected?: boolean,
}

function Button(props: IButton) {
    const { onClick, children, className, variant = 'default', selected } = props;

    const svg = () => {
        switch (variant) {
            case IndexType.FREEDOM:
                return <Freedom />
            case IndexType.PROSPERITY:
                return <Prosperity />
            case IndexType.COMBINED:
                return <span>
                    {/* <Freedom/>
                    <Prosperity /> */}
                </span>
            case 'close':
                return <Close />
            case 'sort':
                return <Sort />
            default:
                return null;
        }
    }

    return (
        <button {...props}
            className={`button ${className || ''} ${variant ? `button--${variant.toLowerCase()}` : ''}  ${selected ? `button--selected` : ''}`}
            onClick={onClick}>
            {svg()}
            <span>
                {children}
            </span>
        </button>
    )
}

export default Button;