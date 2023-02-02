import { MouseEventHandler } from 'react';
import { IndexType } from '../../@enums/IndexType';
import Freedom from './../../assets/icons/freedom';
import Prosperity from './../../assets/icons/prosperity';

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
    //         case ButtonIcons.ARROW_RIGHT:
    //             return <ArrowRight />
    //         case ButtonIcons.CHEVRON_LEFT:
    //             return <ChevronLeft />
    //         case ButtonIcons.CHEVRON_RIGHT:
    //             return <ChevronRight />
    //         case ButtonIcons.CLOSE:
    //             return <Close />
    //         case ButtonIcons.GRID:
    //             return <Grid />
    //         case ButtonIcons.NETWORK:
    //             return <Network />
    //         case ButtonIcons.RESOURCES:
    //             return <Resources />
    //         case ButtonIcons.FILTERS:
    //             return <Filters />
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
            {/* {variant === 'big-link' ?
                <span className='icon--arrow'>
                    <ArrowRight />
                </span>
                :
                null 
            } */}
        </button>
    )
}

export default Button;