interface IPage {
    id: string,
    title: string,
    children: React.ReactNode,
}

function Page(props: IPage) {
    const { id, title, children } = props;

    return (
        <div className={`page page--${id}`} id={id}>
            <div className="page__header">
                <div className="container">
                    <h1>
                        {title}
                    </h1>
                </div>
            </div>
            {children}
        </div>
    )
}

export default Page
