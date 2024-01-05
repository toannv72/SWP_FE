
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Logout() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

    removeCookie('accessToken');
    setCookie("accessToken", null)
    localStorage.removeItem('user');
    useEffect(() => {
        navigate('/login')
        if (cookies.accessToken) {
        }
    });

    return (
        <>

        </>
    )

}

