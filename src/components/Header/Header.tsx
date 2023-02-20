import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import './_header.scss';

interface IHeader {
    page: string,
    setPage: (page: string) => void
}

function Header(props: IHeader) {
    const { page, setPage } = props;
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

                <input type='text'
                    className='header__search'
                    placeholder='Type country or region'
                    />
            </div>
        </header>
    )
}

export default Header;