import { Box } from '@mui/material';
import { Product } from '../../types/common';
import ProductPlacement from '../products/ProductBox';

const SpecialOffers: React.FC<{ offers: Product[] }> = (props) => {
  const { offers } = props;
  
  return (
    <div className="front-specialOffers">
      <div className="front-specialOffers title">Special Offers</div>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, m: 1, bgcolor: 'background.paper', borderRadius: 1, justifyContent: 'center' }}>
        {' '}
        {offers.map((offer) => (
          <ProductPlacement key={`specialOffers-${offer.id}`} size={100} product={offer} isOnSale={true} isHideDescription={false} />
        ))}
      </Box>
    </div>
  );
};

export default SpecialOffers;
