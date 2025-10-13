import { apiRoutes, apiUrl } from "@/config/app-config";
import { MailData } from "@/types/data-types";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export const getProducts = async (query?: string) => {
  try {
    const { data } = await axios.get(
      `${apiRoutes.productRoute}${query ? `?${query}` : ""}`
    );

    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    return [];
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data } = await axios.get(`${apiRoutes.productRoute}/${id}`);
    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    return [];
  }
};

export const getBlogs = async (pageParam: number, query?: string) => {
  try {
    const { data } = await axios.get(
      `${apiRoutes.blogRoute}?page=${pageParam}&limit=10${
        query ? `${query}` : ""
      }`
    );

    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    return [];
  }
};

export const getBlog = async (id: string) => {
  try {
    const { data } = await axios.get(`${apiRoutes.blogRoute}/${id}`);

    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    return [];
  }
};

export const createInvestor = async (investorData: any) => {
  try {
    const { data } = await axios.post(
      `${apiRoutes.investorRoute}`,
      investorData
    );

    return data;
  } catch (error) {
    console.log(error);
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const loginInvestor = async (investorData: any) => {
  try {
    const { data } = await axios.post(
      `${apiRoutes.investorRoute}/login`,
      investorData
    );
    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    return [];
  }
};

export const getInvestments = async (id?: string) => {
  try {
    const { data } = await axios.get(`${apiRoutes.investRoute}/investor/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const getRoi = async () => {
  try {
    const { data } = await axios.get(`${apiRoutes.roiRoute}`);

    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const getInvestor = async (id?: string) => {
  try {
    const { data } = await axios.get(`${apiRoutes.investorRoute}/get/${id}`);
    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const withdrawFunds = async (id: string) => {
  try {
    const { data } = await axios.patch(
      `${apiRoutes.investRoute}/withdraw/investor/${id}`
    );
    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axios.get(`${apiRoutes.categoryRoute}`);
    return data?.categories || [];
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};

export const sendMail = async (mailData: MailData) => {
  try {
    const { data } = await axios.post(`${apiRoutes.userRoute}/mail`, mailData);

    return data;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.log(error);
    throw error;
  }
};
