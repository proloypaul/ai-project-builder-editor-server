import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getBlog,
  getBlogs,
  getCategories,
  getInvestments,
  getInvestor,
  getProduct,
  getProducts,
  getRoi,
} from "./api";
import { useInvestorStore } from "@/store/investor-store";

export const getProductsOption = (query?: string) => {
  return queryOptions({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
};

export const getBlogsOption = (query?: string) => {
  return infiniteQueryOptions({
    queryKey: ["blogs", query],
    queryFn: ({ pageParam = 1 }) => getBlogs(pageParam as number, query),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage
        ? Number(lastPage.pagination?.page) + 1
        : null;
    },
  });
};

export const getProductOption = (id: string) => {
  return queryOptions({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });
};

export const getBlogOption = (id: string) => {
  return queryOptions({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id),
  });
};

export const getInvestmentsOption = (id?: string) => {
  return queryOptions({
    queryKey: ["investments", id],
    queryFn: () => getInvestments(id),
    enabled: !!useInvestorStore.getState().investorData?._id,
  });
};

export const getRoiOption = () => {
  return queryOptions({
    queryKey: ["roi"],
    queryFn: () => getRoi(),
  });
};

export const getInvestorOption = (id?: string) => {
  return queryOptions({
    queryKey: ["investor", id],
    queryFn: () => getInvestor(id),
  });
};

export const getCategoriesOption = () => {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
};
