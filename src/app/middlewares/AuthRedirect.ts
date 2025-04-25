import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
    const navigate = useNavigate();
    const shouldRedirect = useSelector((state: any) => state.auth.shouldRedirect);

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/login');
        }
    }, [shouldRedirect, navigate]);

    return null;
};

export default AuthRedirect;