import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';

interface DataGridTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: number;
  pageSize?: number;
  onPageChange?: (newPage: number) => void;
}

const DataGridTable: React.FC<DataGridTableProps> = ({
  rows,
  columns,
  height = 450,
  pageSize = 6,
  onPageChange,
}) => {
  return (
    <Box sx={{ height: height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        onPaginationModelChange={(model) => {
          onPageChange?.(model.page);
        }}
        pageSizeOptions={[6]}
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
