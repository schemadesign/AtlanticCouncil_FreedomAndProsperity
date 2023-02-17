

import { FreedomCategory } from '../../@enums/FreedomCategory';
import { IIcon } from './IconProsperity';
import './_icon-category.scss';

function IconFreedomCategory(props: IIcon) {
    const { category } = props;

    return (
        <svg className="icon--category icon--category--freedom" data-category={category} width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect className="icon--category__background" y="24.042" width="34" height="34" transform="rotate(-45 0 24.042)" fill="#F4F6F8" />
                <rect className="icon--category__color" x="12.0215" y="12.0215" width="17" height="17" transform="rotate(45 12.0215 12.0215)" fill="#C9CED4" />
            {category !== FreedomCategory.UNFREE ?
                <rect className="icon--category__color" x="24.043" y="24.041" width="17" height="17" transform="rotate(45 24.043 24.041)" fill="#C9CED4" />
                :
                null 
            }
            {category === FreedomCategory.FREE || category === FreedomCategory.MOSTLY_FREE ?
                <rect className="icon--category__color" x="24.043" width="17" height="17" transform="rotate(45 24.043 0)" fill="#C9CED4" />
                :
                null
            }
            {category === FreedomCategory.FREE ?
                <rect className="icon--category__color" x="36.0209" y="12" width="17" height="17" transform="rotate(45 36.0209 12)" fill="#C9CED4" />
                :
                null
            }
        </svg>
    )
}

export default IconFreedomCategory;