export type Product = {
  _id: string;
  description: string;
  name: string;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  category: Category;
  quantity: number;
  createdAt?: string;
  price: string | number;
  updateAt?: string;
  secondaryImages?: string[];
  parentCategory?: Category;
  subCategory?: Category;
};

export type Category = {
  _id: string;
  name: string;
  createdAt?: string;
  updateAt?: string;
  parentCategory?: string;
  category?: string;
};

export type Blog = {
  _id: string;
  title: string;
  createdAt: string;
  updateAt: string;
  tags: string[];
  category: string;
  imageUrl: string;
  imageTitle?: string;
  subtitle?: string;
  description: string;
};

export const investmentStatus = {
  PENDING: "pending",
  APPLIED: "applied",
  PAID: "paid",
  WITHDRAWN: "withdrawn",
  WITHDRAW_REQUESTED: "withdraw_req",
  WITHDRAWABLE: "withdrawable",
};

export type MailData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  mailText: string;
};
