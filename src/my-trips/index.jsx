import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { db } from '../service/firebaseConfig';
import UsertripsCardItem from './Components/UsertripsCardItem';

function MyTrip() {
  const navigate = useNavigate(); 
  const [userTrips, setUserTrips]= useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user =JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
   
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prevValue=> [...prevValue, doc.data()])
    });
  }

  return (
    <div className='sm:px-8 md:px-32 lg:px-52 xl:px-28 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      <div className=' mt-5 grid grid-cols-2 md:grid-cols-3 gap-4'>
        {userTrips?.length>0?userTrips.map((trip, index)=>(
          <UsertripsCardItem  trip ={trip} />
        ))
      :[1,2,3,4,5,6].map((item, index)=>(
        <div  key={index}  className='h-[300px] w-full bg-slate-300 animate-pulse rounded-xl'>
          
        </div>
      ))
      }
      </div>
    </div>
  );
}

export default MyTrip;
