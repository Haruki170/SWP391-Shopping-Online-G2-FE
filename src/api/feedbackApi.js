import { fetch } from "./Fetch"

export const getFeebBackByUser = async () => {
    let data = await fetch.get(`/feedback/customer/all`);
    return data.data;
}
export const deleteFeedbackById = async (feedbackId) => {
    try {
        const response = await fetch.delete(`/feedback/delete/${feedbackId}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return null; 
    }
}
