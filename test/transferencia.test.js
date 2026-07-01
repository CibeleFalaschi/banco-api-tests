const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
console.log('BASE_URL:', JSON.stringify(process.env.BASE_URL));
const { obterToken } = require('../helpers/autenticacao');

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$ 10,00', async () => {
            const token = await obterToken('julio.lima', '123456');

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    conta_origem: 1,
                    conta_destino: 2,
                    valor: 11,
                    token: ""
                });

            expect(resposta.status).to.equal(201);
        });


        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$ 10,00', async () => {
            const token = await obterToken('julio.lima', '123456');

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    conta_origem: 1,
                    conta_destino: 2,
                    valor: 7,
                    token: ""
                });

            expect(resposta.status).to.equal(422);
        });

    });
});