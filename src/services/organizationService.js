import axios from "axios";


const ORG_API_BASE_URL = process.env.REACT_APP_API_URL;


const orgApiClient = axios.create({
  baseURL: ORG_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});


const openOrgApiClient = axios.create({
  baseURL: ORG_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

orgApiClient.interceptors.request.use(config => {
  if (["post", "put", "delete", "patch"].includes(config.method)) {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = xsrfToken;
    }
  }
  return config;
});

export const organizationService = {

  createOrganization: async (orgData) => {
    try {
      const response = await openOrgApiClient.post("/organizations/register", orgData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getCurrentOrganization: async (organizationId) => {
    try {
      const response = await orgApiClient.get(`/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getDepartments: async () => {
    try {
      const response = await orgApiClient.get("/organizations/departments");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getTeams: async () => {
    try {
      const response = await orgApiClient.get("/organizations/teams");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
