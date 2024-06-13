import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);
};

export default useAuthRedirect;
