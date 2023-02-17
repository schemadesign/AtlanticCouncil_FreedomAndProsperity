import { IIcon } from "./IconProsperity";
import './_icon-category.scss';

function IconFreedom(props: IIcon) {
    const { category } = props;

    return (
        
        <svg className="icon icon--freedom" data-category={category} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="icon--category__color" d="M8.15325 15.3539L8.50681 15.7068L8.86001 15.3536L15.3536 8.86001L15.7068 8.50681L15.3539 8.15325L8.86036 1.6468L8.50681 1.29254L8.1529 1.64645L1.64645 8.1529L1.29254 8.50681L1.6468 8.86036L8.15325 15.3539Z" stroke="#666666" />
        </svg>
    )
}

export default IconFreedom;