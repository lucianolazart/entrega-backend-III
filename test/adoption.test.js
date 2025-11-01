import { describe, it } from "mocha";
import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import express from "express";
import app from "../src/app.js";

const requester = supertest(app);

describe("Test router de adoptions", function () {
    this.timeout(10000);

    let testUserId;
    let testPetId;

    before(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: "testadoption@test.com" });
        await mongoose.connection.collection("pets").deleteMany({ specie: "test_adoption" });
        await mongoose.connection.collection("adoptions").deleteMany({});

        const userData = {
            first_name: "Test",
            last_name: "User",
            email: "testadoption@test.com",
            password: "123456"
        };
        await requester.post("/api/sessions/register").send(userData);
        
        const { body: usersBody } = await requester.get("/api/users");
        const testUser = usersBody.payload.find(u => u.email === "testadoption@test.com");
        testUserId = testUser._id;

        const petData = {
            name: "Test Pet",
            specie: "test_adoption",
            birthDate: new Date()
        };
        const { body: petBody } = await requester.post("/api/pets").send(petData);
        testPetId = petBody.payload._id;
    });

    after(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: "testadoption@test.com" });
        await mongoose.connection.collection("pets").deleteMany({ specie: "test_adoption" });
        await mongoose.connection.collection("adoptions").deleteMany({});
    });

    it("El método GET /api/adoptions retorna un objeto con la property status igual a success", async () => {
        const { body } = await requester.get("/api/adoptions");
        expect(body).to.have.property("status").and.to.be.eq("success");
    });

    it("El método GET /api/adoptions retorna un objeto con la property payload de tipo array", async () => {
        const { body } = await requester.get("/api/adoptions");
        expect(Array.isArray(body.payload)).to.be.true;
    });

    it("El método GET /api/adoptions retorna un status http 200", async () => {
        const { statusCode } = await requester.get("/api/adoptions");
        expect(statusCode).to.be.eq(200);
    });

    it("El método POST /api/adoptions/:uid/:pid crea una adopción si envío los datos correctos", async () => {
        const petData = {
            name: "Test Pet Adoption",
            specie: "test_adoption",
            birthDate: new Date()
        };
        const { body: newPetBody } = await requester.post("/api/pets").send(petData);
        const newPetId = newPetBody.payload._id;
        
        const { body } = await requester.post(`/api/adoptions/${testUserId}/${newPetId}`);
        
        expect(body.status).to.be.eq("success");
        expect(body.message).to.be.eq("Mascota adoptada");
        
        const { body: allPetsBody } = await requester.get("/api/pets");
        const adoptedPet = allPetsBody.payload.find(p => p._id.toString() === newPetId.toString());
        expect(adoptedPet).to.exist;
        expect(adoptedPet.adopted).to.be.true;
    });

    it("El método POST /api/adoptions/:uid/:pid retorna error 400 si la mascota ya está adoptada", async () => {
        const petData2 = {
            name: "Test Pet 2",
            specie: "test_adoption",
            birthDate: new Date()
        };
        const { body: petBody2 } = await requester.post("/api/pets").send(petData2);
        const anotherPetId = petBody2.payload._id;
        
        const userData2 = {
            first_name: "Test",
            last_name: "User2",
            email: "testadoption2@test.com",
            password: "123456"
        };
        await requester.post("/api/sessions/register").send(userData2);
        
        const { body: usersBody } = await requester.get("/api/users");
        const testUser2 = usersBody.payload.find(u => u.email === "testadoption2@test.com");
        const anotherUserId = testUser2._id;
        
        await requester.post(`/api/adoptions/${testUserId}/${anotherPetId}`);
        
        const { statusCode, body } = await requester.post(`/api/adoptions/${anotherUserId}/${anotherPetId}`);
        
        expect(statusCode).to.be.eq(400);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("La mascota ya está adoptada");
        
        await requester.delete(`/api/users/${anotherUserId}`);
    });

    it("El método POST /api/adoptions/:uid/:pid retorna error 404 si el usuario no existe", async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        
        const petData3 = {
            name: "Test Pet 3",
            specie: "test_adoption",
            birthDate: new Date()
        };
        const { body: petBody3 } = await requester.post("/api/pets").send(petData3);
        const anotherPetId = petBody3.payload._id;
        
        const { statusCode, body } = await requester.post(`/api/adoptions/${fakeUserId}/${anotherPetId}`);
        
        expect(statusCode).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Usuario no encontrado");
        
        await requester.delete(`/api/pets/${anotherPetId}`);
    });

    it("El método POST /api/adoptions/:uid/:pid retorna error 404 si la mascota no existe", async () => {
        const fakePetId = new mongoose.Types.ObjectId();
        
        const { statusCode, body } = await requester.post(`/api/adoptions/${testUserId}/${fakePetId}`);
        
        expect(statusCode).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Mascota no encontrada");
    });

    it("El método GET /api/adoptions/:aid retorna una adopción específica", async () => {
        const petData4 = {
            name: "Test Pet 4",
            specie: "test_adoption",
            birthDate: new Date()
        };
        const { body: petBody4 } = await requester.post("/api/pets").send(petData4);
        const anotherPetId = petBody4.payload._id;
        
        const userData3 = {
            first_name: "Test",
            last_name: "User3",
            email: "testadoption3@test.com",
            password: "123456"
        };
        await requester.post("/api/sessions/register").send(userData3);
        
        const { body: usersBody } = await requester.get("/api/users");
        const testUser3 = usersBody.payload.find(u => u.email === "testadoption3@test.com");
        const anotherUserId = testUser3._id;
        
        await requester.post(`/api/adoptions/${anotherUserId}/${anotherPetId}`);
        
        const { body: allAdoptions } = await requester.get("/api/adoptions");
        const testAdoption = allAdoptions.payload.find(adoption => 
            adoption.pet.toString() === anotherPetId.toString()
        );
        
        const { body, statusCode } = await requester.get(`/api/adoptions/${testAdoption._id}`);
        
        expect(statusCode).to.be.eq(200);
        expect(body.status).to.be.eq("success");
        expect(body.payload._id).to.be.eq(testAdoption._id);
    });

    it("El método GET /api/adoptions/:aid retorna error 404 si la adopción no existe", async () => {
        const fakeAdoptionId = new mongoose.Types.ObjectId();
        
        const { statusCode, body } = await requester.get(`/api/adoptions/${fakeAdoptionId}`);
        
        expect(statusCode).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Adopción no encontrada");
    });
});
