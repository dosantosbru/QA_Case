describe('Teste de carrinho com descontos', () => {

    it('Deve aplicar cupom em um carrinho que já possua desconto de forma de pagamento, valida se o desconto do cupom foi adicionado ao desconto já aplicado e valida se o valor total do carrinho está correto', () => {
        //Acessa a página do carrinho
        cy.visit('/carrinho');

        // Adiciona o desconto de forma de pagamento
        cy.get('#formaPagamento').select('boleto');
        cy.get('#aplicarDesconto').click(); //clica no botão aplicar desconto

        // Adiciona um cupom
        cy.get('#cupom').type('MEUCUPOM');
        cy.get('#aplicarCupom').click(); //clica no botão aplicar cupom

       //verifica se contém o valor total com desconto.
        cy.get('#totalDesconto').should('contain', 'R$ 50,00'); 

        // Valida se o valor total do carrinho está correto
        cy.get('#totalCarrinho').should('contain', 'R$ 450,00');
    });

    it('Deve Adicionar um produto ao carrinho, aplicar desconto de forma de pagamento e valida se o valor total do carrinho está correto', () => {
        // Adiciona produto ao carrinho
        cy.visit('/produto/123');
        cy.get('#AdicionaAoCarrinho').click();

        // Selecionar forma de pagamento com desconto
        cy.get('#formaPagamento').select('boleto');
        cy.get('#aplicarDesconto').click();

        // valida se o valor total do carrinho está correto
        cy.get('#totalCarrinho').should('contain', 'R$ 450,00');
    });


});

it('Deve Adicionar vários produtos ao carrinho, aplicar desconto de forma de pagamento e valida se o valor total do carrinho está correto', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/produto/123');
    cy.get('#AdicionaAoCarrinho').click();
    cy.visit('/produto/456');
    cy.get('#AdicionaAoCarrinho').click();
    cy.visit('/produto/789');
    cy.get('#AdicionaAoCarrinho').click();

    // Selecionar forma de pagamento com desconto
    cy.get('#formaPagamento').select('boleto');
    cy.get('#aplicarDesconto').click(); //clica no botão aplicar desconto

    // valida se o valor total do carrinho está correto
    cy.get('#totalCarrinho').should('contain', 'R$ 1.200,00');
});

it('Deve remover um produto do carrinho e valida se o valor total do carrinho foi atualizado corretamente', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/produto/123');
    cy.get('#AdicionaAoCarrinho').click();
    cy.visit('/produto/456');
    cy.get('#AdicionaAoCarrinho').click(); //clica no botão adicionar ao carrinho

    // Remove um produto do carrinho
    cy.get('#removerProduto').click();

    // valida se o valor total do carrinho foi atualizado corretamente
    cy.get('#totalCarrinho').should('contain', 'R$ 300,00');
});

it('Deve valida se o valor do frete é removido do total da compra ao Adiciona o cupom "FRETEGRATIS"', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/categoria/eletronicos');
    cy.get('#produto1').click();
    cy.get('#AdicionaAoCarrinho').click(); //clica no botão adicionar ao carrinho

    // Adiciona cupom de frete grátis
    cy.get('#cupom').type('FRETEGRATIS');
    cy.get('#aplicarCupom').click();

    // valida se o valor total do carrinho está correto, considerando o desconto do frete
    cy.get('#totalCarrinho').should('contain', 'R$ 400,00');
});

it('Deve valida se o desconto é aplicado ao total da compra, mas o valor do frete ainda é cobrado', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/categoria/eletronicos');
    cy.get('#produto1').click();
    cy.get('#AdicionaAoCarrinho').click();

    // Adiciona desconto de forma de pagamento
    cy.get('#formaDePagamento').select('Boleto bancário');
    cy.get('#aplicarFormaDePagamento').click();

    // Adiciona cupom que fornece desconto em todos os produtos do carrinho
    cy.get('#cupom').type('MEUCUPOM3');
    cy.get('#aplicarCupom').click();

    // valida se o valor total do carrinho está correto, considerando o desconto e o valor do frete
    cy.get('#totalCarrinho').should('contain', 'R$ 713,00');
});

