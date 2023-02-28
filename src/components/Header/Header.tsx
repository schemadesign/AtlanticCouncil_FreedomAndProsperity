import { useRef } from "react";
import { Page } from "../../@enums/Page";

import './_header.scss';

interface IHeader {
    page: Page,
    setPage: (page: Page) => void,
    children: React.ReactNode,
}

function Header(props: IHeader) {
    const { page, setPage, children } = props;
    const node = useRef(null);

    return (
        <header ref={node} className={`header`}>
            <div className='container'>
                <div className='flex-row'>
                    {[Page.MAP, Page.RANKINGS, Page.PROFILES, Page.COMPARE, Page.ABOUT, Page.LIBRARY].map(p => {
                        return (
                            <a href={`#${p}`} 
                                key={p}
                                className={`button ${p === page ? 'button--selected' : ''}`}
                                onClick={() => setPage(p)}>
                                {p.replace('-', ' ')}
                            </a>
                        )
                    })}
                </div>
                
                {children}
            </div>
        </header>
    )
}

export default Header;