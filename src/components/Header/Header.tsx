import { useRef } from "react";
import Button from "../Button/Button";
import Search from "../Search/Search";

import './_header.scss';

interface IHeader {
    page: string,
    setPage: (page: string) => void,
    openPanel: () => void,
}

function Header(props: IHeader) {
    const { page, setPage, openPanel } = props;
    const node = useRef(null);

    return (
        <header ref={node} className={`header`}>
            <div className='container'>
                <div className='flex-row'>
                    {['map', 'rankings', 'profiles', 'compare', 'library', 'about'].map(p => {
                        return (
                            <Button key={p}
                                selected={p === page}
                                onClick={() => setPage(p)}>
                                {p}
                            </Button>
                        )
                    })}
                </div>
                
                <div className='flex-row justify-end'>
                    <Search />

                    <Button variant='open-panel'
                        onClick={() => openPanel()}>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header;