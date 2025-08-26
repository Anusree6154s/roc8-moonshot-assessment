// import { BaseURL } from "../config/constants";

export const fetchData = async () => {
  try {
    const res = await fetch('https://flipkart-email-mock.now.sh/');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
