import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from "../store/useAuthStore.js";
import { useRecipeStore } from '../store/useRecipeStore.js';

export default function UserView() {
    const [pageUser, setPageUser] = useState();
    const { authFetch } = useRecipeStore();
    const { logout } = useAuth0();
    const { accessToken, user } = useAuthStore();

    useEffect(() => {
        const getUser = async () => {
            if (pageUser) return;
            const url = (window.location.host.indexOf("localhost") >= 0 ? "http://localhost:3300" : "") + "/pageuser";

            const res = await authFetch(url)
            if (res.ok) {
                const data = await res.json();
                setPageUser(data.data.payload);
            }
        }

        getUser()
    }, [pageUser, setPageUser, authFetch])

    return (
        <div className="mt-3 ml-2">
            <div className="mt-2">
                <div className="inline-block min-w-30">nickname</div>
                <div className="inline-block ml-4">{user?.nickname}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30">name</div>
                <div className="inline-block ml-4">{user?.name}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30">updated_at</div>
                <div className="inline-block ml-4">{user?.updated_at}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30">email</div>
                <div className="inline-block ml-4">{user?.email}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30">email_verified</div>
                <div className="inline-block ml-4">{user?.email_verified}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30">sub</div>
                <div className="inline-block ml-4">{user?.sub}</div>
            </div>
            <div className="mt-2">
                <div className="inline-block min-w-30 align-top">picture</div>
                <div className="inline-block ml-4"><img className="w-14" src={user?.picture} /></div>
            </div>
            <div className="mt-10">
                <div className="inline-block min-w-30 align-top">&nbsp;</div>
                <div className="inline-block ml-4"><button className="btn" onClick={() => logout()}>logout</button></div>
            </div>

            <div className="mt-10">
                User: {JSON.stringify(user)}
            </div>

            {pageUser &&
                <>
                    <div className="mt-10">
                        Page User: {JSON.stringify(pageUser)}
                    </div>
                </>
            }
        </div >
    );
}
