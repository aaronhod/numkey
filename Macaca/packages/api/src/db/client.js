import { drizzle } from 'drizzle-orm/d1';
export const createDb = (d1) => {
    return drizzle(d1);
};
