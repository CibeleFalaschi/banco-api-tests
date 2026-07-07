const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');
const postTransferencia = require('../fixtures/postTransferencia.json');

describe('Transferencias', () => {
    let token;

        beforeEach (async () => {
            token = await obterToken('julio.lima', '123456');
        });

    describe('POST /transferencias', () => {
    
        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$ 10,00', async () => {
            const bodyTransferencia = { ...postTransferencia}

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia)       

            expect(resposta.status).to.equal(201)
        });


        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$ 10,00', async () => {
            const bodyTransferencia = { ...postTransferencia}
            bodyTransferencia.valor = 9;
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia)

            expect(resposta.status).to.equal(422)
        })

    })
     describe('GET /transferencias/{id}', () => {
        it ('Deve retornar sucesso com 200 quando e dados iguais ao registro de trasnferência contido no banco de dados quando o id for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/4')
                .set('Authorization', `Bearer ${token}`)
            
                expect(resposta.status).to.equal(200)
                expect (resposta.body.id).to.equal(4) // igualdade do valor
                expect (resposta.body.id).to.a('number') //igualdade da tipagem
                expect (resposta.body.conta_origem_id).to.equal(1)
                expect (resposta.body.conta_destino_id).to.equal(2)
                expect (resposta.body.valor).to.equal(11.00) //erro pq no swagger pede int/float e no banco está como string
        })
    })
      describe('GET /transferencias', () => {
        it ('Deve retornar 10 elementos na paginacao quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10)

        })
    })
})