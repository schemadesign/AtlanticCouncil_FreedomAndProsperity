import { FreedomCategory } from '../../@enums/FreedomCategory';
import { IndexType } from '../../@enums/IndexType';
import { ProsperityCategory } from '../../@enums/ProsperityCategory';
import IconFreedomCategory from '../../assets/icons/IconFreedomCategory';
import IconProsperityCategory from '../../assets/icons/IconProsperityCategory';
import './_category.scss';

interface ICategory {
    type: IndexType | null,
    category: ProsperityCategory | FreedomCategory | null | string,
}

function Category(props: ICategory) {
    const { category, type } = props;

    console.log( )

    return (
        <div className={`category category--${(category || '').toLowerCase()}`}>
            <div className='category__value'>
                {category}
            </div>
            {type === IndexType.FREEDOM ?
                <IconFreedomCategory category={category as FreedomCategory} />
                :
                type === IndexType.PROSPERITY ?
                    <IconProsperityCategory category={category as ProsperityCategory} />
                    :
                    null
            }
        </div>
    )
}

export default Category;