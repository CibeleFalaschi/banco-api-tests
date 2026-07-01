const request = require('supertest');
const obterToken = async (usuario, senha) => {
    const respostaLogin = await request('http://localhost:3000')
           .post('/login')
           .set('Content-Type', 'application/json')
           .send({
                username: usuario,
                senha: senha
           });
    
    
    return respostaLogin.body.token
    
}

module.exports = {
    obterToken
};
               