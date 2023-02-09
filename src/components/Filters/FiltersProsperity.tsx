import { IndexType } from "../../@enums/IndexType";
import Button from "../Button/Button";

import './_filters.scss';

interface IFiltersProsperity {
}

function FiltersProsperity(props: IFiltersProsperity) {
    return (
        <div className="filters--prosperity">
            {['Income', 'Productivity', 'Health', 'Education', 'Inequality', 'Minority Rights', 'Environment', 'Crime'].map((type: string) => (
                <Button key={type}
                    variant={IndexType.PROSPERITY}
                    onClick={() => {} }>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default FiltersProsperity;