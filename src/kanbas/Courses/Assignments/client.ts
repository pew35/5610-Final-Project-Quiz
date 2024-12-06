import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ASSIG_API = `${REMOTE_SERVER}/api/assignments`;
export const deleteAssignment = async (assignmentId: string) => {
    const response = await axios.delete(`${ASSIG_API}/${assignmentId}`);
    return response.data;
};

export const updateAassignment = async (assignment: any) => {
    const { data } = await axios.put(`${ASSIG_API}/${assignment._id}`, assignment);
    return data;
};
