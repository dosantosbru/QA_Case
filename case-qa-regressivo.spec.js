describe('Testes regressivos para carrinho', () => {
    beforeEach(() => {
        // Navegar até a página do produto e Adiciona ao carrinho
        cy.visit('/produto');
        cy.get('#AdicionaCarrinho').click();
    });

    it('Deve valida se o produto adicionado está sendo exibido corretamente no carrinho', () => {
        cy.visit('/carrinho');
        cy.get('#itemCarrinho').should('contain', 'Nome do Produto');
    });

    it('Deve valida se o preço do produto está sendo calculado corretamente', () => {
        cy.visit('/carrinho');
        cy.get('#precoProduto').should('contain', 'R$ 100,00');
        cy.get('#quantidadeProduto').type('2');
        cy.get('#atualizarCarrinho').click();
        cy.get('#precoTotalProduto').should('contain', 'R$ 200,00');
    });

    it('Deve valida se o subtotal está sendo atualizado corretamente', () => {
        cy.visit('/carrinho');
        cy.get('#subtotalCarrinho').should('contain', 'R$ 100,00');
        cy.get('#quantidadeProduto').type('2');
        cy.get('#atualizarCarrinho').click();
        cy.get('#subtotalCarrinho').should('contain', 'R$ 200,00');
    });

    it('Deve valida se o produto removido não está sendo exibido no carrinho', () => {
        cy.visit('/carrinho');
        cy.get('#removerProduto').click();
        cy.get('#itemCarrinho').should('not.contain', 'Nome do Produto');
    });

    it('Deve valida se o subtotal está sendo atualizado corretamente após remover um produto', () => {
        cy.visit('/carrinho');
        cy.get('#subtotalCarrinho').should('contain', 'R$ 200,00');
        cy.get('#removerProduto').click();
        cy.get('#subtotalCarrinho').should('contain', 'R$ 100,00');
    });

    it('Deve valida se a quantidade do produto está sendo atualizada corretamente', () => {
        cy.visit('/carrinho');
        cy.get('#produtoQuantidade').should('have.value', '1');
        cy.get('#aumentarQuantidade').click();
        cy.get('#produtoQuantidade').should('have.value', '2');
    });

    it('Deve valida se o preço do produto e o subtotal estão sendo atualizados corretamente', () => {
        cy.visit('/carrinho');

        const precoProduto = 10.00; // Insira o preço do produto
        cy.get('#subtotal').should('contain', precoProduto);

        cy.get('#aumentarQuantidade').click();
        cy.get('#subtotal').should('contain', precoProduto * 2);
    });

    it('Deve valida se o valor do frete está sendo calculado corretamente com base nas informações do carrinho', () => {
        cy.visit('/carrinho');

        const freteEsperado = 5.00; // Insira o valor esperado do frete aqui

        cy.get('#calcularFrete').click();
        cy.get('#valorFrete').should('contain', freteEsperado);
    });

    it('Deve valida se o valor total está sendo atualizado corretamente após o calculado do frete', () => {
        cy.visit('/carrinho');

        const freteEsperado = 5.00; // Insira o valor do frete aqui
        const subtotalEsperado = 50.00; // Insira o valor subtotal aqui
        const totalEsperado = subtotalEsperado + freteEsperado;

        cy.get('#calcularFrete').click();
        cy.get('#valorFrete').should('contain', freteEsperado);
        cy.get('#subtotal').should('contain', subtotalEsperado);
        cy.get('#total').should('contain', totalEsperado);
    });

    it('Verifica se todos os produtos foram removidos do carrinho', () => {
        cy.visit('url_do_seu_site/carrinho');
        cy.get('.lista-de-produtos').should('not.exist');
    });

    it('Valida se o subtotal, valor de frete e valor total foram atualizados para zero', () => {
        cy.visit('url_do_seu_site/carrinho');
        cy.get('.subtotal').should('contain', '0.00');
        cy.get('.valor-frete').should('contain', '0.00');
        cy.get('.valor-total').should('contain', '0.00');
    });

    it('Verifica se o valor total exibido no carrinho está correto', () => {
        cy.visit('/carrinho');
        cy.get('#totalCarrinho')
            .should('contain', 'R$ 1000,00'); 
    });

    it('Verifica se os detalhes do pedido estão corretos', () => {
        cy.visit('/carrinho');
        cy.get('.nome-produto').should('contain', 'Produto A');
        cy.get('.quantidade-produto').should('contain', '2');
        cy.get('.preco-produto').should('contain', 'R$ 500,00');
        cy.get('.valor-total-produto').should('contain', 'R$ 1.000,00');
    });

    it('Verifica se as informações de pagamento são processadas corretamente', () => {
        cy.visit('/pagamento');

        // preenche os dados do formulário de pagamento
        cy.get('#nome-cartao').type('Fulano de Tal');
        cy.get('#numero-cartao').type('4111111111111111');
        cy.get('#validade-cartao').type('12/25');
        cy.get('#cvv-cartao').type('123');

        // confirma o formulário de pagamento
        cy.get('#botao-pagar').click();

        // verifica se a página de confirmação de pagamento é exibida
        cy.url().should('include', '/confirmacao-pagamento');
        cy.get('h1').should('contain', 'Pagamento Confirmado');
    });

    it('Verifica se o desconto é aplicado corretamente no preço dos produtos / valida se o valor total é atualizado corretamente após a aplicação do desconto', () => {
        cy.visit('/carrinho');

        // Verifica o valor total antes da aplicação do desconto
        cy.get('.valor-produto').first().should('contain', 'R$ 1000.00');

        // Seleciona o pagamento via boleto para aplicar o desconto
        cy.get('#boleto').check();

        // Verifica o valor total após a aplicação do desconto
        cy.get('.valor-produto').first().should('contain', 'R$ 900.00');
    });

    it('Verifica se o cupom é aplicado corretamente no preço dos produtos / valida se o valor total é atualizado corretamente após a aplicação do cupom', () => {
        cy.visit('/carrinho');

        // Verifica o valor total antes da aplicação do cupom
        cy.get('.valor-produto').first().should('contain', 'R$ 1000.00');

        // Insere o cupom de desconto
        cy.get('#campo-cupom').type('DESCONTO10');

        // Clica no botão para aplicar o cupom
        cy.get('#btn-aplicar-cupom').click();

        // Verifica se a mensagem de cupom aplicado é exibida corretamente
        cy.get('.msg-sucesso').should('contain', 'Cupom aplicado com sucesso!');

        // Verifica o valor total após a aplicação do cupom
        cy.get('.valor-produto').first().should('contain', 'R$ 900.00');
    });

    it('Valida se a opção de frete grátis está sendo exibida corretamente no carrinho / valida se o valor total é atualizado corretamente após a seleção da opção de frete grátis', () => {
        cy.visit('/carrinho');

        // Verifica o valor total antes da seleção do frete grátis
        cy.get('.valor-total').should('contain', 'R$ 1000.00');

        // Seleciona a opção de frete grátis
        cy.get('#frete-gratis').check();

        // Verifica se a mensagem de frete grátis é exibida corretamente
        cy.get('.msg-sucesso').should('contain', 'Frete grátis aplicado com sucesso!');

        // Verifica o valor total após a seleção do frete grátis
        cy.get('.valor-total').should('contain', 'R$ 1000.00');
    });

});
