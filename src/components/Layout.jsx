import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, transparentHeader = false }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Header transparent={transparentHeader} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
