import { ReactNode } from "react";

interface ITableCell {
    className?: string,
    children: ReactNode,
    col?: string,
}

function TableCell(props: ITableCell) {
    const { className = '', children, col = '' } = props;
    return (
        <td className={className} data-col={col}>
            {children}
        </td>
    )
}   

export default TableCell;