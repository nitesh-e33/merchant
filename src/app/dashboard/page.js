'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { generateAndCompareDeviceId } from '../lib/helper';

function page() {
  const router = useRouter();

  useEffect(() => {
    generateAndCompareDeviceId(router);
  }, [router]);

  return (
    <>
      <h1 className='text-xl'>Dashboard</h1>
    </>
  )
}

export default page
