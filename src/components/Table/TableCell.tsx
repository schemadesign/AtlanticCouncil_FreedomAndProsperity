import { ReactNode } from "react";

interface ITableCell {
    className?: string,
    children: ReactNode,
}

function TableCell(props: ITableCell) {
    const { className = '', children } = props;
    return (
        <td className={className}>
            {children}
        </td>
    )
}   

export default TableCell;