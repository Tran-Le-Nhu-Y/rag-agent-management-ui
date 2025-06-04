import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  label?: string;
  labelList: Label[];
  onChange?: (value: Label | null) => void;
  loading?: boolean;
};

export default function Tags({
  label,
  labelList,
  onChange,
  loading = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Label[]>([]);

  React.useEffect(() => {
    if (open) {
      setOptions(labelList);
    } else {
      setOptions([]);
    }
  }, [open, labelList]);

  return (
    <Autocomplete
      sx={{ width: '100%' }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      onChange={(_, value) => onChange?.(value)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
