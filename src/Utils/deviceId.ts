const DEVICE_ID_KEY = "the_market_device_id";

export const getDeviceId = (): string => {
    const existingDeviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (existingDeviceId) {
        return existingDeviceId;
    }

    const newDeviceId = crypto.randomUUID();

    localStorage.setItem(DEVICE_ID_KEY, newDeviceId);

    return newDeviceId;
};