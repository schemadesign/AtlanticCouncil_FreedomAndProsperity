import Button from "../Button/Button";
import './_header.scss';

interface IHeader {
    page: string,
    setPage: (page: string) => void
}

function Header(props: IHeader) {
    const { page, setPage } = props;

    return (
        <header>
            <div className="container">
                {['map', 'rankings'].map(p => {
                    return (
                        <Button key={p}
                            selected={p === page}
                            onClick={() => setPage(p)}>
                            {p}
                        </Button>
                    )
                })}
            </div>
        </header>
    )
}

export default Header;