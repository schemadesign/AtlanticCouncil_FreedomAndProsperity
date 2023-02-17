

import { ProsperityCategory } from '../../@enums/ProsperityCategory';
import { IIcon } from './IconProsperity';
import './_icon-category.scss';

function IconProsperityCategory(props: IIcon) {
    const { category } = props;

    return (
        <svg className='icon--category icon--category--prosperity' width="42" height="42" viewBox="-2 -2 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" data-category={category}>
            <circle className="icon--category__background" cx="21" cy="21" r="21" fill="#667080" />
            <path className="icon--category__color" d="M21 42C18.2422 42 15.5115 41.4568 12.9636 40.4015C10.4158 39.3461 8.10079 37.7993 6.15076 35.8492C4.20073 33.8992 2.65388 31.5842 1.59853 29.0363C0.54318 26.4885 -1.15903e-06 23.7578 -9.17939e-07 21L21 21L21 42Z" fill="#667080" />
            {category !== ProsperityCategory.UNPROSPEROUS ?
                <path className="icon--category__color" d="M1.83588e-06 21C2.07697e-06 18.2422 0.543183 15.5115 1.59853 12.9636C2.65388 10.4158 4.20073 8.10078 6.15076 6.15075C8.10079 4.20072 10.4158 2.65388 12.9637 1.59853C15.5115 0.543178 18.2422 -2.19751e-06 21 -1.83588e-06L21 21L1.83588e-06 21Z" fill="#667080" />
                :
                null 
            }
            {category === ProsperityCategory.PROSPEROUS || category === ProsperityCategory.MOSTLY_PROSPEROUS ?
                <path className="icon--category__color" d="M42 21C42 23.7578 41.4568 26.4885 40.4015 29.0364C39.3461 31.5842 37.7993 33.8992 35.8492 35.8492C33.8992 37.7993 31.5842 39.3461 29.0364 40.4015C26.4885 41.4568 23.7578 42 21 42L21 21L42 21Z" fill="#667080" />
            :
                null 
            }
            {category === ProsperityCategory.PROSPEROUS ? 
                <path className="icon--category__color" d="M21 2.50422e-07C23.7578 2.83308e-07 26.4885 0.543181 29.0364 1.59853C31.5842 2.65388 33.8992 4.20073 35.8492 6.15076C37.7993 8.10079 39.3461 10.4158 40.4015 12.9636C41.4568 15.5115 42 18.2422 42 21L21 21L21 2.50422e-07Z" fill="#667080" />
                :
                null
            }
        </svg>
    )
}

export default IconProsperityCategory;