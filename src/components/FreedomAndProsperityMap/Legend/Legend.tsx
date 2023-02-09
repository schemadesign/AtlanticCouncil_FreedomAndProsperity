import { FreedomCategory, FreedomCategoryKeys } from "../../../@enums/FreedomCategory";
import { IndexType } from "../../../@enums/IndexType";
import { ProsperityCategory, ProsperityCategoryKeys } from "../../../@enums/ProsperityCategory";
import Freedom from "../../../assets/icons/IconFreedom";
import Prosperity from "../../../assets/icons/IconProsperity";

import './_legend.scss';

interface ILegend {
    mode: IndexType | null
}


function Legend(props: ILegend) {
    const { mode } = props;

    return (
        <div className='freedom-prosperity-map__legend'>
            {mode !== IndexType.PROSPERITY ?
                <div className='freedom-prosperity-map__legend__category'>
                    {(Object.keys(FreedomCategory) as Array<FreedomCategoryKeys>).map((category) => (
                        <div className='freedom-prosperity-map__legend__item' key={category}>
                            <Freedom category={FreedomCategory[category]} />
                            <span>
                                {FreedomCategory[category]}
                            </span>
                        </div>
                    ))}
                </div>
                :
                <></>
            }
            {mode !== IndexType.FREEDOM ?
                <div className='freedom-prosperity-map__legend__category'>
                    {(Object.keys(ProsperityCategory) as Array<ProsperityCategoryKeys>).map((category) => (
                        <div className='freedom-prosperity-map__legend__item' key={category}>
                            <Prosperity category={ProsperityCategory[category]} />
                            <span>
                                {ProsperityCategory[category]}
                            </span>
                        </div>
                    ))}
                </div>
                :
                <></>
            }
        </div >
    )
}

export default Legend;