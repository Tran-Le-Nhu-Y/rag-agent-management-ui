import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { Label } from '../@types/entities';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Checkbox } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  label?: string;
  labelList: Label[];
  onChange?: (value: Label[] | null) => void;
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
      open={open}
      multiple
      limitTags={2}
      id="checkboxes-tags-demo"
      options={options}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => onChange?.(value)}
      disableCloseOnSelect
      loading={loading}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      style={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
