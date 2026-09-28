import apiClient from "../../Services/API/apiClient";

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    deviceId: string;
    verificationCode?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            username: string;
            email: string;
            role: string;
        };
        sessionId?: string;
        deviceId?: string;
    };
}

export const registerUser = async (
    payload: RegisterPayload
): Promise<RegisterResponse> => {
    console.log("register api sent");

    const response = await apiClient.post<RegisterResponse>(
        "/api/v1/auth/register",
        payload
    );

    console.log("register api returned");

    return response.data;
};