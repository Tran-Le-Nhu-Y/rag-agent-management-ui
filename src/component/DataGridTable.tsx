import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';

interface DataGridTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: number;
  page: number; // current page (begin 0)
  pageSize?: number;
  total: number; // total elements
  onPageChange?: (newPage: number) => void;
}

const DataGridTable: React.FC<DataGridTableProps> = ({
  rows,
  columns,
  height = 450,
  page,
  pageSize = 6,
  total,
  onPageChange,
}) => {
  return (
    <Box sx={{ height: height, width: '100%' }}>
      <DataGrid
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        rows={rows}
        columns={columns}
        onPaginationModelChange={(model) => {
          onPageChange?.(model.page);
        }}
        paginationMode="server"
        rowCount={total}
        paginationModel={{
          page: page,
          pageSize: pageSize,
        }}
        pageSizeOptions={[pageSize]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            fontWeight: 'bold',
            fontSize: '1rem',
          },
          '& .MuiDataGrid-cell': {
            fontSize: '16px',
          },
        }}
      />
    </Box>
  );
};

export default DataGridTable;
