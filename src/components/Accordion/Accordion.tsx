import { ReactNode, useState } from "react";
import Button from "../Button/Button";

import './_accordion.scss';

interface IAccordion {
    header: ReactNode,
    content: ReactNode,
}

function Accordion(props: IAccordion) {
    const [open, setOpen] = useState(false);
    const { header, content } = props;

    return (
        <div className={`accordion ${open ? 'accordion--open' : ''}`}>
            <div className='accordion__header'>
                {header}
                <Button variant='caret'
                    onClick={() => setOpen(prev => !prev)}
                    />
            </div>
            {open ?
                <div className='accordion__content'>
                    {content}
                </div>
                :
                null 
            }
        </div>
    )
}

export default Accordion;