import React from 'react'
import { useAuth } from './AuthContext'
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../api/axios';
import { useLocation } from 'react-router-dom';

function AuthBootstrap({children}) {
    const {auth, setAuth} = useAuth();
    const {pathname} =useLocation();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        let alive = true;
        ( async () =>{
            const isAuthPage = pathname ==="/login"|| pathname === "/register";
            const hasToken = !! auth?.accessToken;

            if(isAuthPage || hasToken){
                if(alive){
                    setLoading(false);
                }
                return;
            }

            try {
                const res = await api.post("/v1/auth/refresh", {}, {
                    withCredentials: true,
                });

                const { accessToken, roles, user} = res.data;
                if(!alive) return;
                setAuth({
                    user: user,
                    roles: roles,
                    accessToken
                });

            } catch (error){
                if(error?.response?.status !== 401){
                    console.log("Lỗi refresh: ", error);
                }
                if(alive) setAuth(null);
            } finally{
                if(alive) setLoading(false);
            }
        }) ();
        
            return () => {
                alive = false;
            };
    }, []);
     if (loading) return <div>Loading...</div>;

  return children;
}

export default AuthBootstrap