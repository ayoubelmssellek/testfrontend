import { useState } from 'react';
import {useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import styles from '../Categories/ViewCategoryDetails.module.css';

const ViewCategoryDetails = () => {
    const { t, i18n } = useTranslation(); // Get translation
    const isRTL = i18n.language === 'ar'; // Determine RTL direction

    const CategoryInfo = useSelector((state) => state.admin.produits);
    const [isOpen, setIsOpen] = useState(false);
    const { nameCategory} = useParams();
    const CategoryDetails = CategoryInfo.filter((item) => item.category === nameCategory);

    const handleSidebarStateChange = (newState) => setIsOpen(newState);
    


    return (
        <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
            <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
                <Navbar pagePath={t('titles.view_category_details')} />
                <div className={styles.pages}>
                    <div className={styles.viewMoreAboutProduct}>
                        <div className={styles.tableContainer}>
                            <table className={styles.productsTable}>
                                <thead>
                                    <tr>
                                        <th>{t('tables.name')}</th>
                                        <th>{t('tables.category')}</th>
                                        <th>{t('tables.type')}</th>
                                        <th>{t('tables.price')}</th>
                                        <th>{t('tables.image')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CategoryDetails.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{t(`categories.${item.category}`)}</td>
                                            <td>{t(`types.${item.type}`)}</td>
                                            <td>${item.price}</td>
                                            <td>
                                                <img
                                                    src={item.image}
                                                    alt="product"
                                                    title='image'
                                                    width={60}
                                                    height={60}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {CategoryDetails.length === 0 && <h3>{t('categories.no_products')}</h3>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCategoryDetails;
