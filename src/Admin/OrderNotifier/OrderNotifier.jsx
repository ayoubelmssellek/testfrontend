import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchNewOrders from '../../Api/fetchingData/FetchNewOrders';
import swiggy_new_order from '../assets/swiggy_new_order.mp3'; // تحقق من المسار

const OrderNotifier = () => {
  const audioRef = useRef(null);
  const lastPlayedRef = useRef(false);

  // إنشاء العنصر الصوتي مرة وحدة
  useEffect(() => {
    audioRef.current = new Audio(swiggy_new_order);
  }, []);

  const { data } = useQuery({
    queryKey: ['new-orders'],
    queryFn: fetchNewOrders,
    refetchInterval: 5000, // كل 10 ثواني
    enabled: true,
  });

  useEffect(() => {
    if (data?.hasNewOrder && !lastPlayedRef.current) {
      audioRef.current?.play();
      lastPlayedRef.current = true;
    }

    if (!data?.hasNewOrder) {
      lastPlayedRef.current = false;
    }
  }, [data]);

  return null;
};

export default OrderNotifier;
