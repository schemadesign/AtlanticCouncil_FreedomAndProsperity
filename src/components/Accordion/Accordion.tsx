import { ReactNode } from "react";

import './_accordion.scss';

interface IAccordion {
    children: ReactNode,
}

function Accordion(props: IAccordion) {
    const { children } = props;

    return (
        <div className='accordion'>
            {children}
        </div>
    )
}

export default Accordion;