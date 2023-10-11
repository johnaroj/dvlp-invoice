import { TableRow, styled } from "@mui/material";

const TableRowStyled = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type Props = {
  children: React.ReactNode;
};

const StyledTableRow = ({ children }: Props) => {
  return <TableRowStyled>{children}</TableRowStyled>;
};

export default StyledTableRow;
