import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function PricingCard({ 
  title, 
  price, 
  badge, 
  badgeColor = 'primary',
  features, 
  buttonText, 
  buttonLink, 
  featured = false 
}) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: featured ? '2px solid' : '1px solid',
        borderColor: featured ? 'primary.main' : 'divider',
      }}
    >
      {featured && (
        <Chip
          label="Popular"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 700,
          }}
        />
      )}
      
      <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Chip
          label={badge}
          size="small"
          sx={{
            width: 'fit-content',
            mb: 2,
            backgroundColor: badgeColor === 'wireless' ? '#e0f2fe' : '#fef3c7',
            color: badgeColor === 'wireless' ? '#0369a1' : '#92400e',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        />
        
        <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
          {title}
        </Typography>
        
        <Typography
          variant="h2"
          component="p"
          sx={{
            fontSize: '48px !important',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            mb: 3,
          }}
        >
          {price}
        </Typography>

        <List sx={{ flex: 1, mb: 3 }}>
          {features.map((feature, index) => (
            <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant={featured ? 'contained' : 'outlined'}
          size="large"
          fullWidth
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

