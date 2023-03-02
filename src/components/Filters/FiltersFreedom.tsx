import { IndexType } from "../../@enums/IndexType";
import { formatLabel, NESTED_INDICATORS } from "../../data/data-util";
import Button from "../Button/Button";

import './_filters.scss';

export interface IFiltersFreedom {
    toggleFilter: (type: string) => void,
    filters: Array<string>,
    includeSubindicators?: boolean,
}

function FiltersFreedom(props: IFiltersFreedom) {
    const { toggleFilter, filters, includeSubindicators } = props;

    return (
        <div className="filters--freedom">
            {Object.keys(NESTED_INDICATORS[IndexType.FREEDOM]).map((type: string) => (
                <>
                    <Button key={type}
                        variant={IndexType.FREEDOM}
                        selected={filters.includes(type)}
                        onClick={() => toggleFilter(type) }>
                        {type}
                    </Button>
                    
                    {includeSubindicators ?
                        <>
                        {NESTED_INDICATORS[IndexType.FREEDOM][type].map((subindicator: string) => (
                            <Button key={subindicator}
                                variant={IndexType.FREEDOM}
                                selected={filters.includes(subindicator)}
                                onClick={() => toggleFilter(subindicator) }>
                                {formatLabel(subindicator)}
                            </Button>
                        ))}
                        </>
                        :
                        <></>
                    }
                </>
            ))}
        </div>
    )
}

export default FiltersFreedom;