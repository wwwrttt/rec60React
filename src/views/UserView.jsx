import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from "../store/useAuthStore.js";
import { useRecipeStore } from '../store/useRecipeStore.js';

export default function UserView() {
    const { authFetch, pageUser, setPageUser } = useRecipeStore();
    const { logout } = useAuth0();
    const { user } = useAuthStore();

    useEffect(() => {
        const getUser = async () => {
            if (pageUser) return;
            if (!authFetch) return;

            const url = (window.location.host.indexOf("localhost") >= 0 ? "http://localhost:3300" : "") + "/api/pageuser";
            const res = await authFetch(url)
            if (res.ok) {
                const data = await res.json();
                setPageUser(data.data);
            }
        }

        getUser()
    }, [pageUser, setPageUser, authFetch])

    return (
        <div className="mt-3 ml-2 mb-20">
            <div className="mt-5 float-right">
                <div className="inline-block min-w-30 align-top">&nbsp;</div>
                <div className="inline-block ml-4"><button className="btn" onClick={() => logout()}>logout</button></div>
            </div>

            <PropertyView name="Client Side Values" value={
                <>
                    <PropertyView name="nickname" value={user?.nickname} />
                    <PropertyView name="name" value={user?.name} />
                    <PropertyView name="updated_at" value={user?.updated_at} />
                    <PropertyView name="email" value={user?.email} />
                    <PropertyView name="email_verified" value={user?.email_verified} />
                    <PropertyView name="sub" value={user?.sub} />
                    <PropertyView name="picture" value={<img className="w-14" src={user?.picture} />} />
                </>
            } />

            {pageUser &&
                <div className="mt-15">
                    <PropertyView name="Server Resolved Values" value={
                        <>
                            <PropertyView name="header" value={<UserObjectView user={pageUser.header} />} />
                            <PropertyView name="payload" value={<UserObjectView user={pageUser.payload} />} />
                            <PropertyView name="token" value={pageUser.token} />
                        </>
                    } />
                </div>
            }
        </div>
    );
}

let uid = 0;
const UserObjectView = ({ user }) => {
    let res = [];

    Object.keys(user).forEach(key => {
        const value = user[key];
        res.push(<PropertyView key={uid++} name={key} value={value} />);
    });

    return res;
}

const PropertyView = ({ name, value }) => {
    return (
        <div className="mt-4">
            <div className="text-slate-400 min-w-30">{name}</div>
            <div className="ml-6">{value}</div>
        </div>
    )
}
