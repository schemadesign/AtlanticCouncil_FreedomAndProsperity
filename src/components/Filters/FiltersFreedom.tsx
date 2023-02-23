import { IndexType } from "../../@enums/IndexType";
import { INDICATORS } from "../../data/data-util";
import Button from "../Button/Button";

import './_filters.scss';

interface IFiltersFreedom {
}

function FiltersFreedom(props: IFiltersFreedom) {
    return (
        <div className="filters--freedom">
            {Object.keys(INDICATORS[IndexType.FREEDOM]).map((type: string) => (
                <Button key={type}
                    variant={IndexType.FREEDOM}
                    onClick={() => {} }>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default FiltersFreedom;