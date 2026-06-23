# API FitStore

A API FitStore é um projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web - Backend. O objetivo principal é gerenciar o ecossistema de um e-commerce voltado para moda e produtos fitness, controlando tanto o catálogo de mercadorias quanto a equipe de colaboradores.

O sistema permite a realização de um CRUD completo de produtos, gerenciamento de estoque (vendas e reposições) e a inativação de itens. Além disso, a API gerencia uma equipe de funcionários, onde as permissões para modificar dados ou cadastrar produtos dependem de regras de hierarquia e do status de atividade do colaborador no sistema.

Para facilitar o acompanhamento e agilizar o desenvolvimento, a aplicação conta com uma camada visual (Server-Side Rendering) que permite visualizar a vitrine de produtos, detalhes específicos de cada item, ferramentas de busca e a listagem da equipe.

## Ferramentas Utilizadas

- **Node.js e Express**: Ambiente de execução e framework para construção do servidor, rotas e manipulação de verbos HTTP.
- **LowDB**: Biblioteca para persistência de dados em arquivos locais no formato JSON.
- **Express-Validator**: Middleware utilizado para interceptar requisições e validar os dados de entrada antes do processamento.
- **Pug**: Motor de templates para renderização dinâmica das páginas web no lado do servidor.

## Como Usar o Projeto

1. Clone o repositório para sua máquina local.
2. Abra o terminal na pasta raiz do projeto.
3. Instale as dependências necessárias executando:
   `npm install`
4. Inicie o servidor com o comando:
   `npm start`

### Acesso Visual

Após iniciar o servidor, você pode acessar as interfaces através do navegador:

- **Vitrine de Produtos**: http://localhost:3000/vitrine
- **Gestão de Equipe**: http://localhost:3000/equipe

### Envio de Requisições (API)

Para interagir com os endpoints da API, recomenda-se o uso de ferramentas como Thunder Client ou Postman.

#### Tutorial Thunder Client:

1. Selecione o método HTTP desejado (GET, POST, PATCH, DELETE).
2. Insira a URL correspondente ao endpoint.
3. Na aba **Headers**, adicione a chave `usuario` e insira no valor um ID de funcionário válido (ex: 1).
4. Na aba **Body**, selecione o formato **JSON** e insira os dados necessários.
5. Envie a requisição.

#### Exemplo de Requisição (Cadastro de Produto):

- **Método HTTP**: POST
- **URL**: http://localhost:3000/api/produtos
- **Header**: `usuario : 1`
- **Body (JSON)**:

```json
{
  "referencia": "REG-055-CZ",
  "nome": "Regata Dry-Fit Cinza Estelar",
  "categoria": "Camisetas",
  "tamanho": "G",
  "preco": 55.0,
  "estoque": 12
}
```

- **Resultado Esperado**: Status `201 Created`. Após o sucesso, você pode acessar http://localhost:3000/vitrine para verificar a inclusão do novo item no catálogo.

## Arquitetura do Sistema

O projeto foi estruturado utilizando o princípio de Separation of Concerns (SoC), organizando as responsabilidades em camadas distintas:

1. **Repositório**: Camada de acesso aos dados que interage diretamente com o banco de dados local (JSON).
2. **DTO (Data Transfer Object)**: Objeto responsável por formatar e filtrar os dados que serão enviados na resposta da API.
3. **Service**: Concentra a lógica de negócio pura, como regras de estoque e validações de hierarquia.
4. **Validator**: Define as regras de obrigatoriedade e tipos de dados para cada campo das entidades.
5. **Middleware**: Intercepta as requisições para verificação de erros de validação e tratamento global de erros do sistema.
6. **Routes**: Mapeia os endpoints e direciona as requisições para os controladores corretos.
7. **Views**: Contém os templates Pug para renderização visual, utilizando um layout principal para manter a consistência.
8. **CSS**: Localizado na pasta pública para definir a identidade visual e o estilo da interface web.

A pasta `src` centraliza os recursos do servidor, incluindo os arquivos principais `app.js` (configurações) e `server.js` (inicialização).

## Principais Endpoints

### Produtos (/api/produtos)

- `GET /`: Lista todos os produtos (suporta busca via query `?busca=`).
- `POST /`: Cadastra um novo produto (Requer ID de funcionário no header).
- `PATCH /:id/vender`: Registra uma venda e abate a quantidade do estoque.
- `PATCH /:id/repor`: Adiciona quantidade ao estoque de um item existente.
- `PATCH /:id/inativar`: Altera o status do produto para inativo (fora de linha).

### Funcionários (/api/usuarios)

- `GET /`: Lista todos os membros da equipe.
- `POST /`: Cadastra um novo colaborador no sistema.
- `PATCH /:id`: Atualiza dados cadastrais ou cargo (Requer permissão de Gerente para alterações de cargo).
- `DELETE /:id`: Inativa um funcionário (Demissão simbólica).

### Rotas Web (Navegador)

- `GET /vitrine`: Exibição visual do catálogo completo.
- `GET /vitrine/:id`: Página com informações detalhadas de um produto específico.
- `GET /equipe`: Tabela visual para consulta rápida de funcionários e seus cargos.

## Características das Entidades

### Produtos

Para que um produto seja válido no sistema, ele deve possuir obrigatoriamente campos como nome, referência, categoria, preço e estoque. Além disso, todo produto deve estar vinculado ao funcionário que realizou o seu cadastro (campo `cadastradoPor`).

### Funcionários

Os funcionários são definidos por nome, e-mail e cargo (ex: Gerente, Vendedor, Estagiário). Um colaborador só pode realizar ações de criação, modificação ou deleção se o seu status for `ativo`. Alterações de hierarquia (promoção de cargo) exigem que o solicitante da ação possua cargo de Gerente.
