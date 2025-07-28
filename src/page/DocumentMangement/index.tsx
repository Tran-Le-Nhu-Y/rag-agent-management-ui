import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { EmbedDocument, UnembedDocument } from '..';
import { Stack, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DocumentManagementPage() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack spacing={2} direction={'column'}>
      <Typography variant="h4" textAlign={'center'}>
        {t('documentList')}
      </Typography>

      <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
        <Tab label={t('unused')} {...a11yProps(0)} />
        <Tab label={t('using')} {...a11yProps(1)} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <UnembedDocument />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EmbedDocument />
      </CustomTabPanel>
    </Stack>
  );
}
