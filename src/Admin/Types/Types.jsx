import {useDispatch } from "react-redux";
import styles from "../Types/Types.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTimesCircle, FaCheckCircle, FaLayerGroup } from "react-icons/fa";
import Modal from "../Modal/Modal";
import AddType from "./AddType";
import { useQuery } from "@tanstack/react-query";
import { fetchingTypes } from "../../Api/fetchingData/FetchingTypes";
import { useMutation ,useQueryClient } from "@tanstack/react-query";
import { fetchingUpdateTypeStatus } from "../../Api/fetchingData/FetchUpdateTypeStatus";
const ProductTypes = () => {
  const {data,isLoading,error}= useQuery({
    queryKey:['types'],
    queryFn:fetchingTypes
  })
  
  const { t } = useTranslation();
  const queryClient = useQueryClient();
    const [showAddCategoryComponent, setShowAddCategoryComponent] = useState(false);
  
    const handleCloseModal = () => setShowAddCategoryComponent(false);
    const handleOpenModal = () => setShowAddCategoryComponent(true); // ✅ Fix: Open Modal

  // Calculate status counts
  const availableCount = data?.filter((type) => type.status ==='available').length;
  const outOfStockCount = data?.filter((type) => type.status !== 'available').length;
  const allTypesCount = data?.length;
    
  const mutation = useMutation({
    mutationFn : ({typeId,status}) =>  fetchingUpdateTypeStatus(typeId,{status:status}),
      onSuccess: () => {
        queryClient.invalidateQueries(['types']);
      },
      onMutate: async (newStatus) => {
        
      await queryClient.cancelQueries(['types']);
      const previousData = queryClient.getQueryData(['types']);
      queryClient.setQueryData(['types'], (old = []) =>
          old.map((item) =>
              item.id === newStatus.typeId ? { ...item, status: newStatus.status } : item
          )
      );                
      return { previousData };
  },
    onError: (error) => {
      console.error("Error updating type status:", error);
    }
  });

      
  const handleStatusToggle = (typeId, newState) => {
    const newStatus = newState === "available" ? "out of stock" : "available";
    console.log("Updating type status:", typeId, newStatus);
    
    mutation.mutate({ typeId, status: newStatus });
   
  };
  isLoading&&<div className={styles.loading}>Loading...</div>
  error&&<div className={styles.error}>Error: {error.message}</div>

  return (
    <div className={styles.container}>
      {/* Badge Section */}
      <div className={styles.header}>
        <div className={styles.typeBadges}>
          {/* All Types */}
          <div className={`${styles.statBadge} ${styles.allTypesStat}`}>
            <FaLayerGroup className={styles.statIcon} color="#3b82f6" />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{t("filters.Total Types")}</span>
              <span className={styles.statNumber}>{allTypesCount}</span>
            </div>
          </div>

          {/* available Types */}
          <div className={`${styles.statBadge} ${styles.availableStat}`}>
            <FaCheckCircle className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{t("status.available")}</span>
              <span className={styles.statNumber}>{availableCount}</span>
            </div>
          </div>

          {/* Out of Stock Types */}
          <div className={`${styles.statBadge} ${styles.outOfStockStat}`}>
            <FaTimesCircle className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{t("status.out of stock")}</span>
              <span className={styles.statNumber}>{outOfStockCount}</span>
            </div>
          </div>
        </div>

       </div>
      {/* Product Types Grid */}
      <div className={styles.grid}>
        {data?.map((item) => (
          <div key={item.name} className={styles.typeItem}>
            <span className={styles.typeName}>{item.name}</span>
            <button
              className={`${styles.statusPill} ${
                item.status === 'available' ? styles.available : styles.outOfStock
              }`}
              onClick={() => handleStatusToggle(item.id, item.status || "available")}
            >
              {item.status || "available"}
            </button>
          </div>
        ))}
                <Modal isOpen={showAddCategoryComponent} onClose={handleCloseModal}>
                  <AddType onClose={handleCloseModal} />
                </Modal>
      </div>
    </div>
  );
};

export default ProductTypes;
