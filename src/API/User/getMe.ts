import apiClient from "../../Services/API/apiClient";

export interface CurrentUser {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface GetMeResponse {
    success: boolean;
    message: string;
    data?: {
        user: CurrentUser;
    };
}

export const getMe = async (): Promise<GetMeResponse> => {
    const response = await apiClient.get<GetMeResponse>(
        "/api/v1/user/me"
    );

    return response.data;
};