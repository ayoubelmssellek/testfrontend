import  { useEffect, useState } from 'react';
import styles from './navbar.module.css';
// import { food_list } from "../../../Admin/assets/assets";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { VscAccount } from "react-icons/vsc";
import { GrFavorite } from "react-icons/gr";
import { BiFoodMenu } from "react-icons/bi";
import { BsCart4 } from "react-icons/bs";
import { assets } from '../../../Admin/assets/assets';
import { fetchingUser } from '../../../Api/fetchingData/FetchUserData';
import { useQuery } from '@tanstack/react-query';



 const Navbar = () => {
    const token = localStorage.getItem('authToken');

    const { data: userInfo } = useQuery({
    queryKey: ["user"],
    queryFn: fetchingUser,
    enabled: !!token,  // هادي كتخلي useQuery يخدم غير إذا كان التوكن موجود (true)
    staleTime: 1000 * 60 * 5,
  });
  const [cart_amount, setCartamount] = useState();
  const location = useLocation();
  
  const cartAmount = useSelector(state => state.client.cartAmount);
 
  useEffect(() => {
    setCartamount(cartAmount);
  }, [cartAmount]);



  return (
    <div className={styles.navbar}>
      <Link to='/'>
        <img className={styles.gustologo} src={assets.logo} alt="Logo" />
      </Link>
      
      <div className={styles.mobileVersion}>
        <div id={styles.navbarIcon} className={location.pathname === '/shoupingCart' ? styles.active : ''}>
          <Link to="/shoupingCart">
            <i><BsCart4 size="30px" /> 
            <span>
              <strong className='cartAmount'>{cartAmount}</strong>
            </span></i>
            <p>السلة</p> 
          </Link>
        </div>
        
        <div className={location.pathname === '/menu' ? styles.active : ''}>
          <Link to="/menu">
            <BiFoodMenu size="30px" />
            <p>القائمة</p>
          </Link>
        </div>
        
        <div className={location.pathname === '/' ? styles.active : ''}>
          <Link to="/">
            <i className="pi pi-shop" style={{ fontSize: '2.5rem' }}></i>
            <p>الرئيسية</p>
          </Link>
        </div>
          
        <div className={location.pathname === '/favorite' ? styles.active : ''}>
          <Link to="/favorite">
            <GrFavorite size="30px" />
            <p>مفضل</p>
          </Link>
        </div>
         <div className={location.pathname === '/myaccount' ? styles.active : ''}>
          <Link to="/myaccount">
            <VscAccount size="30px" />
            <p>حساب</p> 
          </Link>
        </div>
      </div>
      
      <ul>
        <Link to="/">
          <li className={location.pathname === '/' ? styles.active : ''}>Home</li>
        </Link>
        <Link to="/menu">
          <li className={location.pathname === '/menu' ? styles.active : ''}>Menu</li>
        </Link>
        <Link to="/contactUs">
          <li className={location.pathname === '/contactUs' ? styles.active : ''}>Contact</li>
        </Link>
     
      </ul>
      
      <div className={styles.navbarRight}>
        <div id={styles.navbarIcon} className={styles.navbarBag}>
          <Link to="/shoupingCart">
            <i><BsCart4 size="30px" /></i>
            <span>{cart_amount}</span>
          </Link>
        </div>
        
        {userInfo ? (
          <Link to="/myaccount" className={styles.accountLink}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatars}>
                {userInfo.name[0].toUpperCase()}
              </div>

            </div>
          </Link>
        ) : (
          <Link to="/login" >
            <Button  label="تسجيل الدخول " severity="warning" rounded />
          </Link>
        )}
      </div>
    </div>
  );
};
export default Navbar;