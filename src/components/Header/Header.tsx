import { useRef } from "react";
import { Pages } from "../../@enums/Pages";

import './_header.scss';

interface IHeader {
    page: Pages | null,
    setPage: (page: Pages) => void,
    children: React.ReactNode,
    className: string,
}

function Header(props: IHeader) {
    const { page, setPage, children, className } = props;
    const node = useRef(null);

    return (
        <header ref={node} className={`header ${className}`}>
            <div className='container'>
                <div className='flex-row'>
                    {[Pages.MAP, Pages.RANKINGS, Pages.PROFILES, Pages.COMPARE, Pages.ABOUT, Pages.LIBRARY].map(p => {
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