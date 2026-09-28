import apiClient from "../../Services/API/apiClient";

interface SendRegistrationVerificationCodeResponse {
    success: boolean;
    message: string;
}

const sendRegistrationVerificationCode = async (
    email: string,
    username: string
): Promise<SendRegistrationVerificationCodeResponse> => {
    const response = await apiClient.post<SendRegistrationVerificationCodeResponse>(
        "/api/v1/auth/send-registration-verification-code",
        {
            email, username
        }
    );

    return response.data;
};

export default sendRegistrationVerificationCode;