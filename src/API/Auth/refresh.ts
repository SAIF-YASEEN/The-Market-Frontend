import apiClient from "../../Services/API/apiClient";

export interface RefreshResponse {
    success: boolean;
    message: string;

    data?: {
        user: {
            id: string;
            username: string;
            email: string;
            role: string;
        };
    };
}

export const refreshAuth =
    async (): Promise<RefreshResponse> => {
        const response =
            await apiClient.post<RefreshResponse>(
                "/api/v1/auth/refresh"
            );
        console.log(response.data)
        return response.data;
    };