import { Box, Card, CardContent, Grid, List, ListItem, ListItemButton, ListItemText, Pagination, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHook';
import { Product, Category } from '../../types/common';
import ProductBox from './ProductBox';
import { addNotification } from '../Functions/common';
import AddCategoryModel from './AddCategoryModal';

const ProductsList: React.FC = () => {
  const [isAsc, revertSort] = useState(true);
  const categoryList = useAppSelector((state) => state.categoryReducer);
  const products = useAppSelector((state) => state.productReducer);
  const navigate = useNavigate();

  const [urlQueries] = useSearchParams();
  const searchQuery = urlQueries.get('search');
  const categoryQuery = urlQueries.get('category');

  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [chosenCat, setChosenCat] = useState<Category | undefined>(undefined);

  const [priceRange, setPriceRange] = useState<number[]>([10, 100000]);
  const [minMaxPrice, setMinMaxPrice] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProducts, setViewProducts] = useState<Product[]>([]);

  const [showCategoryModel, setShowCategoryModel] = useState(false);
  const [showProductModel, setShowProductModel] = useState(false);

  useEffect(() => {
    let tempArr: Product[] = [];
    if (categoryQuery) {
      const a: Category | undefined = categoryList.find((cat) => cat.name === categoryQuery);
      if (a === undefined) addNotification('ERROR FINDING CATEGORY', "Can't find a specific category, please go back to Home Screen", 'danger');
      else {
        tempArr = products.filter((product: Product) => product.category.name === a.name);
        setChosenCat(a);
      }
    } else {
      setChosenCat(undefined);
      if (products.length > 0) tempArr = products.map((x: any) => x);
    }

    if (tempArr.length > 0) {
      if (searchQuery) tempArr = tempArr.filter((product: Product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (isAsc) {
        tempArr = tempArr.sort((a, b) => (a.price > b.price ? 1 : -1));
      } else {
        tempArr = tempArr.sort((a, b) => (a.price > b.price ? -1 : 1));
      }
      setMinMaxPrice([tempArr[0].price, tempArr[tempArr.length - 1].price]);
    }

    tempArr.filter((product: Product) => product.price >= priceRange[0] && product.price <= priceRange[1]);
    setCurrentProducts(tempArr.map((x: any) => x));
  }, [categoryList, navigate, products, isAsc, categoryQuery, searchQuery, chosenCat, priceRange]);

  useEffect(() => {
    if (currentProducts.length > 0) setViewProducts(currentProducts.slice(currentPage * 12 - 12, currentPage * 12));
  }, [currentPage, currentProducts]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  function valuetext(value: number) {
    return `${value} EUR`;
  }

  const handlePageChange = (event: any, pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="products-page">
      <Box className="products-page intro">
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              The Acacia Products
            </Typography>
            <Typography sx={{ fontSize: 14 }} component="div">
              The best products are available. With personalized birthday gifting option, our products are sure to delight. Make their birthday this year extra spcial - a gift with heart and soul.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box className="products-page products">
        <Grid container spacing={'4em'}>
          <Grid item xs={3}>
            <Box textAlign={'left'}>
              <Box>
                <Typography variant="h6" component="div">
                  Price
                </Typography>
                {minMaxPrice.length > 0 && (
                  <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={priceRange}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    min={minMaxPrice[0]}
                    max={minMaxPrice[1]}
                  />
                )}
                <List>
                  <ListItem disablePadding>
                    <ListItemButton selected={isAsc === true && true} onClick={() => revertSort(true)}>
                      <ListItemText primary={'Ascending'} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected={isAsc === false && true} onClick={() => revertSort(false)}>
                      <ListItemText primary={'Descending'} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
              <Box>
                <Typography variant="h6" component="div">
                  Category
                </Typography>
                <List>
                  <ListItemButton selected={chosenCat === undefined ? true : false} onClick={() => navigate('/products')}>
                    <ListItemText primary="All Categories" />
                  </ListItemButton>
                  {categoryList.map((category, index) => (
                    <ListItem key={`list-${category.id}`} disablePadding>
                      <ListItemButton selected={chosenCat?.id === index + 1 ? true : false} onClick={() => navigate(`/products?category=${category.name}`)}>
                        <ListItemText primary={category.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            <Box>
              {' '}
              <Typography variant="h6" component="div">
                Admin Commands
              </Typography>
              <ListItem key={`list-adminCommand`} disablePadding>
                {/* <ListItemButton onClick={() => setCategoryModel(true)}>Add New Category</ListItemButton>
                <ListItemButton onClick={() => setProductModel(true)}>Add New Product</ListItemButton>
                <AddCategoryModel open={showCategoryModel} onClose={() => setCategoryModel(!showCategoryModel)} />
                <AddProductModel open={showProductModel} onClose={() =>  */}
                  
                  
                  {/* (!showProductModel)} /> */}
              </ListItem>
            </Box>
          </Grid>

          <Grid item xs={9}>
            <Box textAlign={'left'}>
              <Typography variant="h6" component="div">
                Products
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, m: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              {viewProducts.map((product) => (
                <ProductBox key={`productLis-${product.id}`} size={50} product={product} isOnSale={false} isHideDescription={true} />
              ))}
            </Box>
            <Pagination count={Math.ceil(currentProducts.length / 12)} page={currentPage} variant="outlined" onChange={handlePageChange} shape="rounded" size="large" />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ProductsList;