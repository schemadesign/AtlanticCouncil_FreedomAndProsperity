import { IndexType } from "../../@enums/IndexType";
import Button from "../Button/Button";

import './_filters.scss';

interface IFiltersFreedom {
}

function FiltersFreedom(props: IFiltersFreedom) {
    return (
        <div className="filters--freedom">
            {['Economic', 'Political', 'Legal'].map((type: string) => (
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