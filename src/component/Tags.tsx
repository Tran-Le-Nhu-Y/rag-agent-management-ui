import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export interface Tag {
  name: string;
}

type Props = {
  label?: string;
  tags: Tag[];
  onChange?: (value: Tag | null) => void;
  loading?: boolean;
};

export default function Tags({
  label,
  tags,
  onChange,
  loading = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    if (open) {
      setOptions(tags);
    } else {
      setOptions([]);
    }
  }, [open, tags]);

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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
