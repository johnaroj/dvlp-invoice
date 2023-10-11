import { TableCell, tableCellClasses, styled } from "@mui/material";

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));
type Props = {
  children: React.ReactNode;
};

const StyledTableCell = ({ children }: Props) => {
  return <TableCellStyled>{children}</TableCellStyled>;
};

export default StyledTableCell;
