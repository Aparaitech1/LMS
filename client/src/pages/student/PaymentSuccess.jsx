// src/pages/student/PaymentSuccess.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, getToken } = useContext(AppContext);

  useEffect(() => {
    const verifyPayment = async () => {
      const courseId = searchParams.get('courseId');
      if (!courseId) return navigate('/');

      try {
        const token = await getToken();

        const { data } = await axios.get(
          `${backendUrl}/api/user/payment-success?courseId=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Payment verified successfully!");
          navigate('/my-enrollments');
        } else {
          toast.error('Payment verification failed.');
          navigate('/');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Something went wrong during payment verification.');
        navigate('/');
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-semibold text-blue-600">
        Verifying your payment, please wait...
      </h2>
    </div>
  );
};

export default PaymentSuccess;
