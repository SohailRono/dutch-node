import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('purchasePrice', data.purchasePrice);
          setValue('cost', data.cost);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('featuredImage', data.featuredImage);
          setIsFeatured(data.isFeatured);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
          setValue('tag', data.tag);
          setValue('breed', data.breed);
          setValue('weight', data.weight);
          setValue('customerName', data.customerName);
          setValue('customerPhone', data.customerPhone);
          setValue('customerAddress', data.customerAddress);
          setValue('sellerName', data.sellerName);
          setValue('sellerAddress', data.sellerAddress);
          setValue('purchaseDate', data.purchaseDate);
          setValue('sellDate', data.sellDate);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);
  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    purchasePrice,
    cost,
    price,
    category,
    image,
    featuredImage,
    brand,
    countInStock,
    description,
    tag,
    breed,
    weight,
    customerName,
    customerPhone,
    customerAddress,
    sellerName,
    sellerAddress,
    purchaseDate,
    sellDate,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          purchasePrice,
          cost,
          price,
          category,
          image,
          isFeatured,
          featuredImage,
          brand,
          countInStock,
          description,
          tag,
          breed,
          weight,
          customerName,
          customerPhone,
          customerAddress,
          sellerName,
          sellerAddress,
          purchaseDate,
          sellDate,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <Layout title={`Edit Product ${productId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
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
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Edit Product {productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <ListItem>
                          <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Product Name"
                                error={Boolean(errors.name)}
                                helperText={
                                  errors.name ? 'Name is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <Controller
                            name="category"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="category"
                                label="Category"
                                error={Boolean(errors.category)}
                                helperText={
                                  errors.category ? 'Category is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="purchasePrice"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="purchasePrice"
                                label="Purchase Price"
                                error={Boolean(errors.purchasePrice)}
                                helperText={
                                  errors.purchasePrice
                                    ? 'Purchase Price is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="cost"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="cost"
                                label="Purchase Cost"
                                error={Boolean(errors.cost)}
                                helperText={
                                  errors.cost ? 'Purchase cost is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="price"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="price"
                                label="Selling Price"
                                error={Boolean(errors.price)}
                                helperText={
                                  errors.price ? 'Price is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="tag"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="tag"
                                label="Tag"
                                error={Boolean(errors.tag)}
                                helperText={errors.tag ? 'tag is required' : ''}
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="breed"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="breed"
                                label="Breed"
                                error={Boolean(errors.breed)}
                                helperText={
                                  errors.breed ? 'breed is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="weight"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="weight"
                                label="Weight"
                                error={Boolean(errors.weight)}
                                helperText={
                                  errors.weight ? 'weight is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <Controller
                            name="customerName"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="customerName"
                                label="Customer Name"
                                error={Boolean(errors.customerName)}
                                helperText={
                                  errors.customerName
                                    ? 'customerName is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="customerPhone"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="customerPhone"
                                label="Customer Phone"
                                error={Boolean(errors.customerPhone)}
                                helperText={
                                  errors.customerPhone
                                    ? 'customerPhone is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="slug"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="slug"
                                label="Slug"
                                error={Boolean(errors.slug)}
                                helperText={
                                  errors.slug ? 'Slug is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        {' '}
                        <ListItem>
                          <Controller
                            name="customerAddress"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="customerAddress"
                                label="Customer Address"
                                error={Boolean(errors.customerAddress)}
                                helperText={
                                  errors.customerAddress
                                    ? 'customerAddress is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <Controller
                            name="sellerName"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="sellerName"
                                label="Seller Name"
                                error={Boolean(errors.sellerName)}
                                helperText={
                                  errors.sellerName
                                    ? 'sellerName is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        {' '}
                        <ListItem>
                          <Controller
                            name="sellerAddress"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="sellerAddress"
                                label="sellerAddress"
                                error={Boolean(errors.sellerAddress)}
                                helperText={
                                  errors.sellerAddress
                                    ? 'sellerAddress is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <Controller
                            name="purchaseDate"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                type="date"
                                id="purchaseDate"
                                label="Purchase Date"
                                error={Boolean(errors.purchaseDate)}
                                helperText={
                                  errors.purchaseDate
                                    ? 'purchaseDate is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        {' '}
                        <ListItem>
                          <Controller
                            name="sellDate"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                type="date"
                                id="sellDate"
                                label="Selling Date"
                                error={Boolean(errors.sellDate)}
                                helperText={
                                  errors.sellDate ? 'sellDate is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={4}>
                        <ListItem>
                          <Controller
                            name="image"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="image"
                                label="Image"
                                error={Boolean(errors.image)}
                                helperText={
                                  errors.image ? 'Image is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={4}>
                        <ListItem>
                          <Button variant="contained" component="label">
                            Upload File
                            <input
                              type="file"
                              onChange={uploadHandler}
                              hidden
                            />
                          </Button>
                          {loadingUpload && <CircularProgress />}
                        </ListItem>
                      </Grid>
                      <Grid item xs={4}>
                        <ListItem>
                          <Controller
                            name="countInStock"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="countInStock"
                                label="Count in stock"
                                error={Boolean(errors.countInStock)}
                                helperText={
                                  errors.countInStock
                                    ? 'Count in stock is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12}>
                        <ListItem>
                          <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                id="description"
                                label="Description"
                                error={Boolean(errors.description)}
                                helperText={
                                  errors.description
                                    ? 'Description is required'
                                    : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <ListItem style={{ display: 'none' }}>
                        <FormControlLabel
                          label="Is Featured"
                          control={
                            <Checkbox
                              onClick={(e) => setIsFeatured(e.target.checked)}
                              checked={isFeatured}
                              name="isFeatured"
                            />
                          }
                        ></FormControlLabel>
                      </ListItem>
                      <ListItem style={{ display: 'none' }}>
                        <Controller
                          name="featuredImage"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="featuredImage"
                              label="Featured Image"
                              error={Boolean(errors.image)}
                              helperText={
                                errors.image ? 'Featured Image is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem style={{ display: 'none' }}>
                        <Button variant="contained" component="label">
                          Upload File
                          <input
                            type="file"
                            onChange={(e) => uploadHandler(e, 'featuredImage')}
                            hidden
                          />
                        </Button>
                        {loadingUpload && <CircularProgress />}
                      </ListItem>
                      <ListItem style={{ display: 'none' }}>
                        <Controller
                          name="brand"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="brand"
                              label="Brand"
                              error={Boolean(errors.brand)}
                              helperText={
                                errors.brand ? 'Brand is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                    </Grid>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
