import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
// User
export const UserTable = sqliteTable('User', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
});
export const insertUserSchema = createInsertSchema(UserTable);
export const selectUserSchema = createSelectSchema(UserTable);
// Car
export const CarTable = sqliteTable('Car', {
    id: text('id').primaryKey(),
    make: text('make').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    color: text('color').notNull(),
    price: real('price').notNull(),
    mileage: integer('mileage').notNull(),
    fuelType: text('fuelType').notNull(),
    transmission: text('transmission').notNull(),
});
export const insertCarSchema = createInsertSchema(CarTable);
export const selectCarSchema = createSelectSchema(CarTable);
