import axios from 'axios'
import { Audio } from 'react-loader-spinner'
import { useQuery } from 'react-query'
import SimpleSlider from '../HomeSlider/HomeSlider'
import CategorySlider from '../CategorySlider/CategorySlider'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { cartContext } from "../../Context/CartContext"
import toast from "react-hot-toast"
import { WishListContext } from "../../Context/WishListContext"

export default function Products() {
  const { addProductTOCart } = useContext(cartContext);
  const { addToWishList } = useContext(WishListContext);

  async function productToWishList(id) {
    const res = await addToWishList(id);
    if (res.status === 'success') {
      toast.success('Added successfully to Wish List', { duration: 1000, position: 'top-center' });
    } else {
      toast.error('Error occurred', { duration: 1500 , position: 'top-center' });
    }
  }

  async function addProduct(id) {
    const res= await addProductTOCart(id);
    if (res.status === 'success') {
      toast.success('Added successfully', { duration: 1500, position: 'top-center' });
    } else {
      toast.error('Error occurred', { duration: 1500, position: 'top-center' });
    }
  }

  async function getAllProducts() {
    return axios.get('https://ecommerce.routemisr.com/api/v1/products');
  }

  const { isLoading, data } = useQuery('getAllProducts', getAllProducts);
  
  if (isLoading) {
    return (
      <div className='d-flex vh-100 bg-primary bg-opacity-50 justify-content-center align-items-center'>
        <Audio
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row my-4">
          <div className="col-md-9 px-0">
            <SimpleSlider />
          </div>
          <div className="col-md-3 px-0 ps-0">
            <div>
              <img style={{ height: '150px' }} className='w-100' src={require('../../Assets/images/blog-img-1.jpeg')} alt="" />
            </div>
            <div>
              <img style={{ height: '150px' }} className='w-100' src={require('../../Assets/images/blog-img-2.jpeg')} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <CategorySlider />
      </div>
      <div className="container products mt-4">
        <div className="row gy-3 mt-5">
          {data.data.data.map((product , idx) => {
            return (
              <div key={idx} className="col-6 col-sm-4 col-md-3 col-lg-2 gx-5 gy-5 overflow-hidden position-relative">
                <Link className='product h-100 text-center' to={`/productdetails/${product.id}`} >
                  <div>
                    <img src={product.imageCover} className='w-75' alt="" />
                    <h6 className='text-main'>{product.category.name}</h6>
                    <h2 className='h4 text-center'>{product.title.split(' ').slice(0, 2).join(' ')}</h2>
                    <div className='d-flex justify-content-between'>
                      {product.priceAfterDiscount ? (
                        <p>
                          <span className='text-decoration-line-through'>{product.price}</span> - {product.priceAfterDiscount}
                        </p>
                      ) : (
                        <p>{product.price}</p>
                      )}
                      <p>
                        <span><i style={{ color: '#ffc908' }} className='fa-solid fa-star'></i></span> {product.ratingsAverage}
                      </p>
                    </div>
                  </div>
                </Link>
                <button onClick={() => productToWishList(product.id)} className="btn-heart fa-1xl border-0 bg-white position-absolute top-0 start-0">
                  <i id="heart" className="fa-regular fa-heart heart"></i>
                </button>
                <button onClick={() => addProduct(product.id)} className='addCart btn bg-main text-white w-100 mb-3'>Add to Cart +</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}