import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, getToken } = useContext(AppContext);

  useEffect(() => {
    const verifyPayment = async () => {
      const courseId = searchParams.get('courseId');
      const token = await getToken();

      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/payment-success?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          navigate('/my-enrollments');
        } else {
          alert('Payment verification failed!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
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
