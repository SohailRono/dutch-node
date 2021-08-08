import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-slug-' + Math.random(),
    purchasePrice: 200000,
    cost: 10000,
    image: '/images/p1.jpg',
    price: 250000,
    category: 'Bull',
    tag: '120',
    brand: 'sample brand',
    countInStock: 1,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
    breed: 'sample breed',
    weight: '500 KG',
    customerName: 'Customer name',
    customerPhone: 'Customer phone',
    customerAddress: 'Customer address',
    sellerName: 'Seller name',
    sellerAddress: 'Seller address',
    purchaseDate: Date.now(),
    sellDate: Date.now(),
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
