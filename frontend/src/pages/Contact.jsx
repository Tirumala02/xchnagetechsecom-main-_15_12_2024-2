import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-800'>Our Office</p>
          <p className=' text-gray-600'>
            #459, 3rd Floor, KIRAN TOWER<br />
            Teachers Colony, 1st Block Koramangala,<br />
            Bangalore - 560034 Karnataka, INDIA
          </p>
          <p className=' text-gray-600'>Tel: +91 88677 71117 <br /> Email: sales_inquiries@xchangetechs.com</p>
          <p className='font-semibold text-xl text-gray-800'>Careers at Exchange Tech</p>
          <p className=' text-gray-600'>Learn more about our teams and job openings.</p>
          <button className='border bg-gray-200 text-gray-700 border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
