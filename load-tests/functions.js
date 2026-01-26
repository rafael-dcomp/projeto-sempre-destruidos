/**
 * Funções auxiliares para testes de carga Artillery
 * Este arquivo contém funções customizadas usadas nos cenários de teste
 */

module.exports = {
  /**
   * Gera um número aleatório entre min e max (inclusivo)
   */
  randomNumber: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Gera uma string aleatória
   */
  randomString: function(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Gera um valor booleano aleatório
   */
  randomBoolean: function() {
    return Math.random() < 0.5;
  },

  /**
   * Define variáveis de contexto antes do cenário
   */
  setVariables: function(requestParams, context, ee, next) {
    context.vars.randomUsername = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    context.vars.randomPassword = 'Test123!@#';
    return next();
  },

  /**
   * Log de resposta para debug (opcional)
   */
  logResponse: function(requestParams, response, context, ee, next) {
    if (response.statusCode >= 400) {
      console.log(`Erro ${response.statusCode}: ${response.body}`);
    }
    return next();
  }
};
