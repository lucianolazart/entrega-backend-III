import { Router } from 'express';
import { fakerES as faker } from '@faker-js/faker';
import { generateMockUsers } from '../mocks/userMock.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

router.get('/mockingusers', async (req, res) => {
    const quantity = parseInt(req.query.quantity||"50");
    const users = generateMockUsers(isNaN(quantity)?50:quantity);
    res.send({ status:"success", payload: users.map(u=>({
        _id: faker.database.mongodbObjectId(),
        ...u
    }))});
});

router.get('/mockingpets', async (req, res) => {
    const qty = parseInt(req.query.quantity||"100");
    const count = isNaN(qty)?100:qty;
    const pets = [];
    for (let i=0;i<count;i++){
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.dog(),
            specie: faker.helpers.arrayElement(["dog","cat","bird","fish"]),
            birthDate: faker.date.past({ years: 10 }),
            adopted: false,
            image: undefined
        });
    }
    res.send({status:"success", payload:pets});
});

router.post('/generateData', async (req, res) => {
    try {
        const usersQty = parseInt(req.body.users||req.query.users||"0");
        const petsQty = parseInt(req.body.pets||req.query.pets||"0");

        const toInsertUsers = usersQty>0? generateMockUsers(usersQty):[];
        const createdUsers = [];
        for (const u of toInsertUsers){
            const created = await usersService.create(u);
            createdUsers.push(created);
        }

        const createdPets = [];
        for (let i=0;i<(petsQty>0?petsQty:0);i++){
            const pet = {
                name: faker.animal.dog(),
                specie: faker.helpers.arrayElement(["dog","cat","bird","fish"]),
                birthDate: faker.date.past({ years: 10 })
            };
            const created = await petsService.create(pet);
            createdPets.push(created);
        }

        res.send({status:"success", inserted:{users: createdUsers.length, pets: createdPets.length}});
    } catch (error) {
        res.status(500).send({status:"error", error: error.message});
    }
});

export default router;


