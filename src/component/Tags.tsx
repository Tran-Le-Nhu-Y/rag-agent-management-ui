import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Checkbox } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props<T> = {
  label?: string;
  limitTags?: number;
  multiple?: boolean;
  options: T[];
  onChange?: (value: T | T[] | null) => void;
  loading?: boolean;
  getOptionLabel?: (option: T) => string;
};

export default function Tags<T>({
  label,
  limitTags,
  multiple,
  options,
  onChange,
  loading = false,
  getOptionLabel,
}: Props<T>) {
  return (
    <Autocomplete
      multiple={multiple}
      limitTags={limitTags}
      size="small"
      options={options}
      onChange={(_, value) => {
        onChange?.(value);
      }}
      disableCloseOnSelect
      loading={loading}
      getOptionLabel={getOptionLabel}
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
            {getOptionLabel?.(option) ?? 'Unknown Option'}
          </li>
        );
      }}
      style={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
