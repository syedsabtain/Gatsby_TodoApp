import React from 'react'
import Footer from '../components/Footer'
import {Link} from 'gatsby'

export default()=>{

    return(
        <div className='container mt-5 text-center'>
            <div className='row d-flex justify-content-center '>
                <div className='col-md-6 mt-5  bgdiv  shadow-lg p-lg-5'>
                    <h1 className='mt-5 mb-5'>404 Page Not Found</h1>
                  <Link className='btn btn-outline-primary text-white' to='/'>Go To Homepage</Link>  
                </div>
            </div>
            <div className='fixed-bottom'><Footer></Footer></div>
        </div>
    )
}