"use client"
import Header from '@/components/Header'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  // const router = useRouter()
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    console.log("I am useeffect");
    const fetchProducts = async () => {
      let response = await fetch('api/product')
      let res = await response.json()
      setProducts(res.products)
    }
    fetchProducts()


  }, [])



  const addProduct = async (e) => {
    try {
      const response = await fetch('api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      })

      if (response.ok) {
        console.log("Product added successfully");
        // console.log(productForm);

        setProductForm({})
        setAlert("Your Product added succesfully")
        // router.push('/')
      } else {
        console.error('Error Adding Products');
      }
    } catch (error) {
      console.error('Error', error);
    }
    // Fetch all products again to sync back
    let response = await fetch('api/product')
    let res = await response.json()
    setProducts(res.products)
    e.preventDefault()
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })

  }


  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 3) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('api/search?query=' + query)
      let rjson = await response.json()
      console.log(rjson.products);
      setDropdown(rjson.products)
      setLoading(false)
    } else {
      setDropdown([])
    }
  }

  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)

    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)



    console.log(action, slug);
    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    })
    let r = await response.json()
    console.log(r);
    setLoadingaction(false)
  }

  return (
    <>
      <Header />

      <div className='container bg-red-50 mx-auto'>
        {console.log(products)}
        <div className='text-green-800 text-center'>{alert}</div>
        <h1 className='text-3xl font-bold mb-6'>Search a Product</h1>
        <div className='flex mb-6'>
          {/* onBlur={() => { setDropdown([]) }} */}
          <input onChange={onDropdownEdit} type='text' placeholder='Enter a product name' className='flex-1 border border-gray-300' />
          <select className='border border-gray-300 px-4 py-2 rounded-r-md'>
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        {loading && <div className='flex justify-center items-center'>
          <img className='w-16' src='loader.svg' />
        </div>}

        <div className='dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md mt-[-22px]'>
          {dropdown.map(item => {
            return <div key={item.slug} className='container flex justify-between p-2 my-1 border-b-2'>
              <span className='slug'>{item.slug} ({item.quantity} available for Rs {item.price})</span>
              <div className='mx-5'>
                <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className='subtract inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200'>-</button>
                <span className='quantity inline-block min-w-3 mx-3'>{item.quantity}</span>
                <button onClick={() => buttonAction("plus", item.slug, item.quantity)} disabled={loadingaction} className='add inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200'>+</button>
              </div>
            </div>
          })}
        </div>
      </div>
      <div className='container bg-red-50 mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Add a Product</h1>


        {/* Add Product Form */}
        <form>
          <div className="mb-4">
            <label htmlFor="productName" className='block mb-2'>Product Name</label>

            <input value={productForm?.slug || ""} type="text" name="slug" id="slug" onChange={handleChange} className="w-full border border-gray-300  px-4 py-2 mr-2" />
          </div>

          <div className="mb-4">
            <label htmlFor="productName" className='block mb-2'>Quantity</label>

            <input value={productForm?.quantity || ""} type="text" name="quantity" id="quantity" onChange={handleChange} className="w-full border border-gray-300  px-4 py-2 mr-2" />
          </div>

          <div className="mb-4">
            <label htmlFor="productName" className='block mb-2'>Price</label>

            <input value={productForm?.price || ""} type="text" name="price" id="price" onChange={handleChange} className="w-full border border-gray-300  px-4 py-2 mr-2" />
          </div>

          <button onClick={addProduct} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-lg">Add Product</button>


        </form>


      </div>
      <div className='container mt-10 bg-red-50 mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Display Current Stock</h1>

        {/* Display Stock Table */}
        <table className="table-auto w-full mt-4">
          {/* Table headers */}
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {products.map((item) => {
              return (
                <tr key={item._id} >
                  <td className="border px-4 py-2">{item.slug}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">Pak Rs. {item.price}</td>
                </tr>)
            })}
          </tbody>
        </table>
      </div>

    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  // Pass data to the page via props
  // return { props: { data } }
}


