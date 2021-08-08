import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  InputBase,
  IconButton,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import SearchIcon from '@material-ui/icons/Search';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminProdcuts() {
  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();
  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Products">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid item xs={4}>
                    <div>
                      <form
                        onSubmit={submitHandler}
                        className={classes.searchForm}
                      >
                        <InputBase
                          name="query"
                          className={classes.searchInput}
                          placeholder="Search products"
                          onChange={queryChangeHandler}
                        />
                        <IconButton
                          type="submit"
                          className={classes.iconButton}
                          aria-label="search"
                        >
                          <SearchIcon />
                        </IconButton>
                      </form>
                    </div>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={4}>
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      Create
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={1}>
                    {products.map((product) => (
                      <Card key={product._id} item xs={6} md={2}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            image={product.image}
                            title={product.name}
                          ></CardMedia>
                          <CardContent
                            style={{ justifyContent: 'space-between' }}
                          >
                            <Typography>
                              Product Name: {product.name}
                            </Typography>
                            <Typography>
                              Category: {product.category}
                            </Typography>
                            <Typography>
                              Purchase Price: {product.purchasePrice}
                            </Typography>
                            <Typography>Cost: {product.cost}</Typography>
                            <Typography>
                              Selling Price: {product.price}
                            </Typography>
                            <Typography>Breed: {product.breed}</Typography>
                            <Typography>Weight: {product.weight}</Typography>

                            <Typography>
                              Customer Name: {product.customerName}
                            </Typography>
                            <Typography>
                              Customer Phone: {product.customerPhone}
                            </Typography>
                            <Typography>
                              Customer Address: {product.customerAddress}
                            </Typography>
                            <Typography>
                              Seller Name: {product.sellerName}
                            </Typography>
                            <Typography>
                              Seller Address: {product.sellerAddress}
                            </Typography>
                            <Typography>
                              Purchase Date: {product.purchaseDate}
                            </Typography>
                            <Typography>
                              Sell Date: {product.sellDate}
                            </Typography>
                            {/* <Rating value={product.rating} readOnly></Rating> */}
                          </CardContent>
                        </CardActionArea>
                        <CardActions
                          style={{ justifyContent: 'space-between' }}
                        >
                          <NextLink
                            href={`/admin/product/${product._id}`}
                            passHref
                          >
                            <Button size="small" variant="contained">
                              Edit
                            </Button>
                          </NextLink>{' '}
                          <Button
                            onClick={() => deleteHandler(product._id)}
                            size="small"
                            variant="contained"
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Grid>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminProdcuts), { ssr: false });
