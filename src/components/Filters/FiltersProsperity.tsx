import { IndexType } from "../../@enums/IndexType";
import { INDICATORS } from "../../data/data-util";
import Button from "../Button/Button";
import { IFiltersFreedom } from "./FiltersFreedom";

import './_filters.scss';

interface IFiltersProsperity extends IFiltersFreedom {
    toggleFilter: (type: string) => void,
    filters: Array<string>,
}

function FiltersProsperity(props: IFiltersProsperity) {
    const { toggleFilter, filters } = props;

    return (
        <div className="filters--prosperity">
            {INDICATORS[IndexType.PROSPERITY].map((type: string) => (
                <Button key={type}
                    variant={IndexType.PROSPERITY}
                    selected={filters.includes(type)}
                    onClick={() => toggleFilter(type) }>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default FiltersProsperity;