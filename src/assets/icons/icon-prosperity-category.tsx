

import { ProsperityCategory } from '../../@enums/ProsperityCategory';
import './_icon-category.scss';

interface IProsperityCategory {
    category: ProsperityCategory
}

function IconProsperityCategory(props: IProsperityCategory) {
    const { category } = props;

    return (
        <svg className="icon--category" data-category={category} width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect className="icon--category__background" y="24.042" width="34" height="34" transform="rotate(-45 0 24.042)" fill="#F4F6F8" />
                <rect className="icon--category__indicator" x="12.0215" y="12.0215" width="17" height="17" transform="rotate(45 12.0215 12.0215)" fill="#C9CED4" />
            {category !== ProsperityCategory.UNPROSPEROUS ?
                <rect className="icon--category__indicator" x="24.043" y="24.041" width="17" height="17" transform="rotate(45 24.043 24.041)" fill="#C9CED4" />
                :
                null 
            }
            {category === ProsperityCategory.PROSPEROUS || category === ProsperityCategory.MOSTLY_PROSPEROUS ?
                <rect className="icon--category__indicator" x="24.043" width="17" height="17" transform="rotate(45 24.043 0)" fill="#C9CED4" />
                :
                null
            }
            {category === ProsperityCategory.PROSPEROUS ?
                <rect className="icon--category__indicator" x="36.0209" y="12" width="17" height="17" transform="rotate(45 36.0209 12)" fill="#C9CED4" />
                :
                null
            }
        </svg>
    )
}

export default IconProsperityCategory;