import React from 'react'
import { useAuth } from './AuthContext'
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../api/axios';
import { useLocation } from 'react-router-dom';

function AuthBootstrap({children}) {
    const {auth, setAuth} = useAuth();
    const location =useLocation();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const boot = async () => {
            try {
                const isAuthPage =  ["/login", "/register"].includes(location.pathname);
                if(isAuthPage) return;

                if (auth?.accessToken) return;

                const res = await api.post("/v1/auth/refresh");
                const {accessToken, roles, id} = res.data;
                console.log(res.data);

                setAuth((prev) =>({
                    user: {id},
                    roles: roles,
                    accessToken,
                }));
            } catch (error) {
                console.log("Lỗi khi xin cấp accessToken mới", error);
                setAuth(null);
            } finally{
                setLoading(false);
            }
        };
     boot();
    },[]);
    if(loading) if (loading) return <div>Loading...</div>;

  return children;
}

export default AuthBootstrap