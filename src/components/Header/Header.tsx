import { useRef } from "react";
import { Page } from "../../@enums/Page";
import Button from "../Button/Button";
import Search from "../Search/Search";

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
                            <Button key={p}
                                selected={p === page}
                                onClick={() => setPage(p)}>
                                {p}
                            </Button>
                        )
                    })}
                </div>
                
                {children}
            </div>
        </header>
    )
}

export default Header;