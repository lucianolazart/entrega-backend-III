import { fakerES as faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const FIXED_PASSWORD = "coder123";

export const generateMockUsers = (count = 1) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        const email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();
        const password = bcrypt.hashSync(FIXED_PASSWORD, bcrypt.genSaltSync(10));
        const role = Math.random() < 0.5 ? "user" : "admin";
        users.push({ first_name, last_name, email, password, role, pets: [] });
    }
    return users;
};


