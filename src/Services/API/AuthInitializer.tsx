import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useAppDispatch } from "../../Hooks/hooks";

import {
    setUser,
    clearUser,
} from "../../Store/slices/authSlice";

import { getMe } from "../../API/User/getMe";

interface AuthInitializerProps {
    children: ReactNode;
}

const AuthInitializer = ({
    children,
}: AuthInitializerProps) => {
    const dispatch = useAppDispatch();

    const [isInitializing, setIsInitializing] =
        useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await getMe();

                if (
                    response.success &&
                    response.data?.user
                ) {
                    dispatch(
                        setUser(response.data.user)
                    );
                } else {
                    dispatch(clearUser());
                }
            } catch (error) {
                dispatch(clearUser());
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    if (isInitializing) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default AuthInitializer;