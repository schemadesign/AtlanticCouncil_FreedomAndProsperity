import { IndexType } from "../../@enums/IndexType";
import { INDICATORS } from "../../data/data-util";
import Button from "../Button/Button";

import './_filters.scss';

interface IFiltersProsperity {
}

function FiltersProsperity(props: IFiltersProsperity) {
    return (
        <div className="filters--prosperity">
            {INDICATORS[IndexType.PROSPERITY].map((type: string) => (
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