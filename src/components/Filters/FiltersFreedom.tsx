import { IndexType } from "../../@enums/IndexType";
import { NESTED_INDICATORS } from "../../data/data-util";
import Button from "../Button/Button";

import './_filters.scss';

export interface IFiltersFreedom {
    toggleFilter: (type: string) => void,
    filters: Array<string>,
}

function FiltersFreedom(props: IFiltersFreedom) {
    const { toggleFilter, filters } = props;

    return (
        <div className="filters--freedom">
            {Object.keys(NESTED_INDICATORS[IndexType.FREEDOM]).map((type: string) => (
                <Button key={type}
                    variant={IndexType.FREEDOM}
                    selected={filters.includes(type)}
                    onClick={() => toggleFilter(type) }>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default FiltersFreedom;