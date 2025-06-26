import axios from "axios";

const ORG_API_BASE_URL = "http://localhost:8082/api";

export const organizationService = {
  // Create a new organization
  createOrganization: async (orgData) => {
    const response = await axios.post(
      `${ORG_API_BASE_URL}/organizations`,
      orgData
    );
    return response.data;
  },
};