it('Deve valida desconto ao inserir cupom "FRETEGRATIS" quando há desconto de forma de pagamento aplicado', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/categoria/eletronicos');
    cy.get('#produto1').click();
    cy.get('#AdicionaAoCarrinho').click();

    // Adiciona desconto de forma de pagamento
    cy.get('#formaDePagamento').select('Boleto bancário');
    cy.get('#aplicarFormaDePagamento').click();

    // Adiciona cupom de frete grátis
    cy.get('#cupom').type('FRETEGRATIS');
    cy.get('#aplicarCupom').click();

    // valida se o valor total do carrinho está correto, considerando o desconto do frete e da forma de pagamento
    cy.get('#totalCarrinho').should('contain', 'R$ 375,00');
});

it('Deve valida restrição de cupom "FRETEGRATIS" para compras abaixo do valor mínimo', () => {
    // Adiciona produto ao carrinho
    cy.visit('/produto/123');
    cy.get('#AdicionaAoCarrinho').click();

    // Adiciona cupom de frete grátis
    cy.get('#cupom').type('FRETEGRATIS');
    cy.get('#aplicarCupom').click();

    // valida se o cupom não foi aplicado, pois o valor mínimo de compra não foi atingido
    cy.get('#totalCarrinho').should('contain', 'R$ 450,00');
});

it('Deve valida restrição de cupom "TODOS10" para compras abaixo do valor mínimo e se o cupom é aplicado corretamente quando o valor mínimo é atingido', () => {
    // Adiciona produtos ao carrinho
    cy.visit('/categoria/eletronicos');
    cy.get('#produto1').click();
    cy.get('#AdicionaAoCarrinho').click();

    // Adiciona cupom "TODOS10" com valor mínimo de R$500
    cy.get('#cupom').type('TODOS10');
    cy.get('#aplicarCupom').click();

    // valida se o cupom não foi aplicado, pois o valor mínimo de compra não foi atingido
    cy.get('#totalCarrinho').should('contain', 'R$ 450,00');

    // Adiciona mais um produto para atingir o valor mínimo de compra
    cy.go('back');
    cy.get('#produto2').click();
    cy.get('#AdicionaAoCarrinho').click();

    // Adiciona cupom "TODOS10" novamente
    cy.get('#cupom').type('TODOS10');
    cy.get('#aplicarCupom').click();

    // valida se o valor total do carrinho está correto, considerando o desconto do cupom
    cy.get('#totalCarrinho').should('contain', 'R$ 810,00');
});

it('Deve valida um cupom que já venceu', () => {
    // Navegar até a página do carrinho
    cy.visit('/carrinho');

    // Inserir o código do cupom vencido
    cy.get('#codigoCupom').type('CUPOM_VENCIDO');
    cy.get('#aplicarCupom').click();

    // Verificar se a mensagem de erro é exibida
    cy.get('#mensagemErro').should('contain', 'O cupom inserido já venceu.');
});

it('Deve aplicar um cupom que ainda está em validade', () => {
    // Navegar até a página do carrinho
    cy.visit('/carrinho');

    // Inserir o código do cupom válido
    cy.get('#codigoCupom').type('CUPOM_VALIDO');
    cy.get('#aplicarCupom').click();

    // Verificar se a mensagem de sucesso é exibida
    cy.get('#mensagemSucesso').should('contain', 'Cupom aplicado com sucesso!');

    // valida se o valor total do carrinho foi atualizado com o desconto do cupom
    cy.get('#totalCarrinho').should('contain', 'R$ 800,00');
});

it('Deve aplicar um cupom que é aplicado no valor total da compra', () => {
    // Navegar até a página do carrinho
    cy.visit('/carrinho');

    // Inserir o código do cupom que aplica desconto no valor total
    cy.get('#codigoCupom').type('CUPOM_TOTAL');
    cy.get('#aplicarCupom').click();

    // Verificar se a mensagem de sucesso é exibida
    cy.get('#mensagemSucesso').should('contain', 'Cupom aplicado com sucesso!');

    // valida se o valor total da compra foi atualizado com o desconto do cupom
    cy.get('#totalCompra').should('contain', 'R$ 900,00');
});

it('Deve aplicar um cupom que é aplicado apenas no valor do carrinho', () => {
    // Navegar até a página do carrinho
    cy.visit('/carrinho');

    // Inserir o código do cupom que aplica desconto apenas no valor do carrinho
    cy.get('#codigoCupom').type('CUPOM_CARRINHO');
    cy.get('#aplicarCupom').click();

    // Verificar se a mensagem de sucesso é exibida
    cy.get('#mensagemSucesso').should('contain', 'Cupom aplicado com sucesso!');

    // valida se o valor total do carrinho foi atualizado com o desconto do cupom
    cy.get('#totalCarrinho').should('contain', 'R$ 800,00');
});
