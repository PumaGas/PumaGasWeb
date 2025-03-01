import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Layout/Loader"; // Already imported

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const logoutHandler = async () => {
    setIsLoading(true); // Show loader during logout
    try {
      const response = await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });
      // Assuming success is indicated by status 201 or response.data.success
      if (response.status === 201 || response.data.success) {
        toast.success(response.data.message || "Log out successful!"); // Show success toast
        window.location.reload(); // Reload on success
      } else {
        toast.error(response.data.message || "Logout failed!"); // Show error toast
        setIsLoading(false); // Hide loader if logout fails
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout!"); // Show error toast
      console.log("Logout error:", error);
      setIsLoading(false); // Hide loader on error
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoading ? (
        <Loader /> // Show loader when isLoading is true
      ) : (
        <div className="w-full min-h-screen flex flex-col items-center">
          <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
            <div className="w-full flex items-center justify-center">
              <div className="relative">
                <img
                  src={avatar ? avatar : `${seller.avatar?.url}`}
                  alt=""
                  className="w-[200px] h-[200px] rounded-full cursor-pointer"
                />
                <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <label htmlFor="image">
                    <AiOutlineCamera />
                  </label>
                </div>
              </div>
            </div>

            {/* Shop info form */}
            <form
              aria-required={true}
              className="flex flex-col items-center"
              onSubmit={updateHandler}
            >
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Name</label>
                </div>
                <input
                  type="text"
                  placeholder={`${seller.name}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Description</label>
                </div>
                <input
                  type="text"
                  placeholder={
                    seller?.description
                      ? seller.description
                      : "Enter your shop description"
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Address</label>
                </div>
                <input
                  type="text"
                  placeholder={seller?.address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Phone Number</label>
                </div>
                <input
                  type="number"
                  placeholder={seller?.phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Zip Code</label>
                </div>
                <input
                  type="number"
                  placeholder={seller?.zipCode}
                  value={zipCode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <input
                  type="submit"
                  value="Update Shop"
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                  readOnly
                />
              </div>
            </form>
            <button
              onClick={logoutHandler}
              className="logout-button mt-2 bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer w-[95%] 800px:hidden"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopSettings;